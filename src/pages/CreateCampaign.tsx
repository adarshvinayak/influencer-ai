
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [formData, setFormData] = useState({
    campaignName: "",
    niche: "",
    platforms: [] as string[],
    targetAllIndia: false,
    targetLocations: [] as string[],
    contentFormats: [] as string[],
    brief: "",
    budget: "",
  });

  const industries = [
    "Food & Beverage", "Fashion", "Health & Fitness", "Technology", 
    "Beauty & Cosmetics", "Travel", "Gaming", "Education", "Finance", 
    "Home & Garden", "Family & Kids", "Arts & Culture", "Automotive", "Pets"
  ];

  const platforms = [
    "Instagram", "YouTube", "TikTok", "X (Twitter)", "Facebook", "LinkedIn", "Blog"
  ];

  const contentFormats = [
    "Static Photo", "Text Post", "Instagram Reel", "Long Video (YouTube)", 
    "Instagram Story", "Blog Article", "Live Stream"
  ];

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", 
    "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh", "Dadra & Nagar Haveli", 
    "Daman & Diu", "Lakshadweep", "Puducherry"
  ];

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }));
  };

  const handleContentFormatChange = (format: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      contentFormats: checked 
        ? [...prev.contentFormats, format]
        : prev.contentFormats.filter(f => f !== format)
    }));
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      targetLocations: checked 
        ? [...prev.targetLocations, location]
        : prev.targetLocations.filter(l => l !== location)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.brief.length < 100) {
      toast({
        title: "Brief too short",
        description: "Please provide at least 100 characters for better AI matching.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Mock campaign creation
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Campaign Created!",
        description: "Your campaign has been created and AI is analyzing for matches."
      });
      navigate("/app/influencers");
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Influencer Campaign</h1>
        <p className="text-gray-600 mt-2">
          Fill details below. More detail = better AI matching!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Basics</CardTitle>
            <CardDescription>Define your campaign's core details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="campaignName">Campaign Name *</Label>
              <Input
                id="campaignName"
                placeholder="e.g., 'Festive Season Blast'"
                maxLength={100}
                value={formData.campaignName}
                onChange={(e) => setFormData({...formData, campaignName: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="niche">Primary Campaign Niche *</Label>
              <Select value={formData.niche} onValueChange={(value) => setFormData({...formData, niche: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign niche" />
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
          </CardContent>
        </Card>

        {/* Target Platforms */}
        <Card>
          <CardHeader>
            <CardTitle>Target Platforms *</CardTitle>
            <CardDescription>Select where you want your campaign to run</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={formData.platforms.includes(platform)}
                    onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                  />
                  <Label htmlFor={platform}>{platform}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Target Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Target Location(s) in India *</CardTitle>
            <CardDescription>Choose your geographic focus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allIndia"
                checked={formData.targetAllIndia}
                onCheckedChange={(checked) => setFormData({...formData, targetAllIndia: checked as boolean})}
              />
              <Label htmlFor="allIndia" className="font-medium">Target All India</Label>
            </div>
            
            {!formData.targetAllIndia && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
                {indianStates.map((state) => (
                  <div key={state} className="flex items-center space-x-2">
                    <Checkbox
                      id={state}
                      checked={formData.targetLocations.includes(state)}
                      onCheckedChange={(checked) => handleLocationChange(state, checked as boolean)}
                    />
                    <Label htmlFor={state} className="text-sm">{state}</Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Formats */}
        <Card>
          <CardHeader>
            <CardTitle>Required Content Formats *</CardTitle>
            <CardDescription>What type of content do you need?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {contentFormats.map((format) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={format}
                    checked={formData.contentFormats.includes(format)}
                    onCheckedChange={(checked) => handleContentFormatChange(format, checked as boolean)}
                  />
                  <Label htmlFor={format}>{format}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Brief */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Goals & Detailed Brief *</CardTitle>
            <CardDescription>
              Describe objectives, target audience, key messages, and requirements. Min 100 chars for AI matching.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe objectives, target audience, key messages, product features, mandatory elements (hashtags, @mentions), Do's/Don'ts. The more detail you provide, the better our AI can match you with relevant influencers."
              value={formData.brief}
              onChange={(e) => setFormData({...formData, brief: e.target.value})}
              rows={6}
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.brief.length}/100 minimum characters for AI matching
            </p>
          </CardContent>
        </Card>

        {/* Optional Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Optional Details</CardTitle>
            <CardDescription>Additional information to refine your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="budget">Total Campaign Budget (INR)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 50000"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                This helps AI suggest influencers within your budget range
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Proposed Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Proposed End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-between">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            className="bg-teal-500 hover:bg-teal-600"
            disabled={isLoading}
          >
            {isLoading ? "Creating Campaign..." : "Save Campaign & Find Influencers"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
