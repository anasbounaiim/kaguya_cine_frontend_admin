"use client";

import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiVenue from "@/utils/venueApiFetch";
import toast from "react-hot-toast";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { TheaterSeatsPlanEditable } from "./Seats/TheaterSeatsPlan";

// --- Types ---
interface Seat {
  seatId: number;
  rowLabel: string;
  seatNumber: number;
  seatType: string;
}
interface Theater {
  theaterId: number;
  name: string;
  capacity: number;
  techFormat: string;
  seats?: Seat[];
}
interface Cinema {
  cinemaId: number;
  name: string;
  city: string;
  address: string;
}
interface CinemaDetails extends Cinema {
  theaters: Theater[];
}

const CinemaPage = () => {
  // State
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null);
  const [cinemaToDelete, setCinemaToDelete] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [cinemaForm, setCinemaForm] = useState({ name: "", city: "", address: "" });

  // --- Sheet Détail & salle courante ---
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [cinemaDetails, setCinemaDetails] = useState<CinemaDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch list
  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const response = await apiVenue.get("/api/cinemas");
      setCinemas(response);
    } catch {
      setCinemas([]);
      toast.error("Erreur lors du chargement des cinémas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  // Fetch details on demand
  const fetchCinemaDetails = async (cinemaId: number) => {
    setLoadingDetails(true);
    try {
      const details = await apiVenue.get(`/api/cinemas/${cinemaId}`);
      setCinemaDetails(details);
    } catch {
      setCinemaDetails(null);
      toast.error("Erreur lors du chargement du détail");
    }
    setLoadingDetails(false);
  };

  // --- Filtrage search ---
  const filteredCinemas = cinemas.filter((cinema) => {
    const q = search.toLowerCase();
    return (
      cinema.name.toLowerCase().includes(q) ||
      cinema.city.toLowerCase().includes(q) ||
      cinema.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* --- Header & bouton --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cinémas</h1>
        <Dialog open={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); if (!open) setEditingCinema(null); }}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
              + Add Cinema
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCinema ? "Edit Cinema" : "Add New Cinema"}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                // TODO: Ajoute ici le POST ou PUT via apiVenue
                setIsModalOpen(false);
                toast.success(editingCinema ? "Cinéma modifié (fictif)" : "Cinéma ajouté (fictif)");
                fetchCinemas();
                setCinemaForm({ name: "", city: "", address: "" });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="cinemaName">Name</Label>
                <Input id="cinemaName" value={cinemaForm.name} onChange={e => setCinemaForm(cf => ({ ...cf, name: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="cinemaCity">City</Label>
                <Input id="cinemaCity" value={cinemaForm.city} onChange={e => setCinemaForm(cf => ({ ...cf, city: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="cinemaAddress">Address</Label>
                <Input id="cinemaAddress" value={cinemaForm.address} onChange={e => setCinemaForm(cf => ({ ...cf, address: e.target.value }))} required />
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

      {/* --- Search --- */}
      <div>
        <Input
          placeholder="Search cinemas by name, city, or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-400 mb-2"
        />
      </div>

      {/* --- Table --- */}
      <div className="rounded-3xl border-0 border-b-2 border-red-700 p-4 md:p-8 bg-black">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                  <TableCell><div className="h-4 w-8 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-48 bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                  <TableCell className="text-right"><div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-neutral-700 rounded" /></TableCell>
                </TableRow>
              ))
            ) : filteredCinemas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-neutral-400">
                  Aucun cinéma trouvé.
                </TableCell>
              </TableRow>
            ) : (
              filteredCinemas.map((cinema) => (
                <TableRow key={cinema.cinemaId}>
                  <TableCell>{cinema.cinemaId}</TableCell>
                  <TableCell>{cinema.name}</TableCell>
                  <TableCell>{cinema.city}</TableCell>
                  <TableCell>{cinema.address}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {/* --- Edit --- */}
                    <Button size="sm" variant="ghost" 
                    // onClick={() => handleEdit(cinema)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    {/* --- Delete --- */}
                    <Dialog open={cinemaToDelete === cinema.cinemaId} onOpenChange={(open) => setCinemaToDelete(open ? cinema.cinemaId : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="text-red-600 font-bold text-xl">Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">Delete &quot;{cinema.name}&quot;?</div>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              className="bg-red-700 hover:bg-red-800 px-6"
                              variant="destructive"
                            //   onClick={() => handleDelete(cinema.cinemaId)}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {/* --- Details avec Sheet --- */}
                    <Sheet open={detailSheetOpen && cinemaDetails?.cinemaId === cinema.cinemaId} onOpenChange={(open) => {
                      setDetailSheetOpen(open);
                      if (!open) setCinemaDetails(null);
                    }}>
                      <SheetTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            setDetailSheetOpen(true);
                            await fetchCinemaDetails(cinema.cinemaId);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1 text-green-500" /> Details
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="md:max-w-xl w-full px-8 bg-neutral-900 border-l-4 border-red-950 overflow-y-auto">
                        <SheetHeader className="px-0 py-4">
                          <SheetTitle>
                            <div className="text-red-600 font-bold text-2xl">{cinemaDetails?.name}</div>
                            <div className="text-sm text-neutral-400">{cinemaDetails?.city}, {cinemaDetails?.address}</div>
                          </SheetTitle>
                        </SheetHeader>
                        {loadingDetails ? (
                          <div className="p-8 text-center">Chargement…</div>
                        ) : cinemaDetails ? (
                          <div>
                            {cinemaDetails.theaters?.length ? (
                              cinemaDetails.theaters.map((theater, idx) => (
                                <div key={idx} className="mb-6 rounded-3xl p-4 bg-black">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-semibold text-lg mb-2">{theater.name} ({theater.techFormat}) - {theater.capacity} places</div>
                                    </div>
                                  </div>
                                  
                                  <TheaterSeatsPlanEditable
                                    seats={theater.seats ?? []}
                                    readOnly
                                    theaterFormat={theater.techFormat}
                                  />

                                </div>
                              ))
                            ) : (
                              <div>Aucune salle</div>
                            )}
                          </div>
                        ) : (
                          <div>Erreur de chargement ou pas de détails.</div>
                        )}
                      </SheetContent>
                    </Sheet>
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

export default CinemaPage;
