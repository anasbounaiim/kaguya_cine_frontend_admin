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

const Genres = () => {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<number | null>(null);
  const [editingGenre, setEditingGenre] = useState<{ id: number; name: string } | null>(null);
  const [search, setSearch] = useState("");

  const fetchGenres = async () => {
    try {
      const response = await apiCatalog.get('/api/genres');
      setGenres(response);
      console.log("Genres fetched successfully", response);
    } catch (err: unknown) {
      console.error("Genres fetched error", err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddOrEditGenre = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;

    if (editingGenre) {
      setGenres((prev) =>
        prev.map((g) => (g.id === editingGenre.id ? { ...g, name } : g))
      );
    } else {
      const newGenre = {
        id: genres.length > 0 ? Math.max(...genres.map(g => g.id)) + 1 : 1,
        name,
      };
      setGenres((prev) => [...prev, newGenre]);
    }

    setIsModalOpen(false);
    setEditingGenre(null);
    form.reset();
  };

  const handleEdit = (genre: { id: number; name: string }) => {
    setEditingGenre(genre);
    setIsModalOpen(true);
  };

  const confirmDeleteGenre = () => {
    if (genreToDelete !== null) {
      setGenres((prev) => prev.filter((genre) => genre.id !== genreToDelete));
      setGenreToDelete(null);
    }
  };

  // FILTER GENRES BASED ON SEARCH
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Genres</h1>
        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) setEditingGenre(null); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {editingGenre ? "Edit Genre" : "Add Genre"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGenre ? "Edit Genre" : "Add New Genre"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOrEditGenre} className="space-y-4">
              <div>
                <Label htmlFor="name">Genre Name</Label>
                <Input
                  name="name"
                  id="name"
                  required
                  defaultValue={editingGenre ? editingGenre.name : ""}
                />
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

      {/* --- SEARCH BAR --- */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search genres…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 md:p-8 bg-white dark:bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                  <TableCell><div className="h-4 w-8 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-48 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell className="text-right"><div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                </TableRow>
              ))
            ) : filteredGenres.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-neutral-400">
                  No genres found.
                </TableCell>
              </TableRow>
            ) : (
              filteredGenres.map((genre) => (
                <TableRow key={genre.id}>
                  <TableCell>{genre.id}</TableCell>
                  <TableCell>{genre.name}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(genre)}>
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Dialog open={genreToDelete === genre.id} onOpenChange={(open) => setGenreToDelete(open ? genre.id : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">Are you sure you want to delete &quot;{genre.name}&quot;?</div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant="destructive" onClick={confirmDeleteGenre}>Delete</Button>
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
      </div>
    </div>
  );
};

export default Genres;
