
import { useLocation } from "react-router-dom";
import UniversalSearch from "../UniversalSearch";

const DynamicHeader = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/app/dashboard") return "Dashboard Overview";
    if (path === "/app/campaigns") return "My Campaigns";
    if (path === "/app/campaigns/create") return "Create New Campaign";
    if (path === "/app/influencers") return "Find Influencers";
    if (path.startsWith("/app/influencers/")) return "Influencer Profile";
    if (path === "/app/analytics") return "Analytics & Reports";
    if (path === "/app/notifications") return "Notifications";
    if (path === "/app/settings") return "Account Settings";
    
    return "Dashboard";
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
      <UniversalSearch />
    </div>
  );
};

export default DynamicHeader;
