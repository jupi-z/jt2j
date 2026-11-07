import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

describe('Figma V2 implementation and image prompt contract', () => {
  it('keeps the approved 38 routes, 76 reference frames, 14 states and 43 independent prompts in sync', () => {
    const output = execFileSync(
      process.execPath,
      ['scripts/check-figma-assets.mjs'],
      { cwd: process.cwd(), encoding: 'utf8' },
    );
    expect(output).toContain('38 routes');
    expect(output).toContain('76 reference frames');
    expect(output).toContain('14 states');
    expect(output).toContain('43 autonomous image prompts');
  });
});
