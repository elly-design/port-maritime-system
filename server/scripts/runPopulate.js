// This script runs the populateData.ts script using ts-node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting database population script...');

const tsNode = spawn('npx', [
  'ts-node',
  '--esm',
  '--experimental-specifier-resolution=node',
  path.join(__dirname, 'populateData.ts')
]);

tsNode.stdout.on('data', (data) => {
  console.log(`${data}`);
});

tsNode.stderr.on('data', (data) => {
  console.error(`${data}`);
});

tsNode.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});
