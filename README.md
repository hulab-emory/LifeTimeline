# LifeTimeline

Participant event capture application for recording timeline events by participant.

## Usage

Install dependencies (none required beyond Node.js):

```bash
npm install
```

Run tests:

```bash
npm test
```

Capture events from the CLI:

```bash
npm start -- add-participant p1 "Jane Doe" '{"cohort":"A"}'
npm start -- capture-event p1 visit '{"location":"clinic"}' 2026-01-10T12:00:00.000Z
npm start -- list-events p1
```

By default data is persisted to `data/events.json`. Override with `LIFETIMELINE_DATA=/path/to/events.json`.
