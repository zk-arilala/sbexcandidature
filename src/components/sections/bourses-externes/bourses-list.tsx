"use client";
import { useState } from 'react';
import BoursesExternesCard from './BoursesExternesCard';
import { ChevronDown } from "lucide-react";

export default function BoursesListClient({ bourses }: { bourses: any[] }) {

    return (
      <>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto relative z-10">
            {bourses.map((item) => (
                <BoursesExternesCard key={item.id} bourse={item} />
            ))}
        </div>
      </>
    );
}
