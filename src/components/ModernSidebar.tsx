
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
    { id: "dashboard" as ViewType, icon: BarChart3, label: "Dashboard", ariaLabel: "Go to Dashboard" },
    { id: "ai" as ViewType, icon: Brain, label: "AI Assistant", ariaLabel: "Open AI Assistant" },
    { id: "inbox" as ViewType, icon: Inbox, label: "Inbox", ariaLabel: "View Email Inbox" },
    { id: "calendar" as ViewType, icon: Calendar, label: "Calendar", ariaLabel: "View Calendar" },
    { id: "notes" as ViewType, icon: FileText, label: "Notes", ariaLabel: "View Notes" },
  ];

  if (showAuthConfig) {
    menuItems.push({ 
      id: "auth-config" as ViewType, 
      icon: Settings, 
      label: "Auth Config", 
      ariaLabel: "Authentication Configuration" 
    });
  }

  const handleMenuClick = (view: ViewType) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu button with accessibility */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 icon-button"
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-primary" />
        ) : (
          <Menu className="h-6 w-6 text-primary" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav 
        className={cn(
          "fixed md:relative w-64 h-full glass-sidebar flex flex-col z-40 transition-transform duration-300",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-primary text-xl">Gmail AI</h1>
              <p className="text-sm text-secondary">Intelligent Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2" role="list">
            {menuItems.map((item, index) => (
              <li key={item.id} role="none">
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium animate-fade-in group",
                    currentView === item.id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-primary border border-white/20 shadow-lg scale-105"
                      : "text-secondary hover:bg-white/10 hover:text-primary hover:scale-105 hover:shadow-md"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  aria-label={item.ariaLabel}
                  aria-current={currentView === item.id ? "page" : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200 flex-shrink-0",
                    currentView === item.id ? "text-primary scale-110" : "text-muted group-hover:scale-110"
                  )} />
                  <span className="truncate">{item.label}</span>
                  {currentView === item.id && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full animate-pulse flex-shrink-0" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-muted text-center glass rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>AI Powered</span>
            </div>
            <div className="text-muted opacity-80">Secure • Fast • Smart</div>
          </div>
        </div>
      </nav>
    </>
  );
};
