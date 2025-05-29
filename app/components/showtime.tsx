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
import { Trash2, Plus } from "lucide-react";
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
  {
    showtimeId: 1,
    versionId: 1,
    theaterId: 5,
    startTime: "2025-06-15T17:30:00Z",
    basePrice: 12.5,
    ticketsSold: 0,
    private: true,
    theater: {
      name: "Salle 1",
      capacity: 120,
      techFormat: "IMAX"
    }
  },
  {
    showtimeId: 2,
    versionId: 2,
    theaterId: 3,
    startTime: "2025-06-15T18:30:00Z",
    basePrice: 10.5,
    ticketsSold: 0,
    private: true,
    theater: {
      name: "Salle 2",
      capacity: 95,
      techFormat: "Dolby"
    }
  },
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
      showtimeId: showtimes.length + 1,
      versionId: Number(formData.get("versionId")),
      theaterId: Number(formData.get("theaterId")),
      startTime: formData.get("startTime") as string,
      basePrice: parseFloat(formData.get("basePrice") as string),
      ticketsSold: 0,
      private: formData.get("private") === "on",
      theater: {
        name: "Salle X",
        capacity: 100,
        techFormat: "Standard"
      }
    };
    setShowtimes((prev) => [...prev, newShowtime]);
    setIsModalOpen(false);
    form.reset();
  };

  const confirmDeleteShowtime = () => {
    if (showtimeToDelete !== null) {
      setShowtimes((prev) => prev.filter((st) => st.showtimeId !== showtimeToDelete));
      setShowtimeToDelete(null);
    }
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
                <Label htmlFor="versionId">Version ID</Label>
                <Input name="versionId" id="versionId" type="number" required />
              </div>
              <div>
                <Label htmlFor="theaterId">Theater ID</Label>
                <Input name="theaterId" id="theaterId" type="number" required />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input name="startTime" id="startTime" type="datetime-local" required />
              </div>
              <div>
                <Label htmlFor="basePrice">Base Price</Label>
                <Input name="basePrice" id="basePrice" type="number" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="private">Private</Label>
                <Input type="checkbox" name="private" id="private" />
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
              <TableHead>Version</TableHead>
              <TableHead>Theater</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Tickets Sold</TableHead>
              <TableHead>Private</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    {Array(9).fill(null).map((_, i) => (
                      <TableCell key={i}><div className="h-4 w-full bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                    ))}
                    <TableCell className="text-right"><div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  </TableRow>
                ))
              : showtimes.map((st) => (
                  <TableRow key={st.showtimeId}>
                    <TableCell>{st.showtimeId}</TableCell>
                    <TableCell>{st.versionId}</TableCell>
                    <TableCell>{st.theater.name}</TableCell>
                    <TableCell>{st.theater.techFormat}</TableCell>
                    <TableCell>{st.theater.capacity}</TableCell>
                    <TableCell>{new Date(st.startTime).toLocaleString()}</TableCell>
                    <TableCell>${st.basePrice.toFixed(2)}</TableCell>
                    <TableCell>{st.ticketsSold}</TableCell>
                    <TableCell>{st.private ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Dialog open={showtimeToDelete === st.showtimeId} onOpenChange={(open) => setShowtimeToDelete(open ? st.showtimeId : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">Are you sure you want to delete this showtime?</div>
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
