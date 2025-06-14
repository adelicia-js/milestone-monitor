import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ApiResponse } from '../types';

// Base API client class that handles database operations
export class ApiClient {
  private supabase; // Supabase client instance

  constructor() {
    // Initialize Supabase client
    this.supabase = createClientComponentClient();
  }

  /**
   * Generic query method to fetch data from a table with optional filters, ordering and limits
   * @param table - Name of the table to query
   * @param query - Query parameters including select (columns string), filters (to filter), order (to sort), and limit (max rows to be returned)
   * @returns Promise with query results or error
   */
  protected async query<T>(
    table: string,
    query: {
      select?: string;
      filters?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<ApiResponse<T[]>> {
    try {
      // Initialize query builder with table and select statement
      let queryBuilder = this.supabase.from(table).select(query.select || '*');

      // Apply filters if provided
      if (query.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          queryBuilder = queryBuilder.eq(key, value);
        });
      }

      // Apply ordering if provided
      if (query.order) {
        queryBuilder = queryBuilder.order(query.order.column, {
          ascending: query.order.ascending ?? true,
        });
      }

      // Apply limit if provided
      if (query.limit) {
        queryBuilder = queryBuilder.limit(query.limit);
      }

      // Execute query
      const { data, error } = await queryBuilder;

      if (error) throw error;

      return { data: data as T[], error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Insert a new record into a table
   * @param table - Name of the table
   * @param data - Data to insert
   * @returns Promise with inserted record or error
   */
  protected async insert<T>(
    table: string,
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      return { data: result as T, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Update a record in a table by its ID
   * @param table - Name of the table
   * @param id - ID of the record to update
   * @param data - New data to update
   * @returns Promise with updated record or error
   */
  protected async update<T>(
    table: string,
    id: string | number,
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data: result as T, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Delete a record from a table by its ID
   * @param table - Name of the table
   * @param id - ID of the record to delete
   * @returns Promise with deleted record or error
   */
  protected async delete<T>(
    table: string,
    id: string | number
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data: result as T, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  /**
   * Update a record in a table by a specific field value
   * @param table - Name of the table
   * @param field - Field name to match
   * @param value - Value to match
   * @param data - New data to update
   * @returns Promise with updated record or error
   */
  protected async updateByField<T>(
    table: string,
    field: string,
    value: string | number,
    data: Partial<T>
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data)
        .eq(field, value)
        .select()
        .single();

      if (error) throw error;

      return { data: result as T, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }
}