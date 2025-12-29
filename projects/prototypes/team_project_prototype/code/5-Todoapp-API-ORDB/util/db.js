/**
 * Database Initialization and Configuration
 * 
 * This module wraps the ORDB bridge and provides database initialization.
 * It automatically selects the appropriate database adapter (MongoDB or SQLite)
 * based on environment configuration.
 */

import { db } from '../db/bridge.js';

/**
 * Initialize the database connection
 * This function should be called before starting the server
 */
export async function initializeDatabase() {
  try {
    await db.connect();
    console.log('Database connected successfully');
    console.log(`Database type: ${process.env.DB_TYPE || 'sqlite'}`);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Close the database connection
 * This function should be called during graceful shutdown
 */
export async function closeDatabase() {
  try {
    await db.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
    throw error;
  }
}

// Export database instance
export { db };
