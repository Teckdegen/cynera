import { Suspense } from "react";
import { RunView } from "./view";

export default function RunPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <Ready params={params} />
    </Suspense>
  );
}

async function Ready({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RunView id={id} />;
}
