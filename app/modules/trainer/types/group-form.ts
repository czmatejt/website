import { z } from "zod";

export const groupFormSchema = z.object({
  id: z.string().optional(), // Null for create, UUID for edit
  name: z.string().min(1, "Group name is required"),
  day_of_week: z.string().min(1, "Please select a training day"),
  school_year_id: z.string().min(1, "School year is required"),
  
  // Times (Stored as "HH:MM" string)
  summer_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time"),
  winter_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time"),
  
  // Durations (Int)
  summer_duration_minutes: z.coerce.number().min(1).max(720, "Must be between 1 and 720 minutes"),
  winter_duration_minutes: z.coerce.number().min(1).max(720, "Must be between 1 and 720 minutes"),

  // IDs
  trainer_ids: z.array(z.string()),
  athlete_ids: z.array(z.string()),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;