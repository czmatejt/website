import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { 
  ArrowLeft, Save, Sun, Snowflake, Clock, Timer, 
  Search, UserMinus, UserPlus, MapPin 
} from "lucide-react"; // Added MapPin

import { apiClient } from "~/lib/api-client";
import { groupFormSchema, type GroupFormValues } from "~/modules/trainer/types/group-form";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";

// --- Mock Data Loaders ---
import { useUser } from "~/modules/shared/hooks/use-user"; 

// Helper interface for the sub-component
interface Person {
  id: string;
  first_name: string;
  last_name: string;
}

interface GroupData {
  id: string;
  system?: number;
  name: string;
  description?: string | null;
  day_of_week: string;
  school_year_id: string;
  summer_time: string;
  winter_time: string;
  duration_summer: number;
  duration_winter: number;
  default_location_summer?: string | null;
  default_location_winter?: string | null;
  trainers: Array<{ id: string }>;
  athletes: Array<{ id: string }>;
}

export default function ManageGroupPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const isEditMode = !!id;
  const { user: currentUser } = useUser();
  const queryClient = useQueryClient();

  // 1. Fetch Reference Data
  const { data: athletes = [] } = useQuery({
    queryKey: ["athletes", "all"],
    queryFn: async () => (await apiClient.get<Person[]>("/v1/group/athletes/all")),
    placeholderData: [], 
  });

  const { data: trainers = [] } = useQuery({
    queryKey: ["trainers", "all"],
    queryFn: async () => (await apiClient.get<Person[]>("/v1/group/trainers/all")),
    placeholderData: [],
  });
  
  const { data: schoolYears = [] } = useQuery({
    queryKey: ["school-years"],
    queryFn: async () => (await apiClient.get<Map<string, string>[]>("/v1/group/school-years")),
    placeholderData: [],
  });

  // 2. Fetch Group Data
  const { data: groupData, isLoading: isLoadingGroup } = useQuery({
    queryKey: ["group", id],
    queryFn: async () => (await apiClient.get<GroupData>(`/v1/group/${id}`)),
    enabled: isEditMode,
  });

  // 3. Form Setup
  type GroupFormSchemaValues = z.input<typeof groupFormSchema>;

  const form = useForm<GroupFormSchemaValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      system: 0,
      name: "",
      description: "",
      day_of_week: "Monday",
      school_year_id: "",
      summer_time: "16:00",
      winter_time: "16:00",
      duration_summer: 90,
      duration_winter: 90,
      default_location_summer: "",
      default_location_winter: "",
      trainer_ids: currentUser ? [currentUser.trainer_id] : [],
      athlete_ids: [],
    },
  });

  useEffect(() => {
    if (groupData) {
      form.reset({
        system: groupData.system ?? 0,
        name: groupData.name,
        description: groupData.description ?? "",
        day_of_week: groupData.day_of_week,
        school_year_id: groupData.school_year_id,
        summer_time: groupData.summer_time,
        winter_time: groupData.winter_time,
        duration_summer: groupData.duration_summer,
        duration_winter: groupData.duration_winter,
        default_location_summer: groupData.default_location_summer || "",
        default_location_winter: groupData.default_location_winter || "",
        trainer_ids: groupData.trainers.map((t: any) => t.id),
        athlete_ids: groupData.athletes.map((a: any) => a.id),
      });
    }
  }, [groupData]);

  // 4. Mutation
  const saveMutation = useMutation({
    mutationFn: async (values: GroupFormSchemaValues) => {
      if (isEditMode) {
        await apiClient.put(`/v1/group/${id}`, values);
      } else {
        await apiClient.post("/v1/group", values);
      }
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Group updated!" : "Group created!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      navigate(-1);
    },
    onError: () => toast.error("Failed to save group."),
  });

  if (isEditMode && isLoadingGroup) return <div className="p-8">{t("trainer.group.loading")}</div>;
  
  // Don't render form until we have data in edit mode
  if (isEditMode && !groupData) return <div className="p-8">{t("trainer.group.loading")}</div>;

  return (
    // Mobile Fix: Added overflow-x-hidden to prevent horizontal scrolling issues
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in duration-500 overflow-x-hidden">
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">
            {isEditMode ? "Edit Group" : "Create New Group"}
          </h1>
        </div>
      </div>

      <div className="flex-1 p-4 pb-32 max-w-3xl mx-auto w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))} className="space-y-8">
            
            {/* --- SECTION 1: BASICS --- */}
            <Card>
              <CardHeader>
                <CardTitle>{t("trainer.group.basic_information")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("trainer.group.group_name")}</FormLabel>
                    <FormControl><Input placeholder="e.g. Elite Sprinters" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("trainer.group.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("trainer.group.description_placeholder")}
                        className="min-h-[96px]"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="system" render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input type="hidden" {...field} value={field.value ?? 0} />
                    </FormControl>
                  </FormItem>
                )} />

                <FormField control={form.control} name="day_of_week" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("trainer.group.training_day")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      key={field.value}
                    >
                      <FormControl><SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="school_year_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("trainer.group.school_year")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      key={field.value}
                    >
                      <FormControl><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {schoolYears.map((y: any) => (
                          <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            {/* --- SECTION 2: TIME & DURATION (Fixed Mobile Layout) --- */}
            <Card>
              <CardHeader>
                <CardTitle>{t("trainer.group.schedule_settings")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* SUMMER BLOCK */}
                <div className="p-4 rounded-lg bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                  {/* Grid Layout: Stacks on mobile, 2 columns on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Label & Icon - Spans full width on mobile */}
                    <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400 font-medium md:col-span-2">
                      <Sun className="h-5 w-5" /> Summer
                    </div>

                    {/* NEW: Default Location (Full width on mobile, Left col on desktop) */}
                    <FormField control={form.control} name="default_location_summer" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs">Default Location</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="e.g. Outdoor Stadium" className="pl-9 bg-background" {...field} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    {/* Time */}
                    <FormField control={form.control} name="summer_time" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Start Time</FormLabel>
                        <div className="relative">
                          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="time" 
                            className="pl-9 bg-background w-full" 
                            {...field}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Duration */}
                    <FormField control={form.control} name="duration_summer" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Duration (min)</FormLabel>
                        <div className="relative">
                          <Timer className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            className="pl-9 bg-background w-full"
                            value={typeof field.value === 'number' ? field.value : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? "" : Number(val) || val);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                {/* WINTER BLOCK */}
                <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-medium md:col-span-2">
                      <Snowflake className="h-5 w-5" /> Winter
                    </div>

                    {/* NEW: Default Location */}
                    <FormField control={form.control} name="default_location_winter" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs">Default Location</FormLabel>
                        <div className="relative">
                          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="e.g. Indoor Gym" className="pl-9 bg-background" {...field} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="winter_time" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Start Time</FormLabel>
                        <div className="relative">
                          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="time" 
                            className="pl-9 bg-background w-full" 
                            {...field}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="duration_winter" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Duration (min)</FormLabel>
                        <div className="relative">
                          <Timer className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            className="pl-9 bg-background w-full"
                            value={typeof field.value === "number" || typeof field.value === "string" ? field.value : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? "" : Number(val) || val);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* --- SECTION 3: TRAINERS --- */}
            <PersonSelector 
              title="Trainers"
              data={trainers}
              selectedIds={form.watch("trainer_ids")}
              onUpdate={(ids) => form.setValue("trainer_ids", ids, { shouldDirty: true })}
              disabledId={currentUser?.trainer_id}
              disabledMessage="You cannot remove yourself from the group."
            />

            {/* --- SECTION 4: ATHLETES --- */}
            <PersonSelector 
              title="Athletes"
              data={athletes}
              selectedIds={form.watch("athlete_ids")}
              onUpdate={(ids) => form.setValue("athlete_ids", ids, { shouldDirty: true })}
            />

          </form>
        </Form>
      </div>

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/80 backdrop-blur safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <Button 
            size="lg" 
            className="w-full shadow-lg gap-2" 
            onClick={form.handleSubmit((d) => saveMutation.mutate(d))}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving..." : "Save Group"}
            {!saveMutation.isPending && <Save className="h-4 w-4" />}
          </Button>
        </div>
      </div>

    </div>
  );
}

// Sub-component remains the same...
function PersonSelector({ 
  title, data, selectedIds, onUpdate, disabledId, disabledMessage
}: { 
  title: string; data: Person[]; selectedIds: string[]; 
  onUpdate: (ids: string[]) => void; disabledId?: string; disabledMessage?: string;
}) {
    // ... (This part was fine in your original code)
    // Just ensuring the import logic is clean
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
  
    const selectedPeople = data.filter(p => selectedIds.includes(p.id));
    const availablePeople = data.filter(p => 
      !selectedIds.includes(p.id) && 
      (`${p.first_name} ${p.last_name}`).toLowerCase().includes(query.toLowerCase())
    );
  
    const toggleSelection = (id: string) => {
      if (id === disabledId && selectedIds.includes(id)) {
        toast.error(disabledMessage || "Cannot remove this user.");
        return;
      }
      if (selectedIds.includes(id)) {
        onUpdate(selectedIds.filter(x => x !== id));
      } else {
        onUpdate([...selectedIds, id]);
      }
    };

    return (
        <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {title} 
            <Badge variant="secondary">{selectedIds.length}</Badge>
            </CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "Done" : "Manage"}
            </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
            {selectedPeople.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {selectedPeople.map(person => (
                <button
                  type="button"
                  onClick={() => toggleSelection(person.id)}
                  disabled={person.id === disabledId}
                  className={cn(
                    "group rounded-full",
                    person.id === disabledId && "cursor-not-allowed"
                  )}
                >
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "px-3 py-2 text-sm flex items-center gap-2 transition-colors group-hover:bg-destructive group-hover:text-white",
                      person.id === disabledId && "opacity-70"
                    )}
                  >
                    <span>{person.first_name} {person.last_name}</span>
                    <span className="inline-flex items-center justify-center rounded-full border border-transparent p-1">
                      <UserMinus className="h-4 w-4" />
                    </span>
                  </Badge>
                </button>
                ))}
            </div>
            ) : (
            <div className="text-sm text-muted-foreground italic">No {title.toLowerCase()} selected</div>
            )}

            {isOpen && (
            <div className="animate-in slide-in-from-top-2 pt-2 border-t mt-2">
                <div className="relative mb-3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={e => setQuery(e.target.value)} className="pl-9" />
                </div>
                
                <ScrollArea className="h-[200px] rounded-md border p-2">
                {availablePeople.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">No matches found.</div>
                ) : (
                    <div className="space-y-1">
                    {availablePeople.map(person => (
                        <div key={person.id} onClick={() => toggleSelection(person.id)} className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer group">
                        <span className="text-sm">{person.first_name} {person.last_name}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                            <UserPlus className="h-4 w-4 text-green-600" />
                        </Button>
                        </div>
                    ))}
                    </div>
                )}
                </ScrollArea>
            </div>
            )}
        </CardContent>
        </Card>
    );
}