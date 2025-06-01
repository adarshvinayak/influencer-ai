
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

const FindInfluencers = () => {
  const [filters, setFilters] = useState({
    niche: "",
    platform: "",
    location: "",
    followerRange: ""
  });

  // Mock influencer data
  const mockInfluencers = [
    {
      id: 1,
      name: "Rohan 'Tech Guru' Verma",
      handle: "@TechWithRohan",
      profilePic: "/placeholder.svg",
      platforms: { instagram: "120k", youtube: "75k" },
      totalFollowers: "225k",
      engagementRate: "4.2%",
      niches: ["Tech Reviews", "Gadgets"],
      location: "Bangalore, Karnataka",
      pastCollabs: "OnePlus, Intel"
    },
    {
      id: 2,
      name: "Priya 'Style Maven' Singh",
      handle: "@StyleWithPriya",
      profilePic: "/placeholder.svg",
      platforms: { instagram: "185k", youtube: "45k" },
      totalFollowers: "230k",
      engagementRate: "5.1%",
      niches: ["Fashion", "Lifestyle"],
      location: "Mumbai, Maharashtra", 
      pastCollabs: "Myntra, Nykaa"
    },
    {
      id: 3,
      name: "Ananya 'Foodie Explorer' Joshi",
      handle: "@AnanyaEats",
      profilePic: "/placeholder.svg",
      platforms: { instagram: "150k", youtube: "95k" },
      totalFollowers: "245k",
      engagementRate: "6.3%",
      niches: ["Food", "Travel"],
      location: "Delhi, Delhi",
      pastCollabs: "Swiggy, Zomato"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Discover Influencers for 'Spring Fashion Campaign'</h1>
        <div className="mt-2 p-3 bg-teal-50 rounded-lg border border-teal-200">
          <p className="text-teal-800 flex items-center">
            <BrainCircuit className="h-4 w-4 mr-2" />
            ✨ AI analyzing your brief. Use filters below to refine matches.
          </p>
        </div>
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
                <Select value={filters.niche} onValueChange={(value) => setFilters({...filters, niche: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select value={filters.platform} onValueChange={(value) => setFilters({...filters, platform: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="All India" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="followers">Follower Count</Label>
                <Select value={filters.followerRange} onValueChange={(value) => setFilters({...filters, followerRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="micro">10k - 100k</SelectItem>
                    <SelectItem value="mid">100k - 500k</SelectItem>
                    <SelectItem value="macro">500k+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full">Apply Filters</Button>
                <Button variant="outline" className="w-full">Reset Filters</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Influencer Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sort Options */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{mockInfluencers.length} influencers found</p>
            <Select defaultValue="relevance">
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">AI Relevance Score (WIP)</SelectItem>
                <SelectItem value="followers-high">Followers (High to Low)</SelectItem>
                <SelectItem value="followers-low">Followers (Low to High)</SelectItem>
                <SelectItem value="engagement">Engagement Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Curated Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <BrainCircuit className="h-5 w-5 mr-2 text-orange-500" />
              ✨ AI-Curated Matches for 'Spring Fashion Campaign' 
              <span className="text-sm text-gray-500 ml-2">(GPT-4 analysis - WIP)</span>
            </h2>
          </div>

          {/* Influencer Cards */}
          <div className="grid gap-6">
            {mockInfluencers.map((influencer) => (
              <Card key={influencer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{influencer.name}</h3>
                        <p className="text-gray-600">{influencer.handle}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {influencer.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <Instagram className="h-4 w-4 mr-1 text-pink-500" />
                          <span>{influencer.platforms.instagram}</span>
                          <span className="text-gray-500 ml-1">(Mock - Live API WIP)</span>
                        </div>
                        <div className="flex items-center">
                          <Youtube className="h-4 w-4 mr-1 text-red-500" />
                          <span>{influencer.platforms.youtube}</span>
                          <span className="text-gray-500 ml-1">(Mock - Live API WIP)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-medium">~{influencer.totalFollowers} Total</span>
                        <span>Engagement: {influencer.engagementRate}</span>
                        <span className="text-gray-500">(Mock calc. - Live API WIP)</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {influencer.niches.map((niche, index) => (
                          <Badge key={index} variant="secondary">{niche}</Badge>
                        ))}
                      </div>

                      <p className="text-sm text-gray-600">Past Collabs: {influencer.pastCollabs}</p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Link to={`/app/influencers/${influencer.id}`}>
                        <Button className="w-full bg-teal-500 hover:bg-teal-600">
                          View Full Profile & Outreach Options
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindInfluencers;
