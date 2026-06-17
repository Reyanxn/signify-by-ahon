import ProductDetailClient from './_components/ProductDetailClient';

const PRODUCT_SLUGS = [
  'digital-printed-lawn-use-9317-0', 'embroidered-khaddar-fk-2345-1',
  'digital-printed-viscose-rtw-1223-2', 'embroidered-lawn-el-5678-3',
  'digital-printed-premium-viscose-uw-0100-4', 'embroidered-chiffon-uc-3064-5',
  'embroidered-velvet-ev-8901-6', 'digital-printed-lawn-use-9322-7',
  'embroidered-jacquard-khaddar-jk-1234-8', 'embroidered-raw-silk-rs-4567-9',
  'digital-printed-lawn-use-9313-10', 'embroidered-lawn-use-9352-11',
];

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export default function ProductPage({ params }) {
  return <ProductDetailClient slug={params.slug} />;
}
