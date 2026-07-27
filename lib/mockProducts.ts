import { Product } from "@/types/product";

export function getMockProductById(id: number): Product | undefined {
  return mockProducts.find((product) => product.id === id);
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Fone Bluetooth ClearWave",
    description:
      "Fone over-ear com cancelamento de ruído ativo e até 30 horas de bateria. Drivers de 40mm entregam graves encorpados sem perder clareza nos agudos. Case dobrável incluso, ideal para levar na mochila.",
    sku: "CLW-001",
    price: 189.9,
    active: true,
    categoryId: 1,
  },
  {
    id: 2,
    name: "Mochila Urban Trek",
    description:
      "Mochila resistente à água com compartimento acolchoado para notebook até 15 polegadas. Alças ergonômicas e bolso frontal organizador.",
    sku: "UTK-002",
    price: 249.0,
    active: true,
    categoryId: 2,
  },
  {
    id: 3,
    name: "Cafeteira Compacta Aroma",
    description:
      "Cafeteira elétrica de 600ml com desligamento automático. Design compacto que cabe em qualquer bancada, ideal para uso individual.",
    sku: "ARM-003",
    price: 312.5,
    active: true,
    categoryId: 3,
  },
  {
    id: 4,
    name: "Tênis Runner Flex",
    description:
      "Tênis de corrida com solado em EVA de alta densidade e cabedal respirável. Amortecimento reforçado no calcanhar para longas distâncias.",
    sku: "RNF-004",
    price: 279.9,
    active: true,
    categoryId: 4,
  },
  {
    id: 5,
    name: "Luminária LED Orbit",
    description:
      "Luminária de mesa com três temperaturas de luz e controle touch de intensidade. Braço articulado em 360 graus.",
    sku: "LED-005",
    price: 98.0,
    active: true,
    categoryId: 3,
  },
  {
    id: 6,
    name: "Teclado Mecânico Pulse",
    description:
      "Teclado mecânico com switches táteis, retroiluminação RGB customizável e estrutura em alumínio escovado.",
    sku: "PLS-006",
    price: 349.0,
    active: true,
    categoryId: 1,
  },
  {
    id: 7,
    name: "Garrafa Térmica Nordic",
    description:
      "Garrafa térmica de aço inoxidável, mantém a temperatura por até 12 horas. Tampa vazante e corpo antiderrapante.",
    sku: "NRD-007",
    price: 89.9,
    active: true,
    categoryId: 2,
  },
  {
    id: 8,
    name: "Câmera Instantânea Snap",
    description:
      "Câmera instantânea compacta com flash automático e visor óptico. Revele suas fotos na hora, sem precisar de app.",
    sku: "SNP-008",
    price: 429.0,
    active: true,
    categoryId: 4,
  },
];
