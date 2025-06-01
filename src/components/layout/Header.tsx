
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search campaigns, influencers..." 
              className="pl-10 w-64"
            />
          </div>

          {/* Create Campaign Button */}
          <Link to="/app/campaigns/create">
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Link>

          {/* Notifications */}
          <Link to="/app/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
          </Link>

          {/* Profile */}
          <Link to="/app/settings">
            <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-teal-700">B</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
