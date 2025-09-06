import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-600 px-6 text-center">
      {/* gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="translate-y-24 rotate-45 bg-gradient-to-br from-black/25 via-black/10 to-transparent opacity-40" />
      </div>

      {/* 404 headline */}
      <h1 className="select-none text-7xl font-extrabold leading-none tracking-tight text-white drop-shadow-sm md:text-9xl">
        404
      </h1>

      <h2 className="mt-6 text-pretty text-3xl font-semibold text-white md:text-5xl">
        Oops, nothing here...
      </h2>

      <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-white/80 md:text-base">
        Uh oh, we can’t seem to find the page you’re looking for. Try going back
        to the previous page or contact us for more information.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button
          asChild
          className="rounded-full bg-white px-6 py-6 text-base font-medium text-blue-700 hover:bg-white/90"
        >
          <Link href="/">Back to Homepage</Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="rounded-full border-white bg-transparent px-6 py-6 text-base font-medium text-white hover:bg-white/10 hover:text-white"
        >
          <Link href="/support">Contact Us</Link>
        </Button>
      </div>
    </main>
  );
}
