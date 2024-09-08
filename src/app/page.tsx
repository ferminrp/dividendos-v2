import { DividendInfo } from "@/components/dividend-info";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <DividendInfo />
      </div>
    </main>
  );
}
