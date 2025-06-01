
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, MailCheck, PhoneForwarded, MessageSquareWarning, Sparkles, FileSignature, CircleDollarSign, BellOff, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";

const Notifications = () => {
  const [filter, setFilter] = useState("all");
  const { notifications, isLoading, error, markAsRead, unreadCount } = useNotifications();

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "ai-activity":
        return Bot;
      case "response":
        return MailCheck;
      case "alert":
        return MessageSquareWarning;
      case "success":
        return Sparkles;
      case "contract":
        return FileSignature;
      case "payment":
        return CircleDollarSign;
      default:
        return Bot;
    }
  };

  const getNotificationColor = (type?: string) => {
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

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.is_read;
    if (filter === "alerts") return notification.type === "alert";
    if (filter === "ai") return notification.type === "ai-activity";
    return true;
  }) || [];

  const markAllAsRead = () => {
    notifications?.forEach(notif => {
      if (!notif.is_read) {
        markAsRead(notif.notification_id);
      }
    });
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Loading your notifications...</p>
        </div>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-800">Error loading notifications: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

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
            const IconComponent = getNotificationIcon(notification.type);
            const timeAgo = notification.created_at 
              ? new Date(notification.created_at).toLocaleDateString()
              : 'Unknown date';
            
            return (
              <Card 
                key={notification.notification_id} 
                className={`border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.is_read ? 'shadow-md' : 'shadow-sm'
                } hover:shadow-lg transition-shadow cursor-pointer`}
                onClick={() => handleNotificationClick(notification)}
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
                          !notification.is_read ? 'font-semibold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-2"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mt-1 mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {notification.related_entity_type && notification.related_entity_id && (
                          <Link 
                            to={`/app/dashboard`}
                            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                          >
                            View Details →
                          </Link>
                        )}
                        
                        <div className="text-sm text-gray-500">
                          {timeAgo}
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
