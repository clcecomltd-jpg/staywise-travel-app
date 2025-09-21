import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Create Supabase client with service role key for admin operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client with anon key for user operations
export const supabaseAnon = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

export async function connectDatabase(): Promise<void> {
  try {
    // Test the connection by querying a simple table
    const { data, error } = await supabase
      .from('accounts')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    logger.info('✅ Database connection established');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Database helper functions
export class DatabaseHelper {
  static async executeQuery<T>(
    query: () => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    const { data, error } = await query();
    
    if (error) {
      logger.error('Database query error:', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from database');
    }
    
    return data;
  }

  static async executeQueryArray<T>(
    query: () => Promise<{ data: T[] | null; error: any }>
  ): Promise<T[]> {
    const { data, error } = await query();
    
    if (error) {
      logger.error('Database query error:', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
    
    return data || [];
  }

  static async executeMutation<T>(
    query: () => Promise<{ data: T | null; error: any }>
  ): Promise<T> {
    const { data, error } = await query();
    
    if (error) {
      logger.error('Database mutation error:', error);
      throw new Error(`Database operation failed: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from database');
    }
    
    return data;
  }
}