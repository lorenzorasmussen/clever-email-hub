
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoData {
  emails: any[];
  events: any[];
  notes: any[];
}

interface DemoDataContextType {
  demoData: DemoData;
  addDemoEmail: (email: any) => void;
  addDemoEvent: (event: any) => void;
  addDemoNote: (note: any) => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export const useDemoData = () => {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
};

const sampleEmails = [
  {
    id: '1',
    sender: 'sarah@company.com',
    subject: 'Q4 Marketing Strategy Review',
    preview: 'Hi team, I wanted to share the preliminary results from our Q4 marketing campaigns...',
    content: 'Hi team,\n\nI wanted to share the preliminary results from our Q4 marketing campaigns. The data shows some really promising trends that I think we should discuss in our next meeting.\n\nKey highlights:\n- 25% increase in email open rates\n- 40% improvement in click-through rates\n- 15% boost in conversion rates\n\nI\'ve attached the detailed analytics report. Let me know your thoughts!\n\nBest regards,\nSarah',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_read: false,
    is_starred: true,
    priority: 'high' as const,
    ai_summary: 'Marketing team sharing positive Q4 campaign results with significant improvements in engagement metrics.',
    ai_tags: ['marketing', 'quarterly-review', 'analytics'],
  },
  {
    id: '2',
    sender: 'notifications@github.com',
    subject: 'Pull Request #142 - New Dashboard Component',
    preview: 'Your pull request has been approved and merged into main branch...',
    content: 'Your pull request "Add new dashboard component with improved widgets" has been successfully reviewed and merged into the main branch.\n\nChanges included:\n- New responsive dashboard layout\n- Enhanced widget components\n- Improved mobile experience\n\nBuild status: ✅ All checks passed\nDeployment: Automatically deployed to staging',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    is_read: true,
    is_starred: false,
    priority: 'medium' as const,
    ai_summary: 'GitHub notification about successful PR merge for dashboard improvements.',
    ai_tags: ['development', 'github', 'deployment'],
  },
  {
    id: '3',
    sender: 'team@design-studio.com',
    subject: 'Project Milestone Achieved 🎉',
    preview: 'Congratulations! We\'ve successfully completed the first phase of the redesign project...',
    content: 'Congratulations team!\n\nWe\'ve successfully completed the first phase of the redesign project. The client feedback has been overwhelmingly positive, and we\'re ahead of schedule.\n\nNext steps:\n1. Begin phase 2 wireframes\n2. Schedule client presentation\n3. Prepare development handoff\n\nGreat work everyone!',
    time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    is_read: false,
    is_starred: false,
    priority: 'low' as const,
    ai_summary: 'Project team celebrating completion of redesign phase 1 with positive client feedback.',
    ai_tags: ['project-management', 'milestone', 'design'],
  },
];

const sampleEvents = [
  {
    id: '1',
    title: 'Team Standup',
    description: 'Daily team synchronization meeting',
    start_time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
    event_type: 'meeting' as const,
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Product Demo',
    description: 'Quarterly product demonstration for stakeholders',
    start_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    event_type: 'event' as const,
    color: 'bg-green-500',
  },
  {
    id: '3',
    title: 'Code Review Deadline',
    description: 'Submit all pending code reviews',
    start_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    event_type: 'reminder' as const,
    color: 'bg-yellow-500',
  },
];

const sampleNotes = [
  {
    id: '1',
    title: 'Meeting Notes - Q4 Planning',
    content: '• Discussed budget allocation for next quarter\n• New hiring plan for engineering team\n• Product roadmap updates\n• Marketing campaign ideas',
    color: 'bg-yellow-100',
    is_pinned: true,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Ideas for App Improvements',
    content: '• Add dark mode toggle\n• Implement keyboard shortcuts\n• Better mobile responsiveness\n• Integration with calendar apps',
    color: 'bg-blue-100',
    is_pinned: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Personal Goals',
    content: '• Learn TypeScript advanced patterns\n• Complete React certification\n• Read 2 books this month\n• Exercise 3x per week',
    color: 'bg-green-100',
    is_pinned: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export const DemoDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoData, setDemoData] = useState<DemoData>({
    emails: sampleEmails,
    events: sampleEvents,
    notes: sampleNotes,
  });

  const addDemoEmail = (email: any) => {
    setDemoData(prev => ({
      ...prev,
      emails: [email, ...prev.emails]
    }));
  };

  const addDemoEvent = (event: any) => {
    setDemoData(prev => ({
      ...prev,
      events: [...prev.events, event]
    }));
  };

  const addDemoNote = (note: any) => {
    setDemoData(prev => ({
      ...prev,
      notes: [note, ...prev.notes]
    }));
  };

  return (
    <DemoDataContext.Provider value={{ demoData, addDemoEmail, addDemoEvent, addDemoNote }}>
      {children}
    </DemoDataContext.Provider>
  );
};
