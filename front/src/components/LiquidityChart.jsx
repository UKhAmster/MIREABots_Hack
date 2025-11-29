import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from 'recharts';
import { formatCurrency } from '../utils/dataTransform';

const LiquidityChart = ({ client }) => {
  // Генерируем исторические данные и прогноз
  const generateData = () => {
    const data = [];
    const today = new Date();
    const predictedLiquidity = client?.predictedLiquidity || client?.predictedIncome || 0;
    
    // Исторические данные (последние 6 месяцев)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const monthLabel = date.toLocaleDateString('ru-RU', { month: 'short' });
      
      const baseIncome = predictedLiquidity * 0.9;
      const baseExpenses = predictedLiquidity * 0.7;
      
      data.push({
        month: monthLabel,
        date: date.toISOString().slice(0, 7),
        income: baseIncome + Math.random() * predictedLiquidity * 0.2 - predictedLiquidity * 0.1,
        expenses: baseExpenses + Math.random() * predictedLiquidity * 0.1 - predictedLiquidity * 0.05,
      });
    }
    
    // Прогноз на 3 месяца вперед
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() + i);
      const monthLabel = date.toLocaleDateString('ru-RU', { month: 'short' });
      
      data.push({
        month: monthLabel,
        date: date.toISOString().slice(0, 7),
        income: predictedLiquidity + Math.random() * predictedLiquidity * 0.1 - predictedLiquidity * 0.05,
        expenses: predictedLiquidity * 0.7 + Math.random() * predictedLiquidity * 0.05,
        isForecast: true,
      });
    }
    
    return data;
  };

  const chartData = generateData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const liquidity = data.income - data.expenses;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-bold text-gray-900 mb-2">{data.month}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600 font-semibold">Доходы:</span>{' '}
              {formatCurrency(data.income)}
            </p>
            <p className="text-sm">
              <span className="text-red-600 font-semibold">Расходы:</span>{' '}
              {formatCurrency(data.expenses)}
            </p>
            <p className="text-sm font-bold text-green-600 pt-2 border-t border-gray-200">
              Свободная ликвидность: {formatCurrency(liquidity)}
            </p>
            {data.isForecast && (
              <p className="text-xs text-gray-500 italic mt-1">ML Прогноз</p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Динамика ликвидности
        </h3>
        <p className="text-sm text-gray-600">
          Зона инвестиций — разница между доходами и расходами
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}М`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}к`;
              return value.toString();
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Зона инвестиций (Area между доходами и расходами) */}
          <Area
            dataKey="income"
            stroke="none"
            fill="url(#liquidityGradient)"
            fillOpacity={0.3}
          />
          
          {/* Столбцы расходов */}
          <Bar 
            dataKey="expenses" 
            fill="#ef4444" 
            radius={[8, 8, 0, 0]}
            opacity={0.7}
            name="Расходы"
          />
          
          {/* Линия доходов */}
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            strokeDasharray={chartData[chartData.length - 3]?.isForecast ? '5 5' : '0'}
            name="Доходы"
          />
          
          <defs>
            <linearGradient id="liquidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Доходы (ML прогноз)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600">Расходы</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded opacity-50"></div>
          <span className="text-gray-600">Зона инвестиций</span>
        </div>
      </div>
    </div>
  );
};

export default LiquidityChart;

