import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sales Forecasting App</h1>
          <p className="text-sm opacity-80">Predict your future performance based on data</p>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="hover:text-blue-200 font-medium">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-200">
                About
              </a>
            </li>
            <li>
              <a href="/help" className="hover:text-blue-200">
                Help
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
