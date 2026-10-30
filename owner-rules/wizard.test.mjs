// Runs the shared owner-rule lint over WIZARD; registered in scripts/wizard-lab.mjs verify (and CI).
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
execFileSync(process.execPath, [fileURLToPath(new URL('./lint.mjs', import.meta.url)), 'wizard'], { stdio: 'inherit' });
