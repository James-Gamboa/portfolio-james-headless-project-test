"use client"

import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link 
        href="/" 
        className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200"
      >
        Go Back Home
      </Link>
    </div>
  );
}