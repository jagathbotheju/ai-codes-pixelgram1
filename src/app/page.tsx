import Posts from "@/components/Posts";
import { PostsSkeleton } from "@/components/Skeletions";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex w-full flex-grow">
      <div className="flex flex-col flex-1 gap-y-8 max-w-lg mx-auto pb-20">
        <Suspense fallback={<PostsSkeleton />}>
          <Posts />
        </Suspense>
      </div>
    </main>
  );
}
