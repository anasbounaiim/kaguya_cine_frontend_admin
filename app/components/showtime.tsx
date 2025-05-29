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

const initialShowtimes = [
  { id: 1, movie: "Minecraft", date: "2025-06-01", time: "18:00" },
  { id: 2, movie: "Snow White", date: "2025-06-01", time: "20:00" },
];

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState(initialShowtimes);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddShowtime = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newShowtime = {
      id: showtimes.length + 1,
      movie: formData.get("movie") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
    };
    setShowtimes((prev) => [...prev, newShowtime]);
    setIsModalOpen(false);
    form.reset();
  };

  const confirmDeleteShowtime = () => {
    if (showtimeToDelete !== null) {
      setShowtimes((prev) => prev.filter((st) => st.id !== showtimeToDelete));
      setShowtimeToDelete(null);
    }
  };

  const handleEdit = (id: number) => {
    alert(`Edit showtime with ID ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Showtimes</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Showtime
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Showtime</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddShowtime} className="space-y-4">
              <div>
                <Label htmlFor="movie">Movie</Label>
                <Input name="movie" id="movie" required />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input type="date" name="date" id="date" required />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input type="time" name="time" id="time" required />
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
          <TableCaption className="text-neutral-500">List of showtimes in the system.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Movie</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell><div className="h-4 w-8 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell><div className="h-4 w-20 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  </TableRow>
                ))
              : showtimes.map((st) => (
                  <TableRow key={st.id}>
                    <TableCell>{st.id}</TableCell>
                    <TableCell>{st.movie}</TableCell>
                    <TableCell>{st.date}</TableCell>
                    <TableCell>{st.time}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(st.id)}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Dialog open={showtimeToDelete === st.id} onOpenChange={(open) => setShowtimeToDelete(open ? st.id : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">Are you sure you want to delete the showtime for "{st.movie}"?</div>
                          <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button variant="destructive" onClick={confirmDeleteShowtime}>Delete</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Showtimes;
