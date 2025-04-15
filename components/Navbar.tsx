'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex gap-6">
      <Link href="/dashboard" className="hover:text-gray-200">
        Dashboard
      </Link>
      <Link href="/users" className="hover:text-gray-200">
        Users
      </Link>
    </nav>
  );
}
