"use client";
import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { ChevronDown } from "lucide-react";

type Genre = {
  genreId: string;
  name: string;
};

export default function GenresMultiSelectInput({
  options,
  value,
  onChange,
}: {
  options: Genre[];
  value: string[];
  onChange: (genres: string[]) => void;
}) {
  const selected = options.filter((g) => value.includes(g.name));
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between bg-white text-black cursor-pointer"
        >
          <span>
            {selected.length > 0
              ? selected.map((g) => g.name).join(", ")
              : "Select genres"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 max-h-72 overflow-y-auto p-0 bg-white text-black">
        {options.map((genre, idx) => (
          <div
            key={idx}
            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              if (value.includes(genre.name)) {
                onChange(value.filter((v) => v !== genre.name));
              } else {
                onChange([...value, genre.name]);
              }
            }}
          >
            <Checkbox
              className="mr-2"
              checked={value.includes(genre.name)}
              tabIndex={-1}
              onCheckedChange={() => {
                if (value.includes(genre.name)) {
                  onChange(value.filter((v) => v !== genre.name));
                } else {
                  onChange([...value, genre.name]);
                }
              }}
            />
            <span className="text-sm">{genre.name}</span>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
