"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import apiCatalog from "@/utils/catalogApiFetch";
import Image from "next/image";

const MOVIES_PER_PAGE = 5;

const Movies = () => {
  interface Movie {
    movieId: string;
    title: string;
    originalTitle: string;
    releaseDate: string;
    durationMin: number;
    synopsis: string;
    posterUrl: string;
    trailerUrl: string;
    ageRating: string;
    genres: string[];
    versions: { language: string; format: string }[];
    private: boolean;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchMovies = React.useCallback(async () => {
    try {
      const res = await apiCatalog.get(`/api/movies?search=${search}&page=${currentPage}&size=${MOVIES_PER_PAGE}`);
      console.log("Raw API response:", res);
      setMovies(res.content);
    } catch (err) {
      console.error("❌ Failed to load or parse movies:", err);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleAddMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newMovie = {
      title: formData.get("title"),
      originalTitle: formData.get("originalTitle"),
      releaseDate: formData.get("releaseDate"),
      durationMin: Number(formData.get("durationMin")),
      synopsis: formData.get("synopsis"),
      posterUrl: formData.get("posterUrl"),
      trailerUrl: formData.get("trailerUrl"),
      ageRating: formData.get("ageRating"),
      versions: [
        {
          language: formData.get("language"),
          format: formData.get("format"),
        },
      ],
      genres: [formData.get("genre")],
      private: formData.get("private") === "on",
    };

    await fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMovie),
    });

    setIsModalOpen(false);
    form.reset();
    fetchMovies();
  };

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const indexOfLast = currentPage * MOVIES_PER_PAGE;
  const indexOfFirst = indexOfLast - MOVIES_PER_PAGE;
  const currentMovies = movies.slice(indexOfFirst, indexOfLast);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="text-white bg-red-700 cursor-pointer shadow-md" variant="default">
              <Plus className="h-4 w-4" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMovie} className="grid grid-cols-2 gap-6">
              <div><Label htmlFor="title">Title</Label><Input name="title" id="title" required /></div>
              <div><Label htmlFor="originalTitle">Original Title</Label><Input name="originalTitle" id="originalTitle" required /></div>
              <div><Label htmlFor="releaseDate">Release Date</Label><Input type="date" name="releaseDate" id="releaseDate" required /></div>
              <div><Label htmlFor="durationMin">Duration (min)</Label><Input type="number" name="durationMin" id="durationMin" required /></div>
              <div><Label htmlFor="synopsis">Synopsis</Label><Input name="synopsis" id="synopsis" required /></div>
              <div><Label htmlFor="posterUrl">Poster URL</Label><Input name="posterUrl" id="posterUrl" required /></div>
              <div><Label htmlFor="trailerUrl">Trailer URL</Label><Input name="trailerUrl" id="trailerUrl" required /></div>
              <div><Label htmlFor="ageRating">Age Rating</Label><Input name="ageRating" id="ageRating" required /></div>
              <div><Label htmlFor="language">Version Language</Label><Input name="language" id="language" required /></div>
              <div><Label htmlFor="format">Version Format</Label><Input name="format" id="format" required /></div>
              <div><Label htmlFor="genre">Genre</Label><Input name="genre" id="genre" required /></div>
              <div><Label htmlFor="private">Private</Label><Input type="checkbox" name="private" id="private" /></div>
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit">Save</Button>
              </div>
            </form>
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
          <TableCaption className="text-neutral-500">List of movies in the system.</TableCaption>
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
                  <Button size="sm" variant="ghost">
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost">
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
