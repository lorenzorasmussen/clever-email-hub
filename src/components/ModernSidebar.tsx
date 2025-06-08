
import { Brain, Calendar, FileText, Inbox, BarChart3, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewType } from "@/pages/Index";
import { useState } from "react";

interface ModernSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  showAuthConfig?: boolean;
}

export const ModernSidebar = ({ currentView, onViewChange, showAuthConfig = false }: ModernSidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleMenuClick = (view: ViewType) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 glass-button"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed md:relative w-64 h-full glass-sidebar flex flex-col z-40 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Gmail AI</h1>
              <p className="text-xs text-white/70">Intelligent Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium animate-fade-in",
                  currentView === item.id
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white border border-white/20 shadow-lg scale-105"
                    : "text-white/80 hover:bg-white/10 hover:text-white hover:scale-105 hover:shadow-md"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  currentView === item.id ? "text-white scale-110" : "text-white/60 group-hover:scale-110"
                )} />
                <span>{item.label}</span>
                {currentView === item.id && (
                  <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/60 text-center glass rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Powered by AI & Supabase</span>
            </div>
            <div className="text-white/40">Secure • Fast • Intelligent</div>
          </div>
        </div>
      </div>
    </>
  );
};
