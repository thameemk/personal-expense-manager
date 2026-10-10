import { useEffect, useState } from "react";
import { CurrentUser, getCurrentUser } from "../../api/users";

type HomePageProps = {
  onSignOut: () => void;
};

function HomePage({ onSignOut }: HomePageProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(onSignOut);
  }, [onSignOut]);

  return (
    <section className="home-content">
      <p className="eyebrow">Your money, in focus</p>
      <h1>Welcome{user?.display_name ? `, ${user.display_name}` : " back"}.</h1>
      <p className="home-copy">Your personal expense dashboard is ready.</p>
      <div className="home-card">
        <span className="home-card-label">Coming next</span>
        <h2>See your spending clearly.</h2>
        <p>Expense tracking, budgets, and insights will appear here.</p>
      </div>
    </section>
  );
}

export default HomePage;
