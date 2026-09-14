"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("ivy_access_token")));
  }, []);

  function logout() {
    localStorage.removeItem("ivy_access_token");
    localStorage.removeItem("ivy_user_email");
    window.location.href = "/login";
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <a href="/" className="flex items-center">
          <Image
            src="/ivy_homes_logo.png"
            alt="Ivy Homes"
            width={110}
            height={32}
            priority
            className="h-8 w-auto object-contain"
          />
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="/listings" className="hover:text-zinc-500">
            Buy
          </a>

          <a href="/rentals" className="hover:text-zinc-500">
            Rent
          </a>

          <a href="/projects" className="hover:text-zinc-500">
            Projects
          </a>

          <a href="/insights" className="hover:text-zinc-500">
            Insights
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/favourites"
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-50"
          >
            ♡ Favourites
          </a>

          {loggedIn ? (
            <button
              onClick={logout}
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Login
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-lg md:hidden"
          aria-label="Open menu"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <a href="/listings">Buy</a>
            <a href="/rentals">Rent</a>
            <a href="/projects">Projects</a>
            <a href="/insights">Insights</a>
            <a href="/favourites">♡ Favourites</a>

            {loggedIn ? (
              <button
                onClick={logout}
                className="w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
              >
                Logout
              </button>
            ) : (
              <a
                href="/login"
                className="w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
              >
                Login
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}