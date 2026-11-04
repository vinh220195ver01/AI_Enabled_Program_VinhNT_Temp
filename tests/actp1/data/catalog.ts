// Catalog snapshot read from the live ACTP1 store on 2026-11-04 (see uat-context/actp1-csc-edu-vn/).
// The manual cases say the fixture is "recorded before execution; recheck after demo reset" — the site
// resets weekly, so refresh this file when products, prices or categories change.

export type CatalogProduct = {
  name: string;
  slug: string;
  id: number;
  categories: string[];
  regularPrice?: string;
  salePrice?: string;
};

export const products = {
  boldStatementGraphicTee: { name: "Bold Statement Graphic Tee", slug: "bold-statement-graphic-tee", id: 97, categories: ["Clothing", "Tshirt"] },
  floralElegance: { name: "Floral Elegance Sun Hat", slug: "floral-elegance-sun-hat", id: 57, categories: ["Uncategorized"] },
  goldenGlow: {
    name: "Golden Glow Ribbed Knit Dress",
    slug: "golden-glow-ribbed-knit-dress",
    id: 67,
    categories: ["Dresses"],
    regularPrice: "$15.00",
    salePrice: "$12.00",
  },
  midnightBloom: { name: "Midnight Bloom Crochet Dress", slug: "midnight-bloom-crochet-dress", id: 72, categories: ["Dresses"] },
  radiantOneShoulder: { name: "Radiant One-Shoulder T-Shirt", slug: "radiant-one-shoulder-t-shirt", id: 87, categories: ["Clothing", "Tshirt"] },
  sophisticatedTurtleneck: { name: "Sophisticated Ribbed Turtleneck Tee", slug: "sophisticated-ribbed-turtleneck-tee", id: 92, categories: ["Clothing", "Tshirt"] },
  sophisticatedStripedMidi: { name: "Sophisticated Striped Midi Dress", slug: "sophisticated-striped-midi-dress", id: 77, categories: ["Dresses"] },
  sunsetGlow: { name: "Sunset Glow Utility Dress", slug: "sunset-glow-utility-dress", id: 82, categories: ["Dresses"] },
  classicStripedBlouse: { name: "Classic Striped Knit Blouse", slug: "classic-striped-knit-blouse", id: 62, categories: ["Blouse"] },
} satisfies Record<string, CatalogProduct>;

export const allProductNames: string[] = Object.values(products).map((p) => p.name);

export type CatalogCategory = { name: string; path: string; productNames: string[] };

// Membership is by displayed category listing (a parent category includes its children's products).
export const categories = {
  Blouse: { name: "Blouse", path: "/category/blouse/", productNames: [products.classicStripedBlouse.name] },
  Clothing: {
    name: "Clothing",
    path: "/category/clothing/",
    productNames: [
      products.boldStatementGraphicTee.name,
      products.goldenGlow.name,
      products.midnightBloom.name,
      products.radiantOneShoulder.name,
      products.sophisticatedTurtleneck.name,
      products.sophisticatedStripedMidi.name,
      products.sunsetGlow.name,
    ],
  },
  Dresses: {
    name: "Dresses",
    path: "/category/clothing/dresses/",
    productNames: [products.goldenGlow.name, products.midnightBloom.name, products.sophisticatedStripedMidi.name, products.sunsetGlow.name],
  },
  Tshirt: {
    name: "Tshirt",
    path: "/category/clothing/tshirt/",
    productNames: [products.boldStatementGraphicTee.name, products.radiantOneShoulder.name, products.sophisticatedTurtleneck.name],
  },
  Uncategorized: { name: "Uncategorized", path: "/category/uncategorized/", productNames: [products.floralElegance.name] },
} satisfies Record<string, CatalogCategory>;
