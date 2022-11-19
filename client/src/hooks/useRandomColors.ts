import { useState } from "react";

// -------------------------------
const colors = [
  "bg-red-200",
  "bg-yellow-400",
  "bg-green-300",
  "bg-blue-200",
  "bg-indigo-300",
  "bg-purple-400",
  "bg-pink-400",
  "bg-gray-600",
];

export default function useRandomColors() {
  const [color] = useState(colors[Math.floor(Math.random() * colors.length)]);
  return { color };
}
