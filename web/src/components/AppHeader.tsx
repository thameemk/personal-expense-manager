import BrandMark from "./BrandMark";

type AppHeaderProps = {
  onSignOut: () => void;
};

function AppHeader({ onSignOut }: AppHeaderProps) {
  return (
    <header className="home-header">
      <div className="home-brand">
        <BrandMark />
        <span>ledgerly</span>
      </div>
      <nav className="home-menu" aria-label="Main navigation">
        <button className="sign-out-button" type="button" onClick={onSignOut}>
          Sign out
        </button>
      </nav>
    </header>
  );
}

export default AppHeader;
