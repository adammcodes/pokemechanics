import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function Loading() {
  return (
    <main className="w-full h-screen flex flex-col justify-start items-center">
      <LoadingSpinner size="sm" />
    </main>
  );
}
