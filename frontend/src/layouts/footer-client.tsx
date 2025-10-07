'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const FooterClient = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">LC</span>
              </div>
              <span className="font-bold text-xl text-white">LearnCourse</span>
            </div>
            <p className="text-gray-400 mb-4">
              Nền tảng học tập trực tuyến hàng đầu với hơn 1,000 khóa học chất lượng cao.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li><Link href="/courses" className="hover:text-primary-500 transition-colors">Khóa học</Link></li>
              <li><Link href="/about" className="hover:text-primary-500 transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/blog" className="hover:text-primary-500 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary-500 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="hover:text-primary-500 transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="/terms" className="hover:text-primary-500 transition-colors">Điều khoản</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-500 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/faq" className="hover:text-primary-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span>support@learncourse.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; 2024 LearnCourse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterClient;
