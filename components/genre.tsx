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
import toast from "react-hot-toast";

const Genres = () => {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<number | null>(null);
  const [editingGenre, setEditingGenre] = useState<{ id: number; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [nameGenre, setNameGenre] = useState("");

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
  }, []);

  const AddGenre = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiCatalog.post('/api/genres', { name: nameGenre });
      console.log("Genre added successfully", response);
      setNameGenre("");
      fetchGenres();
      setIsModalOpen(false);

      toast.success("Genre added successfully",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
    } catch (err) {
      console.error("Error adding genre", err);
      toast.error("Error adding genre",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
    }
  };

  const deleteGenre = async (id: number) => {
    try {
      await apiCatalog.delete(`/api/genres/${id}`);
      fetchGenres();
      toast.success("Genre deleted successfully",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
    } catch (err) {
      console.error("Error deleting genre", err);
      toast.error("Error deleting genre",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
    }
  };

  const updateGenre = async (id: number, name: string) => {
  try {
    await apiCatalog.put(`/api/genres/${id}`, { name });
    fetchGenres();
    setIsModalOpen(false);
    setEditingGenre(null);
    setNameGenre("");
    toast.success("Genre updated successfully",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
  } catch (err) {
    console.error("Error updating genre", err);
    toast.error("Error updating genre",{
        duration: 5000,
        style: {
          border: '1px solid #4ade80',
          background: '#ecfdf5',
          color: '#065f46',
        }
      })
  }
};

  const handleEdit = (genre: { id: number; name: string }) => {
    setEditingGenre(genre);
    setNameGenre(genre.name);
    setIsModalOpen(true);
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
            <Button className="text-white bg-red-700 cursor-pointer shadow-md" variant="default">
              <Plus className="h-4 w-4" />
                Add Genre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600 font-bold text-xl">{editingGenre ? "Edit Genre" : "Add New Genre"}</DialogTitle>
            </DialogHeader>
            <form 
             onSubmit={e => {
              if (editingGenre) {
                e.preventDefault();
                updateGenre(editingGenre.id, nameGenre);
              } else {
                AddGenre(e);
              }
             }}
             className="space-y-4">
              <div>
                <Label htmlFor="name">Genre Name</Label>
                <Input
                  name="name"
                  className="bg-white text-black mt-1"
                  id="name"
                  required
                  value={nameGenre}
                  onChange={e => setNameGenre(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button className="cursor-pointer" type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button className="bg-red-700 cursor-pointer hover:bg-red-800 px-6" type="submit">Save</Button>
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

      <div className="rounded-3xl border-0 border-b-2 border-red-700 p-4 md:p-8 bg-black">
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
                          <DialogTitle className="text-red-600 font-bold text-xl">Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">Are you sure you want to delete &quot;{genre.name}&quot;?</div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button className="cursor-pointer" variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              className="bg-red-700 cursor-pointer hover:bg-red-800 px-6"
                              variant="destructive"
                              onClick={() => {
                                deleteGenre(genre.id);
                                setGenreToDelete(null);
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
      </div>
    </div>
  );
};

export default Genres;
