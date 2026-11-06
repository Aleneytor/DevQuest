const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function platform(saved = {}) {
  const storage = new Map(Object.entries(saved));
  const window = { SpeechLab: { countWords: text => text.trim() ? text.trim().split(/\s+/).length : 0 }, matchMedia: () => ({ addEventListener() {} }) };
  const context = vm.createContext({ window, document: { addEventListener() {} }, localStorage: { getItem: key => storage.get(key) ?? null }, console, setTimeout, clearTimeout });
  vm.runInContext(fs.readFileSync(path.join(root, 'data/curriculum.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/app.js'), 'utf8'), context);
  return expression => JSON.parse(vm.runInContext(`JSON.stringify(${expression})`, context));
}
function finished(id = 1) {
  return {
    curriculumVersion: 'reasoning-v1', completedLevels: [id], practiceDays: [],
    drafts: { [id]: {
      pseudo: 'Describe inputs, decisions, actions and a visible result in separate steps.',
      prediction: 'I traced the values and explained the output before selecting an answer.',
      agentBrief: 'I asked about boundaries and chose a test based on the feedback.',
      expected: 'The selected test should produce the documented visible result.',
      observed: 'I ran the test and recorded what matched and what remains unverified.',
      reference: 'demo.png', english: 'I built the form and checked its labels with my keyboard.',
      followup: 'The form does not save data yet.', englishRetry: 'I created the form and verified that each label focuses its input.',
      reviewNote: 'My mentor checked the logic and corrected a preposition in my standup.'
    } }, checklists: { [id]: [0, 1, 2] }, quizPassed: { [id]: true }, reviewConfirmed: { [id]: true }
  };
}
test('curriculum has sixteen ordered missions, five competencies, external fragments <= 8 lines', () => {
  const run = platform();
  const levels = run('LEVELS');
  assert.equal(levels.length, 16);
  assert.equal(run('SKILLS.length'), 5);
  levels.forEach((level, index) => {
    assert.equal(level.id, index + 1); assert.equal(level.act, Math.floor(index / 4));
    assert.ok(level.reading.split('\n').length <= 8);
    assert.equal(level.checklist.length, 3); assert.equal(level.hints.length, 3);
    assert.ok(level.quiz.correct >= 0 && level.quiz.correct < level.quiz.options.length);
    assert.ok(level.skills.every(id => ['solve', 'read', 'build', 'verify', 'explain'].includes(id)));
    assert.ok(!/renderQuests|saveQuests|CREATE TABLE|quest\.completed/.test(level.reading));
  });
});
test('empty campaign cannot claim a completed step or award XP', () => {
  const run = platform();
  assert.equal(run('requirementsFor(LEVELS[0]).some(item => item.met)'), false);
  assert.equal(run('totalXp()'), 0);
});
test('legacy migration archives all prior data without mapping old achievements', () => {
  const legacy = { completedLevels: [1, 2, 16], drafts: { 1: { pseudo: 'old note' } }, missions: [{ title: 'Keep me' }], practiceDays: ['2026-11-06'], labTranscript: 'My previous practice' };
  const run = platform({ devquest_nexus_state_v2: JSON.stringify(legacy) });
  assert.deepEqual(run('state.completedLevels'), []);
  assert.deepEqual(run('state.legacyProgress'), legacy);
  assert.equal(run('state.labTranscript'), legacy.labTranscript);
  assert.equal(run('totalXp()'), 0);
});
test('completed evidence survives save/reload normalization, including XP', () => {
  const run = platform({ devquest_nexus_state_v3: JSON.stringify(finished()) });
  assert.deepEqual(run('state.completedLevels'), [1]);
  assert.equal(run('totalXp()'), 100);
  assert.equal(run('requirementsFor(LEVELS[0]).every(item => item.met)'), true);
});
test('completion requires technical evidence, second English attempt and manual review', () => {
  for (const field of ['pseudo', 'prediction', 'agentBrief', 'expected', 'observed', 'english', 'followup', 'englishRetry', 'reviewNote']) {
    const data = finished(); data.drafts[1][field] = '';
    assert.deepEqual(platform({ devquest_nexus_state_v3: JSON.stringify(data) })('state.completedLevels'), [], field);
  }
  const data = finished(); data.reviewConfirmed[1] = false;
  assert.deepEqual(platform({ devquest_nexus_state_v3: JSON.stringify(data) })('state.completedLevels'), []);
});
test('boss requires artifact reference; duplicate and invalid checklist entries cannot bypass work', () => {
  const boss = finished(8); boss.drafts[8].reference = '';
  assert.deepEqual(platform({ devquest_nexus_state_v3: JSON.stringify(boss) })('state.completedLevels'), []);
  const data = finished(); data.checklists[1] = [-1, 0, 0, 99];
  const run = platform({ devquest_nexus_state_v3: JSON.stringify(data) });
  assert.deepEqual(run('state.checklists[1]'), [0]); assert.deepEqual(run('state.completedLevels'), []);
});
test('normalization rejects malformed fields and dates and safely preserves literal user text', () => {
  const data = finished(); data.practiceDays = ['2026-02-30', '2026-11-06', '2026-11-06', '2026-99-01'];
  data.drafts[1].pseudo = { invalid: true }; data.steps = { 1: 99 }; data.unlockedHints = { 1: 1.5 };
  const run = platform({ devquest_nexus_state_v3: JSON.stringify(data) });
  assert.deepEqual(run('state.practiceDays'), ['2026-11-06']);
  assert.equal(run('state.drafts[1].pseudo'), ''); assert.equal(run('state.steps[1]'), 0);
  assert.equal(run('state.unlockedHints[1]'), 0);
  assert.equal(run('esc("<img src=x onerror=alert(1)>")'), '&lt;img src=x onerror=alert(1)&gt;');
});
test('all sixteen completed missions produce finite earned XP without double counting', () => {
  const data = finished();
  for (let id = 2; id <= 16; id++) {
    const item = finished(id);
    for (const key of ['drafts', 'checklists', 'quizPassed', 'reviewConfirmed']) Object.assign(data[key], item[key]);
    data.completedLevels.push(id, id);
  }
  const run = platform({ devquest_nexus_state_v3: JSON.stringify(data) });
  assert.equal(run('state.completedLevels.length'), 16);
  assert.equal(run('totalXp()'), 1900);
});

function speech(supported = true) {
  const recognizers = [], messages = [], elements = new Map();
  class Recognition {
    constructor() { recognizers.push(this); }
    start() { this.started = true; }
    stop() { this.stopped = true; }
  }
  const window = { showToast: text => messages.push(text) };
  if (supported) window.SpeechRecognition = Recognition;
  const context = vm.createContext({ window, Date, Event, setInterval, clearInterval, document: { getElementById: id => elements.get(id) || null, querySelectorAll: () => [] } });
  vm.runInContext(fs.readFileSync(path.join(root, 'js/speech-lab.js'), 'utf8'), context);
  return { api: window.SpeechLab, elements, messages, recognizers };
}
test('dictation fallback preserves typed practice without requesting microphone access', () => {
  const { api, elements, messages } = speech(false);
  const element = { value: 'My written practice stays available.', disabled: false };
  elements.set('labTranscript', element);
  api.toggle('labTranscript');
  assert.equal(element.value, 'My written practice stays available.');
  assert.match(messages[0], /escribir/);
});
test('final dictation results dispatch input and stale results never enter another level', () => {
  const { api, elements, recognizers } = speech();
  let events = 0;
  const original = { value: '', disabled: false, dispatchEvent: () => events++ };
  elements.set('field-english', original);
  api.toggle('field-english');
  const first = recognizers[0];
  first.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: 'I checked my results.' }], { isFinal: true })] });
  assert.equal(original.value, 'I checked my results.'); assert.equal(events, 1);
  api.stop(); assert.equal(first.stopped, true);
  const replacement = { value: 'Different level.', disabled: false, dispatchEvent: () => events++ };
  elements.set('field-english', replacement);
  first.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: 'Late old result.' }], { isFinal: true })] });
  first.onend();
  assert.equal(replacement.value, 'Different level.'); assert.equal(events, 1);
});
test('blocked microphone reports a fallback and allows another attempt', () => {
  const { api, elements, recognizers, messages } = speech();
  elements.set('labTranscript', { value: '', disabled: false, dispatchEvent() {} });
  api.toggle('labTranscript'); recognizers[0].onerror({ error: 'not-allowed' });
  assert.match(messages[0], /bloqueado/);
  api.toggle('labTranscript'); assert.equal(recognizers.length, 2); api.stop();
});
