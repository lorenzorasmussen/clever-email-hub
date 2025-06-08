
import { Brain, Calendar, FileText, Inbox, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewType } from "@/pages/Index";

interface ModernSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  showAuthConfig?: boolean;
}

export const ModernSidebar = ({ currentView, onViewChange, showAuthConfig = false }: ModernSidebarProps) => {
  const menuItems = [
    { id: "dashboard" as ViewType, icon: BarChart3, label: "Dashboard" },
    { id: "ai" as ViewType, icon: Brain, label: "AI Assistant" },
    { id: "inbox" as ViewType, icon: Inbox, label: "Inbox" },
    { id: "calendar" as ViewType, icon: Calendar, label: "Calendar" },
    { id: "notes" as ViewType, icon: FileText, label: "Notes" },
  ];

  if (showAuthConfig) {
    menuItems.push({ id: "auth-config" as ViewType, icon: Settings, label: "Auth Config" });
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Gmail AI</h1>
            <p className="text-xs text-gray-500">Intelligent Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                currentView === item.id
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5",
                currentView === item.id ? "text-blue-600" : "text-gray-500"
              )} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          Powered by AI & Supabase
        </div>
      </div>
    </div>
  );
};
