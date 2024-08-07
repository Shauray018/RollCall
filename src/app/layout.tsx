import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import './globals.css';
import Link from 'next/link';
import RetroGrid from '@/components/magicui/retro-grid';
import { Button } from "@/components/ui/button"
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";
 
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            <SignInPage />
          </SignedOut>
          <SignedIn>
            <div className="app-container">
              <header>
                <UserButton />
              </header>
              <main>
                {children}
              </main>
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}


function SignInPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-4 text-7xl font-bold">Roll-Call</h1>
      <p className="mb-6 text-center text-gray-700">Attendance Tracker</p>
      <SignInButton>
      <AnimatedGradientText>
        🎉 <hr className="mx-2 h-4 w-[1px] shrink-0 bg-gray-300 cursor-pointer" />{" "}
        <span
          className={cn(
            `cursor-pointer inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
          )}
        >
          Get Started
        </span>
        <ChevronRight className="cursor-pointer ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedGradientText>
        {/* <Button>Signin</Button> */}
      </SignInButton>
      <RetroGrid />
    </div>
  );
}