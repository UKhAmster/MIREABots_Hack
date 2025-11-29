// Mock данные для демонстрации интерфейса
// Структура данных соответствует формату с бэкенда

export const mockBackendClientData = {
  // Базовые данные
  id: '12345',
  age: 35,
  gender: 1, // 1 - мужской, 0 - женский
  city_smart_name: 'Москва',
  dt: '2024-01-15',
  dp_ewb_last_employment_position: 'Менеджер по продажам',

  // БКИ данные
  hdb_bki_total_max_limit: 500000,
  hdb_bki_total_cnt: 3,
  hdb_bki_total_max_overdue_sum: 0,
  hdb_bki_active_cc_max_limit: 300000,
  hdb_bki_total_pil_max_limit: 200000,
  bki_total_products: 5,

  // Доходы
  incomeValue: 125000,
  incomeValueCategory: '100k_250k',
  curr_rur_amt_cm_avg: 150000,
  dp_ils_avg_salary_1y: 120000,

  // Транзакции
  loanacc_rur_amt_cm_avg: 25000,
  turn_cur_cr_sum_v2: 450000,
  turn_cur_db_sum_v2: 380000,
  mob_cnt_days: 28,
  avg_amount_daily_transactions_90d: 12500,

  // Риски
  blacklist_flag: 0,
  ovrd_sum: 0,
  hdb_bki_total_max_overdue_sum: 0,
  label_Below_50k_share_r1: 0.15,
  label_Above_1M_share_r1: 0.05,

  // Категории трат
  hdb_bki_total_products: 2,
  transaction_category_supermarket_percent_cnt_2m: 0.35,
  transaction_category_restaurants_percent_cnt_2m: 0.20,
  avg_by_category__amount__sum__cashflowcategory_name__supermarkety: 45000,
  avg_by_category__amount__sum__cashflowcategory_name__kafe: 25000,

  // Стаж работы
  dp_ils_total_seniority: 120,
  dp_ils_max_seniority: 48,
  dp_ils_cnt_changes_1y: 0,
  dp_ils_employeers_cnt_last_month: 1,
  dp_ils_avg_simultanious_jobs_5y: 1.2,
};

// Преобразованные данные для совместимости со старым кодом
export const mockClient = {
  id: '12345',
  name: 'Иванов Иван Иванович', // Генерируется на основе данных
  age: 35,
  region: 'Москва',
  photo: 'https://via.placeholder.com/120',
  predictedIncome: 125000,
  confidence: 'Высокая',
  averageRegionalIncome: 120000,
  incomeStatus: 'above',
};

export const mockShapValues = [
  { feature: 'Траты на путешествия', value: 0.15, impact: 'positive' },
  { feature: 'Наличие вклада', value: 0.12, impact: 'positive' },
  { feature: 'Активность по картам', value: 0.10, impact: 'positive' },
  { feature: 'Возраст', value: -0.08, impact: 'negative' },
  { feature: 'Просрочки по кредитам', value: -0.05, impact: 'negative' },
  { feature: 'Низкая транзакционная активность', value: -0.03, impact: 'negative' },
];

export const mockClientDetails = {
  transactionActivity: {
    monthlyTransactions: 145,
    avgTransactionAmount: 8500,
    categories: ['Путешествия', 'Рестораны', 'Онлайн-покупки'],
  },
  creditHistory: {
    totalCredits: 3,
    activeCredits: 1,
    overduePayments: 0,
    creditScore: 850,
  },
  assets: {
    deposits: 2500000,
    cards: ['Premium', 'Debit'],
    investments: 500000,
  },
};

export const mockDashboardData = {
  // Метрики модели
  wmae: {
    current: 14200,
    change: -2.5,
    trend: 'down',
  },
  predictionsToday: 1247,
  avgPredictedIncome: 95000,
  uptime: 99.9,
  wmaeHistory: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
    value: 15000 - Math.random() * 2000 + (29 - i) * 50,
  })),
  incomeDistribution: [
    { segment: 'Low', count: 450, avgIncome: 45000 },
    { segment: 'Middle', count: 620, avgIncome: 85000 },
    { segment: 'High', count: 177, avgIncome: 150000 },
  ],

  // Агрегации по всем записям
  aggregations: {
    totalClients: 15420,
    avgIncome: 95000,
    totalLoans: 3850000000, // 3.85 млрд
    avgAge: 38.5,
    blacklistCount: 127,
    totalCreditLimit: 12500000000, // 12.5 млрд
    avgCreditsPerClient: 2.3,
    totalOverdueSum: 45000000, // 45 млн
    clientsWithOverdue: 1240,
  },

  // Динамика по датам (последние 30 дней)
  dynamics: Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    const baseIncome = 50000000;
    const baseLoans = 120000000;
    const baseClients = 50;
    const baseOverdue = 1500000;
    
    return {
      date: date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      fullDate: date.toISOString().split('T')[0],
      totalIncome: baseIncome + Math.random() * 10000000 - 5000000,
      totalLoans: baseLoans + Math.random() * 20000000 - 10000000,
      newClients: baseClients + Math.floor(Math.random() * 20 - 10),
      totalOverdue: baseOverdue + Math.random() * 500000 - 250000,
    };
  }),

  // Сегментация клиентов
  segmentation: {
    withoutOverdue: 14180, // hdb_bki_total_max_overdue_sum == 0
    newClients: 3200, // dp_ils_total_seniority < 1
    riskyClients: 127, // blacklist_flag == 1
    totalClients: 15420,
  },

  // ТОП списки
  topLists: {
    byIncome: [
      { id: '10001', income: 2500000, name: 'Клиент #10001' },
      { id: '10002', income: 2200000, name: 'Клиент #10002' },
      { id: '10003', income: 2100000, name: 'Клиент #10003' },
      { id: '10004', income: 1950000, name: 'Клиент #10004' },
      { id: '10005', income: 1800000, name: 'Клиент #10005' },
    ],
    byOverdue: [
      { id: '5001', overdue: 850000, name: 'Клиент #5001' },
      { id: '5002', overdue: 720000, name: 'Клиент #5002' },
      { id: '5003', overdue: 650000, name: 'Клиент #5003' },
      { id: '5004', overdue: 580000, name: 'Клиент #5004' },
      { id: '5005', overdue: 520000, name: 'Клиент #5005' },
    ],
    byLoans: [
      { id: '3001', loans: 2500000, name: 'Клиент #3001' },
      { id: '3002', loans: 2200000, name: 'Клиент #3002' },
      { id: '3003', loans: 2100000, name: 'Клиент #3003' },
      { id: '3004', loans: 1950000, name: 'Клиент #3004' },
      { id: '3005', loans: 1800000, name: 'Клиент #3005' },
    ],
    byBalance: [
      { id: '2001', balance: 8500000, name: 'Клиент #2001' },
      { id: '2002', balance: 7200000, name: 'Клиент #2002' },
      { id: '2003', balance: 6500000, name: 'Клиент #2003' },
      { id: '2004', balance: 5800000, name: 'Клиент #2004' },
      { id: '2005', balance: 5200000, name: 'Клиент #2005' },
    ],
  },

  // Дополнительные метрики
  additionalMetrics: {
    avgMobileActivity: 25.3, // mob_total_sessions
    totalSupermarketSpending: 125000000, // transaction_category_supermarket_sum_amt_d15
    avgCafeSpending: 8500, // avg_by_category__amount__sum__cashflowcategory_name__kafe
    investingUsers: 3420, // vert_has_app_ru_tinkoff_investing == 1
    currentOverdueSum: 32000000, // SUM(ovrd_sum > 0)
    avgLowIncomeProbability: 0.18, // AVG(label_Below_50k_share_r1)
    largeOverdueCount: 87, // COUNT(hdb_bki_total_max_overdue_sum > 10000)
  },

  // Новый дашборд: Основные KPI и тренды
  kpiDashboard: {
    // Основные KPI
    kpi: {
      totalClients: 15420,
      avgIncome: 95000,
      totalLoans: 3850000000, // 3.85 млрд
      riskClients: 127, // COUNT(blacklist_flag == 1)
      avgCreditScore: 782, // AVG(calculated_credit_score)
    },
    
    // Тренды по месяцам (последние 12 месяцев)
    monthlyTrends: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthName = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
      const monthShort = date.toLocaleDateString('ru-RU', { month: 'short' });
      
      // Базовые значения с трендом роста
      const baseIncome = 1500000000 + (11 - i) * 50000000;
      const baseLoans = 350000000 + (11 - i) * 15000000;
      const baseClients = 1200 + (11 - i) * 50;
      
      return {
        month: monthShort,
        monthFull: monthName,
        monthKey: date.toISOString().slice(0, 7), // YYYY-MM
        monthlyIncome: baseIncome + Math.random() * 100000000 - 50000000,
        monthlyLoans: baseLoans + Math.random() * 30000000 - 15000000,
        newClients: baseClients + Math.floor(Math.random() * 100 - 50),
      };
    }),
  },
};

export const mockOffers = [
  {
    id: 1,
    name: 'Alfa Travel Premium',
    description: 'Премиальная карта для путешествий',
    limit: mockClient.predictedIncome * 3,
    image: 'https://via.placeholder.com/200x120?text=Travel+Card',
    category: 'premium',
  },
  {
    id: 2,
    name: 'Инвестиционный портфель',
    description: 'Персональные инвестиционные решения',
    limit: mockClient.predictedIncome * 2,
    image: 'https://via.placeholder.com/200x120?text=Investments',
    category: 'investment',
  },
  {
    id: 3,
    name: 'Кредитная карта 365 дней без %',
    description: 'Беспроцентный период до 365 дней',
    limit: mockClient.predictedIncome * 2.5,
    image: 'https://via.placeholder.com/200x120?text=Credit+Card',
    category: 'credit',
  },
];
