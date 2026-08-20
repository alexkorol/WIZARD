(function (global) {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createBench(fixture) {
    const events = (fixture.events || []).slice().sort((a, b) => a.sequence - b.sequence);
    const bench = {
      fixtureId: fixture.id,
      events,
      index: -1,
      timeMs: 0,
      playing: false,
      applied: [],
      lastPayload: null,
      reset() {
        bench.index = -1;
        bench.timeMs = 0;
        bench.playing = false;
        bench.applied = [];
        bench.lastPayload = null;
        return bench.snapshot();
      },
      play() { bench.playing = true; return bench.snapshot(); },
      pause() { bench.playing = false; return bench.snapshot(); },
      step() {
        if (bench.index + 1 >= events.length) {
          bench.playing = false;
          return bench.snapshot();
        }
        bench.index += 1;
        const event = events[bench.index];
        bench.timeMs = event.timeMs;
        bench.lastPayload = event;
        bench.applied.push(event);
        return event;
      },
      tick(dtMs) {
        if (!bench.playing) return null;
        const next = events[bench.index + 1];
        if (!next) {
          bench.playing = false;
          return null;
        }
        bench.timeMs += dtMs;
        if (bench.timeMs >= next.timeMs) return bench.step();
        return null;
      },
      snapshot() {
        return {
          schemaVersion: 1,
          moduleId: 'wizard.systems-bench',
          fixtureId: fixture.id,
          targetModuleId: fixture.targetModuleId,
          index: bench.index,
          timeMs: bench.timeMs,
          playing: bench.playing,
          applied: clone(bench.applied),
          lastPayload: bench.lastPayload ? clone(bench.lastPayload) : null
        };
      }
    };
    return bench;
  }

  global.WizardSystemsBench = { createBench };
  if (typeof module !== 'undefined' && module.exports) module.exports = { createBench };
})(typeof window !== 'undefined' ? window : globalThis);
