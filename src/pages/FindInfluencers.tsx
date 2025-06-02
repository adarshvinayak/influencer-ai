import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { MapPin, Instagram, Youtube, Users, MessageSquare, BrainCircuit } from "lucide-react";
import { Link } from "react-router-dom";
import { useInfluencers, usePlatformAccounts } from "@/hooks/useInfluencers";
const FindInfluencers = () => {
  const [filters, setFilters] = useState({
    niche: "",
    platform: "",
    location: "",
    followerRange: ""
  });

  // Convert follower range to min/max values
  const getFollowerLimits = (range: string) => {
    switch (range) {
      case "micro":
        return {
          min: 10000,
          max: 100000
        };
      case "mid":
        return {
          min: 100000,
          max: 500000
        };
      case "macro":
        return {
          min: 500000,
          max: undefined
        };
      default:
        return {
          min: undefined,
          max: undefined
        };
    }
  };
  const followerLimits = getFollowerLimits(filters.followerRange);
  const {
    influencers,
    isLoading,
    error
  } = useInfluencers({
    niche: filters.niche || undefined,
    minFollowers: followerLimits.min,
    maxFollowers: followerLimits.max,
    location: filters.location || undefined,
    platforms: filters.platform ? [filters.platform] : undefined
  });
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };
  const formatFollowerCount = (count?: number) => {
    if (!count) return "N/A";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };
  if (isLoading) {
    return <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Influencers</h1>
          <div className="mt-2 p-3 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-teal-800 flex items-center">
              <BrainCircuit className="h-4 w-4 mr-2" />
              ✨ Loading influencers from database...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>;
  }
  if (error) {
    return <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discover Influencers</h1>
          <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800">Error loading influencers: {error.message}</p>
          </div>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discover Influencers (Dummy Data)</h1>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Filter Influencers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="niche">Niche</Label>
                <Select value={filters.niche} onValueChange={value => setFilters({
                ...filters,
                niche: value === "all" ? "" : value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any niche</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                    <SelectItem value="Beauty & Cosmetics">Beauty & Cosmetics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={filters.location} onValueChange={value => setFilters({
                ...filters,
                location: value === "all" ? "" : value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="All India" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All India</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="followers">Follower Count</Label>
                <Select value={filters.followerRange} onValueChange={value => setFilters({
                ...filters,
                followerRange: value === "all" ? "" : value
              })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any range</SelectItem>
                    <SelectItem value="micro">10k - 100k</SelectItem>
                    <SelectItem value="mid">100k - 500k</SelectItem>
                    <SelectItem value="macro">500k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full" onClick={() => {
                // Filters are automatically applied via the useInfluencers hook
              }}>
                  Apply Filters
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setFilters({
                niche: "",
                platform: "",
                location: "",
                followerRange: ""
              })}>
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Influencer Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sort Options */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{influencers?.length || 0} influencers found</p>
            <Select defaultValue="followers">
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="followers">Followers (High to Low)</SelectItem>
                <SelectItem value="engagement">Engagement Rate</SelectItem>
                <SelectItem value="recent">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Influencer Cards */}
          <div className="grid gap-6">
            {influencers && influencers.length > 0 ? influencers.map(influencer => <Card key={influencer.influencer_id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                          {influencer.profile_picture_url ? <img src={influencer.profile_picture_url} alt={influencer.full_name} className="h-16 w-16 rounded-full object-cover" /> : <Users className="h-8 w-8 text-gray-400" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{influencer.full_name}</h3>
                          <p className="text-gray-600">{influencer.username_handle || 'No handle available'}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {influencer.location_city && influencer.location_state_india ? `${influencer.location_city}, ${influencer.location_state_india}` : 'Location not specified'}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-medium">
                            ~{formatFollowerCount(influencer.overall_follower_count_estimate)} Total Followers
                          </span>
                          {influencer.average_engagement_rate_estimate && <span>Engagement: {influencer.average_engagement_rate_estimate}%</span>}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {influencer.primary_niches?.map((niche, index) => <Badge key={index} variant="secondary">{niche}</Badge>) || <Badge variant="outline">No niches specified</Badge>}
                        </div>

                        {influencer.bio_description && <p className="text-sm text-gray-600 line-clamp-2">{influencer.bio_description}</p>}

                        {influencer.past_collaborations_summary && <p className="text-sm text-gray-600">Past Collabs: {influencer.past_collaborations_summary}</p>}
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Link to={`/app/influencers/${influencer.influencer_id}`}>
                          <Button className="w-full bg-teal-500 hover:bg-teal-600">
                            View Full Profile & Outreach Options
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>) : <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Users className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers found</h3>
                  <p className="text-gray-600 text-center max-w-md">
                    Try adjusting your filters to find more influencers, or check back later as we add more profiles to our database.
                  </p>
                </CardContent>
              </Card>}
          </div>
        </div>
      </div>
    </div>;
};
export default FindInfluencers;