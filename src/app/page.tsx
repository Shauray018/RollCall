import Image from "next/image";
import RetroGrid from "@/components/magicui/retro-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import FlipText from "@/components/magicui/flip-text";

export default function Home() {
  return (
    <div className="relative flex h-[700px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      
      <FlipText
      className="text-4xl font-bold tracking-[-0.1em]  text-black dark:text-white md:text-7xl md:leading-[5rem]"
      word="Roll-Call"
    />
    <div className="mb-10 font-semibold text-zinc-800">Attendance Tracker</div>
      
      <Button>
      <Link href="/dashboard">
        Get Started
      </Link>
      </Button>
      <RetroGrid />
    </div>
  );
}
