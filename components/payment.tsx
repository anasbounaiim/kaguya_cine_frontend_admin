"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus } from "lucide-react";

// Mock payments data
const initialPayments = [
  {
    id: 1,
    reservationId: 101,
    provider: "STRIPE",
    amount: 100,
    currency: "MAD",
    status: "Success",
    date: "2025-06-01 19:00",
  },
  {
    id: 2,
    reservationId: 102,
    provider: "PAYPAL",
    amount: 50,
    currency: "MAD",
    status: "Refunded",
    date: "2025-06-02 20:00",
  },
];

const statusColors: Record<string, string> = {
  Success: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Failed: "bg-red-100 text-red-800",
  Refunded: "bg-blue-100 text-blue-800",
};

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    reservationId: "",
    provider: "",
    amount: "",
    currency: "MAD",
    status: "Success",
    date: "",
  });
  const [search, setSearch] = useState(""); // NEW

  // Add payment
  function handleAddPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPayments((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newPayment,
        reservationId: Number(newPayment.reservationId),
        amount: Number(newPayment.amount),
      },
    ]);
    setNewPayment({
      reservationId: "",
      provider: "",
      amount: "",
      currency: "MAD",
      status: "Success",
      date: "",
    });
    setIsModalOpen(false);
  }

  // Delete payment
  function handleDelete(id: number) {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }

  // FILTER LOGIC
  const filteredPayments = payments.filter((p) => {
    const s = search.toLowerCase();
    return (
      p.id.toString().includes(s) ||
      p.reservationId.toString().includes(s) ||
      p.provider.toLowerCase().includes(s) ||
      p.status.toLowerCase().includes(s) ||
      (p.amount + " " + p.currency).toLowerCase().includes(s) ||
      (p.date && new Date(p.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }).toLowerCase().includes(s))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Paiements</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter Paiement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Paiement</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAddPayment}>
              <div>
                <Label htmlFor="reservationId">ID Réservation</Label>
                <Input
                  id="reservationId"
                  type="number"
                  value={newPayment.reservationId}
                  onChange={(e) => setNewPayment((p) => ({ ...p, reservationId: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="provider">Fournisseur</Label>
                <Input
                  id="provider"
                  value={newPayment.provider}
                  onChange={(e) => setNewPayment((p) => ({ ...p, provider: e.target.value }))}
                  placeholder="STRIPE, PAYPAL, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Montant</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment((p) => ({ ...p, amount: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment((p) => ({ ...p, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  className="w-full p-2 rounded border dark:bg-neutral-900 dark:text-white"
                  value={newPayment.status}
                  onChange={(e) => setNewPayment((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="Success">Succès</option>
                  <option value="Pending">En attente</option>
                  <option value="Failed">Échoué</option>
                  <option value="Refunded">Remboursé</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit">Enregistrer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH INPUT */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Recherche paiement… (par ID, fournisseur, statut, date, montant)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72"
        />
      </div>

      <Card className="rounded-2xl shadow-xl border border-neutral-700 bg-neutral-900 text-white">
        <CardContent className="p-6 space-y-4">
          <Table>
            <TableCaption className="text-neutral-500">Liste des paiements enregistrés.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Réservation</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-neutral-400">
                    Aucun paiement.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.reservationId}</TableCell>
                    <TableCell>{p.provider}</TableCell>
                    <TableCell>
                      {p.amount} {p.currency}
                    </TableCell>
                    <TableCell>
                      {p.date
                        ? new Date(p.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${statusColors[p.status] || "bg-gray-100 text-gray-800"}`}>
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1 text-red-600" />
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
