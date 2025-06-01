
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Settings, Plug, CreditCard, LogOut, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState({
    brand: false,
    account: false
  });

  // Mock user data
  const [brandData, setBrandData] = useState({
    brandName: "Awesome Fashion Co.",
    website: "https://www.awesomefashion.com",
    description: "Leading fashion brand focused on sustainable and trendy clothing for young professionals across India.",
    industry: "Fashion"
  });

  const [accountData, setAccountData] = useState({
    contactName: "Priya Sharma",
    email: "priya.sharma@awesomefashion.com",
    notifications: {
      criticalAlerts: true,
      platformNews: false,
      dealUpdates: true,
      aiInsights: true
    }
  });

  // Mock integration statuses
  const integrations = [
    {
      name: "Payment Gateway",
      service: "Razorpay/Stripe",
      status: "not-connected",
      description: "Process payments to influencers securely"
    },
    {
      name: "Email Service",
      service: "SendGrid/Gmail API",
      status: "connected",
      connectedId: "SG_XXXXXXXX",
      description: "Send automated emails through AI agents"
    },
    {
      name: "Social APIs",
      service: "YouTube/Instagram",
      status: "not-connected",
      description: "Access real-time influencer metrics and analytics"
    },
    {
      name: "E-Signature",
      service: "DocuSign/Native",
      status: "not-connected",
      description: "Digital contract signing and management"
    }
  ];

  const handleLogout = () => {
    // Mock logout
    navigate("/");
  };

  const handleSaveBrand = () => {
    setIsEditing({ ...isEditing, brand: false });
    // Mock save brand data
    console.log("Saving brand data:", brandData);
  };

  const handleSaveAccount = () => {
    setIsEditing({ ...isEditing, account: false });
    // Mock save account data
    console.log("Saving account data:", accountData);
  };

  const getIntegrationStatus = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case "not-connected":
        return <Badge variant="outline">Not Connected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your brand profile, account settings, and integrations</p>
      </div>

      <Tabs defaultValue="brand" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="brand" className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Brand Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center">
            <Plug className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Subscription
          </TabsTrigger>
        </TabsList>

        {/* Brand Profile Tab */}
        <TabsContent value="brand">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Brand Identity</span>
                {!isEditing.brand ? (
                  <Button variant="outline" onClick={() => setIsEditing({ ...isEditing, brand: true })}>
                    Edit Brand Details
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing({ ...isEditing, brand: false })}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveBrand}>Save Brand Details</Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                This information helps AI agents personalize outreach and represent your brand accurately
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brandName">Brand Name</Label>
                  {isEditing.brand ? (
                    <Input
                      id="brandName"
                      value={brandData.brandName}
                      onChange={(e) => setBrandData({ ...brandData, brandName: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 font-medium">{brandData.brandName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  {isEditing.brand ? (
                    <Input
                      id="website"
                      type="url"
                      value={brandData.website}
                      onChange={(e) => setBrandData({ ...brandData, website: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-blue-600">
                      <a href={brandData.website} target="_blank" rel="noopener noreferrer">
                        {brandData.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                {isEditing.brand ? (
                  <Select value={brandData.industry} onValueChange={(value) => setBrandData({ ...brandData, industry: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                      <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                      <SelectItem value="Beauty & Cosmetics">Beauty & Cosmetics</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Gaming">Gaming</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-gray-900 font-medium">{brandData.industry}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Brand Description</Label>
                {isEditing.brand ? (
                  <Textarea
                    id="description"
                    rows={4}
                    value={brandData.description}
                    onChange={(e) => setBrandData({ ...brandData, description: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-gray-700">{brandData.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User Account Management</span>
                {!isEditing.account ? (
                  <Button variant="outline" onClick={() => setIsEditing({ ...isEditing, account: true })}>
                    Edit Account Details
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing({ ...isEditing, account: false })}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveAccount}>Save Account Changes</Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contactName">Contact Person Name</Label>
                  {isEditing.account ? (
                    <Input
                      id="contactName"
                      value={accountData.contactName}
                      onChange={(e) => setAccountData({ ...accountData, contactName: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 font-medium">{accountData.contactName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Contact Email</Label>
                  <p className="mt-1 text-gray-900 font-medium">{accountData.email}</p>
                  <p className="text-xs text-gray-500">Login email. Contact support to change</p>
                </div>
              </div>

              <div>
                <Button variant="outline">
                  Change Password
                </Button>
                <p className="text-xs text-gray-500 mt-2">WIP - Secure password change flow needed</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {isEditing.account ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="criticalAlerts"
                          checked={accountData.notifications.criticalAlerts}
                          onCheckedChange={(checked) => 
                            setAccountData({
                              ...accountData,
                              notifications: { ...accountData.notifications, criticalAlerts: checked as boolean }
                            })
                          }
                        />
                        <Label htmlFor="criticalAlerts">Critical alerts (budget exceeded, AI needs help)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dealUpdates"
                          checked={accountData.notifications.dealUpdates}
                          onCheckedChange={(checked) => 
                            setAccountData({
                              ...accountData,
                              notifications: { ...accountData.notifications, dealUpdates: checked as boolean }
                            })
                          }
                        />
                        <Label htmlFor="dealUpdates">Deal updates and contract signings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="aiInsights"
                          checked={accountData.notifications.aiInsights}
                          onCheckedChange={(checked) => 
                            setAccountData({
                              ...accountData,
                              notifications: { ...accountData.notifications, aiInsights: checked as boolean }
                            })
                          }
                        />
                        <Label htmlFor="aiInsights">AI insights and recommendations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="platformNews"
                          checked={accountData.notifications.platformNews}
                          onCheckedChange={(checked) => 
                            setAccountData({
                              ...accountData,
                              notifications: { ...accountData.notifications, platformNews: checked as boolean }
                            })
                          }
                        />
                        <Label htmlFor="platformNews">Platform news and feature updates</Label>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Critical alerts</span>
                        <Badge variant={accountData.notifications.criticalAlerts ? "default" : "secondary"}>
                          {accountData.notifications.criticalAlerts ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Deal updates</span>
                        <Badge variant={accountData.notifications.dealUpdates ? "default" : "secondary"}>
                          {accountData.notifications.dealUpdates ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>AI insights</span>
                        <Badge variant={accountData.notifications.aiInsights ? "default" : "secondary"}>
                          {accountData.notifications.aiInsights ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Platform news</span>
                        <Badge variant={accountData.notifications.platformNews ? "default" : "secondary"}>
                          {accountData.notifications.platformNews ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Tools (Mock Setup)</CardTitle>
              <CardDescription>
                Integrate with third-party services to unlock full AI capabilities. All integrations are currently mocked for demonstration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {integration.status === "connected" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <h3 className="font-medium text-gray-900">{integration.name}</h3>
                        {getIntegrationStatus(integration.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
                      <p className="text-xs text-gray-500">
                        Service: {integration.service}
                        {integration.connectedId && ` | ID: ${integration.connectedId}`}
                      </p>
                    </div>
                    <div className="ml-4">
                      {integration.status === "connected" ? (
                        <Button variant="outline" size="sm">
                          Manage... (WIP)
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          Connect... (WIP)
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Integration Benefits</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Automated payment processing with webhooks</li>
                  <li>• Real-time influencer metrics via platform APIs</li>
                  <li>• Seamless contract signing and audit trails</li>
                  <li>• Professional email delivery and tracking</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
              <CardDescription>Manage your Influencer-AI subscription and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Current Plan: Basic Free Tier (Mock)</h3>
                    <Badge variant="outline">Free</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Included Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Up to 3 campaigns</li>
                        <li>• 50 influencer contacts per month</li>
                        <li>• Basic AI outreach</li>
                        <li>• Email support</li>
                        <li>• Standard analytics</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Pro Features (Upgrade):</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Unlimited campaigns</li>
                        <li>• Unlimited influencer contacts</li>
                        <li>• Advanced AI with voice calls</li>
                        <li>• Priority support</li>
                        <li>• Advanced analytics & insights</li>
                        <li>• Custom integrations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600" disabled>
                    View Upgrade Options (WIP - Coming Soon!)
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    Pricing and subscription management features are in development
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Logout Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Account Management</h3>
              <p className="text-sm text-gray-600">Sign out of your Influencer-AI account</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
