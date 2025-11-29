import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/dataTransform';

const PortfolioStructure = ({ client }) => {
  const aum = client?.aum || 0;
  
  // Генерируем структуру портфеля на основе AUM
  const portfolioData = [
    {
      name: 'Депозиты',
      value: Math.round(aum * 0.4),
      color: '#3b82f6',
    },
    {
      name: 'Облигации',
      value: Math.round(aum * 0.3),
      color: '#10b981',
    },
    {
      name: 'Акции',
      value: Math.round(aum * 0.2),
      color: '#f59e0b',
    },
    {
      name: 'Валюта',
      value: Math.round(aum * 0.1),
      color: '#8b5cf6',
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / aum) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
          <p className="text-sm text-gray-500">{percent}% от портфеля</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
          <Wallet className="text-purple-600" size={20} />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Структура капитала
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={portfolioData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {portfolioData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="flex flex-col justify-center space-y-3">
          {portfolioData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{formatCurrency(item.value)}</p>
                <p className="text-xs text-gray-500">
                  {((item.value / aum) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
          <div className="pt-3 border-t border-gray-200 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Общий AUM</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(aum)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioStructure;

