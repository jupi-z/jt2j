#!/usr/bin/env node
/**
 * Non-destructive Figma v2 and editorial image contract check.
 * Default checks only instructions and route mapping: images are intentionally pending.
 * --require-images demands that generated WebP files exist and are marked generated.
 * --require-publication also demands explicit human publication approval and metadata.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const document = (relative) => readFileSync(resolve(root, relative), 'utf8');
const manifest = JSON.parse(document('docs/figma/image-generation-manifest.json'));
const mapping = JSON.parse(document('docs/figma/JT2J_Figma_NextJS_Mapping.json'));
const promptSource = document(manifest.source);
const errors = [];
const strictImages = process.argv.includes('--require-images') || process.argv.includes('--require-publication');
const strictPublication = process.argv.includes('--require-publication');

function check(condition, message) {
  if (!condition) errors.push(message);
}

check(manifest.schema === 'jt2j-editorial-image-workflow/v1', 'Unexpected image manifest schema');
check(Array.isArray(manifest.assets) && manifest.assets.length === 43, 'Expected exactly 43 image records');
check(Array.isArray(mapping.route_matrix) && mapping.route_matrix.length === 19, 'Expected 19 route identities / 38 locales');
check(mapping.implementation?.routes_total === 38, 'Route count mismatch');
check(Array.isArray(mapping.states) && mapping.states.length === 14, 'Expected 14 interaction states');

const routes = new Map((mapping.route_matrix ?? []).map((entry) => [entry.identity, entry]));
const headings = [...promptSource.matchAll(/^## (\d{2})\. ([^\n]+)$/gm)];
check(headings.length === 43, 'Expected exactly 43 numbered prompt headings');
const imagePaths = new Set();

for (const [index, asset] of (manifest.assets ?? []).entries()) {
  const expectedId = index + 1;
  const id = String(expectedId).padStart(2, '0');
  check(asset.id === expectedId, `Prompt ${id} is out of order`);
  check(asset.source_prompt_id === id, `Prompt ${id} has an unexpected source ID`);
  const section = promptSource.split(/^## (?=\d{2}\. )/m)[expectedId] ?? '';
  const match = section.match(/^(\d{2})\. ([^\n]+)\n\n\*\*Format :\*\* `([^`]+)`[\s\S]*?```text\n([\s\S]*?)\n```/);
  check(Boolean(match), `Prompt ${id} missing heading, ratio or complete code block`);
  if (match) {
    check(match[1] === id && match[2].trim() === asset.title, `Prompt ${id} title differs from source`);
    check(match[3] === asset.aspect_ratio, `Prompt ${id} aspect ratio differs from manifest`);
    check(match[4].length > 500, `Prompt ${id} is not a complete autonomous description`);
  }
  const route = routes.get(asset.route_identity);
  check(Boolean(route), `Prompt ${id} refers to unknown route identity`);
  if (route) {
    check(asset.routes.fr === route.fr.url && asset.routes.en === route.en.url, `Prompt ${id} route mismatch`);
    check(asset.figma_frames.fr.desktop === route.fr.desktop && asset.figma_frames.en.mobile === route.en.mobile, `Prompt ${id} Figma IDs mismatch`);
  }
  check(typeof asset.output === 'string' && /^public\/images\/editorial\/jt2j-\d{2}-[a-z0-9-]+\.webp$/.test(asset.output), `Prompt ${id} output path invalid`);
  check(!imagePaths.has(asset.output), `Prompt ${id} duplicates output path`);
  imagePaths.add(asset.output);
  if (strictImages) {
    const full = resolve(root, asset.output);
    check(full.startsWith(root + sep), `Prompt ${id} path escapes repository`);
    check(existsSync(full), `Prompt ${id} image has not been generated: ${asset.output}`);
    if (existsSync(full)) check(statSync(full).size >= 1024, `Prompt ${id} image file is unexpectedly small`);
    check(asset.status === 'generated', `Prompt ${id} has not been marked generated`);
  }
  if (strictPublication) {
    check(asset.publicationApproved === true, `Prompt ${id} is not approved for publication`);
    if (asset.decorative === true) {
      check(asset.alt_fr === '' && asset.alt_en === '', `Prompt ${id} decorative images require empty alt attributes in both locales`);
    } else {
      check(Boolean(asset.alt_fr && asset.alt_en), `Prompt ${id} needs approved bilingual alt text`);
    }
    check(Boolean(asset.rights_evidence), `Prompt ${id} needs approved media rights evidence`);
  }
}

if (errors.length) {
  console.error('JT2J Figma/image contract failed:');
  for (const error of errors) console.error(' - ' + error);
  process.exitCode = 1;
} else {
  console.log(`JT2J Figma contract OK: ${mapping.route_matrix.length * 2} routes, ${mapping.route_matrix.length * 4} reference frames, ${mapping.states.length} states, ${manifest.assets.length} autonomous image prompts.`);
  if (!strictImages) console.log('Images were not checked for existence; run with --require-images after Codex generation.');
}
