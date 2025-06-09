
import { useState } from 'react';
import { 
  Brain, Calendar, FileText, Inbox, BarChart3, Settings, Menu, X, 
  ChevronLeft, ChevronRight, History, MessageSquare, Search, Filter,
  Moon, Sun, Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewType } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Chat {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

interface EnhancedSidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  showAuthConfig?: boolean;
}

export const EnhancedSidebar = ({ currentView, onViewChange, showAuthConfig = false }: EnhancedSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatHistory] = useState<Chat[]>([
    {
      id: '1',
      title: 'Email Analysis',
      timestamp: '2 hours ago',
      preview: 'Help me analyze my marketing emails...'
    },
    {
      id: '2', 
      title: 'Task Planning',
      timestamp: '1 day ago',
      preview: 'Create a project timeline for Q1...'
    },
    {
      id: '3',
      title: 'Calendar Optimization',
      timestamp: '3 days ago',
      preview: 'Suggest better meeting scheduling...'
    }
  ]);

  const menuItems = [
    { id: "dashboard" as ViewType, icon: BarChart3, label: "Dashboard", ariaLabel: "Go to Dashboard" },
    { id: "ai" as ViewType, icon: Brain, label: "AI Assistant", ariaLabel: "Open AI Assistant" },
    { id: "inbox" as ViewType, icon: Inbox, label: "Inbox", ariaLabel: "View Email Inbox" },
    { id: "calendar" as ViewType, icon: Calendar, label: "Calendar", ariaLabel: "View Calendar" },
    { id: "notes" as ViewType, icon: FileText, label: "Tasks & Notes", ariaLabel: "View Tasks and Notes" },
  ];

  if (showAuthConfig) {
    menuItems.push({ 
      id: "auth-config" as ViewType, 
      icon: Settings, 
      label: "Settings", 
      ariaLabel: "Authentication Configuration" 
    });
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
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border shadow-lg"
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileMenuOpen}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav 
        className={cn(
          "fixed md:relative h-full bg-background border-r border-border flex flex-col z-40 transition-all duration-300 shadow-lg",
          isCollapsed ? "w-16" : "w-80",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className={cn("p-4 border-b border-border", isCollapsed && "px-2")}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-foreground text-lg">Gmail AI</h1>
                  <p className="text-xs text-muted-foreground">Intelligent Assistant</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex h-8 w-8 p-0"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <ul className="space-y-1" role="list">
              {menuItems.map((item) => (
                <li key={item.id} role="none">
                  <button
                    onClick={() => handleMenuClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group",
                      currentView === item.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      isCollapsed && "justify-center px-2"
                    )}
                    aria-label={item.ariaLabel}
                    aria-current={currentView === item.id ? "page" : undefined}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      currentView === item.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                    )} />
                    {!isCollapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {currentView === item.id && (
                          <div className="ml-auto w-2 h-2 bg-primary-foreground rounded-full" />
                        )}
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat History */}
          {!isCollapsed && (
            <div className="p-2 mt-4">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <History className="h-4 w-4 mr-2" />
                    Recent Chats
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1 mt-2">
                  {chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      className="w-full text-left p-2 rounded-lg hover:bg-accent transition-colors group"
                      onClick={() => handleMenuClick('ai')}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-3 w-3 mt-1 text-muted-foreground group-hover:text-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-foreground truncate">{chat.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{chat.preview}</p>
                          <p className="text-xs text-muted-foreground">{chat.timestamp}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={cn("p-4 border-t border-border", isCollapsed && "px-2")}>
          {!isCollapsed ? (
            <div className="text-center">
              <div className="bg-accent rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-foreground">AI Powered</span>
                </div>
                <div className="text-xs text-muted-foreground">Secure • Fast • Smart</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
