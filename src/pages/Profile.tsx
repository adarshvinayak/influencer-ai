import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserBrand } from '@/hooks/useUserBrand';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { userBrand, isLoading, updateBrand, isUpdatingBrand } = useUserBrand();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    brandName: "",
    website: "",
    description: "",
    industry: "",
    contactName: ""
  });

  const industries = ["Food & Beverage", "Fashion", "Health & Fitness", "Technology", "Beauty & Cosmetics", "Travel", "Gaming", "Education", "Finance", "Home & Garden", "Family & Kids", "Arts & Culture", "Automotive", "Pets", "Other"];

  useEffect(() => {
    if (userBrand) {
      setFormData({
        brandName: userBrand.brand_name || "",
        website: userBrand.website_url || "",
        description: userBrand.description || "",
        industry: userBrand.industry || "",
        contactName: userBrand.contact_person_name || ""
      });
    }
  }, [userBrand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      updateBrand({
        brand_name: formData.brandName,
        website_url: formData.website,
        description: formData.description,
        industry: formData.industry,
        contact_person_name: formData.contactName
      });

      toast({
        title: "Profile updated successfully!",
        description: "Your brand information has been saved.",
      });
      
      setIsEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userBrand) {
      setFormData({
        brandName: userBrand.brand_name || "",
        website: userBrand.website_url || "",
        description: userBrand.description || "",
        industry: userBrand.industry || "",
        contactName: userBrand.contact_person_name || ""
      });
    }
    setIsEditing(false);
    setError("");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Brand Profile</CardTitle>
                <CardDescription>
                  Manage your brand information and account settings
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                )}
                <Button onClick={handleLogout} variant="destructive" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email address cannot be changed
                  </p>
                </div>
              </div>

              {/* Brand Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Brand Information</h3>
                
                <div>
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input 
                    id="brandName" 
                    placeholder="Your brand name" 
                    value={formData.brandName} 
                    onChange={(e) => setFormData({...formData, brandName: e.target.value})} 
                    disabled={!isEditing}
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="contactName">Contact Person *</Label>
                  <Input 
                    id="contactName" 
                    placeholder="Your full name" 
                    value={formData.contactName} 
                    onChange={(e) => setFormData({...formData, contactName: e.target.value})} 
                    disabled={!isEditing}
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    placeholder="https://yourbrand.com" 
                    value={formData.website} 
                    onChange={(e) => setFormData({...formData, website: e.target.value})} 
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select 
                    value={formData.industry} 
                    onValueChange={(value) => setFormData({...formData, industry: value})}
                    disabled={!isEditing}
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

                <div>
                  <Label htmlFor="description">Brand Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Tell us about your brand..." 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-3">
                  <Button 
                    type="submit" 
                    className="bg-teal-500 hover:bg-teal-600" 
                    disabled={isUpdatingBrand}
                  >
                    {isUpdatingBrand ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isUpdatingBrand}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
