export interface DashboardTraining {
  id: string; // UUID
  start_at: string; // ISO Date String
  duration_minutes: number;
  
  // Context
  group_id: string;
  group_name: string;
  location?: string;
  training_type?: string;
  description?: string;
  
  // Status
  attendee_count: number;
  cancelled_reason?: string | null;
  attendance_taken_at?: string | null;
}