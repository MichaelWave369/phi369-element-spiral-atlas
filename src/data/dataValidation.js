export function runDataValidation({
  elements,
  familyColors,
  blockColors,
  propertyPresets,
  viewPresets,
  harmonicFilters,
  resonanceModes,
  propertyMeta,
  propertySeeds,
  propertySources,
  emptyElementProperties,
  completenessFields,
  digitalRoot,
}) {
  const errors = [];
  function assert(condition, message) {
    if (!condition) {
      errors.push(message);
      console.error(`Element Spiral Atlas validation failed: ${message}`);
    }
  }
  assert(elements.length === 120, "Expected 120 entries including 119 and 120 placeholders.");
  const seen = new Set();
  elements.forEach((entry, index) => {
    const [z, symbol, name, family, period, group, block] = entry;
    assert(Array.isArray(entry) && entry.length === 7, `Entry ${index + 1} should have 7 fields.`);
    assert(Number.isFinite(z), `Entry ${index + 1} has invalid atomic number.`);
    assert(z === index + 1, `Atomic number sequence break at index ${index + 1}; found ${z}.`);
    assert(!seen.has(z), `Duplicate atomic number ${z}.`);
    assert(typeof symbol === "string" && symbol.length > 0, `Element ${z} missing symbol.`);
    assert(typeof name === "string" && name.length > 0, `Element ${z} missing name.`);
    assert(Boolean(familyColors[family]), `Element ${z} has unknown family '${family}'.`);
    assert(Number.isFinite(period), `Element ${z} has invalid period.`);
    assert(group === null || Number.isFinite(group), `Element ${z} has invalid group.`);
    assert(Boolean(blockColors[block]), `Element ${z} has unknown block '${block}'.`);
    seen.add(z);
  });
  const e119 = elements.find((entry) => entry[0] === 119);
  const e120 = elements.find((entry) => entry[0] === 120);
  assert(e119?.[3] === "future" && e120?.[3] === "future", "Elements 119 and 120 must have family 'future'.");
  Object.keys(propertyPresets).forEach((overlay) => assert(Boolean(propertyPresets[overlay]), `Overlay ${overlay} missing preset label.`));
  Object.keys(viewPresets).forEach((view) => assert(Boolean(viewPresets[view]), `View mode ${view} missing preset label.`));
  Object.keys(harmonicFilters).forEach((root) => assert(root === "all" || Number(root) >= 1, `Harmonic filter ${root} invalid.`));
  Object.keys(resonanceModes).forEach((mode) => assert(Boolean(resonanceModes[mode]), `Resonance mode ${mode} missing preset label.`));
  assert(digitalRoot(3) === 3 && digitalRoot(12) === 3 && digitalRoot(18) === 9, "Digital-root smoke test failed.");
  assert(Object.keys(propertyMeta).every((key) => propertyPresets[key]), "Every heatmap property should have an overlay preset.");
  const completenessKeys = new Set();
  completenessFields.forEach((field, index) => {
    assert(typeof field?.key === "string" && field.key.length > 0, `Completeness field ${index + 1} missing key.`);
    assert(typeof field?.label === "string" && field.label.length > 0, `Completeness field '${field?.key ?? index + 1}' missing label.`);
    completenessKeys.add(field.key);
  });
  Object.keys(emptyElementProperties).forEach((key) => {
    if (key === "sourceRefs") return;
    assert(completenessKeys.has(key), `Completeness fields missing key '${key}'.`);
  });
  const allowedPropertyKeys = new Set(Object.keys(emptyElementProperties));
  Object.entries(propertySeeds).forEach(([z, props]) => {
    Object.keys(props).forEach((key) => {
      assert(allowedPropertyKeys.has(key), `Property seed for Z=${z} has unknown key '${key}'.`);
    });
  });

  const allowedPhase = new Set(["solid", "liquid", "gas", null]);
  const allowedOccurrence = new Set(["natural", "synthetic", "future-unconfirmed", null]);
  elements.forEach((entry) => {
    const z = entry[0];
    const props = propertySeeds[z] || {};
    assert(allowedPhase.has(props.phaseAtSTP ?? null), `Z=${z} has invalid phaseAtSTP '${props.phaseAtSTP}'.`);
    assert(allowedOccurrence.has(props.occurrence ?? null), `Z=${z} has invalid occurrence '${props.occurrence}'.`);
    if (z >= 1 && z <= 118) {
      assert(props.occurrence === "natural" || props.occurrence === "synthetic", `Z=${z} occurrence should be natural/synthetic.`);
    }
    if (z === 119 || z === 120) {
      assert(props.occurrence === "future-unconfirmed", `Z=${z} occurrence must be future-unconfirmed.`);
      assert((props.phaseAtSTP ?? null) === null, `Z=${z} phaseAtSTP must be null.`);
    }
  });

  const sourceIds = new Set(Object.keys(propertySources || {}));
  Object.entries(propertySeeds).forEach(([z, props]) => {
    if (props.sourceRefs) {
      Object.entries(props.sourceRefs).forEach(([field, ids]) => {
        assert(Array.isArray(ids), `Property seed sourceRefs for Z=${z}.${field} must be an array.`);
        ids.forEach((id) => {
          assert(sourceIds.has(id), `Property seed sourceRefs for Z=${z}.${field} has unknown source id '${id}'.`);
        });
      });
    }
  });

  return errors;
}
