
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Target, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const UniversalSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>({ influencers: [], campaigns: [] });
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock data for search results
  const mockInfluencers = [
    { id: 1, name: "Priya Sharma", handle: "@StyleWithPriya", niche: "Fashion", pic: "/placeholder.svg" },
    { id: 2, name: "Ananya Joshi", handle: "@AnanyaEats", niche: "Food", pic: "/placeholder.svg" },
    { id: 3, name: "Rohan Verma", handle: "@TechWithRohan", niche: "Technology", pic: "/placeholder.svg" }
  ];

  const mockCampaigns = [
    { id: "1", name: "Spring Fashion Campaign", status: "Active - Outreach" },
    { id: "2", name: "Tech Gadget Reviews", status: "Negotiating" },
    { id: "3", name: "Organic Food Fest", status: "Completed" }
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      // Mock search logic
      const filteredInfluencers = mockInfluencers.filter(
        influencer => 
          influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          influencer.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
          influencer.handle.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredCampaigns = mockCampaigns.filter(
        campaign => 
          campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults({
        influencers: filteredInfluencers,
        campaigns: filteredCampaigns
      });
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadge = (status: string) => {
    if (status.includes("Active")) return "bg-green-100 text-green-800";
    if (status.includes("Negotiating")) return "bg-orange-100 text-orange-800";
    if (status.includes("Completed")) return "bg-gray-100 text-gray-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search influencers, campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-80"
        />
      </div>

      {/* Results Dropdown */}
      {showResults && (searchQuery.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg bg-white">
          <CardContent className="p-0">
            {/* Influencers Section */}
            {results.influencers.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-4 w-4 text-teal-500" />
                  <span className="text-sm font-medium text-gray-700">Influencers</span>
                </div>
                <div className="space-y-2">
                  {results.influencers.map((influencer: any) => (
                    <Link
                      key={influencer.id}
                      to={`/app/influencers/${influencer.id}`}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setShowResults(false)}
                    >
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{influencer.name}</p>
                        <p className="text-xs text-gray-500">{influencer.handle} • {influencer.niche}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Campaigns Section */}
            {results.campaigns.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="h-4 w-4 text-teal-500" />
                  <span className="text-sm font-medium text-gray-700">Campaigns</span>
                </div>
                <div className="space-y-2">
                  {results.campaigns.map((campaign: any) => (
                    <Link
                      key={campaign.id}
                      to="/app/campaigns"
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setShowResults(false)}
                    >
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
                        <Badge className={`text-xs ${getStatusBadge(campaign.status)}`}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Future Placeholder */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-2 mb-2">
                <Search className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Matching Content (Coming Soon)</span>
              </div>
              <p className="text-xs text-gray-400">Analytics reports, content pieces, and more...</p>
            </div>

            {/* View All Results */}
            <div className="p-4">
              <button className="flex items-center space-x-2 text-sm text-teal-600 hover:text-teal-700 transition-colors">
                <span>View All Results for '{searchQuery}'</span>
                <ArrowRight className="h-3 w-3" />
              </button>
              <p className="text-xs text-gray-400 mt-1">Full search results page - Work in Progress</p>
            </div>

            {/* No Results */}
            {results.influencers.length === 0 && results.campaigns.length === 0 && (
              <div className="p-8 text-center">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords or check spelling</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UniversalSearch;
