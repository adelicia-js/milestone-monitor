import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ApiResponse } from '../types';

// Server-side API client class that handles database operations with proper auth context
export class ServerApiClient {
  private supabase;

  constructor() {
    this.supabase = createServerComponentClient({ cookies });
  }

  protected getSupabase() {
    return this.supabase;
  }

  /**
   * Generic query method to fetch data from a table with optional filters, ordering and limits
   * @param table - Name of the table to query
   * @param options - Query parameters including filters, order, and limit
   * @returns Promise with query results or error
   */
  protected async query<T>(
    table: string,
    options: {
      filters?: Record<string, unknown>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    } = {}
  ): Promise<ApiResponse<T[]>> {
    try {
      let query = this.supabase.from(table).select('*');

      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            if ('gte' in value) query = query.gte(key, value.gte);
            if ('lte' in value) query = query.lte(key, value.lte);
            if ('in' in value && Array.isArray(value.in)) query = query.in(key, value.in);
          } else {
            query = query.eq(key, value);
          }
        });
      }

      if (options.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending ?? true,
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error querying ${table}:`, error);
        return { data: null, error: error.message };
      }

      return { data: data as T[], error: null };
    } catch (error) {
      console.error(`Error querying ${table}:`, error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Insert a new record into a table
   * @param table - Name of the table
   * @param data - Data to insert
   * @returns Promise with inserted record or error
   */
  protected async insert<T>(table: string, data: unknown): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error(`Error inserting into ${table}:`, error);
        return { data: null, error: error.message };
      }

      return { data: result as T, error: null };
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Update a record in a table by its ID
   * @param table - Name of the table
   * @param id - ID of the record to update
   * @param updates - New data to update
   * @returns Promise with updated record or error
   */
  protected async update<T>(
    table: string,
    id: number,
    updates: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${table}:`, error);
        return { data: null, error: error.message };
      }

      return { data: data as T, error: null };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Delete a record from a table by its ID
   * @param table - Name of the table
   * @param id - ID of the record to delete
   * @returns Promise with deleted record or error
   */
  protected async delete<T>(table: string, id: number): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        return { data: null, error: error.message };
      }

      return { data: data as T, error: null };
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Update a record in a table by a specific field value
   * @param table - Name of the table
   * @param field - Field name to match
   * @param value - Value to match
   * @param updates - New data to update
   * @returns Promise with updated record or error
   */
  protected async updateByField<T>(
    table: string,
    field: string,
    value: unknown,
    updates: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .update(updates)
        .eq(field, value)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${table}:`, error);
        return { data: null, error: error.message };
      }

      return { data: data as T, error: null };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }
}