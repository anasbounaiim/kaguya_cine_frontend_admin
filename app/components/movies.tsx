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
const allMovies = [
    {
      movie_id: 950387,
      title: "A Minecraft Movie",
      original_title: "A Minecraft Movie",
      age_rating: "PG",
      duration_min: 120,
      release_date: "2025-03-31",
      synopsis: "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.",
      image: "https://image.tmdb.org/t/p/w500/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg",
    },
    {
      movie_id: 447273,
      title: "Snow White",
      original_title: "Snow White",
      age_rating: "PG",
      duration_min: 120,
      release_date: "2025-03-12",
      synopsis: "Following the benevolent King's disappearance, the Evil Queen dominated the once fair land with a cruel streak. Princess Snow White flees the castle when the Queen, in her jealousy over Snow White's inner beauty, tries to kill her. Deep into the dark woods, she stumbles upon seven magical dwarves and a young bandit named Jonathan. Together, they strive to survive the Queen's relentless pursuit and aspire to take back the kingdom.",
      image: "https://image.tmdb.org/t/p/w500/oLxWocqheC8XbXbxqJ3x422j9PW.jpg",
    },
    {
      movie_id: 574475,
      title: "Final Destination Bloodlines",
      original_title: "Final Destination Bloodlines",
      age_rating: "PG-13",
      duration_min: 120,
      release_date: "2025-05-09",
      synopsis: "Plagued by a violent recurring nightmare, college student Stefanie heads home to track down the one person who might be able to break the cycle and save her family from the grisly demise that inevitably awaits them all.",
      image: "https://image.tmdb.org/t/p/w500/6WxhEvFsauuACfv8HyoVX6mZKFj.jpg",
    },
    {
      movie_id: 1197306,
      title: "A Working Man",
      original_title: "A Working Man",
      age_rating: "R",
      duration_min: 110,
      release_date: "2025-03-26",
      synopsis: "Levon Cade left behind a decorated military career in the black ops to live a simple life working construction. But when his boss's daughter, who is like family to him, is taken by human traffickers, his search to bring her home uncovers a world of corruption far greater than he ever could have imagined.",
      image: "https://image.tmdb.org/t/p/w500/6FRFIogh3zFnVWn7Z6zcYnIbRcX.jpg",
    },
    {
      movie_id: 1241436,
      title: "Warfare",
      original_title: "Warfare",
      age_rating: "R",
      duration_min: 115,
      release_date: "2025-04-09",
      synopsis: "A platoon of Navy SEALs embarks on a dangerous mission in Ramadi, Iraq, with the chaos and brotherhood of war retold through their memories of the event.",
      image: "https://image.tmdb.org/t/p/w500/srj9rYrjefyWqkLc6l2xjTGeBGO.jpg",
    },
    {
      movie_id: 575265,
      title: "Mission: Impossible - The Final Reckoning",
      original_title: "Mission: Impossible - The Final Reckoning",
      age_rating: "PG-13",
      duration_min: 130,
      release_date: "2025-05-17",
      synopsis: "Ethan Hunt and the IMF team continue their search for the terrifying AI known as the Entity — which has infiltrated intelligence networks all over the globe — with the world's governments and a mysterious ghost from Ethan's past on their trail. Joined by new allies and armed with the means to shut the Entity down for good, Hunt is in a race against time to prevent the world as we know it from changing forever.",
      image: "https://image.tmdb.org/t/p/w500/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg",
    },
    {
      movie_id: 552524,
      title: "Lilo & Stitch",
      original_title: "Lilo & Stitch",
      age_rating: "PG",
      duration_min: 110,
      release_date: "2025-05-17",
      synopsis: "The wildly funny and touching story of a lonely Hawaiian girl and the fugitive alien who helps to mend her broken family.",
      image: "https://image.tmdb.org/t/p/w500/tUae3mefrDVTgm5mRzqWnZK6fOP.jpg",
    },
    {
      movie_id: 986056,
      title: "Thunderbolts*",
      original_title: "Thunderbolts*",
      age_rating: "PG-13",
      duration_min: 125,
      release_date: "2025-04-30",
      synopsis: "After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission that will force them to confront the darkest corners of their pasts.",
      image: "https://image.tmdb.org/t/p/w500/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg",
    },
    {
      movie_id: 822119,
      title: "Captain America: Brave New World",
      original_title: "Captain America: Brave New World",
      age_rating: "PG-13",
      duration_min: 130,
      release_date: "2025-02-12",
      synopsis: "After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident. He must discover the reason behind a nefarious global plot before the true mastermind has the entire world seeing red.",
      image: "https://image.tmdb.org/t/p/w500/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg",
    }
  ];


const MOVIES_PER_PAGE = 5;

const Movies = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState(allMovies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<number | null>(null);

  const indexOfLast = currentPage * MOVIES_PER_PAGE;
  const indexOfFirst = indexOfLast - MOVIES_PER_PAGE;
  const currentMovies = movies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const confirmDeleteMovie = () => {
    if (movieToDelete !== null) {
      setMovies((prev) => prev.filter((movie) => movie.movie_id !== movieToDelete));
      setMovieToDelete(null);
    }
  };

  const handleEdit = (id: number) => {
    alert(`Edit movie with ID ${id}`);
  };

  const handleAddMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newMovie = {
      movie_id: movies.length + 1,
      title: formData.get("title") as string,
      original_title: formData.get("original_title") as string,
      age_rating: formData.get("age_rating") as string,
      duration_min: Number(formData.get("duration_min")),
      release_date: formData.get("release_date") as string,
      synopsis: formData.get("synopsis") as string,
      image: formData.get("image") as string,
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
              <div>
                <Label htmlFor="title">Title</Label>
                <Input name="title" id="title" required />
              </div>
              <div>
                <Label htmlFor="original_title">Original Title</Label>
                <Input name="original_title" id="original_title" required />
              </div>
              <div>
                <Label htmlFor="age_rating">Age Rating</Label>
                <Input name="age_rating" id="age_rating" required />
              </div>
              <div>
                <Label htmlFor="duration_min">Duration (minutes)</Label>
                <Input type="number" name="duration_min" id="duration_min" required />
              </div>
              <div>
                <Label htmlFor="release_date">Release Date</Label>
                <Input type="date" name="release_date" id="release_date" required />
              </div>
              <div>
                <Label htmlFor="synopsis">Synopsis</Label>
                <Input name="synopsis" id="synopsis" required />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input name="image" id="image" required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
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
            {loading
              ? Array.from({ length: MOVIES_PER_PAGE }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell><div className="h-16 w-12 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-48 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-12 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-64 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  </TableRow>
                ))
              : currentMovies.map((movie) => (
                  <TableRow key={movie.movie_id}>
                    <TableCell>
                      <img src={movie.image} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                    </TableCell>
                    <TableCell>{movie.title}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${movie.age_rating === "PG" ? "bg-blue-100 text-blue-800" : movie.age_rating === "PG-13" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>
                        {movie.age_rating}
                      </span>
                    </TableCell>
                    <TableCell>{movie.duration_min} min</TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">
                      <span className="whitespace-normal break-words">{movie.synopsis}</span>
                    </TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(movie.movie_id)}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Dialog open={movieToDelete === movie.movie_id} onOpenChange={(open) => setMovieToDelete(open ? movie.movie_id : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">Are you sure you want to delete "{movie.title}"?</div>
                          <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button variant="destructive" onClick={confirmDeleteMovie}>Delete</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        {!loading && (
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="px-2 text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
