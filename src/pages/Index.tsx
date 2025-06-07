
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModernSidebar } from "@/components/ModernSidebar";
import { EmailList } from "@/components/EmailList";
import { Calendar } from "@/components/Calendar";
import { Notes } from "@/components/Notes";
import { EmailView } from "@/components/EmailView";
import { AIChatInterface } from "@/components/AIChatInterface";
import { EnhancedDashboard } from "@/components/EnhancedDashboard";
import { DemoDataProvider } from "@/components/DemoDataProvider";
import { Button } from "@/components/ui/button";
import { LogOut, User, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ViewType = "dashboard" | "ai" | "inbox" | "calendar" | "notes";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // For demo mode, we'll use a mock user if no real user is logged in
  const demoUser = {
    email: "demo@gmail-ai.com",
    user_metadata: {
      full_name: "Demo User",
      avatar_url: null
    }
  };

  const currentUser = user || demoUser;
  const isDemoMode = !user;

  const handleSignOut = async () => {
    if (isDemoMode) {
      navigate('/auth');
      return;
    }
    
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case "dashboard": return "Dashboard";
      case "ai": return "AI Assistant";
      case "inbox": return "Inbox";
      case "calendar": return "Calendar";
      case "notes": return "Notes";
      default: return "Dashboard";
    }
  };

  const renderMainContent = () => {
    if (selectedEmail) {
      return <EmailView email={selectedEmail} onBack={() => setSelectedEmail(null)} />;
    }

    switch (currentView) {
      case "dashboard":
        return <EnhancedDashboard />;
      case "ai":
        return <AIChatInterface />;
      case "inbox":
        return <EmailList onEmailSelect={setSelectedEmail} />;
      case "calendar":
        return <Calendar />;
      case "notes":
        return <Notes />;
      default:
        return <EnhancedDashboard />;
    }
  };

  // Show loading state only for real auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DemoDataProvider>
      <div className="flex h-screen bg-gray-50">
        <ModernSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Enhanced Header */}
          <div className="bg-white/80 backdrop-blur border-b border-gray-200/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h2>
              {isDemoMode && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
                  <Sparkles className="h-3 w-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">Demo Mode</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                  <AvatarImage src={currentUser.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {currentUser.user_metadata?.full_name || currentUser.email}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isDemoMode ? "Demo User" : "Authenticated"}
                  </div>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isDemoMode ? "Login" : "Sign Out"}
              </Button>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-hidden">
            {renderMainContent()}
          </main>
        </div>
      </div>
    </DemoDataProvider>
  );
};

export default Index;
