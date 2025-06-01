
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Sparkles, Bot, TrendingUp, Users, MapPin, Star } from "lucide-react";
import { useInfluencers } from "@/hooks/useInfluencers";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useToast } from "@/hooks/use-toast";

interface AIRecommendationsProps {
  campaignId?: string;
  onInfluencerSelect?: (influencerId: string) => void;
}

const AIRecommendations = ({ campaignId, onInfluencerSelect }: AIRecommendationsProps) => {
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const { influencers } = useInfluencers({});
  const { campaigns } = useCampaigns();
  const { toast } = useToast();

  const generateAIRecommendations = async () => {
    if (!campaignId) {
      toast({
        title: "No Campaign Selected",
        description: "Please select a campaign to get AI recommendations.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingRecommendations(true);
    
    try {
      // TODO: Manual Implementation Required
      // 1. Fetch campaign details from Supabase
      // 2. Get sample of influencers from Supabase
      // 3. Send to OpenAI GPT-4o for analysis and ranking
      // 4. Update influencers table with ai_match_score_cache
      
      const campaign = campaigns?.find(c => c.campaign_id === campaignId);
      
      // Mock AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI recommendations with scoring
      const mockRecommendations = influencers?.slice(0, 8).map((influencer, index) => ({
        ...influencer,
        ai_match_score: Math.floor(Math.random() * 30) + 70, // 70-100% match
        ai_reasoning: [
          `Perfect niche alignment with ${campaign?.niche}`,
          `Audience size optimal for ${campaign?.budget_amount} ${campaign?.budget_currency} budget`,
          `High engagement rate indicates quality audience`,
          `Geographic relevance to target market`,
          `Previous collaborations show professionalism`
        ].slice(0, Math.floor(Math.random() * 3) + 2), // 2-4 reasons
        estimated_cost: Math.floor(Math.random() * 50000) + 10000, // 10k-60k INR
        conversion_probability: Math.floor(Math.random() * 40) + 60 // 60-100%
      })).sort((a, b) => b.ai_match_score - a.ai_match_score) || [];
      
      setRecommendations(mockRecommendations);
      setShowRecommendations(true);
      
      toast({
        title: "AI Recommendations Ready!",
        description: `GPT-4o analyzed ${influencers?.length} influencers and found ${mockRecommendations.length} perfect matches.`
      });
      
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  const handleSelectInfluencer = (influencerId: string) => {
    onInfluencerSelect?.(influencerId);
    toast({
      title: "Influencer Selected",
      description: "Navigate to their profile to initiate outreach."
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-purple-500" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>
            Let GPT-4o analyze your campaign and recommend the best influencers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">How AI Recommendations Work:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Analyzes campaign brief, niche, and budget</li>
                <li>• Evaluates influencer content alignment and audience quality</li>
                <li>• Calculates optimal budget allocation and conversion probability</li>
                <li>• Provides detailed reasoning for each recommendation</li>
              </ul>
            </div>

            <Button 
              onClick={generateAIRecommendations}
              disabled={isGeneratingRecommendations || !campaignId}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              {isGeneratingRecommendations ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  GPT-4o Analyzing {influencers?.length} Influencers...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Recommendations
                </>
              )}
            </Button>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-2">Manual Implementation Required:</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• OpenAI API integration for intelligent analysis</li>
                <li>• Campaign and influencer data fetching from Supabase</li>
                <li>• AI match scoring storage in database</li>
                <li>• Security Warning: API key exposed in frontend</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Results */}
      <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              AI Recommendations for {campaigns?.find(c => c.campaign_id === campaignId)?.campaign_name}
            </DialogTitle>
            <DialogDescription>
              GPT-4o has analyzed and ranked the best influencer matches for your campaign
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {recommendations.map((influencer, index) => (
              <Card key={influencer.influencer_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative">
                        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <Badge className="absolute -top-2 -right-2 bg-purple-500 text-xs px-1">
                          #{index + 1}
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{influencer.full_name}</h3>
                          <Badge variant="outline" className="text-purple-600 border-purple-600">
                            {influencer.ai_match_score}% Match
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{influencer.username_handle}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{influencer.overall_follower_count_estimate?.toLocaleString()} followers</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{influencer.average_engagement_rate_estimate}% engagement</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{influencer.location_city}, {influencer.location_state_india}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{influencer.conversion_probability}% conversion probability</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">AI Reasoning:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {influencer.ai_reasoning.map((reason: string, idx: number) => (
                              <li key={idx}>• {reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {influencer.primary_niches?.slice(0, 3).map((niche: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {niche}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Estimated Cost</p>
                        <p className="font-semibold text-lg">₹{influencer.estimated_cost.toLocaleString()}</p>
                      </div>
                      
                      <Button 
                        onClick={() => handleSelectInfluencer(influencer.influencer_id)}
                        className="bg-teal-500 hover:bg-teal-600"
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Recommendations powered by GPT-4o analysis
            </p>
            <Button variant="outline" onClick={() => setShowRecommendations(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIRecommendations;
