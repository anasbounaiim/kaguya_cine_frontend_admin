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
// import { Checkbox } from "./ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import VersionsSelectInput from "./ui/VersionsSelectInput";

const MOVIES_PER_PAGE = 5;

// Movie type = schéma sans movieId (pour la création)
type MovieBase = z.infer<typeof MovieFormSchema>;
// Ajoute movieId en plus pour l'affichage
type Movie = MovieBase & { movieId: string };

const Movies = () => {
  const form = useForm<MovieBase>({
    resolver: zodResolver(MovieFormSchema),
    defaultValues: {
      title: "",
      originalTitle: "",
      releaseDate: "",
      durationMin: 0,
      synopsis: "",
      posterUrl: "",
      trailerUrl: "",
      ageRating: "",
      genres: [],
      versions: [{ language: "", format: "" }],
      private: false,
    }
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  // Load movies (paginated)
  const fetchMovies = React.useCallback(async () => {
    try {
      const res = await apiCatalog.get(`/api/movies?search=${search}&page=${currentPage}&size=${MOVIES_PER_PAGE}`);
      setMovies(res.content);
    } catch (err) {
      console.error("❌ Failed to load or parse movies:", err);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Pré-remplit le formulaire sur modification
  useEffect(() => {
    if (editingMovie) {
      form.reset({
        ...editingMovie,
        // Formate la date si besoin
        releaseDate: editingMovie.releaseDate?.split("T")[0] ?? "",
      });
      setIsModalOpen(true);
    }
  }, [editingMovie, form]);

  // Add or Edit movie
  const handleSubmitMovie = async (data: MovieBase) => {
    try {
      // Pour le POST : movieId doit être absent du body !
      const bodyToSend = { ...data };
      if (editingMovie) {
        bodyToSend.movieId = editingMovie.movieId; // Ajoute movieId pour la mise à jour
      } else {
        // Type assertion to allow delete on possibly undefined property
        delete (bodyToSend as { movieId?: string }).movieId; // Assure que movieId n'est pas envoyé lors de la création
      }
      if (editingMovie) {
        await apiCatalog.put(`/api/movies/${editingMovie.movieId}`, bodyToSend);
      } else {
        await apiCatalog.post("/api/movies", bodyToSend);
      }
      setIsModalOpen(false);
      setEditingMovie(null);
      fetchMovies();
      form.reset();
    } catch (err) {
      console.error("Error submitting movie:", err);
    }
  };

  const handleAddClick = () => {
    setEditingMovie(null);
    form.reset({
      title: "",
      originalTitle: "",
      releaseDate: "",
      durationMin: 0,
      synopsis: "",
      posterUrl: "",
      trailerUrl: "",
      ageRating: "",
      genres: [],
      versions: [{ language: "", format: "" }],
      private: false,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
  };

  // Delete movie
  const deleteMovie = async (id: string) => {
    try {
      await apiCatalog.delete(`/api/movies/${id}`);
      fetchMovies();
    } catch (err) {
      console.error("Error deleting movie:", err);
    }
  };

  // Pagination helpers
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
            <Button
              className="text-white bg-red-700 cursor-pointer shadow-md"
              variant="default"
              onClick={handleAddClick}
            >
              <Plus className="h-4 w-4" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 font-bold text-xl">{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmitMovie)} className="grid grid-cols-2 gap-6">
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white text-black mt-1"
                          {...field} />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* <FormField
                  control={form.control}
                  name="releaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input className="bg-white text-black mt-1" type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

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
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal bg-white text-black mt-1",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span className="text-gray-500">Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-black" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white text-black" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={date => {
                              field.onChange(date ? date.toISOString().split("T")[0] : "");
                              console.log("Selected date:", date?.toISOString().split("T")[0]);
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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
                        <Input
                          className="bg-white text-black mt-1"
                          {...field}
                          value={Array.isArray(field.value) ? field.value.join(", ") : field.value}
                          onChange={e => field.onChange(e.target.value.split(",").map(v => v.trim()))}
                          placeholder="Action, Drama"
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4 col-span-2">
                  <DialogClose asChild>
                    <Button
                      className="cursor-pointer"
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingMovie(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button className="bg-red-700 cursor-pointer hover:bg-red-800 px-6" type="submit">{editingMovie ? "Update" : "Save"}</Button>
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
            {currentMovies.map((movie) => (
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
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(movie)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteMovie(movie.movieId)}>
                    <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
