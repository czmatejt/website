import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router"; // or react-router-dom
import { 
  ArrowLeft, Save, Sun, Snowflake, Clock, Timer, 
  Search, UserMinus, UserPlus, Check, AlertCircle 
} from "lucide-react";

import { apiClient } from "~/lib/api-client";
import { groupFormSchema, type GroupFormValues } from "~/modules/trainer/types/group-form"; // Import schema

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

// --- Mock Data Loaders (Replace with your actual API calls) ---
// You likely have a user hook already
import { useUser } from "~/modules/shared/hooks/use-user"; 

export default function ManageGroupPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // If present, we are in Edit Mode
  const [searchParams] = useSearchParams();
  const isEditMode = !!id;
  const { user: currentUser } = useUser(); // Get current trainer to prevent self-removal
  const queryClient = useQueryClient();

  // 1. Fetch Reference Data
  const { data: athletes = [] } = useQuery({
    queryKey: ["athletes", "all"],
    queryFn: async () => (await apiClient.get("/athletes/all")).data,
    initialData: [], 
  });

  const { data: trainers = [] } = useQuery({
    queryKey: ["trainers", "all"],
    queryFn: async () => (await apiClient.get("/trainers/all")).data,
    initialData: [],
  });
  
  const { data: schoolYears = [] } = useQuery({
    queryKey: ["school-years"],
    queryFn: async () => (await apiClient.get("/school-years")).data,
    initialData: [{ id: "curr", name: "2023/2024" }], // Fallback
  });

  // 2. Fetch Group Data (if Editing)
  const { data: groupData, isLoading: isLoadingGroup } = useQuery({
    queryKey: ["group", id],
    queryFn: async () => (await apiClient.get(`/groups/${id}`)).data,
    enabled: isEditMode,
  });

  // 3. Form Setup
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      day_of_week: "Monday",
      school_year_id: "",
      summer_time: "16:00",
      winter_time: "16:00",
      summer_duration_minutes: 90,
      winter_duration_minutes: 90,
      trainer_ids: currentUser ? [currentUser.trainer_id] : [], // Default to current user
      athlete_ids: [],
    },
  });

  // Populate form on Edit
  useEffect(() => {
    if (groupData) {
      form.reset({
        name: groupData.name,
        day_of_week: groupData.day_of_week,
        school_year_id: groupData.school_year_id,
        summer_time: groupData.summer_time,
        winter_time: groupData.winter_time,
        summer_duration_minutes: groupData.summer_duration_minutes,
        winter_duration_minutes: groupData.winter_duration_minutes,
        trainer_ids: groupData.trainers.map((t: any) => t.id),
        athlete_ids: groupData.athletes.map((a: any) => a.id),
      });
    }
  }, [groupData, form]);

  // 4. Mutation
  const saveMutation = useMutation({
    mutationFn: async (values: GroupFormValues) => {
      if (isEditMode) {
        await apiClient.put(`/groups/${id}`, values);
      } else {
        await apiClient.post("/groups", values);
      }
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Group updated!" : "Group created!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      navigate(-1);
    },
    onError: () => toast.error("Failed to save group."),
  });

  if (isEditMode && isLoadingGroup) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      
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
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Group Name</FormLabel>
                    <FormControl><Input placeholder="e.g. Elite Sprinters" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="day_of_week" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormLabel>School Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* --- SECTION 2: TIME & DURATION --- */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Summer Row */}
                <div className="flex flex-col md:flex-row gap-4 items-end p-4 rounded-lg bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                  <div className="flex items-center gap-2 min-w-[120px] pb-2 text-orange-700 dark:text-orange-400 font-medium">
                    <Sun className="h-5 w-5" /> Summer
                  </div>
                  
                  <FormField control={form.control} name="summer_time" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Start Time</FormLabel>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="time" className="pl-9 bg-background" {...field} />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="summer_duration_minutes" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Duration (min)</FormLabel>
                      <div className="relative">
                        <Timer className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" className="pl-9 bg-background" {...field} />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {/* Winter Row */}
                <div className="flex flex-col md:flex-row gap-4 items-end p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-center gap-2 min-w-[120px] pb-2 text-blue-700 dark:text-blue-400 font-medium">
                    <Snowflake className="h-5 w-5" /> Winter
                  </div>
                  
                  <FormField control={form.control} name="winter_time" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Start Time</FormLabel>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="time" className="pl-9 bg-background" {...field} />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="winter_duration_minutes" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Duration (min)</FormLabel>
                      <div className="relative">
                        <Timer className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="number" className="pl-9 bg-background" {...field} />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

              </CardContent>
            </Card>

            {/* --- SECTION 3: TRAINERS --- */}
            <PersonSelector 
              title="Trainers"
              data={trainers}
              selectedIds={form.watch("trainer_ids")}
              onUpdate={(ids) => form.setValue("trainer_ids", ids, { shouldDirty: true })}
              disabledId={currentUser?.id} // Cannot remove self
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

// ----------------------------------------------------------------------
// SUB-COMPONENT: Reusable Person Selector (Like the Flutter Expansion)
// ----------------------------------------------------------------------

interface Person {
  id: string;
  first_name: string;
  last_name: string;
}

function PersonSelector({ 
  title, 
  data, 
  selectedIds, 
  onUpdate,
  disabledId,
  disabledMessage
}: { 
  title: string; 
  data: Person[]; 
  selectedIds: string[]; 
  onUpdate: (ids: string[]) => void;
  disabledId?: string;
  disabledMessage?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedPeople = data.filter(p => selectedIds.includes(p.id));
  // Filter available people: Not already selected AND matches search
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
          {title === "Trainers" ? <UserPlus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {title} 
          <Badge variant="secondary">{selectedIds.length}</Badge>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Done" : "Manage"}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 1. List of SELECTED people (Always visible) */}
        {selectedPeople.length > 0 ? (
           <div className="flex flex-wrap gap-2">
             {selectedPeople.map(person => (
               <Badge 
                 key={person.id} 
                 variant="secondary" 
                 className={cn(
                   "pl-2 pr-1 py-1 flex items-center gap-1",
                   person.id === disabledId && "opacity-70 cursor-not-allowed"
                 )}
               >
                 {person.first_name} {person.last_name}
                 <button 
                   onClick={() => toggleSelection(person.id)}
                   disabled={person.id === disabledId}
                   className="hover:bg-destructive hover:text-white rounded-full p-0.5 transition-colors"
                 >
                    <UserMinus className="h-3 w-3" />
                 </button>
               </Badge>
             ))}
           </div>
        ) : (
          <div className="text-sm text-muted-foreground italic">No {title.toLowerCase()} selected</div>
        )}

        {/* 2. EXPANDABLE AREA: Search & Add */}
        {isOpen && (
          <div className="animate-in slide-in-from-top-2 pt-2 border-t mt-2">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`Search ${title.toLowerCase()}...`} 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {availablePeople.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No matches found.
                </div>
              ) : (
                <div className="space-y-1">
                  {availablePeople.map(person => (
                    <div 
                      key={person.id} 
                      onClick={() => toggleSelection(person.id)}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer group"
                    >
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