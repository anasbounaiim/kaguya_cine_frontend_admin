"use client";
import React, { useState } from "react";
import { Button } from "./button";
import { X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";

const LANGUAGES = [
  { value: "EN", label: "English" },
  { value: "FR", label: "Français" },
  { value: "ES", label: "Español" },
  // Ajoute plus si besoin
];
const FORMATS = [
  { value: "IMAX", label: "IMAX" },
  { value: "2D", label: "2D" },
  { value: "3D", label: "3D" },
  // Ajoute plus si besoin
];

export default function VersionsSelectInput({
  value,
  onChange,
}: {
  value: { language: string; format: string }[];
  onChange: (value: { language: string; format: string }[]) => void;
}) {
  const [language, setLanguage] = useState<string>("");
  const [format, setFormat] = useState<string>("");

  const addVersion = () => {
    if (language && format) {
      onChange([...(value || []), { language, format }]);
      setLanguage("");
      setFormat("");
    }
  };

  const removeVersion = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-32 bg-white text-black border rounded-md cursor-pointer">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            {LANGUAGES.map(l => (
              <SelectItem className="cursor-pointer hover:bg-gray-100" key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger className="w-32 bg-white text-black border rounded-md cursor-pointer">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black">
            {FORMATS.map(f => (
              <SelectItem className="cursor-pointer hover:bg-gray-100" key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="text-red-700 border-2 font-bold cursor-pointer" type="button" variant="outline" onClick={addVersion} disabled={!language || !format}>
          Ajouter
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(value || []).map((v, idx) => (
          <span key={idx}>
            {idx >= 0 && (
              <span
                key={idx}
                className="inline-flex items-center border border-green-800 bg-green-100 text-green-800 px-2 py-1 font-semibold rounded-full text-sm"
              >
            
                {v.language}-{v.format}
                <X
                  className="ml-1 h-4 w-4 cursor-pointer"
                  onClick={() => removeVersion(idx)}
                />
                </span>
              )}
          </span>
        ))}
      </div>
    </div>
  );
}
