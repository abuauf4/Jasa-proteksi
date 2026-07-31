import { Metadata } from "next";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { products as staticProducts, InsuranceProduct } from "@/lib/products";
import ProductFlowClient from "./ProductFlowClient";

// ISR — product data changes rarely. Cache rendered page for 5 min.
export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Merge a DB product record with its static definition (highlights, coverage,
 * claimTypes, etc. are static; only id/name/description/prices come from DB).
 *
 * This mirrors the mergeProductData() function in Portfolio.tsx so the
 * /produk/[slug] page shows the same product data the user clicked on.
 */
function mergeProductData(dbProduct: any): InsuranceProduct | null {
  const staticProduct = staticProducts.find((sp) => sp.slug === dbProduct.slug);
  if (staticProduct) {
    return {
      ...staticProduct,
      id: dbProduct.id,
      name: dbProduct.name,
      slug: dbProduct.slug,
      category: dbProduct.category,
      description: dbProduct.description,
      benefits: dbProduct.benefits,
      estimatedPrice: dbProduct.estimatedPrice,
      minimumOfferPrice: dbProduct.minimumOfferPrice,
      isActive: dbProduct.isActive,
    };
  }
  // Fallback for products that exist in DB but not in static list
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    category: dbProduct.category,
    tagline: dbProduct.name,
    price: `Mulai Rp ${(dbProduct.estimatedPrice / 1000).toLocaleString("id-ID")}rb/tahun`,
    discount: "",
    iconName: "Shield",
    image: "/images/product-car.svg",
    description: dbProduct.description,
    coverage: [],
    highlights: [{ icon: "shield", label: "Tipe", value: "TLO / All Risk" }],
    claimTypes: [],
    variants: [],
    warranty: "Polis aktif sejak pembayaran",
    estimatedPrice: dbProduct.estimatedPrice,
    minimumOfferPrice: dbProduct.minimumOfferPrice,
    benefits: dbProduct.benefits,
    isActive: dbProduct.isActive,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product || !product.isActive) {
    return { title: "Produk Tidak Ditemukan - Jasa Proteksi" };
  }

  return {
    title: `${product.name} - Cek Harga Premi | Jasa Proteksi`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} - Jasa Proteksi`,
      description: product.description.slice(0, 160),
      type: "website",
    },
  };
}

export default async function ProductFlowPage({ params }: Props) {
  const { slug } = await params;

  const dbProduct = await db.product.findUnique({ where: { slug } });

  if (!dbProduct || !dbProduct.isActive) {
    notFound();
  }

  const product = mergeProductData(dbProduct);

  if (!product) {
    notFound();
  }

  return <ProductFlowClient product={product} />;
}
