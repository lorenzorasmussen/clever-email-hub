
import { Calendar as CalendarIcon, Mail, StickyNote, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const QuickActionsWidget = () => {
  const actions = [
    {
      icon: Mail,
      label: "Compose Email",
      variant: "default" as const
    },
    {
      icon: CalendarIcon,
      label: "New Event",
      variant: "secondary" as const
    },
    {
      icon: StickyNote,
      label: "Quick Note",
      variant: "outline" as const
    },
    {
      icon: Users,
      label: "Schedule Meeting",
      variant: "ghost" as const
    }
  ];

  return (
    <Card className="mt-6 glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground font-semibold">Quick Actions</CardTitle>
        <CardDescription className="text-muted-foreground">Get things done faster</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              className="h-20 flex-col gap-2 transition-all duration-200 hover:scale-105 hover:shadow-md min-h-[44px]"
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
