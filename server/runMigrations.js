import fs from 'fs';
import path from 'path';
import connection from './config/DB.js';

async function runMigrations() {
  try {
    console.log('Running migrations...');

    const migrationsDir = path.join(process.cwd(), '../database/migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql') && (f.startsWith('006') || f.startsWith('007'))).sort();

    for (const file of files) {
      console.log(`Executing ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await connection.query(sql);
      console.log(`${file} executed successfully`);
    }

    console.log('All migrations completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

runMigrations();