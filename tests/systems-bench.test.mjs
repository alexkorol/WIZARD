import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createBench } = require('../tools/systems_bench/bench.js');
const fixture = JSON.parse(readFileSync(new URL('../tools/systems_bench/fixtures/resource-session.v1.json', import.meta.url)));

assert.equal(fixture.schemaVersion, 1);
assert.ok(fixture.events.length >= 4);
for (const event of fixture.events) {
  assert.equal(event.schemaVersion, 1);
  assert.equal(typeof event.sequence, 'number');
  assert.equal(typeof event.timeMs, 'number');
  assert.ok(event.type);
  assert.ok(event.data);
}

const bench = createBench(fixture);
assert.equal(bench.snapshot().index, -1);
const first = bench.step();
assert.equal(first.sequence, 0);
bench.play();
const maybe = bench.tick(10000);
assert.ok(maybe);
bench.pause();
assert.equal(bench.snapshot().playing, false);
const beforeReset = bench.snapshot().index;
assert.ok(beforeReset >= 1);
bench.reset();
assert.equal(bench.snapshot().index, -1);
assert.equal(bench.snapshot().applied.length, 0);

let stepped = 0;
while (bench.index + 1 < fixture.events.length) {
  bench.step();
  stepped += 1;
}
assert.equal(stepped, fixture.events.length);
assert.equal(bench.lastPayload.data.resource, 'mana');

console.log('ok systems bench fixture playback');
