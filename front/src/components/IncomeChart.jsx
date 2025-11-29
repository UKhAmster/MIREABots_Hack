import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts';
import { formatCurrency } from '../utils/dataTransform';

const IncomeChart = ({ originalIncome, simulatedIncome, simulationActive }) => {
  const data = [
    { period: 'Текущий прогноз', current: originalIncome, potential: simulationActive ? simulatedIncome : null },
    { period: 'Потенциальный', current: originalIncome, potential: simulationActive ? simulatedIncome : null },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
        Прогноз дохода
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF3124" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#EF3124" stopOpacity={0}/>
            </linearGradient>
            {simulationActive && (
              <linearGradient id="colorPotential" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="period" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}к`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value) => formatCurrency(value)}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="current" 
            stroke="#EF3124" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCurrent)"
            name="Текущий прогноз"
          />
          {simulationActive && simulatedIncome && (
            <Area 
              type="monotone" 
              dataKey="potential" 
              stroke="#3b82f6" 
              strokeWidth={3}
              strokeDasharray="5 5"
              fillOpacity={0.3}
              fill="url(#colorPotential)"
              name="Потенциальный доход"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;

