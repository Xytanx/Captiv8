"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "axios";
import SparklesIcon from "./SparklesIcon";

export default function HeaderWithDeletion() {
  const pathname = usePathname();

  // Determine if we're on a dynamic file page (adjust logic as needed)
  const isFilePage = pathname !== "/" && !pathname.startsWith("/pricing");
  const filename = isFilePage ? pathname.slice(1) : null;

  // Function to call the deletion API using the filename from the URL
  const handleDeletion = async () => {
    if (isFilePage && filename) {
      try {
        await axios.delete(`/api/delete?filename=${filename}`);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  return (
    <header className="flex justify-between my-2 sm:my-8">
      <Link href="/" legacyBehavior>
        <a onClick={handleDeletion} className="flex gap-1">
          <SparklesIcon />
          <span className="text-white-700">Captiv8</span>
        </a>
      </Link>
      <nav className="flex items-center gap-2 sm:gap-6 text-white/80 text-sm sm:text-base">
        <Link href="/" legacyBehavior>
          <a onClick={handleDeletion}>Home</a>
        </Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="mailto:sweytank10@gmail.com">Contact</Link>
      </nav>
    </header>
  );
}