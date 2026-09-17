import test from "node:test";
import assert from "node:assert/strict";
import { ELEMENTS } from "../src/data/elementsBase.js";
import {
  phiCoordinate,
  phiDistance,
  nearestPhiNeighbors,
  periodicGroupPeers,
  COMPARATIVE_EXPERIMENT_CONTRACT,
} from "../src/lib/comparativeAnalysis.js";

test("phiCoordinate is deterministic and radius follows sqrt(Z)", () => {
  const gold = phiCoordinate(79);
  assert.ok(gold);
  assert.equal(gold.z, 79);
  assert.ok(Math.abs(gold.r - Math.sqrt(79)) < 1e-12);
  assert.ok(gold.theta >= 0 && gold.theta < 360);
  assert.deepEqual(gold, phiCoordinate(79));
});

test("phiDistance is symmetric and zero for identical Z", () => {
  assert.equal(phiDistance(79, 79), 0);
  const ab = phiDistance(79, 47);
  const ba = phiDistance(47, 79);
  assert.ok(Number.isFinite(ab));
  assert.ok(Math.abs(ab - ba) < 1e-12);
});

test("nearestPhiNeighbors excludes the selected element and sorts by distance", () => {
  const neighbors = nearestPhiNeighbors(ELEMENTS, 79, 5);
  assert.equal(neighbors.length, 5);
  assert.ok(neighbors.every((item) => item.entry[0] !== 79));
  for (let i = 1; i < neighbors.length; i += 1) {
    assert.ok(neighbors[i - 1].distance <= neighbors[i].distance);
  }
});

test("periodicGroupPeers returns confirmed same-group elements", () => {
  const peers = periodicGroupPeers(ELEMENTS, 79);
  const atomicNumbers = peers.map((entry) => entry[0]);
  assert.ok(atomicNumbers.includes(29));
  assert.ok(atomicNumbers.includes(47));
  assert.ok(atomicNumbers.includes(111));
  assert.ok(!atomicNumbers.includes(79));
  assert.ok(peers.every((entry) => entry[5] === 11 && entry[0] <= 118));
});

test("experiment contract preserves Russell as unavailable pending transcription", () => {
  assert.match(COMPARATIVE_EXPERIMENT_CONTRACT.russellDistance, /unavailable/i);
  assert.match(COMPARATIVE_EXPERIMENT_CONTRACT.nullModel, /shuffled/i);
  assert.match(COMPARATIVE_EXPERIMENT_CONTRACT.authority, /not evidence/i);
});
