import { Quote } from "lucide-react";
import BrandMark from "../../../components/BrandMark";
import { Card, CardContent } from "@/components/ui/card";

function BrandPanel() {
  return (
    <section
      className="hidden flex-col justify-center bg-accent/50 p-12 lg:flex xl:p-24"
      aria-label="Ledgerly introduction"
    >
      <div className="mb-20">
        <BrandMark />
      </div>
      <p className="mb-4 text-xs font-bold tracking-widest text-primary uppercase">
        Your money, in focus
      </p>
      <h1 className="max-w-md text-5xl font-semibold tracking-tight xl:text-6xl">
        Make room for what matters.
      </h1>
      <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
        Ledgerly brings your spending, saving, and everyday decisions into one calm, clear view.
      </p>
      <Card className="mt-20 max-w-sm bg-card/70">
        <CardContent>
          <Quote className="mb-3 size-6 text-primary" aria-hidden="true" />
          <blockquote>
            <p className="leading-relaxed">Clarity is the first step toward confidence.</p>
            <footer className="mt-3 text-xs text-muted-foreground">— Your future self</footer>
          </blockquote>
        </CardContent>
      </Card>
    </section>
  );
}

export default BrandPanel;
