import { getSignInUrl, getUser, signOut } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";

export default async function Header() {
  const { user } = await getUser();
  const signInUrl = await getSignInUrl();

  return (
    <header className="bg-white shadow-md">
      <div className="container flex items-center justify-between mx-auto py-4 px-6">
        <Link href={'/'} className="flex items-center">
          <Image src={logo} alt="Job Board Logo" width={150} height={40} className="h-10 w-auto" />
        </Link>
        <nav className="flex items-center gap-4">
          {!user && (
            <Link
              className="rounded-md bg-gray-100 py-2 px-4 text-gray-700 hover:bg-gray-200 transition duration-300 ease-in-out"
              href={signInUrl}
            >
              Login
            </Link>
          )}
          {user && (
            <form action={async () => {
              'use server';
              await signOut();
            }}>
              <button
                type="submit"
                className="rounded-lg bg-gray-100 py-2 px-4 text-gray-700 hover:bg-gray-200 transition duration-300 ease-in-out"
              >
                Logout
              </button>
            </form>
          )}
          <Link
            className="rounded-lg py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out"
            href={'/new-listing'}
          >
            Post a job
          </Link>
        </nav>
      </div>
    </header>
  );
}