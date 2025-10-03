import { Suspense } from "react";
import HomeContent from "./HomeContent";

export default function Home() {
  return (
    <Suspense fallback={<div className="whole">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}