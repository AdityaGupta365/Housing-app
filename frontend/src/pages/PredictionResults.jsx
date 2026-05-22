import React from 'react';

const PredictionResults = ({ prediction }) => {
  const { predicted_rent, confidence_interval, market_insights } = prediction;
  
  const confidenceWidth = ((confidence_interval.upper - confidence_interval.lower) / predicted_rent) * 100;
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="text-green-600 mr-2">💰</span>
        Predicted Rent Price
      </h3>
      
      {/* Main Prediction */}
      <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">
            ₹{predicted_rent.toLocaleString()}
          </div>
          <div className="text-gray-600">per month</div>
        </div>
        
        {/* Confidence Interval */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700 mb-2 text-center">
            <strong>95% Confidence Range</strong>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-orange-600 font-medium">
              ₹{confidence_interval.lower.toLocaleString()}
            </span>
            <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full relative">
              <div 
                className="h-2 bg-gradient-to-r from-orange-400 to-green-400 rounded-full"
                style={{ width: '100%' }}
              ></div>
              <div 
                className="absolute top-0 w-1 h-2 bg-green-600 rounded-full transform -translate-x-1/2"
                style={{ left: '50%' }}
              ></div>
            </div>
            <span className="text-green-600 font-medium">
              ₹{confidence_interval.upper.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Confidence Indicator */}
        <div className="mt-3 text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            confidenceWidth < 20 ? 'bg-green-100 text-green-800' :
            confidenceWidth < 40 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {confidenceWidth < 20 ? '🎯 High Confidence' :
             confidenceWidth < 40 ? '⚡ Medium Confidence' :
             '⚠️ Variable Range'}
          </span>
        </div>
      </div>

      {/* Market Insights */}
      {market_insights && market_insights.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="text-blue-500 mr-2">💡</span>
            AI Market Insights
          </h4>
          <div className="space-y-2">
            {market_insights.map((insight, index) => (
              <div key={index} className="flex items-start">
                <span className="text-blue-500 mr-2 mt-1">•</span>
                <span className="text-gray-700 text-sm">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;

