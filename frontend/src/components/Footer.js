import Link from 'next/link';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-lg font-bold mb-4">SIGNIFY <span className="text-primary-500">BY AHON</span></h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">Premium fashion & clothing store. Discover the latest trends with quality craftsmanship.</p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"><FaFacebook size={16} /></a>
              <a href="#" className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"><FaInstagram size={16} /></a>
              <a href="#" className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"><FaYoutube size={16} /></a>
              <a href="#" className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"><FaTiktok size={16} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2"><HiPhone className="mt-0.5" /><span>+92 300 1234567</span></li>
              <li className="flex items-start space-x-2"><HiMail className="mt-0.5" /><span>info@signifyahon.com</span></li>
              <li className="flex items-start space-x-2"><HiLocationMarker className="mt-0.5" /><span>Lahore, Pakistan</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="text-gray-600 hover:text-black">All Products</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-black">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-black">FAQ</Link></li>
              <li><Link href="/about" className="text-gray-600 hover:text-black">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 uppercase text-sm tracking-wider">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-600 hover:text-black">Privacy Policy</Link></li>
              <li><Link href="/refund" className="text-gray-600 hover:text-black">Refund & Exchange</Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-black">Shipping Policy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-black">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-10 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SIGNIFY BY AHON. All rights reserved.</p>
          <p className="text-xs mt-1">Made by <strong>MESO Business Solutions TEAM</strong></p>
        </div>
      </div>
    </footer>
  );
}
