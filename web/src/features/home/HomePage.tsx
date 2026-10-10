import { useEffect, useState } from "react";
import { CurrentUser, getCurrentUser } from "../../api/users";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type HomePageProps = { onSignOut: () => void };

function HomePage({ onSignOut }: HomePageProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  useEffect(() => {
    getCurrentUser().then(setUser).catch(onSignOut);
  }, [onSignOut]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-28">
      <p className="mb-4 text-xs font-bold tracking-widest text-primary uppercase">
        Your money, in focus
      </p>
      <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
        Welcome{user?.display_name ? `, ${user.display_name}` : " back"}.
      </h1>
      <p className="mt-5 mb-10 text-muted-foreground">Your personal expense dashboard is ready.</p>
      <Card className="max-w-lg">
        <CardHeader>
          <p className="mb-3 text-xs font-bold tracking-widest text-primary uppercase">
            Coming next
          </p>
          <CardTitle>
            <h2 className="text-xl">See your spending clearly.</h2>
          </CardTitle>
          <CardDescription className="leading-relaxed">
            Expense tracking, budgets, and insights will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  );
}

export default HomePage;
