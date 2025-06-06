// pages/404.tsx

import Link from "next/link";

import Button from "../components/ui/Button";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
        Page not found
      </h2>
      <p className="text-gray-600 mb-6">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Button href="/" size="lg" variant="primary">
        Go to Homepage
      </Button>
    </div>
  );
}
