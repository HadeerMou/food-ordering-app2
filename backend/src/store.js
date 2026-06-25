import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedData } from '../data/seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../data/db.json');

export async function readDb() {
  try {
    return JSON.parse(await fs.readFile(dbPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const initial = structuredClone(seedData);
    await writeDb(initial);
    return initial;
  }
}

export async function writeDb(data) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}
