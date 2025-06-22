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
import { Button } from "./ui/button";
import { Pencil, Trash2, Plus, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import apiCatalog from "@/utils/catalogApiFetch";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieFormSchema } from "@/validators/movie";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import VersionsSelectInput from "./ui/VersionsSelectInput";
import GenresMultiSelectInput from "./ui/GenresMultiSelectInput";
import toast from "react-hot-toast";
import { formatDateToYMD, parseDateStringToLocal } from "@/utils/date";

const MOVIES_PER_PAGE = 5;

type MovieBase = z.infer<typeof MovieFormSchema>;
type Movie = MovieBase & { movieId: string };

const Movies = () => {
  const form = useForm<MovieBase>({
    resolver: zodResolver(MovieFormSchema),
    defaultValues: {
      title: "",
      originalTitle: "",
      releaseDate: "",
      durationMin: "",
      synopsis: "",
      posterUrl: "",
      trailerUrl: "",
      ageRating: "",
      genres: [],
      versions: [],
      private: false,
    }
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null);

  const [genresList, setGenresList] = useState<{ genreId: string; name: string }[]>([]);

  // Genres fetch
  const fetchGenres = async () => {
    try {
      const response = await apiCatalog.get('/api/genres');
      setGenresList(response);
    } catch (err: unknown) {
      console.error("Genres fetched error", err)
    }
  };

  useEffect(() => { fetchGenres(); }, []);

  // Movies fetch
  const fetchMovies = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiCatalog.get(`/api/movies?search=${search}&page=${currentPage}&size=${MOVIES_PER_PAGE}`);
      setMovies(res.content);
    } catch (err) {
      console.error("❌ Failed to load or parse movies:", err);
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);
  

  function uniqueVersions(arr: { language: string; format: string }[]) {
    return arr.filter(
      (item, index, self) =>
        index === self.findIndex(
          v => v.language === item.language && v.format === item.format
        )
    );
  }

  // Form: edit
  useEffect(() => {
    if (editingMovie) {
      form.reset({
        ...editingMovie,
        releaseDate: editingMovie.releaseDate?.split("T")[0] ?? "",
        durationMin: editingMovie.durationMin.toString(),
        versions: editingMovie.versions ? uniqueVersions(editingMovie.versions) : [],
      });
      setIsModalOpen(true);
    }
  }, [editingMovie, form]);

  // Submit
  async function onSubmit(values: z.infer<typeof MovieFormSchema>) {
    try {
      const bodyToSend = { ...values };
      if (editingMovie) {
        bodyToSend.movieId = editingMovie.movieId;
      } else {
        delete (bodyToSend as { movieId?: string }).movieId;
      }
      if (editingMovie) {
        await apiCatalog.put(`/api/movies/${editingMovie.movieId}`, bodyToSend);
      } else {
        await apiCatalog.post("/api/movies", bodyToSend);
      }
      toast.success("Movie added successfully", {
        duration: 5000,
        style: { border: '1px solid #4ade80', background: '#ecfdf5', color: '#065f46' }
      });
      setIsModalOpen(false);
      setEditingMovie(null);
      fetchMovies();
      form.reset();
    } catch (err) {
      console.error("Error submitting movie:", err);
      toast.error("Error ading movie", {
        duration: 5000,
        style: { border: '1px solid #4ade80', background: '#ecfdf5', color: '#065f46' }
      });
    }
  }

  // Add
  const handleAddClick = () => {
    setEditingMovie(null);
    form.reset({
      title: "",
      originalTitle: "",
      releaseDate: "",
      durationMin: "",
      synopsis: "",
      posterUrl: "",
      trailerUrl: "",
      ageRating: "",
      genres: [],
      versions: [],
      private: false,
    });
    setIsModalOpen(true);
  };

  // Edit
  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
  };

  // Delete
  const deleteMovie = async (id: string) => {
    try {
      await apiCatalog.delete(`/api/movies/${id}`);
      fetchMovies();
      toast.success("Movie deleted successfully", {
        duration: 5000,
        style: { border: '1px solid #4ade80', background: '#ecfdf5', color: '#065f46' }
      });
    } catch (err) {
      console.error("Error deleting movie", err);
      toast.error("Error deleting movie", {
        duration: 5000,
        style: { border: '1px solid #4ade80', background: '#ecfdf5', color: '#065f46' }
      });
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));
  const indexOfLast = currentPage * MOVIES_PER_PAGE;
  const indexOfFirst = indexOfLast - MOVIES_PER_PAGE;
  const currentMovies = movies.slice(indexOfFirst, indexOfLast);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="text-white bg-red-700 cursor-pointer shadow-md" variant="default" onClick={handleAddClick}>
              <Plus className="h-4 w-4" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 font-bold text-xl">{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, (errors) => { console.log("Validation Errors:", errors); })} className="grid grid-cols-2 gap-6">
                {/* All form fields (identique à avant, je ne recopie pas tout pour la lisibilité) */}
                {/* ... */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black mt-1" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="originalTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Title</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black mt-1" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal bg-white text-black mt-1 cursor-pointer",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value && parseDateStringToLocal(field.value)
                                ? format(parseDateStringToLocal(field.value) as Date, "yyyy-MM-dd")
                                : <span className="text-gray-500">Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-black" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                          <Calendar
                            mode="single"
                            selected={parseDateStringToLocal(field.value)}
                            onSelect={date => field.onChange(formatDateToYMD(date))}
                            disabled={date =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="durationMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (min)</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black mt-1" type="number" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="synopsis"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Synopsis</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black mt-1" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="posterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poster URL</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black mt-1" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trailerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trailer URL</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black mt-1" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ageRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Rating</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black mt-1" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="genres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genres</FormLabel>
                      <FormControl>
                        <GenresMultiSelectInput
                          options={genresList}
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="versions"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Versions</FormLabel>
                      <FormControl>
                        <VersionsSelectInput
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-4 col-span-2">
                  <DialogClose asChild>
                    <Button className="cursor-pointer" type="button" variant="outline" onClick={() => { setEditingMovie(null); form.reset(); }}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button className="bg-red-700 cursor-pointer hover:bg-red-800 px-6" type="submit">
                    {editingMovie ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search by title, genre, or synopsis…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-80"
        />
        <span className="text-neutral-500 text-sm">
          {movies.length} movie{movies.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-3xl border-0 border-b-2 border-red-700 p-4 md:p-8 bg-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Poster</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Synopsis</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                  <TableCell><div className="h-16 w-12 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-48 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell className="text-right"><div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                </TableRow>
              ))
            ) : currentMovies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-neutral-400">
                  No movies found.
                </TableCell>
              </TableRow>
            ) : (
              currentMovies.map((movie) => (
                <TableRow key={movie.movieId}>
                  <TableCell>
                    <Image src={movie.posterUrl} alt={movie.title} width={48} height={48} className="w-12 h-16 object-cover rounded" />
                  </TableCell>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      movie.ageRating === "PG"
                        ? "bg-blue-100 text-blue-800"
                        : movie.ageRating === "PG-13"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {movie.ageRating}
                    </span>
                  </TableCell>
                  <TableCell>{movie.durationMin} min</TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    <span className="whitespace-normal break-words">{movie.synopsis}</span>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => handleEdit(movie)}>
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    {/* Dialog de confirmation suppression */}
                    <Dialog open={movieToDelete === movie.movieId} onOpenChange={open => setMovieToDelete(open ? movie.movieId : null)}>
                      <DialogTrigger asChild>
                        <Button className="cursor-pointer" size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-red-600 font-bold text-xl">Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          Are you sure you want to delete <b>{movie.title}</b>?
                        </div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button className="cursor-pointer" variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              className="bg-red-700 cursor-pointer hover:bg-red-800 px-6"
                              variant="destructive"
                              onClick={() => {
                                deleteMovie(movie.movieId);
                                setMovieToDelete(null);
                              }}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end gap-2">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
            Previous
          </Button>
          <span className="self-center">Page {currentPage} of {totalPages}</span>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Movies;
