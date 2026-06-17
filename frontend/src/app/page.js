'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { bannerAPI, productAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, featuredRes, trendingRes] = await Promise.all([
          bannerAPI.getAll({ section: 'hero' }),
          productAPI.getFeatured(),
          productAPI.getTrending(),
        ]);
        setBanners(bannerRes.data);
        setFeatured(featuredRes.data);
        setTrending(trendingRes.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const categoryGrid = [
    { name: 'New Arrivals', slug: 'new-arrivals', img: 'https://placehold.co/600x750/f5f5f5/333?text=New+Arrivals' },
    { name: 'Formals', slug: 'formals', img: 'https://placehold.co/600x750/f5f5f5/333?text=Formals' },
    { name: 'Unstitched Summer', slug: 'unstitched-summer', img: 'https://placehold.co/600x750/f5f5f5/333?text=Unstitched+Summer' },
    { name: 'Ready to Wear', slug: 'ready-to-wear', img: 'https://placehold.co/600x750/f5f5f5/333?text=Ready+to+Wear' },
  ];

  return (
    <div>
      {banners.length > 0 && (
        <Swiper modules={[Autoplay, Pagination, Navigation]} autoplay={{ delay: 5000 }} pagination={{ clickable: true }} navigation loop className="h-[50vh] md:h-[80vh]">
          {banners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <Link href={banner.buttonLink || '#'} className="relative block w-full h-full">
                <Image src={banner.desktopImage?.url} alt={banner.title} fill className="object-cover hidden md:block" />
                <Image src={banner.mobileImage?.url || banner.desktopImage?.url} alt={banner.title} fill className="object-cover md:hidden" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">{banner.title}</h1>
                    {banner.subtitle && <p className="text-lg md:text-xl mb-6 text-white/90">{banner.subtitle}</p>}
                    <span className="btn-white inline-block">{banner.buttonText || 'Shop Now'}</span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Explore our collections</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryGrid.map((cat) => (
            <Link key={cat.slug} href={`/shop?collection=${cat.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-gray-100">
              <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-white text-lg font-display font-bold">{cat.name}</h3>
                  <span className="text-white/80 text-sm uppercase tracking-wider">Shop Now →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Our curated selection</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/shop" className="btn-outline inline-block">View All Products</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="section-title">Trending This Week</h2>
        <p className="section-subtitle">Top 5 picks</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {trending.slice(0, 5).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section className="relative bg-black text-white py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Keep Me Updated</h2>
          <p className="text-gray-400 mb-8">Subscribe us and get more exciting offers and updates.</p>
          <form className="flex max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 text-black outline-none" />
            <button className="bg-primary-500 px-6 py-3 font-medium uppercase text-sm tracking-wider hover:bg-primary-600 transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
