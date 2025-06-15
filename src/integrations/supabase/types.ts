export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_engine_settings: {
        Row: {
          created_at: string | null
          id: string
          model: string
          temperature: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          model?: string
          temperature?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          model?: string
          temperature?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_learning_data: {
        Row: {
          applied: boolean
          confidence_score: number
          created_at: string
          data: Json
          id: string
          interaction_type: string
          user_id: string
        }
        Insert: {
          applied?: boolean
          confidence_score?: number
          created_at?: string
          data: Json
          id?: string
          interaction_type: string
          user_id: string
        }
        Update: {
          applied?: boolean
          confidence_score?: number
          created_at?: string
          data?: Json
          id?: string
          interaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_memory_bank: {
        Row: {
          created_at: string
          id: string
          importance_score: number
          last_accessed: string
          memory_key: string
          memory_type: string
          memory_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          importance_score?: number
          last_accessed?: string
          memory_key: string
          memory_type: string
          memory_value: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          importance_score?: number
          last_accessed?: string
          memory_key?: string
          memory_type?: string
          memory_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_personalities: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_custom: boolean
          is_default: boolean
          name: string
          personality_traits: Json
          system_prompt: string
          updated_at: string
          voice_settings: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_custom?: boolean
          is_default?: boolean
          name: string
          personality_traits?: Json
          system_prompt: string
          updated_at?: string
          voice_settings?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_custom?: boolean
          is_default?: boolean
          name?: string
          personality_traits?: Json
          system_prompt?: string
          updated_at?: string
          voice_settings?: Json
        }
        Relationships: []
      }
      announcements: {
        Row: {
          admin_email: string
          admin_id: string
          created_at: string
          id: string
          message: string
          title: string
        }
        Insert: {
          admin_email: string
          admin_id: string
          created_at?: string
          id?: string
          message: string
          title: string
        }
        Update: {
          admin_email?: string
          admin_id?: string
          created_at?: string
          id?: string
          message?: string
          title?: string
        }
        Relationships: []
      }
      conversation_analytics: {
        Row: {
          ai_messages: number
          avg_response_time_seconds: number | null
          created_at: string
          date: string
          id: string
          mood_distribution: Json
          session_duration_minutes: number | null
          topics_discussed: Json
          total_messages: number
          updated_at: string
          user_id: string
          user_messages: number
        }
        Insert: {
          ai_messages?: number
          avg_response_time_seconds?: number | null
          created_at?: string
          date?: string
          id?: string
          mood_distribution?: Json
          session_duration_minutes?: number | null
          topics_discussed?: Json
          total_messages?: number
          updated_at?: string
          user_id: string
          user_messages?: number
        }
        Update: {
          ai_messages?: number
          avg_response_time_seconds?: number | null
          created_at?: string
          date?: string
          id?: string
          mood_distribution?: Json
          session_duration_minutes?: number | null
          topics_discussed?: Json
          total_messages?: number
          updated_at?: string
          user_id?: string
          user_messages?: number
        }
        Relationships: []
      }
      conversation_memory: {
        Row: {
          context_data: Json | null
          created_at: string
          emotional_profile: Json | null
          id: string
          interaction_quality: number | null
          message_content: string
          response_data: Json | null
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          emotional_profile?: Json | null
          id?: string
          interaction_quality?: number | null
          message_content: string
          response_data?: Json | null
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          emotional_profile?: Json | null
          id?: string
          interaction_quality?: number | null
          message_content?: string
          response_data?: Json | null
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_rewards: {
        Row: {
          check_in_date: string
          collected: boolean
          created_at: string
          id: string
          reward_amount: number
          streak_count: number
          user_id: string
        }
        Insert: {
          check_in_date?: string
          collected?: boolean
          created_at?: string
          id?: string
          reward_amount?: number
          streak_count?: number
          user_id: string
        }
        Update: {
          check_in_date?: string
          collected?: boolean
          created_at?: string
          id?: string
          reward_amount?: number
          streak_count?: number
          user_id?: string
        }
        Relationships: []
      }
      game_taps: {
        Row: {
          created_at: string
          id: string
          last_played: string
          score: number
          tap_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_played?: string
          score?: number
          tap_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_played?: string
          score?: number
          tap_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_ai: boolean
          mood: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_ai?: boolean
          mood?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_ai?: boolean
          mood?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nft_metadata: {
        Row: {
          attributes: Json
          collection_id: string | null
          created_at: string
          creator_address: string
          description: string | null
          external_url: string | null
          id: string
          image_url: string
          mint_address: string | null
          name: string
          royalty_percentage: number
          status: string
          updated_at: string
          uri: string | null
        }
        Insert: {
          attributes?: Json
          collection_id?: string | null
          created_at?: string
          creator_address: string
          description?: string | null
          external_url?: string | null
          id?: string
          image_url: string
          mint_address?: string | null
          name: string
          royalty_percentage?: number
          status?: string
          updated_at?: string
          uri?: string | null
        }
        Update: {
          attributes?: Json
          collection_id?: string | null
          created_at?: string
          creator_address?: string
          description?: string | null
          external_url?: string | null
          id?: string
          image_url?: string
          mint_address?: string | null
          name?: string
          royalty_percentage?: number
          status?: string
          updated_at?: string
          uri?: string | null
        }
        Relationships: []
      }
      personality_settings: {
        Row: {
          ai_name: string
          created_at: string
          id: string
          personality_type: string
          updated_at: string
          user_id: string
          voice_id: string | null
        }
        Insert: {
          ai_name?: string
          created_at?: string
          id?: string
          personality_type?: string
          updated_at?: string
          user_id: string
          voice_id?: string | null
        }
        Update: {
          ai_name?: string
          created_at?: string
          id?: string
          personality_type?: string
          updated_at?: string
          user_id?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          chain: string
          created_at: string | null
          email: string | null
          fren_balance: number | null
          id: string
          is_new_user: boolean | null
          last_login: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          wallet_address: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          chain: string
          created_at?: string | null
          email?: string | null
          fren_balance?: number | null
          id?: string
          is_new_user?: boolean | null
          last_login?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          wallet_address: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          chain?: string
          created_at?: string | null
          email?: string | null
          fren_balance?: number | null
          id?: string
          is_new_user?: boolean | null
          last_login?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          wallet_address?: string
        }
        Relationships: []
      }
      user_ai_preferences: {
        Row: {
          active_personality_id: string | null
          analytics_enabled: boolean
          created_at: string
          custom_training_topics: Json
          id: string
          learning_enabled: boolean
          memory_retention_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active_personality_id?: string | null
          analytics_enabled?: boolean
          created_at?: string
          custom_training_topics?: Json
          id?: string
          learning_enabled?: boolean
          memory_retention_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active_personality_id?: string | null
          analytics_enabled?: boolean
          created_at?: string
          custom_training_topics?: Json
          id?: string
          learning_enabled?: boolean
          memory_retention_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_ai_preferences_active_personality_id_fkey"
            columns: ["active_personality_id"]
            isOneToOne: false
            referencedRelation: "ai_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          communication_style: string | null
          created_at: string
          emotional_patterns: string[] | null
          id: string
          last_interaction: string | null
          preferred_topics: string[] | null
          relationship_depth: number | null
          sensitivity_markers: string[] | null
          total_interactions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          created_at?: string
          emotional_patterns?: string[] | null
          id?: string
          last_interaction?: string | null
          preferred_topics?: string[] | null
          relationship_depth?: number | null
          sensitivity_markers?: string[] | null
          total_interactions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_style?: string | null
          created_at?: string
          emotional_patterns?: string[] | null
          id?: string
          last_interaction?: string | null
          preferred_topics?: string[] | null
          relationship_depth?: number | null
          sensitivity_markers?: string[] | null
          total_interactions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_reward: {
        Args: { streak: number }
        Returns: number
      }
      calculate_streak: {
        Args: { user_uuid: string }
        Returns: number
      }
      has_claimed_daily_reward: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
