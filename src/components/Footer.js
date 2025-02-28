import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Sales Forecasting App</h3>
            <p className="text-sm text-gray-400 mt-1">
              Make data-driven marketing decisions
            </p>
          </div>
          
          <div className="flex space-x-6">
            <div>
              <h4 className="text-sm font-semibold mb-2">Resources</h4>
              <ul className="text-sm text-gray-400">
                <li className="mb-1"><a href="/documentation" className="hover:text-white">Documentation</a></li>
                <li className="mb-1"><a href="/examples" className="hover:text-white">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Support</h4>
              <ul className="text-sm text-gray-400">
                <li className="mb-1"><a href="/faq" className="hover:text-white">FAQ</a></li>
                <li className="mb-1"><a href="/contact" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400 text-center">
          <p>© {new Date().getFullYear()} Sales Forecasting App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
