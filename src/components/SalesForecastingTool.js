import React, { useState, useEffect } from 'react';
import { LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToCSV, getSampleData, saveToLocalStorage, loadFromLocalStorage } from '../utils/dataUtils';

const SalesForecastingTool = () => {
  // State for historical data input
  const [salesPeriod, setSalesPeriod] = useState('');
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');
  const [adSpend, setAdSpend] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [regressionResult, setRegressionResult] = useState(null);
  
  // State for future forecasting
  const [futurePeriods, setFuturePeriods] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [showForecasts, setShowForecasts] = useState(false);
  
  // State for budget calculator
  const [budgetTarget, setBudgetTarget] = useState('');
  const [salesTarget, setSalesTarget] = useState('');
  const [budgetForecast, setBudgetForecast] = useState(null);
  const [salesForecast, setSalesForecast] = useState(null);
  
  // State for notifications
  const [notification, setNotification] = useState(null);

  // Load data from local storage on component mount
  useEffect(() => {
    const savedData = loadFromLocalStorage('historicalData');
    if (savedData && savedData.length > 0) {
      setHistoricalData(savedData);
      calculateRegression(savedData);
    }
    
    const savedFuturePeriods = loadFromLocalStorage('futurePeriods');
    if (savedFuturePeriods) {
      setFuturePeriods(savedFuturePeriods);
    }
  }, []);

  // Save data to local storage when it changes
  useEffect(() => {
    if (historicalData.length > 0) {
      saveToLocalStorage('historicalData', historicalData);
    }
    
    if (futurePeriods.length > 0) {
      saveToLocalStorage('futurePeriods', futurePeriods);
    }
  }, [historicalData, futurePeriods]);

  // Show temporary notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Add historical data point
  const addDataPoint = () => {
    if (salesPeriod && xValue && yValue && adSpend) {
      const newDataPoint = {
        period: salesPeriod,
        x: parseFloat(xValue),
        y: parseFloat(yValue),
        adSpend: parseFloat(adSpend),
        cpl: parseFloat(adSpend) / parseFloat(xValue),
        cpa: parseFloat(adSpend) / parseFloat(yValue),
        conversionRate: (parseFloat(yValue) / parseFloat(xValue)) * 100
      };
      
      const updatedData = [...historicalData, newDataPoint];
      setHistoricalData(updatedData);
      setSalesPeriod('');
      setXValue('');
      setYValue('');
      setAdSpend('');
      
      // Calculate regression
      calculateRegression(updatedData);
      showNotification('Data point added successfully', 'success');
    } else {
      showNotification('Please fill in all fields', 'error');
    }
  };

  // Calculate linear regression
  const calculateRegression = (data) => {
    if (data.length < 2) return;
    
    try {
      // Extract x and y values
      const xValues = data.map(item => item.x);
      const yValues = data.map(item => item.y);
      
      // Calculate means
      const xMean = xValues.reduce((sum, val) => sum + val, 0) / xValues.length;
      const yMean = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
      
      // Calculate slope and intercept
      let numerator = 0;
      let denominator = 0;
      
      for (let i = 0; i < xValues.length; i++) {
        numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
        denominator += Math.pow(xValues[i] - xMean, 2);
      }
      
      const slope = denominator !== 0 ? numerator / denominator : 0;
      const intercept = yMean - slope * xMean;
      
      // Calculate R-squared
      const predictions = xValues.map(x => slope * x + intercept);
      const residualSumOfSquares = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - yValues[i], 2), 0);
      const totalSumOfSquares = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
      const r2 = 1 - (residualSumOfSquares / totalSumOfSquares);
      
      setRegressionResult({ slope, intercept, r2 });
    } catch (error) {
      console.error("Error calculating regression:", error);
      showNotification('Error calculating regression', 'error');
    }
  };

  // Calculate forecast based on budget
  const calculateBudgetForecast = () => {
    if (!regressionResult || !budgetTarget || historicalData.length === 0) {
      showNotification('Please enter budget and ensure you have historical data', 'error');
      return;
    }
    
    const budget = parseFloat(budgetTarget);
    const avgCPL = getAvgCPL();
    
    // How many leads can we get with this budget
    const leads = budget / avgCPL;
    
    // How many sales will that generate
    const { slope, intercept } = regressionResult;
    const sales = slope * leads + intercept;
    
    setBudgetForecast({
      budget: budget,
      leads: leads,
      sales: sales,
      cpl: avgCPL,
      cpa: budget / sales
    });
    
    showNotification('Budget forecast calculated', 'success');
  };
  
  // Calculate budget needed for sales target
  const calculateSalesForecast = () => {
    if (!regressionResult || !salesTarget || historicalData.length === 0) {
      showNotification('Please enter sales target and ensure you have historical data', 'error');
      return;
    }
    
    const target = parseFloat(salesTarget);
    const { slope, intercept } = regressionResult;
    const avgCPL = getAvgCPL();
    
    // How many leads needed to reach the target sales
    const leads = (target - intercept) / slope;
    
    // How much budget is needed to get those leads
    const budget = leads * avgCPL;
    
    setSalesForecast({
      target: target,
      leads: leads,
      budget: budget,
      cpl: avgCPL,
      cpa: budget / target
    });
    
    showNotification('Sales forecast calculated', 'success');
  };

  // Add forecast point
  const addForecastPoint = () => {
    if (salesPeriod && xValue) {
      const newForecast = {
        period: salesPeriod,
        xValue: parseFloat(xValue)
      };
      
      setFuturePeriods([...futurePeriods, newForecast]);
      setSalesPeriod('');
      setXValue('');
      showNotification('Forecast point added', 'success');
    } else {
      showNotification('Please enter period and lead value', 'error');
    }
  };

  // Generate forecasts
  const generateForecasts = () => {
    if (!regressionResult || futurePeriods.length < 3) {
      showNotification('Please add at least 3 forecast points', 'error');
      return;
    }
    
    const { slope, intercept } = regressionResult;
    const avgCPL = getAvgCPL();
    
    const results = futurePeriods.map(period => {
      const x = period.xValue;
      const y = slope * x + intercept;
      const adSpend = x * avgCPL;
      
      return {
        period: period.period,
        x: x,
        y: y,
        adSpend: adSpend,
        cpl: avgCPL,
        cpa: adSpend / y,
        conversionRate: (y / x) * 100
      };
    });
    
    setForecasts(results);
    setShowForecasts(true);
    showNotification('Forecasts generated successfully', 'success');
  };

  // Load sample data
  const loadSampleData = () => {
    const sampleData = getSampleData();
    setHistoricalData(sampleData);
    calculateRegression(sampleData);
    showNotification('Sample data loaded', 'success');
  };

  // Export forecasts to CSV
  const exportForecasts = () => {
    if (forecasts.length === 0) {
      showNotification('No forecast data to export', 'error');
      return;
    }
    
    exportToCSV(forecasts, 'sales-forecasts.csv');
    showNotification('Forecasts exported to CSV', 'success');
  };

  // Calculate average cost per lead
  const getAvgCPL = () => {
    if (historicalData.length === 0) return 0;
    return historicalData.reduce((sum, item) => sum + item.cpl, 0) / historicalData.length;
  };

  // Calculate average cost per acquisition
  const getAvgCPA = () => {
    if (historicalData.length === 0) return 0;
    return historicalData.reduce((sum, item) => sum + item.cpa, 0) / historicalData.length;
  };

  // Calculate average conversion rate
  const getAvgConversionRate = () => {
    if (historicalData.length === 0) return 0;
    return historicalData.reduce((sum, item) => sum + item.conversionRate, 0) / historicalData.length;
  };

  // Clear all data
  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setHistoricalData([]);
      setRegressionResult(null);
      setForecasts([]);
      setShowForecasts(false);
      setFuturePeriods([]);
      setSalesPeriod('');
      setXValue('');
      setYValue('');
      setAdSpend('');
      setBudgetTarget('');
      setSalesTarget('');
      setBudgetForecast(null);
      setSalesForecast(null);
      
      // Also clear local storage
      localStorage.removeItem('historicalData');
      localStorage.removeItem('futurePeriods');
      
      showNotification('All data cleared', 'info');
    }
  };

  // Remove forecast point
  const removeForecastPoint = (index) => {
    const updated = [...futurePeriods];
    updated.splice(index, 1);
    setFuturePeriods(updated);
    showNotification('Forecast point removed', 'info');
  };

  // Remove historical data point
  const removeDataPoint = (index) => {
    const updated = [...historicalData];
    updated.splice(index, 1);
    setHistoricalData(updated);
    calculateRegression(updated);
    showNotification('Data point removed', 'info');
  };
