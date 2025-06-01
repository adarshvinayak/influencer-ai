
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  AreaChart, 
  Bell, 
  BrainCircuit, 
  Building2, 
  FileText, 
  Target, 
  UsersRound,
  UserCircle
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: AreaChart },
  { name: "My Campaigns", href: "/app/campaigns", icon: Target },
  { name: "Find Influencers", href: "/app/influencers", icon: UsersRound },
  { name: "Analytics", href: "/app/analytics", icon: AreaChart },
  { name: "Notifications", href: "/app/notifications", icon: Bell },
  { name: "Settings", href: "/app/settings", icon: UserCircle },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/app/dashboard" className="flex items-center space-x-2">
          <BrainCircuit className="h-8 w-8 text-teal-500" />
          <span className="text-xl font-bold text-gray-900">Influencer-AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-teal-50 text-teal-700 border-l-4 border-teal-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-teal-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-teal-800 mb-1">AI Status</h4>
          <p className="text-xs text-teal-600">All AI agents active and ready</p>
        </div>
      </div>
    </div>
  );
};
