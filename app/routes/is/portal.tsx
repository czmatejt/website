import { useTranslation } from "react-i18next";

// Conceptual Layout for your Portal
export default function Portal() {
  const { t } = useTranslation();


  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">      
      <h1 className="text-3xl font-bold text-foreground">{t("portal.welcome")}</h1>
    </div>
    // <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      
    //   {/* LEFT COLUMN (Wide): The "Pulse" of the club */}
    //   <div className="space-y-6 md:col-span-2">
    //     {/* 1. Welcome & Next Action */}
    //     <WelcomeBanner userName="Jan" />
        
    //     {/* 2. Urgent Alerts (Conditional) */}
    //     <AlertBanner type="warning" message="Track closed for maintenance until Friday." />

    //     {/* 3. News Feed */}
    //     <h2 className="text-xl font-bold">Club News</h2>
    //     <NewsFeed />
    //   </div>

    //   {/* RIGHT COLUMN (Narrow): Utility & Info */}
    //   <div className="space-y-6">
    //     {/* 1. Module Quick Links (The cards we made earlier, but smaller/vertical) */}
    //     <QuickModuleNav />

    //     {/* 2. Weather Widget */}
    //     <WeatherWidget location="Kuřim Stadium" />

    //     {/* 3. Upcoming Meets */}
    //     <UpcomingMeetsList />
    //   </div>
      
    // </div>
  )
}