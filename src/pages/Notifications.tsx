
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, MailCheck, PhoneForwarded, MessageSquareWarning, Sparkles, FileSignature, CircleDollarSign, BellOff, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "ai-activity",
      icon: Bot,
      title: "AI Sam (GPT-4 & ElevenLabs) call with @AnanyaJoshi for 'Mumbai Food Fest' successful",
      message: "Initial discussion positive. Ananya is interested in the collaboration.",
      link: "/app/dashboard",
      linkText: "View Outreach Progress",
      timestamp: "June 1, 2025, 02:45 PM",
      timeAgo: "5m ago",
      unread: true
    },
    {
      id: 2,
      type: "response",
      icon: MailCheck,
      title: "@StyleByPriya replied to AI Eva's email (GPT-4) for 'Summer Fashion'",
      message: "Eva is analyzing the response. Positive sentiment detected.",
      link: "/app/dashboard",
      linkText: "View Thread",
      timestamp: "June 1, 2025, 01:30 PM",
      timeAgo: "1h ago",
      unread: true
    },
    {
      id: 3,
      type: "alert",
      icon: MessageSquareWarning,
      title: "⚠️ Action Needed: AI Sam negotiation with @TravelVikram stalled",
      message: "Budget mismatch detected. Influencer quote (₹25k) exceeds campaign budget (₹20k).",
      link: "/app/dashboard", 
      linkText: "Review Log & Intervene",
      timestamp: "June 1, 2025, 11:15 AM",
      timeAgo: "4h ago",
      unread: true
    },
    {
      id: 4,
      type: "success",
      icon: Sparkles,
      title: "🎉 Deal Finalized! AI Eva & @HealthyHacks for 'Organic Snacks'",
      message: "Rate agreed: ₹15k INR for 3 Instagram posts + 1 Reel.",
      link: "/app/dashboard",
      linkText: "View Summary",
      timestamp: "June 1, 2025, 09:45 AM",
      timeAgo: "6h ago",
      unread: false
    },
    {
      id: 5,
      type: "contract",
      icon: FileSignature,
      title: "📄 Contract for @HealthyHacks sent for e-sign",
      message: "Contract sent via DocuSign/Native e-signature platform. Awaiting influencer signature.",
      link: "#",
      linkText: "View Contract Status",
      timestamp: "May 31, 2025, 04:20 PM",
      timeAgo: "1d ago",
      unread: false
    },
    {
      id: 6,
      type: "contract",
      icon: FileSignature,
      title: "✅ Contract Signed! @HealthyHacks e-signed for 'Organic Snacks'",
      message: "All parties have signed the collaboration agreement. Campaign can proceed.",
      link: "#",
      linkText: "View Signed Contract",
      timestamp: "May 31, 2025, 06:15 PM",
      timeAgo: "1d ago",
      unread: false
    },
    {
      id: 7,
      type: "payment",
      icon: CircleDollarSign,
      title: "💸 Payment (₹7.5k advance) to @HealthyHacks processed",
      message: "Payment successfully processed via Razorpay/Stripe. Influencer notified.",
      link: "#",
      linkText: "View Transaction",
      timestamp: "May 31, 2025, 07:30 PM",
      timeAgo: "1d ago",
      unread: false
    },
    {
      id: 8,
      type: "ai-activity",
      icon: Bot,
      title: "📈 AI found 5 new high-potential influencers for 'Tech Reviews'",
      message: "Custom embeddings and GPT-4 analysis identified new matches based on campaign brief.",
      link: "/app/influencers",
      linkText: "Review Recommendations",
      timestamp: "May 30, 2025, 02:10 PM",
      timeAgo: "2d ago",
      unread: false
    }
  ]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "ai-activity":
        return "border-l-blue-400 bg-blue-50";
      case "response":
        return "border-l-green-400 bg-green-50";
      case "alert":
        return "border-l-red-400 bg-red-50";
      case "success":
        return "border-l-emerald-400 bg-emerald-50";
      case "contract":
        return "border-l-purple-400 bg-purple-50";
      case "payment":
        return "border-l-orange-400 bg-orange-50";
      default:
        return "border-l-gray-400 bg-gray-50";
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return notification.unread;
    if (filter === "alerts") return notification.type === "alert";
    if (filter === "ai") return notification.type === "ai-activity";
    return true;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const unreadCount = notifications.filter(notif => notif.unread).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">
            Stay updated on AI agent activity, influencer responses, and campaign progress
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="alerts">Alerts Only</SelectItem>
                  <SelectItem value="ai">AI Activity</SelectItem>
                </SelectContent>
              </Select>
              
              <Badge variant="outline">
                {filteredNotifications.length} notifications
              </Badge>
            </div>

            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <Card 
                key={notification.id} 
                className={`border-l-4 ${getNotificationColor(notification.type)} ${
                  notification.unread ? 'shadow-md' : 'shadow-sm'
                } hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent className={`h-6 w-6 ${
                        notification.type === 'alert' ? 'text-red-600' :
                        notification.type === 'success' ? 'text-green-600' :
                        notification.type === 'ai-activity' ? 'text-blue-600' :
                        notification.type === 'contract' ? 'text-purple-600' :
                        notification.type === 'payment' ? 'text-orange-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className={`text-lg font-medium text-gray-900 ${
                          notification.unread ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mt-1 mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Link 
                          to={notification.link}
                          className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                        >
                          {notification.linkText} →
                        </Link>
                        
                        <div className="text-sm text-gray-500">
                          <span className="hidden sm:inline">{notification.timestamp}</span>
                          <span className="sm:hidden">{notification.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BellOff className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "unread" ? "No unread notifications" : "No notifications"}
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              {filter === "unread" 
                ? "You're all caught up! New notifications will appear here when AI agents take action."
                : "We'll update you here when there's AI activity, influencer responses, or important campaign updates."
              }
            </p>
            {filter !== "all" && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilter("all")}
              >
                View All Notifications
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
