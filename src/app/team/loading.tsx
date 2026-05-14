import { LoadingSequence } from "@/components/loading-sequence";

export default function Loading() {
  return (
    <LoadingSequence
      label="team scan · in progress"
      stages={[
        "fetching every member",
        "aggregating archetypes",
        "spotting the blind spot",
        "drafting the team verdict",
        "naming the missing cofounder",
      ]}
    />
  );
}
