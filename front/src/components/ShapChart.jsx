import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Line, LineChart, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

const ShapChart = ({ shapValues, simulationData }) => {
  const chartData = shapValues.map((item) => ({
    name: item.feature,
    value: item.value,
    impact: item.impact,
  })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-bold text-gray-900 mb-1">{data.name}</p>
          <p className={`text-sm font-semibold ${data.impact === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            Влияние: {data.impact === 'positive' ? '+' : ''}{(data.value * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Почему такой прогноз?
          </h3>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
            <span className="text-gray-600 font-medium">Повышающие</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
            <span className="text-gray-600 font-medium">Понижающие</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-5 leading-relaxed">
        Клиент активно пользуется премиальными картами и имеет вклад, что повысило прогноз на 15%. 
        Однако возраст и низкая транзакционная активность несколько снизили прогноз.
      </p>
      
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            domain={[-0.2, 0.2]}
            stroke="#9ca3af"
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#9ca3af"
            tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
            width={95}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.impact === 'positive' 
                  ? 'url(#greenGradient)' 
                  : 'url(#redGradient)'} 
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShapChart;

