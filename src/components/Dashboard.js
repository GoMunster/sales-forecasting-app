import React, { useState } from 'react';
import SalesForecastingTool from './SalesForecastingTool';

const Dashboard = () => {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Forecasting Dashboard</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setShowGuide(!showGuide)}
        >
          {showGuide ? 'Hide Guide' : 'Show Guide'}
        </button>
      </div>

      {showGuide && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">How to Use This Tool</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>
              <strong>Enter Historical Data:</strong> Start by entering your past sales data, including 
              the time period, number of leads generated, resulting sales, and the ad spend for that period.
            </li>
            <li>
              <strong>View Regression Analysis:</strong> Once you've entered enough data points (at least 6), 
              the tool will automatically calculate the relationship between your leads and sales.
            </li>
            <li>
              <strong>Use Budget Calculator:</strong> Enter your available budget to predict leads and sales, 
              or enter a sales target to determine the required budget.
            </li>
            <li>
              <strong>Generate Future Forecasts:</strong> Enter future periods and expected leads to create 
              a forecast of your upcoming sales performance.
            </li>
          </ol>
          <p className="mt-3 text-sm text-gray-600">
            <strong>Note:</strong> The more historical data you provide, the more accurate your forecasts will be.
          </p>
        </div>
      )}

      {/* Main forecasting tool */}
      <SalesForecastingTool />
      
      {/* Additional resources */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2 text-blue-700">Save Your Data</h3>
          <p className="text-gray-600 mb-4">Export your forecasts or save them for future reference.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export Data (CSV)
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2 text-green-700">Share Results</h3>
          <p className="text-gray-600 mb-4">Share your forecasts with your team or stakeholders.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Share Report
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium text-lg mb-2 text-purple-700">Sample Data</h3>
          <p className="text-gray-600 mb-4">Not sure where to start? Load sample data to see how it works.</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            Load Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
