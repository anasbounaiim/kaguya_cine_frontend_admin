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
import { Button } from "../components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const MOVIES_PER_PAGE = 5;

const allMovies = [
  {
    movieId: 1,
    title: "Final Destination",
    originalTitle: "Final Destination Bloodlines",
    releaseDate: "2025-01-01",
    durationMin: 120,
    synopsis: "A chilling tale of fate and survival.",
    posterUrl: "http://example.com/poster1.jpg",
    trailerUrl: "http://example.com/trailer1",
    ageRating: "PG-13",
    versions: [{ language: "EN", format: "IMAX" }],
    genres: ["Action"],
    private: true,
  },
  {
    movieId: 2,
    title: "Snowfall",
    originalTitle: "Snowfall",
    releaseDate: "2025-02-15",
    durationMin: 115,
    synopsis: "An emotional winter journey of discovery.",
    posterUrl: "http://example.com/poster2.jpg",
    trailerUrl: "http://example.com/trailer2",
    ageRating: "PG",
    versions: [{ language: "FR", format: "2D" }],
    genres: ["Drama"],
    private: false,
  },
  {
    movieId: 3,
    title: "Galactic War",
    originalTitle: "Galactic War",
    releaseDate: "2025-03-10",
    durationMin: 130,
    synopsis: "Epic space battles for universal peace.",
    posterUrl: "http://example.com/poster3.jpg",
    trailerUrl: "http://example.com/trailer3",
    ageRating: "PG-13",
    versions: [{ language: "EN", format: "3D" }],
    genres: ["Sci-Fi", "Action"],
    private: false,
  },
  {
    movieId: 4,
    title: "The Hidden Truth",
    originalTitle: "The Hidden Truth",
    releaseDate: "2025-04-05",
    durationMin: 110,
    synopsis: "A journalist uncovers a political conspiracy.",
    posterUrl: "http://example.com/poster4.jpg",
    trailerUrl: "http://example.com/trailer4",
    ageRating: "R",
    versions: [{ language: "EN", format: "2D" }],
    genres: ["Thriller"],
    private: true,
  },
  {
    movieId: 5,
    title: "Love Beyond",
    originalTitle: "Love Beyond Time",
    releaseDate: "2025-05-20",
    durationMin: 105,
    synopsis: "Two souls connected across centuries.",
    posterUrl: "http://example.com/poster5.jpg",
    trailerUrl: "http://example.com/trailer5",
    ageRating: "PG",
    versions: [{ language: "EN", format: "2D" }],
    genres: ["Romance", "Fantasy"],
    private: false,
  },
  {
    movieId: 6,
    title: "Cyber Strike",
    originalTitle: "Cyber Strike",
    releaseDate: "2025-06-01",
    durationMin: 122,
    synopsis: "Hackers battle for control of the digital world.",
    posterUrl: "http://example.com/poster6.jpg",
    trailerUrl: "http://example.com/trailer6",
    ageRating: "PG-13",
    versions: [{ language: "EN", format: "4DX" }],
    genres: ["Action", "Tech"],
    private: true,
  },
  {
    movieId: 7,
    title: "The Silent Hills",
    originalTitle: "The Silent Hills",
    releaseDate: "2025-07-07",
    durationMin: 98,
    synopsis: "A haunted village shrouded in fog.",
    posterUrl: "http://example.com/poster7.jpg",
    trailerUrl: "http://example.com/trailer7",
    ageRating: "R",
    versions: [{ language: "EN", format: "2D" }],
    genres: ["Horror"],
    private: true,
  },
  {
    movieId: 8,
    title: "The Artisan",
    originalTitle: "The Artisan's Touch",
    releaseDate: "2025-08-15",
    durationMin: 112,
    synopsis: "A sculptor battles self-doubt and finds love.",
    posterUrl: "http://example.com/poster8.jpg",
    trailerUrl: "http://example.com/trailer8",
    ageRating: "PG",
    versions: [{ language: "EN", format: "2D" }],
    genres: ["Drama", "Romance"],
    private: false,
  },
  {
    movieId: 9,
    title: "Savage Earth",
    originalTitle: "Savage Earth",
    releaseDate: "2025-09-12",
    durationMin: 140,
    synopsis: "A survival story in a world undone by nature.",
    posterUrl: "http://example.com/poster9.jpg",
    trailerUrl: "http://example.com/trailer9",
    ageRating: "PG-13",
    versions: [{ language: "EN", format: "IMAX" }],
    genres: ["Adventure"],
    private: false,
  },
  {
    movieId: 10,
    title: "Midnight Code",
    originalTitle: "Midnight Code",
    releaseDate: "2025-10-20",
    durationMin: 108,
    synopsis: "An underground coder takes down a megacorp.",
    posterUrl: "http://example.com/poster10.jpg",
    trailerUrl: "http://example.com/trailer10",
    ageRating: "R",
    versions: [{ language: "EN", format: "2D" }],
    genres: ["Thriller", "Tech"],
    private: true,
  },
  {
    movieId: 11,
    title: "Echoes",
    originalTitle: "Echoes of the Past",
    releaseDate: "2025-11-05",
    durationMin: 100,
    synopsis: "Revisiting memories reveals dark family secrets.",
    posterUrl: "http://example.com/poster11.jpg",
    trailerUrl: "http://example.com/trailer11",
    ageRating: "PG",
    versions: [{ language: "EN", format: "2D" }],
    genres: ["Drama"],
    private: false,
  },
  {
    movieId: 12,
    title: "Quantum Rift",
    originalTitle: "Quantum Rift",
    releaseDate: "2025-12-12",
    durationMin: 125,
    synopsis: "Scientists race to prevent reality from collapsing.",
    posterUrl: "http://example.com/poster12.jpg",
    trailerUrl: "http://example.com/trailer12",
    ageRating: "PG-13",
    versions: [{ language: "EN", format: "3D" }],
    genres: ["Sci-Fi"],
    private: true,
  },
  {
    movieId: 13,
    title: "The Orchestra",
    originalTitle: "The Orchestra",
    releaseDate: "2025-12-25",
    durationMin: 90,
    synopsis: "A conductor unites a broken ensemble for one last performance.",
    posterUrl: "http://example.com/poster13.jpg",
    trailerUrl: "http://example.com/trailer13",
    ageRating: "PG",
    versions: [{ language: "EN", format: "2D" }],
    genres: ["Drama", "Music"],
    private: false,
  },
  {
    movieId: 14,
    title: "Infinite Loop",
    originalTitle: "Infinite Loop",
    releaseDate: "2026-01-10",
    durationMin: 118,
    synopsis: "A developer trapped in repeating time loops.",
    posterUrl: "http://example.com/poster14.jpg",
    trailerUrl: "http://example.com/trailer14",
    ageRating: "PG-13",
    versions: [{ language: "EN", format: "4DX" }],
    genres: ["Sci-Fi", "Thriller"],
    private: true,
  },
  {
    movieId: 15,
    title: "Legends Reborn",
    originalTitle: "Legends Reborn",
    releaseDate: "2026-02-20",
    durationMin: 135,
    synopsis: "Ancient heroes return to protect the modern world.",
    posterUrl: "http://example.com/poster15.jpg",
    trailerUrl: "http://example.com/trailer15",
    ageRating: "PG-13",
    versions: [{ language: "EN", format: "IMAX" }],
    genres: ["Fantasy", "Action"],
    private: false,
  }
];


const Movies = () => {
  const [movies, setMovies] = useState(allMovies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const indexOfLast = currentPage * MOVIES_PER_PAGE;
  const indexOfFirst = indexOfLast - MOVIES_PER_PAGE;
  const currentMovies = movies.slice(indexOfFirst, indexOfLast);

  const handleAddMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newMovie = {
      movieId: movies.length + 1,
      title: formData.get("title") as string,
      originalTitle: formData.get("originalTitle") as string,
      releaseDate: formData.get("releaseDate") as string,
      durationMin: Number(formData.get("durationMin")),
      synopsis: formData.get("synopsis") as string,
      posterUrl: formData.get("posterUrl") as string,
      trailerUrl: formData.get("trailerUrl") as string,
      ageRating: formData.get("ageRating") as string,
      versions: [
        {
          language: formData.get("language") as string,
          format: formData.get("format") as string,
        },
      ],
      genres: [formData.get("genre") as string],
      private: formData.get("private") === "on",
    };
    setMovies((prev) => [...prev, newMovie]);
    setIsModalOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMovie} className="space-y-4">
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

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 md:p-8 bg-white dark:bg-neutral-900">
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
                <TableCell><img src={movie.posterUrl} alt={movie.title} className="w-12 h-16 object-cover rounded" /></TableCell>
                <TableCell>{movie.title}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${movie.ageRating === "PG" ? "bg-blue-100 text-blue-800" : movie.ageRating === "PG-13" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
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
