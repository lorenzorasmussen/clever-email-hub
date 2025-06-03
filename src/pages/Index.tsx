
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { EmailList } from "@/components/EmailList";
import { Calendar } from "@/components/Calendar";
import { Notes } from "@/components/Notes";
import { EmailView } from "@/components/EmailView";
import { AIChatInterface } from "@/components/AIChatInterface";

export type ViewType = "ai" | "inbox" | "calendar" | "notes";

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>("ai");
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const renderMainContent = () => {
    if (selectedEmail) {
      return <EmailView email={selectedEmail} onBack={() => setSelectedEmail(null)} />;
    }

    switch (currentView) {
      case "ai":
        return <AIChatInterface />;
      case "inbox":
        return <EmailList onEmailSelect={setSelectedEmail} />;
      case "calendar":
        return <Calendar />;
      case "notes":
        return <Notes />;
      default:
        return <AIChatInterface />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Index;
