import BrandMark from "./BrandMark";
import { Button } from "@/components/ui/button";

type AppHeaderProps = { onSignOut: () => void };

function AppHeader({ onSignOut }: AppHeaderProps) {
  return (
    <header className="border-b bg-background px-6 py-6 lg:px-24">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-lg font-bold">
          <BrandMark />
          <span>ledgerly</span>
        </div>
        <nav aria-label="Main navigation">
          <Button variant="outline" type="button" onClick={onSignOut}>
            Sign out
          </Button>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
