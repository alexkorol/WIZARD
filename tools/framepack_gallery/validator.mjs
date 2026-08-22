const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];

export const FRAME_STATES = ['default', 'hover', 'focus', 'active', 'disabled'];

function issue(code, path, reason) {
  return { code, path, reason: `[${code}] ${path}: ${reason}` };
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function validQuad(value) {
  return Array.isArray(value)
    && value.length === 4
    && value.every((part) => Number.isInteger(part) && part >= 0);
}

function validAssetShape(asset) {
  return isObject(asset)
    && typeof asset.file === 'string'
    && Number.isInteger(asset.width)
    && Number.isInteger(asset.height)
    && typeof asset.sha256 === 'string';
}

export function validateManifestShape(manifest) {
  const errors = [];
  if (!isObject(manifest)) return [issue('manifest', 'manifest', 'expected an object')];
  if (manifest.schemaVersion !== 1) errors.push(issue('manifest', 'manifest', 'schemaVersion must equal 1'));
  if (typeof manifest.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.id)) {
    errors.push(issue('manifest', 'manifest', 'id must be lowercase kebab-case'));
  }
  if (typeof manifest.title !== 'string' || !manifest.title.trim()) {
    errors.push(issue('manifest', 'manifest', 'title must be a non-empty string'));
  }
  if (typeof manifest.assetRoot !== 'string' || !manifest.assetRoot.startsWith('assets/verdigris-ui/framepacks/')) {
    errors.push(issue('manifest', 'manifest', 'assetRoot must begin assets/verdigris-ui/framepacks/'));
  }
  if (!Array.isArray(manifest.components) || manifest.components.length === 0) {
    errors.push(issue('manifest', 'manifest', 'components must contain at least one component'));
    return errors;
  }

  const componentIds = new Set();
  for (const component of manifest.components) {
    const componentId = isObject(component) && typeof component.id === 'string' ? component.id : '<unknown>';
    const componentPath = `component "${componentId}"`;
    if (!isObject(component)) {
      errors.push(issue('component', componentPath, 'expected an object'));
      continue;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(componentId)) {
      errors.push(issue('component', componentPath, 'id must be lowercase kebab-case'));
    } else if (componentIds.has(componentId)) {
      errors.push(issue('component', componentPath, 'duplicate component id'));
    }
    componentIds.add(componentId);
    if (!validQuad(component.slice)) errors.push(issue('slice', componentPath, 'slice must be four non-negative integers'));
    if (!validQuad(component.contentInsets)) {
      errors.push(issue('content-insets', componentPath, 'contentInsets must be four non-negative integers'));
    }
    if (!['stretch', 'repeat', 'round'].includes(component.edgeMode)) {
      errors.push(issue('edge-mode', componentPath, 'edgeMode must be stretch, repeat, or round'));
    }
    if (!isObject(component.states) || !isObject(component.states.default)) {
      errors.push(issue('state', componentPath, 'states.default is required'));
      continue;
    }
    for (const stateName of FRAME_STATES) {
      if (!(stateName in component.states)) continue;
      const asset = component.states[stateName];
      const statePath = `${componentPath} state "${stateName}"`;
      if (!validAssetShape(asset)) {
        errors.push(issue('asset', statePath, 'asset requires file, width, height, and sha256'));
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(asset, 'hasAlpha')) {
        errors.push(issue('alpha-declaration', statePath, 'missing alpha declaration "hasAlpha"'));
      } else if (typeof asset.hasAlpha !== 'boolean') {
        errors.push(issue('alpha-declaration', statePath, 'hasAlpha must be boolean'));
      }
    }
  }
  return errors;
}

export function parsePngMetadata(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (data.length < 33 || PNG_SIGNATURE.some((value, index) => data[index] !== value)) {
    throw new Error('asset is not a valid PNG');
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const chunkType = String.fromCharCode(...data.slice(12, 16));
  if (chunkType !== 'IHDR') throw new Error('PNG is missing its leading IHDR chunk');
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  const colorType = data[25];
  let hasTransparencyChunk = false;
  let offset = 8;
  while (offset + 12 <= data.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...data.slice(offset + 4, offset + 8));
    if (type === 'tRNS') hasTransparencyChunk = true;
    offset += length + 12;
    if (type === 'IEND') break;
  }
  return {
    width,
    height,
    hasAlpha: colorType === 4 || colorType === 6 || hasTransparencyChunk,
    colorType
  };
}

export async function sha256Hex(bytes) {
  const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((part) => part.toString(16).padStart(2, '0')).join('');
}

function resolveAssetUrl(manifest, manifestUrl, file) {
  const rootUrl = new URL(`${manifest.assetRoot.replace(/\/+$/, '')}/`, manifestUrl);
  const assetUrl = new URL(file, rootUrl);
  if (!assetUrl.href.startsWith(rootUrl.href)) throw new Error('asset file escapes assetRoot');
  return assetUrl;
}

export async function validateFramepack(manifest, options) {
  const manifestUrl = options?.manifestUrl;
  const loadAsset = options?.loadAsset;
  if (!manifestUrl || typeof loadAsset !== 'function') {
    throw new Error('validateFramepack requires manifestUrl and loadAsset');
  }

  const errors = validateManifestShape(manifest);
  const assets = [];
  if (!isObject(manifest) || !Array.isArray(manifest.components) || typeof manifest.assetRoot !== 'string') {
    return { ok: false, errors, assets };
  }

  for (const component of manifest.components) {
    if (!isObject(component) || !isObject(component.states)) continue;
    for (const stateName of FRAME_STATES) {
      const asset = component.states[stateName];
      if (!validAssetShape(asset) || typeof asset.hasAlpha !== 'boolean') continue;
      const statePath = `component "${component.id}" state "${stateName}"`;
      const [top, right, bottom, left] = validQuad(component.slice) ? component.slice : [0, 0, 0, 0];
      const [contentTop, contentRight, contentBottom, contentLeft] = validQuad(component.contentInsets)
        ? component.contentInsets
        : [0, 0, 0, 0];

      const horizontalSliceValid = left + right < asset.width;
      const verticalSliceValid = top + bottom < asset.height;
      if (!horizontalSliceValid) {
        errors.push(issue(
          'slice-overflow',
          statePath,
          `horizontal slice overflow: left ${left} + right ${right} must be less than width ${asset.width}`
        ));
      }
      if (!verticalSliceValid) {
        errors.push(issue(
          'slice-overflow',
          statePath,
          `vertical slice overflow: top ${top} + bottom ${bottom} must be less than height ${asset.height}`
        ));
      }
      if (horizontalSliceValid && verticalSliceValid && (
        contentTop < top || contentRight < right || contentBottom < bottom || contentLeft < left
        || contentLeft + contentRight >= asset.width
        || contentTop + contentBottom >= asset.height
      )) {
        errors.push(issue('content-insets', statePath, 'contentInsets must remain inside the sliced center region'));
      }

      let assetUrl;
      try {
        assetUrl = resolveAssetUrl(manifest, manifestUrl, asset.file);
      } catch (error) {
        errors.push(issue('asset-path', statePath, error.message));
        continue;
      }

      try {
        const bytes = await loadAsset(assetUrl);
        const metadata = parsePngMetadata(bytes);
        const actualSha256 = await sha256Hex(bytes);
        if (metadata.width !== asset.width || metadata.height !== asset.height) {
          errors.push(issue(
            'dimension',
            statePath,
            `dimension mismatch: declared ${asset.width}x${asset.height}, decoded ${metadata.width}x${metadata.height}`
          ));
        }
        if (metadata.hasAlpha !== asset.hasAlpha) {
          errors.push(issue(
            'alpha',
            statePath,
            `alpha mismatch: declared ${asset.hasAlpha}, decoded ${metadata.hasAlpha}`
          ));
        }
        if (actualSha256 !== asset.sha256) {
          errors.push(issue(
            'checksum',
            statePath,
            `checksum mismatch: expected ${asset.sha256}, received ${actualSha256}`
          ));
        }
        assets.push({ componentId: component.id, stateName, asset, assetUrl: assetUrl.href, metadata, actualSha256 });
      } catch (error) {
        errors.push(issue('asset-load', statePath, `could not validate ${asset.file}: ${error.message}`));
      }
    }
  }

  return { ok: errors.length === 0, errors, assets };
}
