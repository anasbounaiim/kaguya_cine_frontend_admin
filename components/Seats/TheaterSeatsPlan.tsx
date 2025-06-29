"use client";
import React from "react";

type Seat = {
  seatId: number;
  rowLabel: string;
  seatNumber: number;
  seatType: string;
};

type Props = {
  seats: Seat[];
  readOnly?: boolean;
  theaterFormat?: string;
};

const seatTypeStyle = (type: string) => {
  switch (type) {
    case "VIP":
      return `
        bg-gradient-to-b from-purple-600 to-purple-800 text-white border-2 border-yellow-400
        shadow-[0_0_16px_2px_rgba(128,90,213,0.7)]`;
    case "PREMIUM":
      return `
        bg-blue-400 text-white border-2 border-blue-600
        shadow-[0_0_12px_1px_rgba(59,130,246,0.5)]`;
    default:
      return `
        bg-white text-gray-900 border-2 border-gray-300
        shadow-[0_1px_6px_0_rgba(0,0,0,0.14)]`;
  }
};

export function TheaterSeatsPlanEditable({ seats, theaterFormat }: Props) {
  const rows = React.useMemo(() => {
    const map: Record<string, Seat[]> = {};
    seats.forEach((s) => {
      if (!map[s.rowLabel]) map[s.rowLabel] = [];
      map[s.rowLabel].push(s);
    });
    return Object.entries(map)
      .map(([rowLabel, seats]) => ({
        rowLabel,
        seats: seats.sort((a, b) => a.seatNumber - b.seatNumber),
      }))
      .sort((a, b) => a.rowLabel.localeCompare(b.rowLabel));
  }, [seats]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Légende */}
      <div className="flex gap-4 justify-center my-8">
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-sm bg-white border-2 border-gray-300" />
          <span className="text-xs">Standard</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-sm bg-blue-400 border-2 border-blue-600" />
          <span className="text-xs">Premium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-sm bg-gradient-to-b from-purple-600 to-purple-800 border-2 border-yellow-400" />
          <span className="text-xs">VIP</span>
        </div>
      </div>

      {/* Plan dynamique par rangée (lecture seule) */}
      <div className="flex flex-col gap-2 px-2">
        {rows.map(({ rowLabel, seats: rowSeats }) => (
          <div key={rowLabel} className="flex items-center gap-2 justify-center">
            <span className="w-6 text-xs font-bold text-gray-400">{rowLabel}</span>
            <div className="flex gap-1">
              {rowSeats.map((seat, idx) => {
                return (
                  <div
                    key={idx}
                    className={`
                      h-9 w-9 rounded-xl text-xs font-bold flex items-center justify-center
                      border-2 transition-all
                      ${seatTypeStyle(seat.seatType)}
                      cursor-default opacity-90
                      relative
                    `}
                  >
                    {seat.seatNumber}
                    {seat.seatType === "VIP" && (
                      <span className="absolute -top-2 left-1 text-yellow-300 text-base">
                        ⚡
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="w-2 text-xs font-bold text-gray-400">{rowLabel}</span>
          </div>
        ))}
      </div>

      {/* Écran */}
      <div className="mt-6 mb-1 flex justify-center w-full">
        <svg viewBox="0 0 180 15" className="h-10 w-full max-w-xs">
            { theaterFormat === 'Standard' ? (
                <path d="M0 10 Q90 10 180 10" fill="none" stroke="#E50914" strokeWidth={3} />
            ):(
                <path d="M0 10 Q90 20 180 10" fill="none" stroke="#E50914" strokeWidth={3} />
            )}
          <text x="50%" y="5" textAnchor="middle" fontSize="7" fill="#fff">
            {theaterFormat}
          </text>
        </svg>
      </div>
    </div>
  );
}
