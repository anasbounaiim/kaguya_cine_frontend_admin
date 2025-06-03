"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialCinemas = [
  {
    cinemaId: 1,
    name: "Boyle and Sons",
    city: "New Matthewburgh",
    address: "4729 Wood Stream Apt. 609",
    theaters: [],
  },
  {
    cinemaId: 2,
    name: "Adams-Gregory",
    city: "Greeneland",
    address: "884 Elizabeth Via",
    theaters: [
      {
        theaterId: 1,
        name: "Salle 1",
        capacity: 120,
        techFormat: "IMAX",
      },
      {
        theaterId: 2,
        name: "Salle 2",
        capacity: 95,
        techFormat: "Dolby",
      },
    ],
  },
];

export default function Cinema() {
  const [cinemas, setCinemas] = useState(initialCinemas);
  const [cinemaDialogOpen, setCinemaDialogOpen] = useState(false);
  const [salleDialogOpen, setSalleDialogOpen] = useState<number | null>(null);

  // For controlled inputs in dialogs
  const [newCinema, setNewCinema] = useState({ name: "", city: "", address: "" });
  const [newSalle, setNewSalle] = useState({ name: "", capacity: "", techFormat: "" });

  // --- NEW: Search state ---
  const [search, setSearch] = useState("");

  // Add cinema
  function handleAddCinema(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCinemas((prev) => [
      ...prev,
      {
        cinemaId: prev.length + 1,
        ...newCinema,
        theaters: [],
      },
    ]);
    setNewCinema({ name: "", city: "", address: "" });
    setCinemaDialogOpen(false);
  }

  // Add salle
  function handleAddSalle(e: React.FormEvent<HTMLFormElement>, cinemaId: number) {
    e.preventDefault();
    setCinemas((prev) =>
      prev.map((cinema) =>
        cinema.cinemaId === cinemaId
          ? {
              ...cinema,
              theaters: [
                ...cinema.theaters,
                {
                  theaterId: cinema.theaters.length + 1,
                  ...newSalle,
                  capacity: Number(newSalle.capacity),
                },
              ],
            }
          : cinema
      )
    );
    setNewSalle({ name: "", capacity: "", techFormat: "" });
    setSalleDialogOpen(null);
  }

  // --- NEW: Filter cinemas by search ---
  const filteredCinemas = cinemas.filter((cinema) => {
    const query = search.toLowerCase();
    return (
      cinema.name.toLowerCase().includes(query) ||
      cinema.city.toLowerCase().includes(query) ||
      cinema.address.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cinémas</h1>
        <Dialog open={cinemaDialogOpen} onOpenChange={setCinemaDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
              + Add Cinema
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Cinema</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddCinema}>
              <div>
                <Label htmlFor="cinemaName">Name</Label>
                <Input id="cinemaName" value={newCinema.name} onChange={(e) => setNewCinema((nc) => ({ ...nc, name: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="cinemaCity">City</Label>
                <Input id="cinemaCity" value={newCinema.city} onChange={(e) => setNewCinema((nc) => ({ ...nc, city: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="cinemaAddress">Address</Label>
                <Input id="cinemaAddress" value={newCinema.address} onChange={(e) => setNewCinema((nc) => ({ ...nc, address: e.target.value }))} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- NEW: Search input --- */}
      <div>
        <Input
          placeholder="Search cinemas by name, city, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-400 mb-2"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {filteredCinemas.length === 0 ? (
          <div className="col-span-2 text-center text-neutral-400 py-8">
            No cinemas match your search.
          </div>
        ) : (
          filteredCinemas.map((cinema) => (
            <Card key={cinema.cinemaId} className="rounded-2xl shadow-xl border border-neutral-700 bg-neutral-900 text-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{cinema.name}</h2>
                    <div className="text-sm text-neutral-400">{cinema.city}</div>
                    <div className="text-xs text-neutral-500">{cinema.address}</div>
                  </div>
                  <Dialog open={salleDialogOpen === cinema.cinemaId} onOpenChange={(v) => setSalleDialogOpen(v ? cinema.cinemaId : null)}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-700 text-white rounded-xl">+ Add Salle</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Salle</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4" onSubmit={(e) => handleAddSalle(e, cinema.cinemaId)}>
                        <div>
                          <Label htmlFor="salleName">Name</Label>
                          <Input id="salleName" value={newSalle.name} onChange={(e) => setNewSalle((ns) => ({ ...ns, name: e.target.value }))} required />
                        </div>
                        <div>
                          <Label htmlFor="salleCapacity">Capacity</Label>
                          <Input id="salleCapacity" type="number" value={newSalle.capacity} onChange={(e) => setNewSalle((ns) => ({ ...ns, capacity: e.target.value }))} required />
                        </div>
                        <div>
                          <Label htmlFor="salleFormat">Tech Format</Label>
                          <Input id="salleFormat" value={newSalle.techFormat} onChange={(e) => setNewSalle((ns) => ({ ...ns, techFormat: e.target.value }))} required />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit">Save</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <Table>
                  <TableCaption className="text-neutral-500">Salles for this cinema</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Format</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cinema.theaters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-neutral-400">
                          No salles yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      cinema.theaters.map((theater, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{theater.name}</TableCell>
                          <TableCell>{theater.capacity}</TableCell>
                          <TableCell>{theater.techFormat}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}




      </div>
    </div>
  );
}
