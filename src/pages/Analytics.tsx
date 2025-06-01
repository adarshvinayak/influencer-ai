
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, MessageSquare, DollarSign, Clock, Bot, BarChart3, PieChart, Info } from "lucide-react";

const Analytics = () => {
  // Mock analytics data
  const kpiData = [
    {
      title: "Total Influencers Contacted",
      value: "128",
      subtitle: "Across 5 Campaigns",
      trend: "+15%",
      trendUp: true,
      icon: Users
    },
    {
      title: "Deals Finalized",
      value: "22",
      subtitle: "Success Rate: 17.2%",
      trend: "+8%",
      trendUp: true,
      icon: DollarSign
    },
    {
      title: "Avg. Time to Deal",
      value: "6.5 Days",
      subtitle: "First outreach to signed contract",
      trend: "-2 days",
      trendUp: true,
      icon: Clock
    },
    {
      title: "Total AI Interactions",
      value: "500+",
      subtitle: "Emails, Calls, Chats by AI",
      trend: "+25%",
      trendUp: true,
      icon: Bot
    }
  ];

  const campaignData = [
    {
      campaign: "Spring Fashion",
      contacted: 45,
      deals: 8,
      budget: "₹2,50,000",
      spend: "₹1,44,000",
      roi: "285%"
    },
    {
      campaign: "Tech Gadget Reviews",
      contacted: 32,
      deals: 6,
      budget: "₹1,80,000",
      spend: "₹1,08,000",
      roi: "190%"
    },
    {
      campaign: "Organic Food Fest",
      contacted: 28,
      deals: 5,
      budget: "₹1,20,000",
      spend: "₹90,000",
      roi: "240%"
    },
    {
      campaign: "Fitness Challenge",
      contacted: 15,
      deals: 2,
      budget: "₹80,000",
      spend: "₹36,000",
      roi: "150%"
    },
    {
      campaign: "Travel Diaries",
      contacted: 8,
      deals: 1,
      budget: "₹60,000",
      spend: "₹18,000",
      roi: "120%"
    }
  ];

  const influencerEngagement = [
    {
      influencer: "Ananya Joshi",
      campaigns: 2,
      methods: "Email, Chat",
      status: "Deal Signed",
      interactions: 8,
      timeToStatus: "4 days",
      responseRate: "100%",
      contentScore: "9.2/10"
    },
    {
      influencer: "Rohan Verma",
      campaigns: 1,
      methods: "Phone, Email",
      status: "Negotiating",
      interactions: 12,
      timeToStatus: "7 days",
      responseRate: "85%",
      contentScore: "8.7/10"
    },
    {
      influencer: "Priya Singh",
      campaigns: 1,
      methods: "Email",
      status: "Positive Interest",
      interactions: 4,
      timeToStatus: "2 days",
      responseRate: "100%",
      contentScore: "8.9/10"
    }
  ];

  const aiActivity = [
    {
      time: "2 hours ago",
      agent: "AI Sam (GPT-4 & ElevenLabs)",
      action: "call to @InfluencerX for Campaign Y",
      outcome: "Follow-up scheduled"
    },
    {
      time: "4 hours ago",
      agent: "AI Eva (GPT-4)",
      action: "email to @FashionGuru for Spring Fashion",
      outcome: "Positive response received"
    },
    {
      time: "6 hours ago",
      agent: "AI Sam (GPT-4 & Voice)",
      action: "negotiation with @TechReviewer",
      outcome: "Rate agreed: ₹15k"
    },
    {
      time: "1 day ago",
      agent: "AI Eva (GPT-4)",
      action: "follow-up email to @FoodBlogger",
      outcome: "Contract sent for signing"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaign & Outreach Analytics</h1>
          <p className="text-gray-600 mt-2">Track AI performance and campaign success metrics</p>
        </div>
        
        <Select defaultValue="30days">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{kpi.subtitle}</p>
                </div>
                <div className="flex flex-col items-end">
                  <kpi.icon className="h-8 w-8 text-teal-500" />
                  <div className={`flex items-center mt-2 ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trendUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    <span className="text-sm font-medium">{kpi.trend}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outreach Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Outreach Conversion Funnel
            </CardTitle>
            <CardDescription>Track conversion from AI suggestions to finalized deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Identified (AI Suggestion)</span>
                <span className="text-xl font-bold text-blue-600">150</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-100 rounded-lg">
                <span className="font-medium">Initiated</span>
                <span className="text-xl font-bold text-blue-700">128</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Responses</span>
                <span className="text-xl font-bold text-yellow-600">78</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Positive Interest</span>
                <span className="text-xl font-bold text-green-600">45</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                <span className="font-medium">Negotiations</span>
                <span className="text-xl font-bold text-green-700">32</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-200 rounded-lg">
                <span className="font-medium">Deals</span>
                <span className="text-xl font-bold text-green-800">22</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Agent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              Recent AI Agent Activity
            </CardTitle>
            <CardDescription>Live feed of AI agent actions and outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {aiActivity.map((activity, index) => (
                <div key={index} className="flex space-x-3 p-3 border rounded-lg">
                  <Bot className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.agent}</span> {activity.action}
                    </p>
                    <p className="text-sm text-green-600 mt-1">Outcome: {activity.outcome}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Campaign ROI Overview
          </CardTitle>
          <CardDescription>
            Financial performance across all campaigns
            <span className="inline-flex items-center ml-2 text-xs text-teal-600">
              <Info className="h-3 w-3 mr-1" />
              Financials enhanced with payment integration
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Campaign</th>
                  <th className="text-left py-2">Contacted</th>
                  <th className="text-left py-2">Deals</th>
                  <th className="text-left py-2">Budget</th>
                  <th className="text-left py-2">Spend</th>
                  <th className="text-left py-2">ROI</th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((campaign, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-medium">{campaign.campaign}</td>
                    <td className="py-3">{campaign.contacted}</td>
                    <td className="py-3">{campaign.deals}</td>
                    <td className="py-3">{campaign.budget}</td>
                    <td className="py-3">{campaign.spend}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {campaign.roi}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Influencer Engagement Table */}
      <Card>
        <CardHeader>
          <CardTitle>Influencer Engagement Details</CardTitle>
          <CardDescription>Detailed metrics for each influencer interaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Influencer</th>
                  <th className="text-left py-2">Campaigns</th>
                  <th className="text-left py-2">Methods</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">AI Interactions</th>
                  <th className="text-left py-2">Time to Status</th>
                  <th className="text-left py-2">Response Rate</th>
                  <th className="text-left py-2">Content Score</th>
                </tr>
              </thead>
              <tbody>
                {influencerEngagement.map((influencer, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-medium">{influencer.influencer}</td>
                    <td className="py-3">{influencer.campaigns}</td>
                    <td className="py-3">{influencer.methods}</td>
                    <td className="py-3">
                      <Badge variant="outline">{influencer.status}</Badge>
                    </td>
                    <td className="py-3">{influencer.interactions}</td>
                    <td className="py-3">{influencer.timeToStatus}</td>
                    <td className="py-3">{influencer.responseRate}</td>
                    <td className="py-3">
                      <span className="text-sm">
                        {influencer.contentScore}
                        <span className="text-xs text-gray-500 ml-1">
                          (Future: Live content metrics via APIs)
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Future Features Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-gray-400" />
              Live Content Metrics
              <Badge variant="outline" className="ml-2 text-xs">WIP</Badge>
            </CardTitle>
            <CardDescription>Real-time performance via YouTube/Instagram APIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Live content metrics dashboard coming soon!</p>
              <p className="text-sm mt-2">Integration with YouTube Data API & Instagram Graph API in progress</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-400" />
              Audience Overlap Analysis
              <Badge variant="outline" className="ml-2 text-xs">Advanced AI WIP</Badge>
            </CardTitle>
            <CardDescription>AI-powered audience insights and overlap detection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Advanced AI audience analysis in development</p>
              <p className="text-sm mt-2">Cross-platform audience overlap and demographic insights</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
