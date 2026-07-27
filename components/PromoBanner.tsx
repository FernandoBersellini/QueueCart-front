export function PromoBanner() {
  return (
    <section
      className="relative overflow-hidden m-6 rounded-[20px] px-10 py-14"
      style={{
        background: "linear-gradient(120deg, var(--secondary), var(--accent))",
        color: "var(--on-accent)",
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-20% -10%",
          background:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 2px, transparent 2px, transparent 34px)",
          animation: "driftStripes 14s linear infinite",
        }}
      />
      <div className="relative" style={{ maxWidth: 460 }}>
        <h2 className="text-[32px] leading-[1.15] mb-3 tracking-tight">
          Frete grátis em todas as categorias essa semana
        </h2>
        <p className="text-[15px] mb-[22px]" style={{ opacity: 0.9 }}>
          Sem cupom, sem valor mínimo — o desconto já entra no carrinho.
        </p>
        <span
          className="inline-block rounded-full font-semibold text-sm px-[22px] py-3 cursor-pointer"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          Ver ofertas
        </span>
      </div>
    </section>
  );
}
