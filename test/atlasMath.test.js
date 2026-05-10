import test from "node:test";
import assert from "node:assert/strict";
import { digitalRoot, sectorFromAngle, bandFromZ, nearestMagic, parityLabel, heatColor } from "../src/lib/atlasMath.js";

test("digitalRoot",()=>{ assert.equal(digitalRoot(1),1); assert.equal(digitalRoot(9),9); assert.equal(digitalRoot(10),1); assert.equal(digitalRoot(12),3); assert.equal(digitalRoot(18),9); assert.equal(digitalRoot(120),3); });
test("sectorFromAngle",()=>{ assert.equal(sectorFromAngle(90),1); assert.equal(sectorFromAngle(209.999),1); assert.equal(sectorFromAngle(210),2); assert.equal(sectorFromAngle(329.999),2); assert.equal(sectorFromAngle(330),3); assert.equal(sectorFromAngle(0),3); });
test("bandFromZ",()=>{ assert.equal(bandFromZ(1),1); assert.equal(bandFromZ(2),1); assert.equal(bandFromZ(3),2); assert.equal(bandFromZ(10),2); assert.equal(bandFromZ(18),3); assert.equal(bandFromZ(36),4); assert.equal(bandFromZ(54),5); assert.equal(bandFromZ(55),6); assert.equal(bandFromZ(120),6); });
test("nearestMagic",()=>{ assert.equal(nearestMagic(119,[114,120,126]).value,120); assert.equal(nearestMagic(184,[126,184]).value,184); assert.equal(nearestMagic(181,[126,184]).distance,3); });
test("parityLabel",()=>{ assert.equal(parityLabel(120,184),"even-even"); assert.equal(parityLabel(119,183),"odd-odd"); assert.equal(parityLabel(120,183),"even-odd"); assert.equal(parityLabel(119,184),"odd-even"); });
test("heatColor",()=>{ assert.equal(heatColor(null,0,1),"#e5e7eb"); assert.equal(heatColor(Number.NaN,0,1),"#e5e7eb"); assert.match(heatColor(0.5,0,1),/hsl\(/); });
