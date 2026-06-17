import ProductDetailClient from './_components/ProductDetailClient';

export async function generateStaticParams() {
  try {
    const res = await fetch('http://localhost:5000/api/products?limit=100');
    const data = await res.json();
    return (data.products || []).map((product) => ({ slug: product.slug }));
  } catch {
    return [];
  }
}

export default function ProductPage({ params }) {
  return <ProductDetailClient slug={params.slug} />;
}
