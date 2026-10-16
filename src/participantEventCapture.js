const fs = require('node:fs');
const path = require('node:path');

class ParticipantEventCapture {
  constructor(storagePath) {
    this.storagePath = storagePath;
    this.state = this.#loadState();
  }

  addParticipant(id, name, metadata = {}) {
    if (!id || !name) {
      throw new Error('Participant id and name are required.');
    }

    if (this.state.participants[id]) {
      throw new Error(`Participant '${id}' already exists.`);
    }

    const participant = {
      id,
      name,
      metadata,
      createdAt: new Date().toISOString(),
    };

    this.state.participants[id] = participant;
    this.#saveState();
    return participant;
  }

  captureEvent(participantId, eventType, details = {}, occurredAt = new Date().toISOString()) {
    if (!participantId || !eventType) {
      throw new Error('participantId and eventType are required.');
    }

    if (!this.state.participants[participantId]) {
      throw new Error(`Participant '${participantId}' does not exist.`);
    }

    const event = {
      id: `${participantId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      participantId,
      eventType,
      details,
      occurredAt,
      capturedAt: new Date().toISOString(),
    };

    this.state.events.push(event);
    this.#saveState();
    return event;
  }

  getParticipantEvents(participantId) {
    return this.state.events
      .filter((event) => event.participantId === participantId)
      .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  }

  getTimeline() {
    return this.state.events
      .slice()
      .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  }

  #loadState() {
    if (!fs.existsSync(this.storagePath)) {
      return { participants: {}, events: [] };
    }

    const fileContent = fs.readFileSync(this.storagePath, 'utf8');
    if (!fileContent.trim()) {
      return { participants: {}, events: [] };
    }

    const parsed = JSON.parse(fileContent);
    return {
      participants: parsed.participants || {},
      events: parsed.events || [],
    };
  }

  #saveState() {
    const directory = path.dirname(this.storagePath);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(this.storagePath, JSON.stringify(this.state, null, 2));
  }
}

module.exports = { ParticipantEventCapture };
