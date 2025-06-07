
import { cn } from "@/lib/utils";
import { Mail, Calendar, FileText, LayoutDashboard, Bot, Star, Send, Archive, Trash2, Tag, Zap, Plus } from "lucide-react";
import { ViewType } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModernSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ModernSidebar = ({ currentView, onViewChange }: ModernSidebarProps) => {
  const mainMenuItems = [
    { 
      id: "dashboard" as ViewType, 
      label: "Dashboard", 
      icon: LayoutDashboard, 
      description: "Overview & insights"
    },
    { 
      id: "ai" as ViewType, 
      label: "AI Assistant", 
      icon: Bot, 
      description: "Smart email help",
      accent: true
    },
    { 
      id: "inbox" as ViewType, 
      label: "Inbox", 
      icon: Mail, 
      count: 3,
      description: "Your messages"
    },
    { 
      id: "calendar" as ViewType, 
      label: "Calendar", 
      icon: Calendar,
      description: "Events & meetings"
    },
    { 
      id: "notes" as ViewType, 
      label: "Notes", 
      icon: FileText,
      description: "Ideas & thoughts"
    },
  ];

  const quickActions = [
    { label: "Compose", icon: Plus, color: "text-blue-600" },
    { label: "Smart Tags", icon: Tag, color: "text-purple-600" },
    { label: "AI Summary", icon: Zap, color: "text-amber-600" },
  ];

  const emailCategories = [
    { label: "Starred", icon: Star, count: 2, color: "text-yellow-600" },
    { label: "Sent", icon: Send, color: "text-green-600" },
    { label: "Archive", icon: Archive, color: "text-gray-600" },
    { label: "Trash", icon: Trash2, color: "text-red-600" },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200/80 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Gmail AI</h1>
            <p className="text-xs text-gray-500">Demo Mode</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 text-sm rounded-xl transition-all duration-200 group",
                  currentView === item.id
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  currentView === item.id 
                    ? "bg-blue-100" 
                    : "bg-gray-100 group-hover:bg-gray-200",
                  item.accent && "bg-gradient-to-br from-purple-100 to-blue-100"
                )}>
                  <item.icon className={cn(
                    "h-4 w-4",
                    currentView === item.id 
                      ? "text-blue-600" 
                      : "text-gray-600",
                    item.accent && "text-purple-600"
                  )} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
                {item.count && (
                  <Badge variant="secondary" className="text-xs">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Quick Actions
          </h3>
          <div className="space-y-1">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-auto py-2 px-3 text-sm font-normal"
              >
                <action.icon className={cn("h-4 w-4", action.color)} />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Email Categories */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Email
          </h3>
          <div className="space-y-1">
            {emailCategories.map((category) => (
              <button 
                key={category.label}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <category.icon className={cn("h-4 w-4", category.color)} />
                <span className="flex-1 text-left">{category.label}</span>
                {category.count && (
                  <Badge variant="outline" className="text-xs">
                    {category.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">AI Powered</span>
          </div>
          <p className="text-xs text-gray-600">
            Experience smart email management with AI assistance
          </p>
        </div>
      </div>
    </div>
  );
};
