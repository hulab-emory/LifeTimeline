const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { ParticipantEventCapture } = require('../src/participantEventCapture');

function createApp() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'lifetimeline-'));
  const storagePath = path.join(tempDirectory, 'events.json');
  return new ParticipantEventCapture(storagePath);
}

test('adds participants and captures timeline events', () => {
  const app = createApp();

  app.addParticipant('p1', 'Jane Doe', { cohort: 'A' });
  app.captureEvent('p1', 'visit', { location: 'clinic' }, '2026-01-10T12:00:00.000Z');
  app.captureEvent('p1', 'survey', { score: 5 }, '2026-01-11T12:00:00.000Z');

  const events = app.getParticipantEvents('p1');
  assert.equal(events.length, 2);
  assert.equal(events[0].eventType, 'visit');
  assert.equal(events[1].eventType, 'survey');
});

test('rejects events for unknown participants', () => {
  const app = createApp();

  assert.throws(() => {
    app.captureEvent('missing', 'visit');
  }, /does not exist/);
});

test('persists captured data to disk', () => {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'lifetimeline-'));
  const storagePath = path.join(tempDirectory, 'events.json');
  const firstInstance = new ParticipantEventCapture(storagePath);

  firstInstance.addParticipant('p2', 'John Doe');
  firstInstance.captureEvent('p2', 'enrolled', {}, '2026-02-01T00:00:00.000Z');

  const secondInstance = new ParticipantEventCapture(storagePath);
  const timeline = secondInstance.getTimeline();

  assert.equal(timeline.length, 1);
  assert.equal(timeline[0].participantId, 'p2');
  assert.equal(timeline[0].eventType, 'enrolled');
});
