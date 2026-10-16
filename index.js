#!/usr/bin/env node
const path = require('node:path');
const { ParticipantEventCapture } = require('./src/participantEventCapture');

const storagePath = process.env.LIFETIMELINE_DATA || path.join(__dirname, 'data', 'events.json');
const app = new ParticipantEventCapture(storagePath);
const [command, ...args] = process.argv.slice(2);

try {
  if (command === 'add-participant') {
    const [id, name, metadataJson] = args;
    const metadata = metadataJson ? JSON.parse(metadataJson) : {};
    const participant = app.addParticipant(id, name, metadata);
    console.log(JSON.stringify(participant, null, 2));
  } else if (command === 'capture-event') {
    const [participantId, eventType, detailsJson, occurredAt] = args;
    const details = detailsJson ? JSON.parse(detailsJson) : {};
    const event = app.captureEvent(participantId, eventType, details, occurredAt);
    console.log(JSON.stringify(event, null, 2));
  } else if (command === 'list-events') {
    const [participantId] = args;
    const events = participantId ? app.getParticipantEvents(participantId) : app.getTimeline();
    console.log(JSON.stringify(events, null, 2));
  } else {
    console.log('Usage:');
    console.log('  node index.js add-participant <id> <name> [metadataJson]');
    console.log('  node index.js capture-event <participantId> <eventType> [detailsJson] [occurredAt]');
    console.log('  node index.js list-events [participantId]');
    process.exitCode = 1;
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
