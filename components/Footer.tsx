import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Institucional",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Contato", href: "/contato" },
      { label: "Trabalhe conosco", href: "/carreiras" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Trocas e devoluções", href: "/trocas" },
      { label: "Frete", href: "/frete" },
      { label: "Perguntas frequentes", href: "/faq" },
    ],
  },
  {
    title: "Redes",
    links: [
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t px-6 pt-10 pb-10 mt-6" style={{ borderColor: "var(--border)" }}>
      <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-6 mb-7">
        <div>
          <h5 className="text-[13px] mb-3">QueueCart</h5>
          <p className="text-[13px]" style={{ color: "var(--muted)" }}>
            Projeto fictício de portfólio — e-commerce com backend em Spring Boot modular e
            mensageria via RabbitMQ.
          </p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h5 className="text-[13px] mb-3">{column.title}</h5>
            <ul className="list-none flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13px]" style={{ color: "var(--muted)" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div
        className="text-xs border-t pt-5"
        style={{ color: "var(--muted)", borderColor: "var(--border)" }}
      >
        © 2026 QueueCart — projeto fictício de portfólio, sem fins comerciais.
      </div>
    </footer>
  );
}
