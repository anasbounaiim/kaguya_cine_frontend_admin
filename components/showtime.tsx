"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Pencil, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiSchedule from "@/utils/scheduleApiFetch";
import apiVenue from "@/utils/venueApiFetch";
import apiCatalog from "@/utils/catalogApiFetch";
import { format } from "date-fns";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const ShowtimeFormSchema = z.object({
  versionId: z.coerce.number().min(1, "Version is required"),
  theaterId: z.coerce.number().min(1, "Theater is required"),
  startTime: z.string(),
  basePrice: z.coerce.number().min(0, "Must be positive"),
  ticketsSold: z.coerce.number().min(0, "Must be positive")
});

type ShowtimeForm = z.infer<typeof ShowtimeFormSchema>;

interface Showtime {
  showtimeId: number;
  versionId: number;
  theaterId: number;
  startTime: string;
  basePrice: number;
  ticketsSold: number;
  private: boolean;
}

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSt, setEditingSt] = useState<Showtime | null>(null);
  const [stToDelete, setStToDelete] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [cinemas, setCinemas] = useState<any[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [cinemaDetails, setCinemaDetails] = useState<any | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [allCinemaDetails, setAllCinemaDetails] = useState<any[]>([]);



  const form = useForm<ShowtimeForm>({
    resolver: zodResolver(ShowtimeFormSchema),
    defaultValues: {
      versionId: 0,
      theaterId: 0,
      startTime: new Date().toISOString(),
      basePrice: 0,
      ticketsSold: 0
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await apiSchedule.get("/api/schedule/all");
        console.log("Showtimes fetched successfully", data);
        setShowtimes(data);
      } catch {
        toast.error("Erreur chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cinemasRes = await apiVenue.get("/api/cinemas");
        setCinemas(cinemasRes);

        // Charger tous les détails une fois
        const detailsPromises = cinemasRes.map((c: any) =>
          apiVenue.get(`/api/cinemas/${c.cinemaId}`)
        );
        const allDetails = await Promise.all(detailsPromises);
        setAllCinemaDetails(allDetails);
      } catch {
        toast.error("Erreur chargement cinémas");
      }
    })();
  }, []);


  useEffect(() => {
    if (!selectedCinemaId) {
      setCinemaDetails(null);
      return;
    }
    (async () => {
      try {
        const res = await apiVenue.get(`/api/cinemas/${selectedCinemaId}`);
        setCinemaDetails(res);
      } catch {
        toast.error("Erreur chargement détails cinéma");
      }
    })();
  }, [selectedCinemaId]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiCatalog.get("/api/movies");
        const moviesData = Array.isArray(res)
          ? res
          : res?.content ?? [];
        setMovies(moviesData);
      } catch {
        toast.error("Erreur chargement films");
      }
    })();
  }, []);

  const openAdd = () => {
    setEditingSt(null);
    form.reset({
      versionId: 0,
      theaterId: 0,
      startTime: new Date().toISOString(),
      basePrice: 0,
      ticketsSold: 0
    });
    setSelectedMovieId(null);
    setSelectedCinemaId(null);
    setIsModalOpen(true);
  };

  const openEdit = async (st: Showtime) => {
    setEditingSt(st);

    const movieWithVersion = movies.find((m) =>
      (m.versions ?? []).some((v: any) => v.versionId === st.versionId)
    );
    setSelectedMovieId(movieWithVersion ? movieWithVersion.movieId : null);

    let foundCinemaDetails = null;
    let foundCinemaId: number | null = null;

    for (const cinema of cinemas) {
      const details = await apiVenue.get(`/api/cinemas/${cinema.cinemaId}`);
      if (
        (details.theaters ?? []).some((t: any) => t.theaterId === st.theaterId)
      ) {
        foundCinemaDetails = details;
        foundCinemaId = cinema.cinemaId;
        break;
      }
    }

    setSelectedCinemaId(foundCinemaId);
    setCinemaDetails(foundCinemaDetails);

    form.reset({
      versionId: st.versionId,
      theaterId: st.theaterId,
      startTime: st.startTime,
      basePrice: st.basePrice,
      ticketsSold: st.ticketsSold
    });

    setIsModalOpen(true);
  };

  async function handleTogglePublish(showtimeId: number, checked: boolean) {
    console.log("Toggling publish for showtime:", showtimeId, "Checked:", checked);
    try {
      if (checked) {
        // Activer
        await apiSchedule.post(`/api/schedule/${showtimeId}/publish`, {});
        toast.success("Séance publiée");
      } else {
        // Désactiver
        await apiSchedule.post(`/api/schedule/${showtimeId}/unpublish`, {});
        toast.success("Séance passée en privé");
      }

      // Après l’opération, recharger la liste
      const data = await apiSchedule.get("/api/schedule/all");
      setShowtimes(data);
    } catch {
      toast.error("Erreur lors de la mise à jour de la publication");
    }
  }




  async function onSubmit(values: ShowtimeForm) {
    console.log("Submitting values:", values);
    try {
      if (editingSt) {
        await apiSchedule.put(`/api/schedule/${editingSt.showtimeId}`, values);
        toast.success("Séance mise à jour");
      } else {
        await apiSchedule.post("/api/schedule", values);
        toast.success("Séance ajoutée");
      }
      const data = await apiSchedule.get("/api/schedule/all");
      setShowtimes(data);
      setIsModalOpen(false);
    } catch {
      toast.error("Erreur enregistrement");
    }
  }

  const confirmDelete = async () => {
    if (stToDelete == null) return;
    try {
      await apiSchedule.delete(`/api/schedule/${stToDelete}`);
      toast.success("Séance supprimée");
      setShowtimes((prev) => prev.filter((s) => s.showtimeId !== stToDelete));
    } catch {
      toast.error("Erreur suppression");
    } finally {
      setStToDelete(null);
    }
  };

  function getVersionLabel(versionId: number) {
    for (const movie of movies) {
      const version = movie.versions?.find((v: any) => v.versionId === versionId);
      if (version) return `${movie.title} - ${version.language}/${version.format}`;
    }
  }

  function getTheaterLabel(theaterId: number) {
    for (const cinema of allCinemaDetails) {
      const theater = cinema.theaters?.find((t: any) => t.theaterId === theaterId);
      if (theater) return `${theater.name} (${cinema.name})`;
    }
  }



  const filtered = showtimes.filter((st) =>
    [st.showtimeId, st.versionId, st.theaterId]
      .map((n) => n.toString())
      .some((str) => str.includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Showtimes</h1>
        <Button
          onClick={openAdd}
          className="bg-red-700 text-white flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Showtime
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="rounded-3xl border-b-2 border-red-700 p-4 bg-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Theater</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Solde</TableHead>
              <TableHead className="text-right">Actions</TableHead>
              <TableHead className="text-right">Publish</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  {Array(6).fill(0).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 w-full bg-gray-200 rounded" />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="h-4 w-20 ml-auto bg-gray-200 rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-4 w-20 ml-auto bg-gray-200 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-neutral-400">
                  No showtimes found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((st) => (
                <TableRow key={st.showtimeId}>
                  <TableCell>{st.showtimeId}</TableCell>
                  <TableCell>{getVersionLabel(st.versionId)}</TableCell>
                  <TableCell>{getTheaterLabel(st.theaterId)}</TableCell>
                  <TableCell>
                    {new Date(st.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{st.basePrice.toFixed(2)}</TableCell>
                  <TableCell>{st.ticketsSold}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEdit(st)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Dialog
                      open={stToDelete === st.showtimeId}
                      onOpenChange={(o) =>
                        setStToDelete(o ? st.showtimeId : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-red-600 font-bold text-xl">
                            Confirm Deletion
                          </DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          Are you sure you want to delete this?
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              className="bg-red-700 hover:bg-red-800 px-6"
                              variant="destructive"
                              onClick={confirmDelete}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Switch
                        className="cursor-pointer"
                        id={`publish-switch-${st.showtimeId}`}
                        defaultChecked={st.private === false}
                        onCheckedChange={(checked) => handleTogglePublish(st.showtimeId, checked)}
                      />
                    </div>
                  </TableCell>


                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 font-bold text-xl">
              {editingSt ? "Edit Showtime" : "Add Showtime"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-8 mb-4">
                <FormItem className="flex-1">
                  <FormLabel>Movie</FormLabel>
                  <select
                    className="w-full bg-white text-black rounded-md mt-1 h-9 px-2 text-sm font-normal"
                    value={selectedMovieId ?? ""}
                    onChange={(e) => {
                      const movieId = Number(e.target.value) || null;
                      setSelectedMovieId(movieId);
                      // Reset version selection when changing movie
                      form.setValue("versionId", 0);
                    }}
                    required
                  >
                    <option value="">-- Select a movie --</option>
                    {movies.map((m) => (
                      <option key={m.movieId} value={m.movieId}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </FormItem>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="versionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <select
                          className="w-full bg-white text-black rounded-md mt-1 h-9 px-2 text-sm font-normal"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={!selectedMovieId}
                          required
                        >
                          <option value="">-- Select a version --</option>
                          {movies
                            .find((m) => m.movieId === selectedMovieId)
                            ?.versions?.map((v: any) => (
                              <option key={v.versionId} value={v.versionId}>
                                {v.language}/{v.format}
                              </option>
                            ))}
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>


              {/* Cinema */}
              <div className="flex gap-8 mb-4">
                <FormItem className="flex-1">
                  <FormLabel>Cinema</FormLabel>
                  <select
                    className="w-full bg-white text-black rounded-md mt-1 h-9 px-2 text-sm font-normal"
                    value={selectedCinemaId ?? ""}
                    onChange={(e) =>
                      setSelectedCinemaId(Number(e.target.value) || null)
                    }
                    required
                  >
                    <option value="">-- Select cinema --</option>
                    {cinemas.map((c) => (
                      <option key={c.cinemaId} value={c.cinemaId}>
                        {c.name} ({c.city})
                      </option>
                    ))}
                  </select>
                </FormItem>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="theaterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salle</FormLabel>
                        <select
                          className="w-full bg-white text-black rounded-md mt-1 h-9 px-2 text-sm font-normal"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={!cinemaDetails}
                          required
                        >
                          <option value="">-- Select a salle --</option>
                          {cinemaDetails?.theaters?.map((t: any) => (
                            <option key={t.theaterId} value={t.theaterId}>
                              {t.name} (Capacity: {t.capacity})
                            </option>
                          ))}
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => {
                  const date = field.value ? new Date(field.value) : undefined;
                  return (
                    <FormItem className="flex flex-col gap-3">
                      <FormLabel>Start Time</FormLabel>
                      <div className="flex gap-8">
                        {/* Date */}
                        <div className="w-4/5">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between font-normal bg-white text-black"
                                >
                                  {date
                                    ? format(new Date(field.value), "yyyy-MM-dd")
                                    : "Select date"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0 bg-white text-black">
                              <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(selected) => {
                                  if (!selected) return;
                                  const updated = date ?? new Date();
                                  updated.setFullYear(
                                    selected.getFullYear(),
                                    selected.getMonth(),
                                    selected.getDate()
                                  );
                                  field.onChange(updated.toISOString());
                                  setOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        {/* Time */}
                        <Input
                          type="time"
                          step="60"
                          value={date ? format(date, "HH:mm") : ""}
                          onChange={(e) => {
                            const [h, m] = e.target.value.split(":").map(Number);
                            const updated = date ?? new Date();
                            updated.setHours(h, m, 0, 0);
                            field.onChange(updated.toISOString());
                          }}
                          className="bg-white text-black w-1/5"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex gap-8 mb-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="basePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white text-black mt-1"
                            {...field}
                            type="number"
                            step="0.01"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="ticketsSold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tickets Sold</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-white text-black mt-1"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>


              {/* Footer buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  className="bg-red-700 hover:bg-red-800 px-6"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

