import { useTrainerSchedule } from "../hooks/use-trainer-dashboard";
import { TrainingCard } from "~/modules/is/trainer/components/training-card"; // Import the new component
import { Skeleton } from "~/components/ui/skeleton";
import { Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function TrainerDashboard() {
  const { t } = useTranslation();
  const { data: trainings, isLoading } = useTrainerSchedule();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECTION 1: Training Schedule */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">{t("trainer.dashboard.your_schedule")}</h2>
        </div>
        
        {!trainings?.length ? (
           <EmptyState />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((training) => (
              <TrainingCard key={training.id} training={training} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Other Widgets (Placeholders for now) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Next Meet Widget will go here */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
           <h3 className="font-semibold mb-2">{t("trainer.dashboard.next_meet")}</h3>
           <p className="text-sm text-muted-foreground">{t("trainer.dashboard.no_meets_scheduled_soon")}</p>
        </div>

        {/* Quick Actions Widget will go here */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
           <h3 className="font-semibold mb-2">{t("trainer.dashboard.quick_actions")}</h3>
           <p className="text-sm text-muted-foreground">{t("trainer.dashboard.add_member_import_results")}</p>
        </div>
      </div>

    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-muted/20">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Activity className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{t("trainer.dashboard.no_upcoming_trainings")}</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {t("trainer.dashboard.no_sessions_scheduled_desc")}
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex h-56 flex-col space-y-3 rounded-xl border p-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-3/4" />
          <div className="flex-1 space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-md mt-auto" />
        </div>
      ))}
    </div>
  );
}