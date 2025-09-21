import { readFileSync } from 'fs';
import { join } from 'path';
import { query, getPool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export const migrate = async (): Promise<void> => {
  try {
    logger.info('Starting database migration...');

    // Read schema file
    const schemaPath = join(process.cwd(), 'src', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await query(statement);
          logger.debug(`Executed: ${statement.substring(0, 100)}...`);
        } catch (error) {
          // Ignore "already exists" errors for tables and extensions
          if (error.message.includes('already exists') || 
              error.message.includes('relation') && error.message.includes('already exists')) {
            logger.debug(`Skipped (already exists): ${statement.substring(0, 100)}...`);
            continue;
          }
          throw error;
        }
      }
    }

    logger.info('Database migration completed successfully');
  } catch (error) {
    logger.error('Database migration failed:', error);
    throw error;
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
    .then(() => {
      logger.info('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}