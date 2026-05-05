import Link from "next/link";
import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

async function logout() {
  "use server";
  await clearSessionCookie();
  redirect("/login");
}

export default async function Navbar() {
  const userId = await getSessionUserId();
  let username: string | null = null;

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });
    username = user?.username ?? null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Chirp</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-primary">
              Home
            </Link>
            <Link href="/explore" className="text-gray-700 hover:text-primary">
              Explore
            </Link>
            {username ? (
              <>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-primary"
                >
                  @{username}
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-200"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
