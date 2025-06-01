
// Custom types for our application that extend the auto-generated Supabase types

export interface UserBrand {
  brand_id: string;
  auth_user_id: string;
  brand_name: string;
  website_url?: string;
  description?: string;
  industry?: string;
  contact_person_name?: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  campaign_id: string;
  brand_id: string;
  campaign_name: string;
  niche: string;
  desired_platforms?: string[];
  target_locations_india?: string[];
  content_types?: string[];
  description_brief: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget_amount?: number;
  budget_currency?: string;
  created_at: string;
  updated_at: string;
}

export interface Influencer {
  influencer_id: string;
  full_name: string;
  username_handle?: string;
  profile_picture_url?: string;
  bio_description?: string;
  active_since_year?: number;
  location_city?: string;
  location_state_india?: string;
  primary_niches?: string[];
  overall_follower_count_estimate?: number;
  average_engagement_rate_estimate?: number;
  primary_content_types_offered?: string[];
  past_collaborations_summary?: string;
  availability_status?: string;
  verification_status?: string;
  preferred_communication_languages?: string[];
  created_at: string;
  updated_at: string;
}

export interface OutreachActivity {
  outreach_id: string;
  campaign_id: string;
  influencer_id: string;
  brand_id: string;
  outreach_method: string;
  ai_agent_name?: string;
  status: string;
  last_updated_status_at: string;
  initiated_at: string;
  notes_and_alerts?: string;
  created_at: string;
  updated_at: string;
}
