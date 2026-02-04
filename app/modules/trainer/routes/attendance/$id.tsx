import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Check, X, AlertCircle, HelpCircle, UserCheck, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { apiClient } from "~/lib/api-client";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

// --- Types ---
type AttendanceStatus = 'p' | 'a' | 'e' | string | ''; 

interface PersonItem {
  id: string; // Generic ID (athlete_id or trainer_id)
  first_name: string;
  last_name: string;
  presence: AttendanceStatus;
}

interface AttendanceDetail {
  id: string;
  group_name: string;
  start_at: string;
  location: string;
  description?: string;
  athletes: { athlete_id: string; first_name: string; last_name: string; presence: AttendanceStatus }[];
  trainers: { trainer_id: string; first_name: string; last_name: string; presence: AttendanceStatus }[];
}

// --- Translations / Dictionary ---
// Replace this with your actual i18n hook (e.g., useTranslation)
const t = {
  header: {
    trainers: "Trainers (Payroll)",
    athletes: "Athletes",
    content: "Training Content",
    placeholder: "What did you do today?",
    save: "Save Attendance",
    saving: "Saving...",
  },
  status: {
    present: "Present",
    absent: "Absent",
    excused: "Excused",
    unmarked: "Unmarked",
    mark_all: "Mark All Present",
    unmark_all: "Reset All",
  },
  toast: {
    success: "Attendance saved successfully!",
    error: "Failed to save attendance.",
  }
};

export default function TakeAttendancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["trainer", "attendance", id],
    queryFn: async () => {
      return await apiClient.get<AttendanceDetail>(`/v1/trainer/attendance/${id}`);
    },
  });

  // State: Maps ID -> Status
  const [description, setDescription] = useState("");
  const [athleteStatus, setAthleteStatus] = useState<Record<string, AttendanceStatus>>({});
  const [trainerStatus, setTrainerStatus] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    if (data) {
      setDescription(data.description || "");
      
      // Initialize Athletes (Default to null/unmarked if backend sends nothing)
      const aStatus: Record<string, AttendanceStatus> = {};
      data.athletes.forEach(a => aStatus[a.athlete_id] = a.presence || '');
      setAthleteStatus(aStatus);

      // Initialize Trainers
      const tStatus: Record<string, AttendanceStatus> = {};
      data.trainers.forEach(t => tStatus[t.trainer_id] = t.presence || '');
      setTrainerStatus(tStatus);
    }
  }, [data]);

  // --- Logic: Cycle Status ---
  // Flow: Unmarked -> Present -> Absent -> Excused -> Unmarked
  const cycleStatus = (current: AttendanceStatus): AttendanceStatus => {
    if (current === '') return 'p';       // Unmarked -> Present
    if (current === 'p') return 'a'; // Present -> Absent
    if (current === 'a') return 'e'; // Absent -> Excused
    if (current === 'e') return ''; // Excused -> Unmarked (Reset)
    return 'p'; // Fallback for custom strings -> Present
  };

  const updateStatus = (type: 'athlete' | 'trainer', id: string) => {
    if (type === 'athlete') {
      setAthleteStatus(prev => ({ ...prev, [id]: cycleStatus(prev[id] || '') }));
    } else {
      setTrainerStatus(prev => ({ ...prev, [id]: cycleStatus(prev[id] || '') }));
    }
  };

  const markAll = (type: 'athlete' | 'trainer', status: 'p' | '') => {
    if (type === 'athlete') {
      const newSt = { ...athleteStatus };
      data?.athletes.forEach(a => newSt[a.athlete_id] = status);
      setAthleteStatus(newSt);
    } else {
      const newSt = { ...trainerStatus };
      data?.trainers.forEach(tr => newSt[tr.trainer_id] = status);
      setTrainerStatus(newSt);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/v1/trainer/attendance/${id}`, {
        description,
        athlete_status: athleteStatus,
        trainer_status: trainerStatus,
        deleted_at: null,
      });
    },
    onSuccess: () => {
      //make it green
      toast.success(t.toast.success, { duration: 4000 , style: { background: 'green', color: 'white' } });
      
      // 1. Refresh the Calendar/List (so the "Present" count updates there)
      queryClient.invalidateQueries({ queryKey: ["trainer", "schedule"] });
      
      // 2. Refresh THIS PAGE (so the description and checkboxes update immediately)
      //    This was missing!
      queryClient.invalidateQueries({ queryKey: ["trainer", "attendance", id] });
      
      navigate(-1);
    },
    onError: () => toast.error(t.toast.error, { duration: 4000 , style: { background: 'red', color: 'white' } }),
  });

  if (isLoading || !data) return <AttendanceSkeleton />;

  const presentCount = Object.values(athleteStatus).filter(s => s === 'p').length;
  const isAllAthletesMarked = data.athletes.every(a => athleteStatus[a.athlete_id] === 'p');

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in slide-in-from-right-4">
      
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b p-4 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-bold text-lg leading-tight">{data.group_name}</h1>
          <p className="text-xs text-muted-foreground">
            {format(parseISO(data.start_at), "MMM d, HH:mm")}
          </p>
        </div>
        <div className="ml-auto">
           <Badge variant={presentCount === data.athletes.length ? "default" : "secondary"}>
             {presentCount} / {data.athletes.length} {t.status.present}
           </Badge>
        </div>
      </div>

      <div className="flex-1 p-4 pb-32 max-w-2xl mx-auto w-full space-y-8">
        
        {/* SECTION 1: TRAINERS */}
        <section className="bg-muted/30 rounded-xl p-4 border space-y-3">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-primary">
            <UserCheck className="h-4 w-4" /> 
            {t.header.trainers}
          </h2>
          <div className="grid gap-2">
            {data.trainers.map(trainer => (
              <AttendanceRow 
                key={trainer.trainer_id}
                firstName={trainer.first_name}
                lastName={trainer.last_name}
                status={trainerStatus[trainer.trainer_id]}
                onClick={() => updateStatus('trainer', trainer.trainer_id)}
              />
            ))}
          </div>
        </section>

        {/* SECTION 2: CONTENT */}
        <section className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground ml-1">
            {t.header.content}
          </label>
          <Textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.header.placeholder}
            className="bg-muted/20 resize-none min-h-[100px]"
          />
        </section>

        {/* SECTION 3: ATHLETES */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t.header.athletes}
            </h2>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-primary"
              onClick={() => markAll('athlete', isAllAthletesMarked ? '' : 'p')}
            >
              {isAllAthletesMarked ? t.status.unmark_all : t.status.mark_all}
            </Button>
          </div>

          <div className="grid gap-3">
            {data.athletes.map((athlete) => (
              <AttendanceRow 
                key={athlete.athlete_id}
                firstName={athlete.first_name}
                lastName={athlete.last_name}
                status={athleteStatus[athlete.athlete_id]}
                onClick={() => updateStatus('athlete', athlete.athlete_id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          <Button 
            size="lg" 
            className="w-full shadow-lg" 
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? t.header.saving : t.header.save}
            {!saveMutation.isPending && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Reusable Row ---

function AttendanceRow({ 
  firstName, 
  lastName, 
  status, 
  onClick 
}: { 
  firstName: string; 
  lastName: string; 
  status: AttendanceStatus; 
  onClick: () => void; 
}) {
  const isCustomReason = status && !['p', 'a', 'e'].includes(status);

  // Visual Logic
  let containerClass = "bg-card border-dashed border-muted-foreground/30 opacity-80 hover:opacity-100";
  let icon = <HelpCircle className="h-4 w-4 text-muted-foreground" />;
  let statusText = t.status.unmarked;
  let badgeClass = "bg-muted text-muted-foreground";
  let avatarClass = "bg-muted text-muted-foreground";

  if (status === 'p') {
    containerClass = "bg-green-50/50 border-solid border-green-200 dark:bg-green-900/10 dark:border-green-900 opacity-100";
    icon = <Check className="h-4 w-4 text-white" />;
    statusText = t.status.present;
    badgeClass = "bg-green-600 text-white";
    avatarClass = "bg-green-600 text-white";
  } 
  else if (status === 'a') {
    // RED for Absent
    containerClass = "bg-red-50/50 border-solid border-red-200 dark:bg-red-900/10 dark:border-red-900 opacity-100";
    icon = <X className="h-4 w-4 text-white" />;
    statusText = t.status.absent;
    badgeClass = "bg-red-600 text-white";
    avatarClass = "bg-red-100 text-red-700";
  } 
  else if (status === 'e') {
    containerClass = "bg-amber-50/50 border-solid border-amber-200 dark:bg-amber-900/10 dark:border-amber-900 opacity-100";
    icon = <span className="text-[10px] font-bold text-amber-900">E</span>;
    statusText = t.status.excused;
    badgeClass = "bg-amber-300 text-amber-900";
    avatarClass = "bg-amber-100 text-amber-700";
  } 
  else if (isCustomReason) {
    containerClass = "bg-blue-50/50 border-solid border-blue-200 opacity-100";
    icon = <AlertCircle className="h-4 w-4 text-blue-600" />;
    statusText = status; // Show the custom text (e.g. "Sick")
    badgeClass = "bg-blue-100 text-blue-800";
    avatarClass = "bg-blue-100 text-blue-700";
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none active:scale-[0.98]",
        containerClass
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
          avatarClass
        )}>
          {firstName[0]}{lastName[0]}
        </div>
        <div>
          <p className={cn("font-medium", status === 'p' && "text-primary")}>
            {firstName} {lastName}
          </p>
          <p className="text-xs text-muted-foreground">{statusText}</p>
        </div>
      </div>

      {/* Status Indicator Circle */}
      <div className={cn("h-6 w-6 rounded-full flex items-center justify-center transition-colors shadow-sm", badgeClass)}>
        {icon}
      </div>
    </div>
  );
}

function AttendanceSkeleton() {
  return <div className="p-4 space-y-6"><Skeleton className="h-8 w-1/2" /><Skeleton className="h-32 w-full" /><div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div></div>;
}