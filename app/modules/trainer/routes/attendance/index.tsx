import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth, endOfMonth, isSameDay, parseISO, isToday } from "date-fns";
import { useTranslation } from "react-i18next";
import { Calendar } from "~/components/ui/calendar";
import { Button } from "~/components/ui/button";
import { Plus, RefreshCw, Calendar as CalendarIcon } from "lucide-react"; // Renamed icon
import { apiClient } from "~/lib/api-client";
import { type DashboardTraining } from "./../../types/trainer";
import { TrainingCard } from "~/modules/trainer/components/training-card";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export default function AttendanceOverview() {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewedMonth, setViewedMonth] = useState<Date>(new Date());
  
  // -- Queries (Same as before) --
  const from = startOfMonth(viewedMonth).toISOString();
  const to = endOfMonth(viewedMonth).toISOString();
  
  const { data: monthTrainings, isFetching } = useQuery({
    queryKey: ["trainer", "schedule", "range", from], 
    queryFn: async () => {
      return await apiClient.get<DashboardTraining[]>("/v1/trainer/schedule/range", {
        params: { from_date: from, to_date: to }
      });
    },
    placeholderData: (prev) => prev, 
  });

  const selectedDayTrainings = monthTrainings?.filter(t => 
    date && isSameDay(parseISO(t.start_at), date)
  ) || [];

  const trainingDates = monthTrainings?.map(t => new Date(t.start_at)) || [];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. Mobile-First Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("trainer.attendance.attendance_title")}</h1>
          <p className="text-sm text-muted-foreground">{t("trainer.attendance.select_date_verify_athletes")}</p>
        </div>
        {/* Quick 'Today' Action for Mobile */}
        <Button 
          variant="outline" 
          size="sm" 
          className="md:hidden"
          onClick={() => {
            const today = new Date();
            setDate(today);
            setViewedMonth(today);
          }}
        >
          Today
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* 2. LEFT COLUMN: Calendar (Scrolls away on mobile) */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col gap-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 flex justify-center relative">
            {isFetching && (
              <div className="absolute top-4 right-4 animate-spin text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
              </div>
            )}
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              month={viewedMonth}
              onMonthChange={setViewedMonth}
              className="w-full max-w-[350px] mx-auto" // Center on mobile
              modifiers={{ hasTraining: trainingDates }}
              modifiersClassNames={{
                hasTraining: "font-bold text-primary decoration-primary underline decoration-2 underline-offset-4"
              }}
            />
          </div>
          
          {/* Desktop-only 'Today' button (since mobile has it in header) */}
          <Button 
            variant="outline" 
            className="hidden md:flex w-full"
            onClick={() => {
              const today = new Date();
              setDate(today);
              setViewedMonth(today);
            }}
          >
            Jump to Today
          </Button>
        </div>

        {/* 3. RIGHT COLUMN: List with Sticky Header */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Sticky Header: Sticks to top of screen on mobile when scrolling list */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b mb-4 flex rounded-lg justify-between items-center transition-all">
            <div>
              <h2 className="text-xl px-4 font-semibold flex items-center gap-2">
                {date ? format(date, "EEEE, MMM do") : "Select a Date"}
                {date && isToday(date) && <Badge variant="secondary">{t("trainer.attendance.today")}</Badge>}
              </h2>
            </div>
          </div>

          <div className="space-y-4 pb-20">
            {selectedDayTrainings.length > 0 ? (
              selectedDayTrainings.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))
            ) : (
              <EmptyState date={date} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ date }: { date?: Date }) {

  const { t } = useTranslation();

  return (

    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/10">

      <div className="bg-background rounded-full p-3 mb-3 shadow-sm">

        <CalendarIcon className="h-6 w-6 opacity-40" />

      </div>

      <p className="font-medium">{t("trainer.attendance.no_sessions_found")}</p>

      <p className="text-sm max-w-[200px] mx-auto">

        {t("shared.no_trainings_scheduled_for_day", { day: date ? format(date, "MMMM do") : t("shared.this_day") })}

      </p>

    </div>

  );

}