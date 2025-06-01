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
      brands: {
        Row: {
          auth_user_id: string
          brand_id: string
          brand_name: string
          contact_person_name: string | null
          created_at: string | null
          description: string | null
          industry: string | null
          profile_picture_url: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          auth_user_id: string
          brand_id?: string
          brand_name: string
          contact_person_name?: string | null
          created_at?: string | null
          description?: string | null
          industry?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          auth_user_id?: string
          brand_id?: string
          brand_name?: string
          contact_person_name?: string | null
          created_at?: string | null
          description?: string | null
          industry?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          brand_id: string
          budget_amount: number | null
          budget_currency: string | null
          campaign_id: string
          campaign_name: string
          content_types: string[] | null
          created_at: string | null
          description_brief: string
          desired_platforms: string[] | null
          end_date: string | null
          niche: string
          start_date: string | null
          status: string
          target_locations_india: string[] | null
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          budget_amount?: number | null
          budget_currency?: string | null
          campaign_id?: string
          campaign_name: string
          content_types?: string[] | null
          created_at?: string | null
          description_brief: string
          desired_platforms?: string[] | null
          end_date?: string | null
          niche: string
          start_date?: string | null
          status?: string
          target_locations_india?: string[] | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          budget_amount?: number | null
          budget_currency?: string | null
          campaign_id?: string
          campaign_name?: string
          content_types?: string[] | null
          created_at?: string | null
          description_brief?: string
          desired_platforms?: string[] | null
          end_date?: string | null
          niche?: string
          start_date?: string | null
          status?: string
          target_locations_india?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
      communication_logs: {
        Row: {
          ai_models_used: string[] | null
          channel: string
          content_transcript: string | null
          created_at: string | null
          direction: string
          log_id: string
          metadata: Json | null
          outreach_id: string
          subject_or_summary: string | null
          timestamp: string
        }
        Insert: {
          ai_models_used?: string[] | null
          channel: string
          content_transcript?: string | null
          created_at?: string | null
          direction: string
          log_id?: string
          metadata?: Json | null
          outreach_id: string
          subject_or_summary?: string | null
          timestamp?: string
        }
        Update: {
          ai_models_used?: string[] | null
          channel?: string
          content_transcript?: string | null
          created_at?: string | null
          direction?: string
          log_id?: string
          metadata?: Json | null
          outreach_id?: string
          subject_or_summary?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "communication_logs_outreach_id_fkey"
            columns: ["outreach_id"]
            isOneToOne: false
            referencedRelation: "outreach_activities"
            referencedColumns: ["outreach_id"]
          },
        ]
      }
      deals_contracts: {
        Row: {
          agreed_deliverables: string
          agreed_rate_amount: number
          agreed_rate_currency: string
          agreed_timeline: string | null
          brand_id: string
          campaign_id: string
          contract_document_url: string | null
          contract_sent_at: string | null
          contract_signed_by_brand_at: string | null
          contract_signed_by_influencer_at: string | null
          created_at: string | null
          deal_finalized_at: string
          deal_id: string
          e_signature_provider: string | null
          e_signature_status: string | null
          influencer_id: string
          outreach_id: string
          updated_at: string | null
        }
        Insert: {
          agreed_deliverables: string
          agreed_rate_amount: number
          agreed_rate_currency?: string
          agreed_timeline?: string | null
          brand_id: string
          campaign_id: string
          contract_document_url?: string | null
          contract_sent_at?: string | null
          contract_signed_by_brand_at?: string | null
          contract_signed_by_influencer_at?: string | null
          created_at?: string | null
          deal_finalized_at?: string
          deal_id?: string
          e_signature_provider?: string | null
          e_signature_status?: string | null
          influencer_id: string
          outreach_id: string
          updated_at?: string | null
        }
        Update: {
          agreed_deliverables?: string
          agreed_rate_amount?: number
          agreed_rate_currency?: string
          agreed_timeline?: string | null
          brand_id?: string
          campaign_id?: string
          contract_document_url?: string | null
          contract_sent_at?: string | null
          contract_signed_by_brand_at?: string | null
          contract_signed_by_influencer_at?: string | null
          created_at?: string | null
          deal_finalized_at?: string
          deal_id?: string
          e_signature_provider?: string | null
          e_signature_status?: string | null
          influencer_id?: string
          outreach_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contracts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "deals_contracts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_analytics"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "deals_contracts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "deals_contracts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["influencer_id"]
          },
          {
            foreignKeyName: "deals_contracts_outreach_id_fkey"
            columns: ["outreach_id"]
            isOneToOne: true
            referencedRelation: "outreach_activities"
            referencedColumns: ["outreach_id"]
          },
        ]
      }
      influencers: {
        Row: {
          active_since_year: number | null
          ai_match_score_cache: Json | null
          availability_status: string | null
          average_engagement_rate_estimate: number | null
          bio_description: string | null
          created_at: string | null
          full_name: string
          influencer_id: string
          location_city: string | null
          location_state_india: string | null
          overall_follower_count_estimate: number | null
          past_collaborations_summary: string | null
          preferred_communication_languages: string[] | null
          primary_content_types_offered: string[] | null
          primary_niches: string[] | null
          profile_picture_url: string | null
          updated_at: string | null
          username_handle: string | null
          verification_status: string | null
        }
        Insert: {
          active_since_year?: number | null
          ai_match_score_cache?: Json | null
          availability_status?: string | null
          average_engagement_rate_estimate?: number | null
          bio_description?: string | null
          created_at?: string | null
          full_name: string
          influencer_id?: string
          location_city?: string | null
          location_state_india?: string | null
          overall_follower_count_estimate?: number | null
          past_collaborations_summary?: string | null
          preferred_communication_languages?: string[] | null
          primary_content_types_offered?: string[] | null
          primary_niches?: string[] | null
          profile_picture_url?: string | null
          updated_at?: string | null
          username_handle?: string | null
          verification_status?: string | null
        }
        Update: {
          active_since_year?: number | null
          ai_match_score_cache?: Json | null
          availability_status?: string | null
          average_engagement_rate_estimate?: number | null
          bio_description?: string | null
          created_at?: string | null
          full_name?: string
          influencer_id?: string
          location_city?: string | null
          location_state_india?: string | null
          overall_follower_count_estimate?: number | null
          past_collaborations_summary?: string | null
          preferred_communication_languages?: string[] | null
          primary_content_types_offered?: string[] | null
          primary_niches?: string[] | null
          profile_picture_url?: string | null
          updated_at?: string | null
          username_handle?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          brand_id: string
          created_at: string | null
          is_read: boolean
          message: string
          notification_id: string
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          is_read?: boolean
          message: string
          notification_id?: string
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          is_read?: boolean
          message?: string
          notification_id?: string
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
      outreach_activities: {
        Row: {
          ai_agent_name: string | null
          brand_id: string
          campaign_id: string
          created_at: string | null
          influencer_id: string
          initiated_at: string | null
          last_updated_status_at: string | null
          next_follow_up_at: string | null
          notes_and_alerts: string | null
          outreach_id: string
          outreach_method: string
          status: string
          updated_at: string | null
        }
        Insert: {
          ai_agent_name?: string | null
          brand_id: string
          campaign_id: string
          created_at?: string | null
          influencer_id: string
          initiated_at?: string | null
          last_updated_status_at?: string | null
          next_follow_up_at?: string | null
          notes_and_alerts?: string | null
          outreach_id?: string
          outreach_method: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          ai_agent_name?: string | null
          brand_id?: string
          campaign_id?: string
          created_at?: string | null
          influencer_id?: string
          initiated_at?: string | null
          last_updated_status_at?: string | null
          next_follow_up_at?: string | null
          notes_and_alerts?: string | null
          outreach_id?: string
          outreach_method?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_activities_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "outreach_activities_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign_analytics"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "outreach_activities_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["campaign_id"]
          },
          {
            foreignKeyName: "outreach_activities_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["influencer_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          deal_id: string
          invoice_url: string | null
          notes: string | null
          payment_due_date: string | null
          payment_gateway: string | null
          payment_id: string
          payment_processed_at: string | null
          status: string
          transaction_id_gateway: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          deal_id: string
          invoice_url?: string | null
          notes?: string | null
          payment_due_date?: string | null
          payment_gateway?: string | null
          payment_id?: string
          payment_processed_at?: string | null
          status?: string
          transaction_id_gateway?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          deal_id?: string
          invoice_url?: string | null
          notes?: string | null
          payment_due_date?: string | null
          payment_gateway?: string | null
          payment_id?: string
          payment_processed_at?: string | null
          status?: string
          transaction_id_gateway?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals_contracts"
            referencedColumns: ["deal_id"]
          },
        ]
      }
      platform_accounts: {
        Row: {
          api_data_last_synced_at: string | null
          created_at: string | null
          engagement_rate_on_platform: number | null
          follower_count: number | null
          influencer_id: string
          platform_account_id: string
          platform_name: string
          profile_url: string
          updated_at: string | null
          username_on_platform: string
        }
        Insert: {
          api_data_last_synced_at?: string | null
          created_at?: string | null
          engagement_rate_on_platform?: number | null
          follower_count?: number | null
          influencer_id: string
          platform_account_id?: string
          platform_name: string
          profile_url: string
          updated_at?: string | null
          username_on_platform: string
        }
        Update: {
          api_data_last_synced_at?: string | null
          created_at?: string | null
          engagement_rate_on_platform?: number | null
          follower_count?: number | null
          influencer_id?: string
          platform_account_id?: string
          platform_name?: string
          profile_url?: string
          updated_at?: string | null
          username_on_platform?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_accounts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["influencer_id"]
          },
        ]
      }
    }
    Views: {
      campaign_analytics: {
        Row: {
          brand_id: string | null
          campaign_id: string | null
          campaign_name: string | null
          finalized_deals: number | null
          negotiations: number | null
          positive_responses: number | null
          total_deal_value: number | null
          total_outreach: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
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
