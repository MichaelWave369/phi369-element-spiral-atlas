import test from "node:test";
import assert from "node:assert/strict";
import { FAMILY_COLORS, BLOCK_COLORS, PROPERTY_PRESETS, VIEW_PRESETS, HARMONIC_FILTERS, RESONANCE_MODES, COMPLETENESS_FIELDS } from "../src/data/atlasConstants.js";
import { ELEMENTS } from "../src/data/elementsBase.js";
import { PROPERTY_SEEDS, EMPTY_ELEMENT_PROPERTIES } from "../src/data/propertySeeds.js";
import { PROPERTY_META } from "../src/data/propertyMeta.js";
import { PROPERTY_SOURCES } from "../src/data/propertySources.js";
import { DATA_CURATION_STATUS } from "../src/data/dataCurationStatus.js";
import { digitalRoot } from "../src/lib/atlasMath.js";
import { runDataValidation } from "../src/data/dataValidation.js";

test("element base list has 120 entries including ghost nodes",()=>{ assert.equal(ELEMENTS.length,120); assert.equal(ELEMENTS[0][0],1); assert.equal(ELEMENTS[117][0],118); assert.equal(ELEMENTS[118][0],119); assert.equal(ELEMENTS[119][0],120); });
test("atomic numbers are sequential and unique",()=>{ const set=new Set(); ELEMENTS.forEach((e,i)=>{ assert.equal(e[0],i+1); set.add(e[0]);}); assert.equal(set.size,ELEMENTS.length); });
test("all element families and blocks are known",()=>{ ELEMENTS.forEach((e)=>{ assert.ok(FAMILY_COLORS[e[3]]); assert.ok(BLOCK_COLORS[e[6]]);});});
test("future placeholders remain ghost nodes",()=>{ assert.equal(ELEMENTS[118][3],"future"); assert.equal(ELEMENTS[119][3],"future"); assert.match(ELEMENTS[118][2],/119/); assert.match(ELEMENTS[119][2],/120/);});
test("property metadata overlays are registered",()=>{ Object.keys(PROPERTY_META).forEach((k)=>assert.ok(PROPERTY_PRESETS[k]));});
test("property seed keys are in EMPTY_ELEMENT_PROPERTIES",()=>{ Object.values(PROPERTY_SEEDS).forEach((seed)=>Object.keys(seed).forEach((k)=>assert.ok(Object.hasOwn(EMPTY_ELEMENT_PROPERTIES,k))));});
test("sourceRefs reference known property sources",()=>{ Object.values(PROPERTY_SEEDS).forEach((props)=>{ if(props.sourceRefs){ Object.values(props.sourceRefs).forEach((ids)=>{ assert.ok(Array.isArray(ids)); ids.forEach((id)=>assert.ok(PROPERTY_SOURCES[id]));});}});});
test("curation status field keys are known",()=>{ Object.keys(DATA_CURATION_STATUS.fields).forEach((k)=>assert.ok(Object.hasOwn(EMPTY_ELEMENT_PROPERTIES,k)));});
test("completeness field keys are known and labeled",()=>{ COMPLETENESS_FIELDS.forEach((f)=>{ assert.ok(f.key); assert.ok(f.label); assert.ok(Object.hasOwn(EMPTY_ELEMENT_PROPERTIES,f.key));});});
test("runtime data validation passes for current dataset",()=>{ const errors = runDataValidation({ elements:ELEMENTS, familyColors:FAMILY_COLORS, blockColors:BLOCK_COLORS, propertyPresets:PROPERTY_PRESETS, viewPresets:VIEW_PRESETS, harmonicFilters:HARMONIC_FILTERS, resonanceModes:RESONANCE_MODES, propertyMeta:PROPERTY_META, propertySeeds:PROPERTY_SEEDS, emptyElementProperties:EMPTY_ELEMENT_PROPERTIES, completenessFields:COMPLETENESS_FIELDS, propertySources:PROPERTY_SOURCES, digitalRoot }); assert.deepEqual(errors,[]);});

test("phaseAtSTP is filled for all confirmed elements except explicitly unknown",()=>{ for(let z=1;z<=118;z++){ const props=PROPERTY_SEEDS[z]; assert.ok(props); if(z<=117){ assert.ok(["solid","liquid","gas"].includes(props.phaseAtSTP)); } else { assert.ok(props.phaseAtSTP===null || ["solid","liquid","gas"].includes(props.phaseAtSTP)); } }});
test("occurrence is classified for all confirmed elements",()=>{ for(let z=1;z<=118;z++){ assert.ok(["natural","synthetic"].includes(PROPERTY_SEEDS[z].occurrence)); } assert.equal(PROPERTY_SEEDS[119].occurrence,"future-unconfirmed"); assert.equal(PROPERTY_SEEDS[120].occurrence,"future-unconfirmed"); });
test("phase and occurrence sourceRefs exist for curated confirmed elements",()=>{ for(let z=1;z<=118;z++){ const p=PROPERTY_SEEDS[z]; if(p.phaseAtSTP!==null) assert.ok(Array.isArray(p.sourceRefs?.phaseAtSTP)); assert.ok(Array.isArray(p.sourceRefs?.occurrence)); [ ...(p.sourceRefs?.phaseAtSTP||[]), ...(p.sourceRefs?.occurrence||[])].forEach((id)=>assert.ok(PROPERTY_SOURCES[id])); }});
test("future placeholders keep null phase and future-unconfirmed occurrence",()=>{ assert.equal(PROPERTY_SEEDS[119].phaseAtSTP,null); assert.equal(PROPERTY_SEEDS[120].phaseAtSTP,null); assert.equal(PROPERTY_SEEDS[119].occurrence,"future-unconfirmed"); assert.equal(PROPERTY_SEEDS[120].occurrence,"future-unconfirmed"); });

test("property sources include retrieval metadata",()=>{ const date=/^\d{4}-\d{2}-\d{2}$/; Object.entries(PROPERTY_SOURCES).forEach(([k,v])=>{ assert.equal(v.id,k); assert.ok(v.name); assert.ok(v.url.startsWith("https://")); assert.ok(v.type); assert.ok(date.test(v.retrievalDate)); assert.ok(v.licenseNote);});});
test("electron configuration batch exists for elements 1 through 54",()=>{ for(let z=1;z<=54;z++){ const p=PROPERTY_SEEDS[z]; assert.equal(typeof p.electronConfiguration,"string"); assert.ok(p.electronConfiguration.length>0); assert.ok(Array.isArray(p.sourceRefs?.electronConfiguration)); p.sourceRefs.electronConfiguration.forEach((id)=>assert.ok(PROPERTY_SOURCES[id])); }});
test("electron configuration is not required beyond third batch",()=>{ for(let z=55;z<=120;z++){ const p=PROPERTY_SEEDS[z]; assert.ok(p); } const errors=runDataValidation({ elements:ELEMENTS, familyColors:FAMILY_COLORS, blockColors:BLOCK_COLORS, propertyPresets:PROPERTY_PRESETS, viewPresets:VIEW_PRESETS, harmonicFilters:HARMONIC_FILTERS, resonanceModes:RESONANCE_MODES, propertyMeta:PROPERTY_META, propertySeeds:PROPERTY_SEEDS, emptyElementProperties:EMPTY_ELEMENT_PROPERTIES, completenessFields:COMPLETENESS_FIELDS, propertySources:PROPERTY_SOURCES, digitalRoot }); assert.deepEqual(errors,[]);});

test("electron configuration exceptions/regression values are preserved",()=>{ assert.equal(PROPERTY_SEEDS[41].electronConfiguration,"[Kr] 4d4 5s1"); assert.equal(PROPERTY_SEEDS[42].electronConfiguration,"[Kr] 4d5 5s1"); assert.equal(PROPERTY_SEEDS[44].electronConfiguration,"[Kr] 4d7 5s1"); assert.equal(PROPERTY_SEEDS[45].electronConfiguration,"[Kr] 4d8 5s1"); assert.equal(PROPERTY_SEEDS[46].electronConfiguration,"[Kr] 4d10"); assert.equal(PROPERTY_SEEDS[47].electronConfiguration,"[Kr] 4d10 5s1"); assert.equal(PROPERTY_SEEDS[54].electronConfiguration,"[Kr] 4d10 5s2 5p6");});
test("sourceNotes use known property keys",()=>{ Object.entries(PROPERTY_SEEDS).forEach(([z,p])=>{ if(!p.sourceNotes) return; Object.entries(p.sourceNotes).forEach(([k,v])=>{ assert.ok(Object.hasOwn(EMPTY_ELEMENT_PROPERTIES,k)); assert.equal(typeof v,"string"); assert.ok(v.length>0);});});});

test("curation and source registries are present",()=>{ assert.equal(typeof DATA_CURATION_STATUS.fields,"object"); assert.equal(typeof PROPERTY_SOURCES,"object"); assert.ok(Object.keys(PROPERTY_SOURCES).length>0);});
test("empty properties include sourceRefs and sourceNotes",()=>{ assert.ok(Object.hasOwn(EMPTY_ELEMENT_PROPERTIES,"sourceRefs")); assert.ok(Object.hasOwn(EMPTY_ELEMENT_PROPERTIES,"sourceNotes"));});
