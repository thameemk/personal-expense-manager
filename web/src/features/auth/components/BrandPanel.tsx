import BrandMark from "../../../components/BrandMark";

function BrandPanel() {
  return (
    <section className="brand-panel" aria-label="Ledgerly introduction">
      <BrandMark />
      <p className="eyebrow">Your money, in focus</p>
      <h1>Make room for what matters.</h1>
      <p className="brand-copy">
        Ledgerly brings your spending, saving, and everyday decisions into one calm, clear view.
      </p>
      <div className="quote-card">
        <div className="quote-icon" aria-hidden="true">
          “
        </div>
        <p>Clarity is the first step toward confidence.</p>
        <span>— Your future self</span>
      </div>
      <div className="leaf leaf-one" aria-hidden="true" />
      <div className="leaf leaf-two" aria-hidden="true" />
    </section>
  );
}

export default BrandPanel;
