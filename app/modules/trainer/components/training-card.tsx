import { Link } from "react-router";
import { format, isPast, parseISO, addMinutes, isWithinInterval, formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { 
  MapPin, 
  Users, 
  Clock, 
  Dumbbell, 
  Trees, 
  Footprints, 
  Activity, 
  AlertCircle,
  Timer
} from "lucide-react";

import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { type DashboardTraining } from "./../types/trainer";

interface TrainingCardProps {
  training: DashboardTraining;
}

export function TrainingCard({ training }: TrainingCardProps) {
  const { t } = useTranslation();
  const startDate = parseISO(training.start_at);
  const endDate = addMinutes(startDate, training.duration_minutes);
  const now = new Date();
  
  const isCancelled = !!training.cancelled_reason;
  // It is "Ongoing" if we are literally inside the time window right now
  const isOngoing = isWithinInterval(now, { start: startDate, end: endDate });
  const isFinished = isPast(endDate);
  const isAttendanceTaken = !!training.attendance_taken_at;

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden transition-all hover:shadow-md relative",
      // Dim finished trainings
      isFinished && !isAttendanceTaken && "opacity-75 bg-muted/40", 
      // Red tint if cancelled
      isCancelled && "border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900",
      // Blue border if Active (Upcoming or Ongoing)
      !isFinished && !isCancelled && "border-l-4 border-l-blue-500 shadow-sm"
    )}>
      <CardHeader className="pb-3">
        {/* TOP ROW: Badge & Icon */}
        <div className="flex items-center justify-between mb-2">
          <TimeStatusBadge 
            startDate={startDate} 
            isOngoing={isOngoing} 
            isFinished={isFinished} 
            isCancelled={isCancelled} 
          />
            {/* <TrainingIcon type={training.training_type} />
            show text of the type instead of icon */}
          <div className="text-sm italic text-muted-foreground">
            {training.training_type || "General"}
          </div>
          
        </div>

        <CardTitle className="text-lg leading-tight">
          {training.group_name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(startDate, "EEEE, d. MMMM")} • {format(startDate, "HH:mm")}
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 pb-3 text-sm">
        {isCancelled ? (
          <div className="flex items-center gap-2 rounded-md bg-red-100 p-2 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">{training.cancelled_reason}</span>
          </div>
        ) : (
          <div className="space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{training.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {training.attendee_count} Athletes 
                {isAttendanceTaken && <span className="ml-1 text-green-600 font-medium">{t("trainer.verified")}</span>}
              </span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 bg-muted/20 mt-auto">
        {!isCancelled && (
           <Button 
             className={cn("w-full", isOngoing && "animate-pulse", isCancelled && "cursor-not-allowed")} 
             variant={isFinished && !isAttendanceTaken ? "secondary" : "default"}
             asChild
             disabled={isCancelled}
           >
             <Link to={`/is/trainer/attendance/${training.id}`}>
               {isOngoing ? "Take Attendance Now" : 
                isAttendanceTaken ? "View Attendance" : "Take Attendance"}
             </Link>
           </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// --- Helper Components ---

function TimeStatusBadge({ 
  startDate, 
  isOngoing, 
  isFinished, 
  isCancelled 
}: { 
  startDate: Date; 
  isOngoing: boolean; 
  isFinished: boolean; 
  isCancelled: boolean; 
}) {
  if (isCancelled) {
    return <Badge variant="destructive">{t("trainer.cancelled")}</Badge>;
  }

  if (isOngoing) {
    return (
      <Badge className="bg-green-600 hover:bg-green-700 animate-pulse flex items-center gap-1">
        <Activity className="h-3 w-3" />
        Ongoing
      </Badge>
    );
  }

  if (isFinished) {
    return <Badge variant="outline" className="text-muted-foreground">{t("trainer.finished")}</Badge>;
  }

  // Logic for "In 30 minutes" vs "In 2 days"
  return (
    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 flex items-center gap-1">
      <Timer className="h-3 w-3" />
      {formatDistanceToNow(startDate, { addSuffix: true })}
    </Badge>
  );
}

// function TrainingIcon({ type }: { type: TrainingType }) {
//   const icons = {
//     [TrainingType.TRACK]: <Footprints className="h-5 w-5 text-orange-500" />,
//     [TrainingType.GYM]: <Dumbbell className="h-5 w-5 text-slate-600" />,
//     [TrainingType.FOREST]: <Trees className="h-5 w-5 text-green-600" />,
//     [TrainingType.REGENERATION]: <Activity className="h-5 w-5 text-blue-400" />,
//     [TrainingType.OTHER]: <Clock className="h-5 w-5 text-gray-400" />,
//   };
//   return icons[type] || icons[TrainingType.OTHER];
// }