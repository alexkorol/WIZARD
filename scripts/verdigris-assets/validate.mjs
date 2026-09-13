import fs from 'node:fs';
import path from 'node:path';

export function typeOk(value, type) {
  if (type === 'integer') return typeof value === 'number' && Number.isInteger(value);
  if (type === 'array') return Array.isArray(value);
  if (Array.isArray(type)) return type.some(single => typeOk(value, single));
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return typeof value === type;
}

export function resolveSchemaRefs(schema, defs = schema.$defs || {}, seen = new Set()) {
  if (Array.isArray(schema)) return schema.map(item => resolveSchemaRefs(item, defs, seen));
  if (schema === null || typeof schema !== 'object') return schema;
  if (typeof schema.$ref === 'string' && schema.$ref.startsWith('#/$defs/')) {
    const name = schema.$ref.slice('#/$defs/'.length);
    if (seen.has(name)) throw new Error(`circular $ref ${name}`);
    return resolveSchemaRefs(defs[name], defs, new Set([...seen, name]));
  }
  const out = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === '$defs' || key === '$schema' || key === '$id') continue;
    out[key] = resolveSchemaRefs(value, defs, seen);
  }
  return out;
}

export function validateAgainstSchema(value, schema, failures, source, field = '') {
  const label = field ? `${source}: ${field}` : source;
  if (schema.type && !typeOk(value, schema.type)) {
    const expected = Array.isArray(schema.type) ? schema.type.join(' or ') : schema.type;
    failures.push(`${label} has wrong type (expected ${expected})`);
    return;
  }
  if (schema.const !== undefined && value !== schema.const) {
    failures.push(`${label} must be ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.includes(value)) {
    failures.push(`${label}=${JSON.stringify(value)} is not an allowed value`);
  }
  if (schema.pattern && typeof value === 'string' && !new RegExp(schema.pattern).test(value)) {
    failures.push(`${label}=${JSON.stringify(value)} fails pattern ${schema.pattern}`);
  }
  if (typeof schema.minLength === 'number' && typeof value === 'string' && value.length < schema.minLength) {
    failures.push(`${label} is too short`);
  }
  if (typeof schema.minimum === 'number' && typeof value === 'number' && value < schema.minimum) {
    failures.push(`${label} must be at least ${schema.minimum}`);
  }
  if (Array.isArray(value)) {
    if (typeof schema.minItems === 'number' && value.length < schema.minItems) {
      failures.push(`${label} needs at least ${schema.minItems} items`);
      return;
    }
    if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) {
      failures.push(`${label} allows at most ${schema.maxItems} items`);
      return;
    }
    if (Array.isArray(schema.prefixItems)) {
      schema.prefixItems.forEach((itemSchema, index) => {
        validateAgainstSchema(value[index], itemSchema, failures, source, `${field}[${index}]`);
      });
    } else if (schema.items && schema.items !== false) {
      value.forEach((item, index) => {
        validateAgainstSchema(item, schema.items, failures, source, `${field}[${index}]`);
      });
    }
  }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    const properties = schema.properties || {};
    for (const key of schema.required || []) {
      if (!(key in value)) {
        failures.push(`${source}: missing required field "${field ? `${field}.${key}` : key}"`);
      }
    }
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) {
          failures.push(`${source}: unknown field "${field ? `${field}.${key}` : key}"`);
        }
      }
    }
    for (const [key, spec] of Object.entries(properties)) {
      if (spec === false || !(key in value)) continue;
      validateAgainstSchema(value[key], spec, failures, source, field ? `${field}.${key}` : key);
    }
  }
}

export function loadAndValidateJson(schemaPath, document) {
  const rawSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const schema = resolveSchemaRefs(rawSchema);
  const failures = [];
  validateAgainstSchema(document, schema, failures, path.basename(schemaPath));
  return failures;
}
