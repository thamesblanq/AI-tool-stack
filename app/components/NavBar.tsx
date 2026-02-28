import { Sparkles, BookmarkCheck, LogOut } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/auth'; 
import { logout } from '../actions/logout';

const NavBar = async () => {
  const session = await auth();

  return (
    <nav className="border-b border-[#2a2a3a] bg-[#14141f]/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d9ff] to-[#a855f7] flex items-center justify-center hover:opacity-90 transition-opacity">
              <Sparkles className="w-5 h-5 text-[#0a0a0f]" />
            </div>
            <span className="text-xl font-semibold text-white">AI Tools Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/bookmarks"
                  className="flex items-center text-[#94949f] hover:text-[#00d9ff] transition-colors"
                >
                  <BookmarkCheck className="w-5 h-5 mr-1" />
                  My Tools
                </Link>

                {/* 2. Much cleaner! Just pass the function to the action */}
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center border border-[#2a2a3a] text-white px-4 py-2 rounded-lg hover:border-[#00d9ff] hover:text-[#00d9ff] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#00d9ff] text-[#0a0a0f] px-5 py-2 rounded-lg font-medium hover:bg-[#00b8d4]/90 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  )
}

export default NavBar;