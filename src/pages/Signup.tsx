
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, BrainCircuit, BotMessageSquare, AreaChart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    brandName: "",
    website: "",
    description: "",
    industry: "",
    customIndustry: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const industries = ["Food & Beverage", "Fashion", "Health & Fitness", "Technology", "Beauty & Cosmetics", "Travel", "Gaming", "Education", "Finance", "Home & Garden", "Family & Kids", "Arts & Culture", "Automotive", "Pets", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

    try {
      const finalIndustry = formData.industry === "Other" ? formData.customIndustry : formData.industry;
      
      // Create user account with brand metadata
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/app/dashboard`,
          data: {
            brand_name: formData.brandName,
            contact_person_name: formData.contactName,
            website_url: formData.website,
            description: formData.description,
            industry: finalIndustry
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to Influencer-AI. Redirecting to dashboard...",
        });
        
        // Wait a moment for the brand profile to be created by the trigger
        setTimeout(() => {
          navigate("/app/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    setFormData({
      ...formData,
      website: value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-teal-500" />
            <span className="text-2xl font-bold text-gray-900">Influencer-AI</span>
          </Link>
          <Link to="/login">
            <Button variant="ghost">Already have an account? Login</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Left side - How It Works */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Transform Your Influencer Marketing with AI Precision
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Influencer-AI uses AI to help you discover influencers, automate outreach, and manage campaigns efficiently. Here's how:
              </p>
            </div>

            <div className="space-y-6">
              {[{
                icon: Building2,
                title: "1. Set Up & Strategize",
                description: "Sign up, detail your brand, and craft targeted campaigns (niche, platforms, content goals, detailed brief)."
              }, {
                icon: BrainCircuit,
                title: "2. Find Your Match with AI",
                description: "Explore our curated Indian influencer database. Smart filters & AI (custom embeddings) match your campaign brief to relevant profiles."
              }, {
                icon: BotMessageSquare,
                title: "3. Automate Smart Outreach",
                description: "Our AI agents (GPT-4 for messages, ElevenLabs/Whisper for voice) initiate personalized, multilingual outreach and handle basic negotiations."
              }, {
                icon: AreaChart,
                title: "4. Monitor, Sign & Succeed",
                description: "Track outreach status, manage e-signed contracts (DocuSign/Native), process payments (Razorpay/Stripe), and analyze campaign performance."
              }].map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300 border-l-4 border-l-teal-500">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right side - Sign Up Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Join Influencer-AI Today</CardTitle>
                <CardDescription>
                  Create your account and start your first AI-powered campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Brand Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Brand Information</h3>
                    
                    <div>
                      <Label htmlFor="brandName">Brand Name *</Label>
                      <Input 
                        id="brandName" 
                        placeholder="e.g., Your Awesome Brand Inc." 
                        value={formData.brandName} 
                        onChange={(e) => setFormData({...formData, brandName: e.target.value})} 
                        required 
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Brand Website *</Label>
                      <Input 
                        id="website" 
                        placeholder="yourbrand.com or www.yourbrand.com" 
                        value={formData.website} 
                        onChange={handleWebsiteChange} 
                        required 
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can enter with or without https:// - we'll handle the rest
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description">Brief Brand Description *</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Tell us about your brand..." 
                        maxLength={300} 
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        required 
                      />
                      <p className="text-sm text-gray-500 mt-1">{formData.description.length}/300 characters</p>
                    </div>

                    <div>
                      <Label htmlFor="industry">Industry/Niche *</Label>
                      <Select 
                        value={formData.industry} 
                        onValueChange={(value) => setFormData({...formData, industry: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.industry === "Other" && (
                      <div>
                        <Label htmlFor="customIndustry">Please specify</Label>
                        <Input 
                          id="customIndustry" 
                          placeholder="Enter your industry" 
                          value={formData.customIndustry} 
                          onChange={(e) => setFormData({...formData, customIndustry: e.target.value})} 
                          required 
                        />
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    
                    <div>
                      <Label htmlFor="contactName">Person Name *</Label>
                      <Input 
                        id="contactName" 
                        placeholder="e.g., Priya Sharma" 
                        value={formData.contactName} 
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})} 
                        required 
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="priya.sharma@yourbrand.com" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="Create a strong password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="Confirm password" 
                        value={formData.confirmPassword} 
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.agreeToTerms} 
                      onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})} 
                      required 
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <a href="#" className="text-teal-600 hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Sign Up & Create First Campaign"}
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-teal-600 hover:underline">
                      Log In
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
