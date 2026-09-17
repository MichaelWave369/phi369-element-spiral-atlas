import test from "node:test";
import assert from "node:assert/strict";

import { ELEMENTS } from "../src/data/elementsBase.js";
import {
  COMPARATIVE_MODEL_SOURCES,
  NASA_ORIGIN_SEEDS,
  RUSSELL_ELEMENT_SEEDS,
  getNasaOrigin,
  getRussellSeed,
} from "../src/data/comparativeElementModels.js";

const confirmed = new Set(ELEMENTS.filter(([z]) => z <= 118).map(([z]) => z));

test("comparative source registry keeps distinct authority classes", () => {
  assert.equal(COMPARATIVE_MODEL_SOURCES.modern.authority, "reference");
  assert.equal(COMPARATIVE_MODEL_SOURCES.phi.authority, "experimental projection");
  assert.equal(COMPARATIVE_MODEL_SOURCES.russell.authority, "historical model");
  assert.equal(COMPARATIVE_MODEL_SOURCES.nasa.authority, "modern astrophysics");
});

test("curated comparative seeds only target confirmed elements", () => {
  for (const z of Object.keys(NASA_ORIGIN_SEEDS).map(Number)) assert.ok(confirmed.has(z), `NASA seed Z=${z} must be confirmed`);
  for (const z of Object.keys(RUSSELL_ELEMENT_SEEDS).map(Number)) assert.ok(confirmed.has(z), `Russell seed Z=${z} must be confirmed`);
});

test("source-backed models expose HTTPS provenance URLs", () => {
  for (const key of ["russell", "nasa"]) {
    assert.match(COMPARATIVE_MODEL_SOURCES[key].sourceUrl, /^https:\/\//);
  }
});

test("uncurated elements fail closed instead of receiving inferred claims", () => {
  assert.equal(getNasaOrigin(2), null);
  assert.equal(getRussellSeed(79), null);
});

test("conversation anchor elements are explicitly curated where sourced", () => {
  assert.match(getNasaOrigin(1).summary, /Big Bang/i);
  assert.match(getNasaOrigin(6).summary, /Stellar fusion/i);
  assert.match(getNasaOrigin(8).summary, /Stellar fusion/i);
  assert.match(getNasaOrigin(26).summary, /Supernova/i);
  assert.match(getNasaOrigin(79).summary, /Neutron-star/i);
  assert.match(getRussellSeed(6).placementSummary, /Fifth-octave/i);
});
