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
import { Button } from "@/components/ui/button";

const cinemas = [
  {
    cinemaId: 1,
    name: "Boyle and Sons",
    city: "New Matthewburgh",
    address: "4729 Wood Stream Apt. 609",
  },
  {
    cinemaId: 2,
    name: "Adams-Gregory",
    city: "Greeneland",
    address: "884 Elizabeth Via",
    theaters: [
      {
        theaterId: 2,
        name: "Salle 2",
        capacity: 95,
        techFormat: "Dolby",
        seats: [
          {
            seatId: 2,
            rowLabel: "B",
            seatNumber: 4,
            seatType: "STD",
          },
        ],
      },
    ],
  },
];

const Cinema = () => {
  const [selectedCinema, setSelectedCinema] = useState<
    | null
    | {
        cinemaId: number;
        name: string;
        city: string;
        address: string;
        theaters?: {
          theaterId: number;
          name: string;
          capacity: number;
          techFormat: string;
          seats: {
            seatId: number;
            rowLabel: string;
            seatNumber: number;
            seatType: string;
          }[];
        }[];
      }
  >(null);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cinémas</h1>

      {!selectedCinema ? (
        <Table>
          <TableCaption>List of cinemas</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cinemas.map((cinema) => (
              <TableRow key={cinema.cinemaId}>
                <TableCell>{cinema.name}</TableCell>
                <TableCell>{cinema.city}</TableCell>
                <TableCell>{cinema.address}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => setSelectedCinema(cinema)}
                  >
                    Show Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{selectedCinema.name} Details</h2>
          <p><strong>City:</strong> {selectedCinema.city}</p>
          <p><strong>Address:</strong> {selectedCinema.address}</p>
          {selectedCinema.theaters && (
            <>
              <h3 className="text-xl font-medium mt-4">Theaters</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Tech Format</TableHead>
                    <TableHead>Seats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCinema.theaters.map((theater) => (
                    <TableRow key={theater.theaterId}>
                      <TableCell>{theater.name}</TableCell>
                      <TableCell>{theater.capacity}</TableCell>
                      <TableCell>{theater.techFormat}</TableCell>
                      <TableCell>
                        {theater.seats.map((seat) => (
                          <div key={seat.seatId}>
                            {seat.rowLabel}{seat.seatNumber} - {seat.seatType}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
          <Button variant="outline" onClick={() => setSelectedCinema(null)}>
            Back to Cinemas
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cinema;
