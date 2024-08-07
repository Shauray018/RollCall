import Image from "next/image";
import RetroGrid from "@/components/magicui/retro-grid";
import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="relative flex h-[700px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      
        Roll-Call
      
      <Button>
      <Link href="/dashboard">
        Get Started
      </Link>
      </Button>
      <RetroGrid />
    </div>
  );
}
