import { useState, useEffect } from 'react';
import { Users, Wallet, AlertTriangle, Ban, TrendingUp, TrendingDown, PieChart as PieChartIcon, Smartphone, ShoppingCart, Coffee } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockSummaryData } from '../mockSummaryData';
import { formatCurrency } from '../utils/dataTransform';
import { fetchDashboardSummary } from '../utils/api';

const DashboardPage = () => {
  const [summaryData, setSummaryData] = useState(mockSummaryData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardSummary();
        setSummaryData({
          general: {
            totalClients: data.general.total_clients,
            avgIncome: data.general.avg_income,
            totalLoans: data.general.total_loans,
            avgAge: data.general.avg_age,
          },
          creditAndRisk: {
            totalCreditLimit: data.credit_and_risk.total_credit_limit,
            totalOverdue: data.credit_and_risk.total_overdue,
            clientsWithOverdue: data.credit_and_risk.clients_with_overdue,
            blacklistedClients: data.credit_and_risk.blacklisted_clients,
          },
          trends: {
            totalClientsChange: data.trends.total_clients_change,
            avgIncomeChange: data.trends.avg_income_change,
            totalLoansChange: data.trends.total_loans_change,
            totalOverdueChange: data.trends.total_overdue_change,
          },
        });
      } catch (error) {
        console.error('Failed to load dashboard summary, using mock data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const { general, creditAndRisk, trends, dynamics, segmentation, topClients, behaviorMetrics } = summaryData;
  const [activeTab, setActiveTab] = useState('income');

  // Форматирование для осей графиков
  const formatAxisValue = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}Млрд`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}М`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}к`;
    }
    return value.toString();
  };

  // Данные для круговых диаграмм
  const qualityData = [
    { name: 'Без просрочек', value: segmentation.clientQuality.withoutOverdue, color: '#10b981' },
    { name: 'С просрочками', value: segmentation.clientQuality.withOverdue, color: '#ef4444' },
  ];

  const riskData = [
    { name: 'Обычные', value: segmentation.risk.normal, color: '#10b981' },
    { name: 'Рисковые', value: segmentation.risk.risky, color: '#ef4444' },
  ];

  const investorData = [
    { name: 'Пользуются инвестициями', value: segmentation.investors.hasInvestments, color: '#3b82f6' },
    { name: 'Не пользуются', value: segmentation.investors.noInvestments, color: '#9ca3af' },
  ];

  const COLORS = {
    income: '#10b981',
    loans: '#3b82f6',
    overdue: '#ef4444',
    newClients: '#9ca3af',
  };

  const formatLargeNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value.toLocaleString('ru-RU');
  };

  const formatBillion = (value) => {
    return `${(value / 1000000000).toFixed(1)} Млрд ₽`;
  };

  const KPICard = ({ title, value, icon: Icon, formatter, trend, trendValue }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          <Icon className="text-gray-600" size={20} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
            trend === 'up' && trendValue > 0
              ? 'bg-red-50 text-red-600'
              : trend === 'down' && trendValue < 0
              ? 'bg-green-50 text-green-600'
              : 'bg-gray-50 text-gray-600'
          }`}>
            {trendValue > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(trendValue).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-sm text-gray-500 mb-2 font-medium">{title}</h3>
      <p className={`text-2xl font-bold ${
        trend === 'up' && trendValue > 0 ? 'text-red-600' : 'text-gray-900'
      }`}>
        {formatter ? formatter(value) : value}
      </p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Сводная информация по доходам банка
        </h1>
        <p className="text-gray-600">
          Общие показатели и анализ кредитного портфеля
        </p>
      </div>

      {/* Ряд 1: Общие показатели (General) */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Общие показатели</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Всего клиентов"
            value={general.totalClients}
            icon={Users}
            formatter={formatLargeNumber}
            trend="up"
            trendValue={trends.totalClientsChange}
          />
          <KPICard
            title="Средний доход"
            value={general.avgIncome}
            icon={Wallet}
            formatter={(val) => formatCurrency(val)}
            trend="down"
            trendValue={trends.avgIncomeChange}
          />
          <KPICard
            title="Общая сумма кредитов"
            value={general.totalLoans}
            icon={Wallet}
            formatter={formatBillion}
            trend="up"
            trendValue={trends.totalLoansChange}
          />
          <KPICard
            title="Средний возраст"
            value={general.avgAge}
            icon={Users}
            formatter={(val) => `${val.toFixed(1)} лет`}
          />
        </div>
      </div>

      {/* Ряд 2: Кредитный портфель и Риски (Credit & Risk) */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Кредитный портфель и Риски</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Общий кредитный лимит"
            value={creditAndRisk.totalCreditLimit}
            icon={Wallet}
            formatter={formatBillion}
          />
          <KPICard
            title="Общая сумма просрочек"
            value={creditAndRisk.totalOverdue}
            icon={AlertTriangle}
            formatter={(val) => formatCurrency(val)}
            trend="up"
            trendValue={trends.totalOverdueChange}
          />
          <KPICard
            title="Клиентов с просрочками"
            value={creditAndRisk.clientsWithOverdue}
            icon={AlertTriangle}
            formatter={(val) => val.toLocaleString('ru-RU')}
          />
          <KPICard
            title="В черном списке"
            value={creditAndRisk.blacklistedClients}
            icon={Ban}
            formatter={(val) => val.toLocaleString('ru-RU')}
          />
        </div>
      </div>

      {/* Графики Динамики */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Динамика показателей</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Динамика финансов */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Динамика финансов</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dynamics} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  tickFormatter={formatAxisValue}
                  width={60}
                />
                <Tooltip 
                  formatter={(value) => formatAxisValue(value)}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalIncome" 
                  name="Доходы"
                  stroke={COLORS.income} 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalLoans" 
                  name="Кредиты"
                  stroke={COLORS.loans} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Динамика качества портфеля */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Динамика качества портфеля</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={dynamics} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#6b7280"
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  tickFormatter={formatAxisValue}
                  width={60}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#6b7280"
                  fontSize={11}
                  tick={{ fill: '#6b7280' }}
                  width={50}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'Просрочки') {
                      return formatCurrency(value);
                    }
                    return value;
                  }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="totalOverdue" 
                  name="Просрочки"
                  stroke={COLORS.overdue} 
                  fill={COLORS.overdue}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="newClients" 
                  name="Новые клиенты"
                  stroke={COLORS.newClients} 
                  fill={COLORS.newClients}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Блок Сегментации */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Сегментация клиентов</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Качество клиентов */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <PieChartIcon className="text-gray-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Качество клиентов</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={qualityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {qualityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value.toLocaleString('ru-RU')}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {qualityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {item.value.toLocaleString('ru-RU')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Риск */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="text-gray-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Риск</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value.toLocaleString('ru-RU')}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {riskData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {item.value.toLocaleString('ru-RU')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Инвесторы */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <Wallet className="text-gray-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-800">Инвесторы</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={investorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {investorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => value.toLocaleString('ru-RU')}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {investorData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {item.value.toLocaleString('ru-RU')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ТОП Клиентов и Поведенческая аналитика */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">ТОП Клиентов и Поведенческая аналитика</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Таблица ТОП клиентов */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Табы */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-1 p-2">
                {[
                  { id: 'income', label: 'По Доходам' },
                  { id: 'overdue', label: 'По Просрочкам' },
                  { id: 'loans', label: 'По Кредитам' },
                  { id: 'balance', label: 'По Балансам' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-alpha-red text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Таблица */}
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Место</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ФИО</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      {activeTab === 'income' && 'Доход'}
                      {activeTab === 'overdue' && 'Сумма просрочки'}
                      {activeTab === 'loans' && 'Сумма кредитов'}
                      {activeTab === 'balance' && 'Баланс'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let data = [];
                    if (activeTab === 'income') {
                      data = topClients.byIncome;
                    } else if (activeTab === 'overdue') {
                      data = topClients.byOverdue;
                    } else if (activeTab === 'loans') {
                      data = topClients.byLoans;
                    } else if (activeTab === 'balance') {
                      data = topClients.byBalance;
                    }

                    return data.map((client, index) => (
                      <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-alpha-red text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-yellow-500 text-white' :
                            'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{client.id}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{client.name}</td>
                        <td className={`py-3 px-4 text-sm font-semibold text-right ${
                          activeTab === 'overdue' ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {activeTab === 'income' && formatCurrency(client.incomeValue)}
                          {activeTab === 'overdue' && formatCurrency(client.overdueSum)}
                          {activeTab === 'loans' && formatCurrency(client.loanAmount)}
                          {activeTab === 'balance' && formatCurrency(client.balance)}
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Карточки Поведения и Трат */}
          <div className="space-y-4">
            {/* Активность в приложении */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Smartphone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Активность в приложении</h3>
                    <p className="text-xs text-gray-400">Среднее количество сессий</p>
                  </div>
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900">
                {behaviorMetrics.mobileSessions.toFixed(1)}
              </p>
            </div>

            {/* Траты в супермаркетах */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <ShoppingCart className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Траты в супермаркетах</h3>
                    <p className="text-xs text-gray-400">За последние 15 дней</p>
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-3">
                {formatCurrency(behaviorMetrics.supermarketSpending)}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((behaviorMetrics.supermarketSpending / general.totalLoans) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {((behaviorMetrics.supermarketSpending / general.totalLoans) * 100).toFixed(2)}% от общего оборота
              </p>
            </div>

            {/* Траты в кафе */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Coffee className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Траты в кафе</h3>
                    <p className="text-xs text-gray-400">Среднее значение</p>
                  </div>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(behaviorMetrics.cafeSpending)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
