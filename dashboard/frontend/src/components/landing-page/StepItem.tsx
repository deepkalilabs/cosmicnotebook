import React from "react";

interface StepItemProps {
  number: number;
  title: string;
  description: string;
}

export default function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
        {number}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
} 