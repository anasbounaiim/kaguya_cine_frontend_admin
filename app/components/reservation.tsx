"use client";

import React, { useState } from "react";
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

const initialReservations = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    seats: 2,
    showtime: "2025-06-01 18:00",
    status: "Confirmed",
    price: 100,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    seats: 1,
    showtime: "2025-06-01 20:00",
    status: "Pending",
    price: 50,
  },
];

export default function Reservations() {
  const [reservations, setReservations] = useState(initialReservations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(null);

  const handleAddReservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const seats = Number(formData.get("seats"));
    const pricePerSeat = 50;
    const newReservation = {
      id: reservations.length + 1,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      seats: seats,
      showtime: formData.get("showtime") as string,
      status: "Pending",
      price: seats * pricePerSeat,
    };
    setReservations((prev) => [...prev, newReservation]);
    setIsModalOpen(false);
    form.reset();
  };

  const confirmDeleteReservation = () => {
    if (reservationToDelete !== null) {
      setReservations((prev) => prev.filter((r) => r.id !== reservationToDelete));
      setReservationToDelete(null);
    }
  };

  const handleEdit = (id: number) => {
    alert(`Edit reservation with ID ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reservations</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reservation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Reservation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddReservation} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input name="name" id="name" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input name="email" id="email" required />
              </div>
              <div>
                <Label htmlFor="seats">Seats</Label>
                <Input type="number" name="seats" id="seats" required />
              </div>
              <div>
                <Label htmlFor="showtime">Showtime</Label>
                <Input type="datetime-local" name="showtime" id="showtime" required />
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
          <TableCaption className="text-neutral-500">List of reservations.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Showtime</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.id}</TableCell>
                <TableCell>{reservation.name}</TableCell>
                <TableCell>{reservation.email}</TableCell>
                <TableCell>{reservation.seats}</TableCell>
                <TableCell>{reservation.showtime}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${reservation.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {reservation.status}
                  </span>
                </TableCell>
                <TableCell>{reservation.price} MAD</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(reservation.id)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Dialog open={reservationToDelete === reservation.id} onOpenChange={(open) => setReservationToDelete(open ? reservation.id : null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">Are you sure you want to delete the reservation for "{reservation.name}"?</div>
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="destructive" onClick={confirmDeleteReservation}>Delete</Button>
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
}
