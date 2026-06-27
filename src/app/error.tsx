"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-4xl font-bold text-heading">Something went wrong</h1>
      <p className="mt-4 text-lg text-body">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="btn-dark inline-flex items-center gap-2 px-6 py-3"
        >
          Try again
        </button>
        <Link
          href="/"
          className="btn-secondary inline-flex items-center gap-2 px-6 py-3 no-underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
