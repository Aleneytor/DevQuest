// Platform logic only. All exercise implementations belong to the learner.
const STORAGE_KEY = "devquest_nexus_state_v3";
const VERSION = window.DQ_CURRICULUM_VERSION;
const LEVELS = window.DQ_CURRICULUM;
const ACTS = window.DQ_ACTS;
const SKILLS = window.DQ_SKILLS;
const FIELDS = ["pseudo", "prediction", "agentBrief", "expected", "observed", "reference", "english", "followup", "englishRetry", "reviewNote"];
const STEPS = ["Razona", "Interpreta", "Construye", "Comprueba", "Explica", "Revisa"];
const $ = id => document.getElementById(id);
const plain = v => v !== null && typeof v === "object" && !Array.isArray(v);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = v => String(v).padStart(2, "0");
const words = text => window.SpeechLab.countWords(text || "");
const written = (text, min = 20) => typeof text === "string" && text.trim().length >= min;
const day = date => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const validDay = v => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && day(new Date(`${v}T12:00:00`)) === v;

function defaults() {
  return { curriculumVersion: VERSION, viewingLevelId: 1, completedLevels: [], practiceDays: [], drafts: {}, checklists: {}, quizPassed: {}, quizMisses: {}, unlockedHints: {}, reviewConfirmed: {}, steps: {}, labTranscript: "" };
}
function normalizeState(raw) {
  const result = defaults();
  if (!plain(raw)) return result;
  result.practiceDays = Array.isArray(raw.practiceDays) ? [...new Set(raw.practiceDays.filter(validDay))].sort().slice(-400) : [];
  result.labTranscript = typeof raw.labTranscript === "string" ? raw.labTranscript : "";
  // Prior level numbers describe different challenges. Preserve them as history.
  if (raw.curriculumVersion !== VERSION) { result.legacyProgress = raw; return result; }
  if (plain(raw.legacyProgress)) result.legacyProgress = raw.legacyProgress;
  if (LEVELS.some(lv => lv.id === raw.viewingLevelId)) result.viewingLevelId = raw.viewingLevelId;
  for (const lv of LEVELS) {
    const id = lv.id;
    const draft = plain(raw.drafts?.[id]) ? raw.drafts[id] : {};
    result.drafts[id] = Object.fromEntries(FIELDS.map(key => [key, typeof draft[key] === "string" ? draft[key] : ""]));
    const checks = raw.checklists?.[id];
    result.checklists[id] = Array.isArray(checks) ? [...new Set(checks.filter(i => Number.isInteger(i) && i >= 0 && i < lv.checklist.length))] : [];
    result.quizPassed[id] = raw.quizPassed?.[id] === true;
    const misses = raw.quizMisses?.[id];
    result.quizMisses[id] = Array.isArray(misses) ? [...new Set(misses.filter(i => Number.isInteger(i) && i >= 0 && i < lv.quiz.options.length && i !== lv.quiz.correct))] : [];
    result.reviewConfirmed[id] = raw.reviewConfirmed?.[id] === true;
    const hints = raw.unlockedHints?.[id];
    result.unlockedHints[id] = Number.isInteger(hints) ? Math.max(0, Math.min(lv.hints.length, hints)) : 0;
    const step = raw.steps?.[id];
    result.steps[id] = Number.isInteger(step) && step >= 0 && step < STEPS.length ? step : 0;
  }
  const completed = Array.isArray(raw.completedLevels) ? [...new Set(raw.completedLevels)] : [];
  result.completedLevels = completed.filter(id => LEVELS.some(lv => lv.id === id) && requirementsFor(LEVELS.find(lv => lv.id === id), result).every(r => r.met));
  return result;
}
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const legacy = localStorage.getItem("devquest_nexus_state_v2");
    return saved ? normalizeState(JSON.parse(saved)) : legacy ? normalizeState(JSON.parse(legacy)) : defaults();
  } catch { return defaults(); }
}
let state = loadState();
let toastTimer;
window.showToast = message => {
  $("toast").textContent = message; $("toast").hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { $("toast").hidden = true; }, 4500);
};
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { window.showToast("No se pudo guardar. Exporta tu progreso desde Datos."); }
}
const getLevel = id => LEVELS.find(lv => lv.id === id) || LEVELS[0];
const currentLevel = () => getLevel(state.viewingLevelId);
function draftFor(id, source = state) { return source.drafts[id] || {}; }
const isDone = id => state.completedLevels.includes(id);
const nextLevel = () => LEVELS.find(lv => !isDone(lv.id));
const currentStep = () => state.steps[state.viewingLevelId] || 0;
const totalXp = () => LEVELS.filter(lv => isDone(lv.id)).reduce((sum, lv) => sum + lv.xp, 0);
function requirementsFor(lv, source = state) {
  const id = lv.id, draft = draftFor(id, source);
  return [
    { label: "Plan propio registrado", met: written(draft.pseudo, 40) },
    { label: "Lectura explicada y predicción correcta", met: !!source.quizPassed[id] && written(draft.prediction) },
    { label: "Resultado construido y diálogo con tu agente", met: (source.checklists[id] || []).length === lv.checklist.length && written(draft.agentBrief) },
    { label: "Prueba con resultado esperado y observado", met: written(draft.expected) && written(draft.observed) && (!lv.boss || written(draft.reference, 5)) },
    { label: "Standup, seguimiento y segundo intento", met: words(draft.english) >= 8 && words(draft.followup) >= 4 && words(draft.englishRetry) >= 8 },
    { label: "Revisión técnica e inglés confirmada por ti", met: written(draft.reviewNote) && source.reviewConfirmed[id] === true }
  ];
}
function currentStreak() {
  const days = new Set(state.practiceDays), date = new Date();
  if (!days.has(day(date))) date.setDate(date.getDate() - 1);
  let count = 0;
  while (days.has(day(date))) { count++; date.setDate(date.getDate() - 1); }
  return count;
}
function recordPractice(text) {
  if (words(text) < 8) return;
  const today = day(new Date());
  if (!state.practiceDays.includes(today)) { state.practiceDays.push(today); renderHud(); }
}
function renderHud() {
  const count = state.completedLevels.length;
  $("hudRank").textContent = ["Iron", "Bronze", "Silver", "Gold", "Platinum"][Math.min(4, Math.floor(count / 4))];
  $("hudRankTitle").textContent = "";
  $("hudLevels").textContent = `${count}/${LEVELS.length}`;
  $("hudXp").textContent = totalXp();
  const streak = currentStreak();
  $("hudStreak").textContent = streak;
  $("hudStreakUnit").textContent = streak === 1 ? "día" : "días";
  $("hudProgress").style.width = `${count / LEVELS.length * 100}%`;
  $("campaignOverview").innerHTML = `<div class="campaign-intro"><span class="eyebrow">TU CAMPAÑA PERSONAL / APRENDE HACIENDO</span><h1>Entiende. Construye.<br><span>Demuestra lo que sabes.</span></h1><p>Lógica, criterio con IA e inglés. Una misión que puedes demostrar a la vez.</p></div><div class="campaign-score"><span class="eyebrow">MISIONES CON EVIDENCIA</span><strong>${pad(count)}<small> / ${LEVELS.length}</small></strong><p>${count === 16 ? "Campaña completada. Tus entregas siguen disponibles." : `Tu siguiente objetivo: ${esc(nextLevel().name)}`}</p><button class="btn btn-small" data-action="resume">${count === 16 ? "Revisar mi entrega" : "Retomar campaña"} ↗</button></div>`;
  $("skillPanel").innerHTML = SKILLS.map(skill => {
    const relevant = LEVELS.filter(lv => lv.skills.includes(skill.id)), earned = relevant.filter(lv => isDone(lv.id)).length;
    return `<div class="skill"><div><span>${skill.icon} ${skill.label}</span><b>${earned}/${relevant.length}</b></div><progress value="${earned}" max="${relevant.length}" aria-label="${skill.label}: misiones revisadas"></progress></div>`;
  }).join("");
  $("milestonePanel").innerHTML = ACTS.map((act, index) => {
    const earned = LEVELS.filter(lv => lv.act === index).every(lv => isDone(lv.id));
    return `<div class="milestone ${earned ? "earned" : ""}"><span aria-hidden="true">${earned ? "✦" : "◇"}</span><div><small>ACTO ${index + 1} · ${earned ? "CONSEGUIDO" : "POR CONSEGUIR"}</small><b>${esc(act.reward)}</b></div></div>`;
  }).join("");
  $("legacyNotice").hidden = !state.legacyProgress;
}
function renderNav() {
  $("levelNav").innerHTML = ACTS.map((act, index) => {
    const levels = LEVELS.filter(lv => lv.act === index);
    return `<div class="track-group"><div class="track-head"><h3><span>${pad(index + 1)}</span> ${esc(act.name)}</h3><span>${levels.filter(lv => isDone(lv.id)).length}/4</span></div><ol>${levels.map(lv => `<li><button class="level-link ${isDone(lv.id) ? "is-done" : ""}" data-action="open-level" data-level="${lv.id}" aria-current="${lv.id === state.viewingLevelId ? "step" : "false"}" title="${esc(lv.name)}"><span class="num">${pad(lv.id)}</span><span class="name">${esc(lv.name)}</span><span class="mark ${isDone(lv.id) ? "done" : lv.id === nextLevel()?.id ? "next" : ""}" aria-label="${isDone(lv.id) ? "completado" : "pendiente"}">${isDone(lv.id) ? "✓" : lv.boss ? "◆" : ""}</span></button></li>`).join("")}</ol></div>`;
  }).join("");
}
function field(name, label, placeholder, rows = 3) {
  return `<div class="field"><label class="field-label" for="field-${name}">${esc(label)}</label><textarea id="field-${name}" data-field="${name}" rows="${rows}" ${["english", "followup", "englishRetry"].includes(name) ? 'lang="en"' : ""} placeholder="${esc(placeholder)}" ${isDone(state.viewingLevelId) ? "disabled" : ""}>${esc(draftFor(state.viewingLevelId)[name])}</textarea></div>`;
}
function renderStepContent(lv, step) {
  const draft = draftFor(lv.id);
  if (step > 0 && !written(draft.pseudo, 40)) return `<div class="empty-state"><span>◇</span><h3>Primero, tu razonamiento.</h3><p>Registra los pasos de tu plan para abrir los retos. El mínimo de texto comprueba que hay un borrador; el mentor revisará su calidad.</p><button class="btn btn-primary" data-action="step" data-step="0">Escribir mi plan</button></div>`;
  if (step === 0) return `<p class="task-prompt">${esc(lv.planPrompt)}</p>${field("pseudo", "Mi plan, paso a paso", "Entradas → decisiones → acciones → resultado esperado", 5)}<details class="reference"><summary>Una idea para orientarte <span>LECTURA BREVE</span></summary><p>${esc(lv.concept)}</p><blockquote><b>En la Grieta</b>${esc(lv.analogy)}</blockquote></details><div id="hintContent"></div>`;
  if (step === 1) {
    const passed = state.quizPassed[lv.id], misses = state.quizMisses[lv.id] || [];
    return `<p class="task-prompt">Lee este fragmento de otro dominio. Predice el resultado y explica el camino antes de elegir.</p><div class="code-block"><div class="code-head">LECTURA / JAVASCRIPT · ${lv.reading.split("\n").length} LÍNEAS</div><pre><code>${esc(lv.reading)}</code></pre></div>${field("prediction", "Mi predicción y mi explicación", "Sigue los valores. ¿Qué se ejecuta y qué cambia?")}<p class="quiz-q">${esc(lv.quiz.question)}</p><div class="quiz-options">${lv.quiz.options.map((option, i) => `<button class="quiz-option ${passed && i === lv.quiz.correct ? "correct" : misses.includes(i) ? "wrong" : ""}" data-action="quiz-answer" data-option="${i}" ${passed || misses.includes(i) || isDone(lv.id) ? "disabled" : ""}><span>${String.fromCharCode(65 + i)}</span>${esc(option)}</button>`).join("")}</div><p id="quizFeedback" class="feedback ${passed ? "ok" : ""}" role="status">${passed ? `✓ ${esc(lv.quiz.explanation)}` : misses.length ? "Esa predicción no coincide. Recorre los valores y ajusta tu explicación." : "Explica tu predicción antes de comprobarla."}</p>`;
  }
  if (step === 2) return `<p class="task-prompt">${esc(lv.outcome)}</p><p class="workspace-path">TU ZONA DE PRÁCTICA <code>${esc(lv.workspace)}</code></p><ul class="checklist">${lv.checklist.map((item, i) => `<li><label class="check"><input type="checkbox" data-action="check-item" data-index="${i}" ${(state.checklists[lv.id] || []).includes(i) ? "checked" : ""} ${isDone(lv.id) ? "disabled" : ""}><span>${esc(item)}</span></label></li>`).join("")}</ul><div class="agent-task"><span class="eyebrow">TRABAJA CON TU COPILOTO</span><p>${esc(lv.agentTask)}</p></div>${field("agentBrief", "Qué pregunté al agente y qué decidí", "Una pregunta real, la respuesta recibida y tu decisión razonada.")}<p class="field-help">El código de práctica lo escribes tú. Puedes consultar sintaxis; el agente acompaña con preguntas y revisiones.</p>`;
  if (step === 3) return `<p class="task-prompt">${esc(lv.testPrompt)}</p>${field("expected", "Caso de prueba y resultado esperado", "Entrada y pasos concretos → qué debería ocurrir", 4)}${field("observed", "Lo que observé y mi conclusión", "Qué ocurrió, qué corregí y qué no comprobé", 4)}${field("reference", lv.boss ? "Evidencia de la entrega (obligatoria en este jefe)" : "Referencia de evidencia (opcional)", "Ruta de captura, hash de commit o enlace", 2)}<p class="field-help">El mentor revisa estos registros. La plataforma no ejecuta tu ejercicio ni verifica automáticamente su corrección.</p>`;
  if (step === 4) return `<p class="task-prompt" lang="en">${esc(lv.englishPrompt)} Use 1–3 sentences.</p>${field("english", "My first standup", "Explain one action and its result in your own words.")}<div class="field-row"><div class="metrics" id="field-english-metrics"></div><button class="btn btn-small mic-btn" data-action="mic" data-target="field-english" ${isDone(lv.id) ? "disabled" : ""}><span class="rec-dot"></span><span class="mic-label">Grabar</span></button></div><div class="tips" id="field-english-tips"></div><div class="followup"><span class="eyebrow">FOLLOW-UP</span><p lang="en">${esc(lv.followup)}</p></div>${field("followup", "My answer to the follow-up", "Answer with a concrete example.", 2)}<div class="field-row"><p class="field-help">Pide revisión técnica e inglés en el chat y vuelve con tu corrección.</p><button class="btn btn-small" data-action="copy-payload">Copiar entrega al mentor ↗</button></div>${field("englishRetry", "My second attempt, after feedback", "Rewrite or repeat your standup using a correction from your coach.")}<p class="field-help">Las palabras cuentan actividad. La claridad se revisa en la conversación con tu coach.</p>`;
  return `<div class="review-intro"><span>◎</span><div><h3>Una entrega que puedes defender.</h3><p>Copia tu evidencia al chat, pide revisión y registra qué aprendiste.</p></div></div><button class="btn" data-action="copy-payload">Copiar entrega completa ↗</button>${field("reviewNote", "Feedback del mentor: lógica e inglés", "Resume la revisión técnica, una corrección de inglés y cómo la aplicaste.", 4)}<label class="check review-check"><input type="checkbox" data-action="confirm-review" ${state.reviewConfirmed[lv.id] ? "checked" : ""} ${isDone(lv.id) ? "disabled" : ""}><span>Confirmo que revisé esta entrega y mi inglés con el mentor, y apliqué el feedback.</span></label><p class="field-help">Confirmación manual tuya. No hay un agente conectado que califique esta página.</p><div id="completionBox"></div>`;
}
function renderLevel() {
  const lv = currentLevel(), step = currentStep();
  window.SpeechLab.stop();
  $("levelPage").innerHTML = `<header class="level-header ${lv.boss ? "boss-header" : ""}"><div class="kicker"><span class="eyebrow">ACTO ${pad(lv.act + 1)} / NIVEL ${pad(lv.id)}</span><span class="status-pill ${isDone(lv.id) ? "done" : ""}">${isDone(lv.id) ? "✓ Entrega revisada" : lv.boss ? "◆ BOSS FIGHT" : `+${lv.xp} XP al completar`}</span></div><h2>${esc(lv.name)}</h2><p class="topic">${esc(lv.topic)}</p><p class="goal">${esc(lv.goal)}</p><div class="outcome"><span aria-hidden="true">↗</span><div><small>AL TERMINAR PODRÁS</small><p>${esc(lv.transfer)}</p></div></div><div class="skill-tags">${lv.skills.map(id => `<span>${esc(SKILLS.find(skill => skill.id === id).label)}</span>`).join("")}</div></header><div class="mission-progress"><div id="missionStatus" role="status"></div><progress id="missionProgress" max="6" value="0" aria-label="Pasos registrados de esta misión"></progress></div><nav class="step-nav" aria-label="Pasos de la misión">${STEPS.map((name, i) => `<button data-action="step" data-step="${i}" aria-current="${step === i ? "step" : "false"}"><span id="stepMark-${i}">${pad(i + 1)}</span>${name}</button>`).join("")}</nav><section class="mission-body" id="missionBody" aria-labelledby="stepHeading"><div class="part-title"><span class="idx">${pad(step + 1)}</span><h3 id="stepHeading" tabindex="-1">${STEPS[step]}</h3><span class="autosave">Guardado local automático</span></div>${renderStepContent(lv, step)}</section><div class="step-footer" id="stepFooter"></div><nav class="pager" aria-label="Entre niveles">${lv.id > 1 ? `<button class="btn btn-quiet" data-action="open-level" data-level="${lv.id - 1}">← Nivel ${pad(lv.id - 1)}</button>` : "<span></span>"}${lv.id < 16 ? `<button class="btn btn-quiet" data-action="open-level" data-level="${lv.id + 1}">Explorar nivel ${pad(lv.id + 1)} →</button>` : ""}</nav>`;
  renderProgress(); renderHints();
  if (step === 4) window.SpeechLab.updateMetrics("field-english", draftFor(lv.id).english || "");
  window.SpeechLab.refreshButtons();
}
function renderProgress() {
  const lv = currentLevel(), reqs = requirementsFor(lv), step = currentStep();
  const count = reqs.filter(r => r.met).length;
  $("missionStatus").innerHTML = `<b>${count}/6 pasos registrados</b><span>${isDone(lv.id) ? "Misión completada con tu confirmación de revisión" : `Siguiente: ${esc(reqs.find(r => !r.met)?.label || "cerrar la entrega")}`}</span>`;
  $("missionProgress").value = count;
  reqs.forEach((r, i) => { const marker = $(`stepMark-${i}`); marker.textContent = r.met ? "✓" : pad(i + 1); marker.parentElement.classList.toggle("step-done", r.met); });
  $("stepFooter").innerHTML = `${step > 0 ? `<button class="btn btn-quiet" data-action="step" data-step="${step - 1}">← Volver</button>` : "<span></span>"}${step < 5 ? `<button class="btn btn-primary" data-action="step" data-step="${step + 1}" ${reqs[step].met ? "" : "disabled"}>Continuar: ${STEPS[step + 1]} →</button>` : "<span></span>"}`;
  if ($("completionBox")) $("completionBox").innerHTML = `<ul class="requirements">${reqs.map(r => `<li class="${r.met ? "met" : ""}">${r.met ? "✓" : "○"} ${esc(r.label)}</li>`).join("")}</ul>${isDone(lv.id) ? `<div class="completion-actions"><span class="earned-label">✦ +${lv.xp} XP registrados</span><button class="btn" data-action="reopen-level">Reabrir entrega</button></div>` : `<button class="btn btn-primary" data-action="complete-level" ${reqs.every(r => r.met) ? "" : "disabled"}>Completar misión · +${lv.xp} XP ↗</button>`}`;
}
function renderHints() {
  if (!$("hintContent")) return;
  const lv = currentLevel(), count = state.unlockedHints[lv.id] || 0;
  $("hintContent").innerHTML = `<div class="hint-list">${lv.hints.slice(0, count).map((hint, i) => `<p class="hint"><span>PISTA ${i + 1}</span>${esc(hint)}</p>`).join("")}</div>${count < lv.hints.length ? `<button class="btn btn-quiet btn-small" data-action="unlock-hint" ${written(draftFor(lv.id).pseudo, 40) && !isDone(lv.id) ? "" : "disabled"}>Necesito una pregunta guía · ${count}/${lv.hints.length}</button>` : `<p class="field-help">Ya tienes las tres preguntas. Lleva tu razonamiento al mentor si sigues atascado.</p>`}`;
}
function openLevel(id) {
  state.viewingLevelId = getLevel(id).id;
  saveState(); renderNav(); renderLevel();
  $("levelPage").scrollIntoView({ block: "start" }); $("stepHeading").focus({ preventScroll: true });
}
function changeStep(step) {
  if (!Number.isInteger(step) || step < 0 || step >= STEPS.length) return;
  state.steps[state.viewingLevelId] = step;
  saveState(); renderLevel(); $("stepHeading").focus({ preventScroll: true });
}
function answerQuiz(index) {
  const lv = currentLevel();
  if (isDone(lv.id) || state.quizPassed[lv.id] || !Number.isInteger(index) || index < 0 || index >= lv.quiz.options.length) return;
  if (!written(draftFor(lv.id).prediction)) { window.showToast("Primero explica tu predicción con tus palabras."); return; }
  state.reviewConfirmed[lv.id] = false;
  if (index === lv.quiz.correct) state.quizPassed[lv.id] = true;
  else state.quizMisses[lv.id] = [...new Set([...(state.quizMisses[lv.id] || []), index])];
  saveState(); renderLevel(); $("quizFeedback")?.scrollIntoView({ block: "nearest" });
}
function completeLevel() {
  const lv = currentLevel();
  if (isDone(lv.id) || !requirementsFor(lv).every(r => r.met)) return;
  state.completedLevels.push(lv.id); saveState(); renderAll();
  const actComplete = LEVELS.filter(item => item.act === lv.act).every(item => isDone(item.id));
  $("celebrationContent").innerHTML = `<span class="celebration-symbol" aria-hidden="true">✦</span><span class="eyebrow">MISIÓN ${pad(lv.id)} COMPLETADA</span><h2>Esto ya puedes explicarlo.</h2><p>${esc(lv.transfer)}</p><strong class="xp-reward">+${lv.xp} XP</strong>${actComplete ? `<p class="act-reward">Acto completado · ${esc(ACTS[lv.act].reward)}</p>` : ""}<p class="field-help">Entrega y revisión registradas por ti.</p>`;
  $("celebrationNext").textContent = nextLevel() ? `Siguiente misión: ${nextLevel().name} →` : "Ver mi campaña completada";
  $("celebration").showModal();
}
function reopenLevel() {
  const id = state.viewingLevelId;
  state.completedLevels = state.completedLevels.filter(value => value !== id); state.reviewConfirmed[id] = false;
  saveState(); renderAll(); window.showToast("Entrega reabierta. Conservas tus notas; vuelve a confirmar la revisión al terminar.");
}
async function copyText(text, message = "Copiado. Pégalo en el chat de tu mentor.") {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const area = document.createElement("textarea"); area.value = text; area.style.position = "fixed"; area.style.opacity = "0";
    document.body.appendChild(area); area.select(); const copied = document.execCommand("copy"); area.remove();
    if (!copied) { window.showToast("No se pudo copiar. Selecciona el texto y usa Ctrl+C."); return; }
  }
  window.showToast(message);
}
function copyLevelPayload() {
  const lv = currentLevel(), draft = draftFor(lv.id);
  copyText(`@02-socratic-fullstack.md @04-english-coach.md @AGENTS.md\n\nNivel ${lv.id}: ${lv.name}\nObjetivo: ${lv.goal}\nWorkspace: ${lv.workspace}\n\nMi plan:\n${draft.pseudo || '(pendiente)'}\n\nLectura externa:\n${lv.reading}\nMi interpretación: ${draft.prediction || '(pendiente)'}\n\nTrabajo declarado:\n${lv.checklist.map((item, i) => `${(state.checklists[lv.id] || []).includes(i) ? '[x]' : '[ ]'} ${item}`).join('\n')}\n\nDiálogo con mi agente y decisión:\n${draft.agentBrief || '(pendiente)'}\n\nPrueba esperada:\n${draft.expected || '(pendiente)'}\nObservado:\n${draft.observed || '(pendiente)'}\nEvidencia: ${draft.reference || '(sin referencia)'}\n\nEnglish prompt: ${lv.englishPrompt}\nFirst standup: ${draft.english || '(pending)'}\nFollow-up: ${lv.followup}\nMy answer: ${draft.followup || '(pending)'}\nSecond attempt: ${draft.englishRetry || '(pending)'}\n\nFeedback previo: ${draft.reviewNote || '(pendiente)'}\n\nInstrucciones: revisa lógica con preguntas socráticas y contrasta evidencia. Nunca escribas ni completes código de /workspaces/. Los checks no prueban corrección. Revisa nombres en inglés. Corrige el standup con lenguaje claro, explica una corrección, haz UNA pregunta nueva en inglés sin darme la respuesta y espera mi segundo intento. Declara qué revisaste y qué sigue sin comprobarse.`);
}
function renderDrills() {
  $("drillList").innerHTML = window.DQ_ENGLISH_DRILLS.map(d => `<article class="drill"><div class="drill-head"><h3>${esc(d.title)}</h3><span class="eyebrow">${esc(d.badge)}</span></div><p>${esc(d.context)}</p><p class="template" lang="en">${esc(d.template)}</p><p class="practice" lang="en">${esc(d.prompt)}</p></article>`).join("");
}
function switchView(view) {
  if (!["levels", "speaking", "prompts"].includes(view)) return;
  ["levels", "speaking", "prompts"].forEach(name => { $(`view-${name}`).hidden = name !== view; });
  document.querySelectorAll('[data-action="switch-view"]').forEach(b => { if (b.dataset.view === view) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
  window.SpeechLab.resetStandup(); window.scrollTo({ top: 0 });
}
function effectiveTheme() { return document.documentElement.dataset.theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); }
function renderTheme() { $("themeToggle").textContent = effectiveTheme() === "dark" ? "☼ Claro" : "◐ Oscuro"; }
function toggleTheme() {
  document.documentElement.dataset.theme = effectiveTheme() === "dark" ? "light" : "dark";
  try { localStorage.setItem("dq_theme", document.documentElement.dataset.theme); } catch {}
  renderTheme();
}
function downloadJson(value, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function importProgress(file) {
  if (file.size > 5 * 1024 * 1024) { window.showToast("El respaldo supera 5 MB. Revisa el archivo."); return; }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const raw = JSON.parse(reader.result);
      if (!plain(raw) || !Array.isArray(raw.completedLevels) || (raw.curriculumVersion && raw.curriculumVersion !== VERSION)) throw new Error("Incompatible backup");
      window.SpeechLab.resetStandup();
      if (raw.curriculumVersion !== VERSION) { state.legacyProgress = raw; window.showToast("Respaldo anterior archivado. Tu campaña actual se conserva."); }
      else { downloadJson(state, `devquest-before-import-${day(new Date())}.json`); state = normalizeState(raw); window.showToast("Progreso importado. Se descargó un respaldo del estado previo."); }
      saveState(); renderAll();
    } catch { window.showToast("Ese archivo no es un respaldo compatible de DevQuest."); }
  };
  reader.onerror = () => window.showToast("No se pudo leer el archivo."); reader.readAsText(file);
}
let resetTimer;
function requestReset(button) {
  if (button.dataset.armed !== "true") {
    button.dataset.armed = "true"; button.textContent = "Confirmar: reiniciar campaña";
    clearTimeout(resetTimer); resetTimer = setTimeout(() => { button.dataset.armed = "false"; button.textContent = "Reiniciar campaña"; }, 5000); return;
  }
  clearTimeout(resetTimer); downloadJson(state, `devquest-before-reset-${day(new Date())}.json`);
  const legacy = state.legacyProgress; state = defaults(); if (legacy) state.legacyProgress = legacy;
  window.SpeechLab.resetStandup(); saveState(); renderAll(); button.dataset.armed = "false"; button.textContent = "Reiniciar campaña";
  $("dataMenu").open = false; window.showToast("Campaña reiniciada. Se descargó un respaldo previo.");
}
function renderAll() {
  renderHud(); renderNav(); renderLevel(); $("labTranscript").value = state.labTranscript;
  window.SpeechLab.updateMetrics("labTranscript", state.labTranscript);
}
document.addEventListener("click", event => {
  const menu = $("dataMenu"); if (menu.open && !menu.contains(event.target)) menu.open = false;
  const b = event.target.closest("[data-action]"); if (!b || b.disabled) return;
  switch (b.dataset.action) {
    case "switch-view": return switchView(b.dataset.view);
    case "open-level": return openLevel(Number(b.dataset.level));
    case "resume": return openLevel(nextLevel()?.id || 16);
    case "step": return changeStep(Number(b.dataset.step));
    case "quiz-answer": return answerQuiz(Number(b.dataset.option));
    case "unlock-hint":
      if (isDone(state.viewingLevelId) || !written(draftFor(state.viewingLevelId).pseudo, 40)) return;
      state.unlockedHints[state.viewingLevelId] = Math.min((state.unlockedHints[state.viewingLevelId] || 0) + 1, currentLevel().hints.length); saveState(); return renderHints();
    case "complete-level": return completeLevel();
    case "reopen-level": return reopenLevel();
    case "copy-payload": return copyLevelPayload();
    case "mic": return window.SpeechLab.toggle(b.dataset.target);
    case "timer-start": return window.SpeechLab.startStandup("labTranscript");
    case "timer-reset": return window.SpeechLab.resetStandup();
    case "copy-lab": return copyText(`@04-english-coach.md\n\nMy practice:\n${state.labTranscript}\n\nCorrige con lenguaje natural, explica una corrección y haz una pregunta nueva sin darme su respuesta. Espera mi segundo intento.`);
    case "copy-block": return copyText($(b.dataset.target).textContent);
    case "toggle-theme": return toggleTheme();
    case "export": return downloadJson(state, `devquest-progress-${day(new Date())}.json`);
    case "export-legacy": return downloadJson(state.legacyProgress, "devquest-previous-curriculum.json");
    case "reset-request": return requestReset(b);
    case "celebration-close": return $("celebration").close();
    case "celebration-next": $("celebration").close(); return openLevel(nextLevel()?.id || 16);
  }
});
document.addEventListener("change", event => {
  const el = event.target;
  if (el.id === "importInput" && el.files[0]) { importProgress(el.files[0]); el.value = ""; return; }
  const id = state.viewingLevelId; if (isDone(id)) return;
  if (el.dataset.action === "check-item") {
    const checks = new Set(state.checklists[id] || []), i = Number(el.dataset.index);
    if (!Number.isInteger(i) || i < 0 || i >= currentLevel().checklist.length) return;
    if (el.checked) checks.add(i); else checks.delete(i);
    state.checklists[id] = [...checks]; state.reviewConfirmed[id] = false;
  } else if (el.dataset.action === "confirm-review") state.reviewConfirmed[id] = el.checked;
  else return;
  saveState(); renderProgress();
});
document.addEventListener("input", event => {
  const el = event.target, key = el.dataset.field;
  if (key === "lab") { state.labTranscript = el.value; window.SpeechLab.updateMetrics("labTranscript", el.value); recordPractice(el.value); saveState(); return; }
  if (!FIELDS.includes(key) || isDone(state.viewingLevelId)) return;
  const id = state.viewingLevelId; state.drafts[id] = { ...draftFor(id), [key]: el.value }; state.reviewConfirmed[id] = false;
  const checkbox = document.querySelector('[data-action="confirm-review"]'); if (checkbox) checkbox.checked = false;
  if (key === "english") window.SpeechLab.updateMetrics("field-english", el.value);
  if (["english", "followup", "englishRetry"].includes(key)) recordPractice(el.value);
  if (key === "pseudo") renderHints();
  renderProgress(); saveState();
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", renderTheme);
document.addEventListener("DOMContentLoaded", () => { renderDrills(); renderTheme(); renderAll(); saveState(); });
