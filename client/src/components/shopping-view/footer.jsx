import React from 'react';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">HAMRO SUPPLEMENT</h2>
          <p className="text-gray-300 mb-4">Your trusted supplement seller in Nepal</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
            <div className="flex items-center">
              <Phone className="text-amber-400 mr-2 h-4 w-4" />
              <span>+977 9876543210</span>
            </div>
            <div className="flex items-center">
              <Mail className="text-amber-400 mr-2 h-4 w-4" />
              <span>hamrosupplement@gmail.com</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <a href="#" className="hover:text-amber-400 transition">Home</a>
          <a href="./listing" className="hover:text-amber-400 transition">Shop</a>
        </div>
        <div className="border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Hamro Supplement. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;