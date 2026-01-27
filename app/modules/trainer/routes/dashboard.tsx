import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { CalendarClock, MapPin, Users, ArrowRight, Timer, Trophy } from "lucide-react";
import { Link } from "react-router";

export default function TrainerDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      
      {/* 1. HERO SECTION: What is happening TODAY? */}
      <section>
        <h2 className="mb-4 text-2xl font-bold tracking-tight">Today's Schedule</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          
          {/* CARD: Upcoming Training (High Priority) */}
          <Card className="border-l-4 border-l-blue-600 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">In 30 Minutes</Badge>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">Elite Sprinters Group</CardTitle>
              <CardDescription>Speed Endurance • 16:30 - 18:00</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Main Stadium, Lane 1-4</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>12 Athletes Assigned</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/is/trainer/attendance/123">
                   Take Attendance
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* CARD: Completed/Past Training */}
          <Card className="opacity-75">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                 <Badge variant="outline">Completed</Badge>
              </div>
              <CardTitle className="text-lg">Youth Development</CardTitle>
              <CardDescription>General Prep • 14:00 - 15:30</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 text-sm">
               <div className="flex items-center gap-2">
                <span className="font-medium text-green-600">15/18 Present</span>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full" size="sm">View Report</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 2. UPCOMING MEETS & ACTIONS */}
      <div className="grid gap-4 md:grid-cols-2">
        
        {/* Upcoming Race */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Next Meet
            </CardTitle>
            <CardDescription>Pražský pohár (Indoor)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">Sat, Feb 12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Signups:</span>
              <span className="font-medium text-amber-600">8 Pending Approval</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Source:</span>
              <Badge variant="secondary" className="text-xs">atletika.cz</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
                <Link to="/is/trainer/meets">Manage Signups <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions / Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="ghost" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Add New Member
            </Button>
            <Button variant="ghost" className="justify-start">
              <Timer className="mr-2 h-4 w-4" />
              Create Training Plan
            </Button>
            <Button variant="ghost" className="justify-start text-blue-600">
               Import Results (Scraper)
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}