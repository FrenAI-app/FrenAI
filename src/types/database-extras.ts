
// Additional type definitions for tables that aren't in the auto-generated types

// Type for our Supabase client extensions
export interface SupabaseClientExtensions {
  // Additional tables not in the auto-generated types
  from<T = any>(table: string): any;
}
