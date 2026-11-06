// Dictation is optional. Typed practice works without microphone support.
window.SpeechLab = (() => {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const countWords = text => (text.trim() ? text.trim().split(/\s+/).length : 0);
  const patterns = [
    [/\bi have \d+ years(?! of)\b/i, 'Para la edad: "I am 25 years old". "I have 3 years of experience" sí es correcto.'],
    [/\bdepends? of\b/i, 'Usa "depend on".'],
    [/\bexplain me\b/i, 'Usa "explain to me" o "explain it to me".'],
    [/\bi am agree\b|\bi'm agree\b/i, 'Usa "I agree".'],
    [/\bmake a question\b/i, 'Usa "ask a question".'],
    [/\bsince \d+ (years|months|weeks|days)\b/i, 'Para duración: "for three years". Para un inicio: "since 2023".'],
    [/\bdiscuss about\b/i, 'Usa "discuss something", sin "about".'],
    [/\bpeople is\b/i, 'Usa "people are".'],
    [/\bfor to\b/i, 'Para propósito usa "to + verb".']
  ];
  let active = null;
  let timer = null;
  let deadline = 0;
  const lastWpm = {};
  const toast = text => window.showToast?.(text);
  function updateMetrics(targetId, text) {
    const metric = document.getElementById(`${targetId}-metrics`);
    if (metric) metric.innerHTML = `<span><b>${countWords(text)}</b> palabras</span><span title="Ritmo aproximado del dictado; no mide pronunciación"><b>${lastWpm[targetId] || '—'}</b> WPM aprox.</span>`;
    const tips = document.getElementById(`${targetId}-tips`);
    if (tips) {
      tips.replaceChildren();
      patterns.filter(([pattern]) => pattern.test(text)).forEach(([, hint]) => {
        const line = document.createElement('p'); line.textContent = hint; tips.appendChild(line);
      });
    }
  }
  function refreshButtons() {
    document.querySelectorAll('.mic-btn').forEach(button => {
      const on = !!active && button.dataset.target === active.targetId;
      button.classList.toggle('is-recording', on);
      button.setAttribute('aria-pressed', String(on));
      button.querySelector('.mic-label').textContent = on ? 'Detener' : 'Grabar';
    });
  }
  function finish(take) {
    const element = document.getElementById(take.targetId);
    if (element === take.element) {
      const spoken = Math.max(0, countWords(element.value) - take.baseWords);
      const minutes = Math.max((Date.now() - take.startedAt) / 60000, .1);
      lastWpm[take.targetId] = spoken >= 5 ? Math.round(spoken / minutes) : null;
      updateMetrics(take.targetId, element.value);
    }
    if (active === take) active = null;
    refreshButtons();
  }
  function stop() {
    if (!active) return;
    const take = active;
    try { take.recognition.stop(); } catch {}
    finish(take);
  }
  function start(targetId) {
    const element = document.getElementById(targetId);
    if (!element || element.disabled) return false;
    if (!Recognition) { toast('Dictado no disponible. Puedes escribir tu práctica directamente.'); return false; }
    stop();
    const recognition = new Recognition();
    recognition.lang = 'en-US'; recognition.continuous = true; recognition.interimResults = false;
    const take = { recognition, targetId, element, baseWords: countWords(element.value), startedAt: Date.now() };
    recognition.onresult = event => {
      // Late final results belong to their original target, never to a newly opened level.
      if (document.getElementById(targetId) !== take.element) return;
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i].isFinal) finalText += event.results[i][0].transcript + ' ';
      if (finalText) { element.value = `${element.value} ${finalText}`.trim(); element.dispatchEvent(new Event('input', { bubbles: true })); }
    };
    recognition.onerror = event => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') toast('El micrófono está bloqueado. Puedes dar permiso o escribir directamente.');
      else if (event.error === 'network') toast('El dictado necesita conexión. Tu práctica escrita sigue disponible.');
      else if (event.error !== 'aborted') toast('No se pudo continuar el dictado. Intenta de nuevo o escribe.');
      finish(take);
    };
    recognition.onend = () => finish(take);
    try { recognition.start(); active = take; refreshButtons(); return true; }
    catch { finish(take); toast('No se pudo iniciar el dictado. Espera un momento o escribe.'); return false; }
  }
  function toggle(targetId) {
    if (active?.targetId === targetId) stop(); else start(targetId);
  }
  function renderTimer(seconds) {
    const element = document.getElementById('standupTimer');
    if (!element) return;
    element.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    element.classList.toggle('low', seconds <= 10);
  }
  function startStandup(targetId) {
    clearInterval(timer); deadline = Date.now() + 60000; renderTimer(60);
    if (active?.targetId !== targetId) start(targetId);
    timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      renderTimer(left);
      if (left === 0) { clearInterval(timer); timer = null; stop(); toast('Tiempo. Lleva tu práctica al coach y responde una pregunta nueva.'); }
    }, 250);
  }
  function resetStandup() { clearInterval(timer); timer = null; stop(); renderTimer(60); }
  return { toggle, stop, updateMetrics, refreshButtons, startStandup, resetStandup, countWords };
})();
