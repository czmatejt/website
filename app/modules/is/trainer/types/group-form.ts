import { z } from "zod";

export const groupFormSchema = z.object({
  id: z.string().optional(),
  system: z.number(),
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  day_of_week: z.string().min(1, "Please select a training day"),
  school_year_id: z.string().min(1, "School year is required"),
  
  // Times (Stored as "HH:MM" string)
  summer_time: z.string().min(1, "Start time is required"),
  winter_time: z.string().min(1, "Start time is required"),
  
  // Durations - preprocess to handle empty strings
  duration_summer: z.preprocess(
    (val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string' && val.trim() !== '') {
        const num = Number(val);
        return isNaN(num) ? val : num;
      }
      return val;
    },
    z.number({ message: "Please enter a valid number" })
      .min(1, "Duration must be at least 1 minute")
      .max(720, "Must be between 1 and 720 minutes")
  ),
  duration_winter: z.preprocess(
    (val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string' && val.trim() !== '') {
        const num = Number(val);
        return isNaN(num) ? val : num;
      }
      return val;
    },
    z.number({ message: "Please enter a valid number" })
      .min(1, "Duration must be at least 1 minute")
      .max(720, "Must be between 1 and 720 minutes")
  ),

  // Locations
  default_location_summer: z.string().min(1, "Default summer location is required"),
  default_location_winter: z.string().min(1, "Default winter location is required"),

  // IDs
  trainer_ids: z.array(z.string()),
  athlete_ids: z.array(z.string()),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;