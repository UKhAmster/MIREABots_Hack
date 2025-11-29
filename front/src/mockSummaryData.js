// Mock данные для страницы "Сводная информация по доходам банка"

// Генерация данных для динамики за последние 30 дней
const generateDynamicsData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dt = date.toISOString().split('T')[0];
    const dateLabel = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    
    // Базовые значения с небольшими случайными колебаниями
    const baseIncome = 1500000000 + (29 - i) * 2000000;
    const baseLoans = 1200000000 + (29 - i) * 1500000;
    const baseOverdue = 40000000 + (29 - i) * 200000;
    const baseNewClients = 1200 + (29 - i) * 15;
    
    data.push({
      dt,
      date: dateLabel,
      totalIncome: baseIncome + Math.random() * 50000000 - 25000000,
      totalLoans: baseLoans + Math.random() * 30000000 - 15000000,
      totalOverdue: baseOverdue + Math.random() * 2000000 - 1000000,
      newClients: Math.round(baseNewClients + Math.random() * 50 - 25),
    });
  }
  
  return data;
};

export const mockSummaryData = {
  // Ряд 1: Общие показатели (General)
  general: {
    totalClients: 1245000, // COUNT(['id'])
    avgIncome: 85400, // AVG(['incomeValue'])
    totalLoans: 45200000000, // SUM(['loanacc_rur_amt_cm_avg']) - 45.2 млрд
    avgAge: 38.5, // AVG(['age'])
  },

  // Ряд 2: Кредитный портфель и Риски (Credit & Risk)
  creditAndRisk: {
    totalCreditLimit: 125000000000, // SUM(['hdb_bki_total_max_limit']) - 125 млрд
    totalOverdue: 45000000, // SUM(['hdb_bki_total_max_overdue_sum'])
    clientsWithOverdue: 12450, // COUNT(['hdb_bki_total_max_overdue_sum'] > 0)
    blacklistedClients: 127, // COUNT(['blacklist_flag'])
  },

  // Дополнительные данные для динамики (опционально)
  trends: {
    totalClientsChange: 2.3, // процент изменения
    avgIncomeChange: -1.2, // процент изменения
    totalLoansChange: 5.7, // процент изменения
    totalOverdueChange: 8.5, // процент изменения (растет - красный)
  },

  // Данные для графиков динамики
  dynamics: generateDynamicsData(),

  // Данные для сегментации
  segmentation: {
    // Качество клиентов: без просрочек vs с просрочками
    clientQuality: {
      withoutOverdue: 1232550, // hdb_bki_total_max_overdue_sum == 0
      withOverdue: 12450, // hdb_bki_total_max_overdue_sum > 0
    },
    // Риск: рисковые vs обычные
    risk: {
      risky: 127, // blacklist_flag == 1
      normal: 1244873, // blacklist_flag == 0
    },
    // Инвесторы: пользуются инвестициями vs нет
    investors: {
      hasInvestments: 186750, // vert_has_app_ru_tinkoff_investing == 1 (15%)
      noInvestments: 1058250, // vert_has_app_ru_tinkoff_investing == 0 (85%)
    },
  },

  // ТОП клиентов по разным категориям
  topClients: {
    byIncome: [
      { id: '78901', name: 'Иванов Иван Иванович', incomeValue: 2500000 },
      { id: '78902', name: 'Петрова Анна Сергеевна', incomeValue: 2200000 },
      { id: '78903', name: 'Сидоров Петр Александрович', incomeValue: 1950000 },
      { id: '78904', name: 'Козлова Мария Дмитриевна', incomeValue: 1800000 },
      { id: '78905', name: 'Смирнов Алексей Викторович', incomeValue: 1650000 },
    ],
    byOverdue: [
      { id: '12345', name: 'Васильев Василий Васильевич', overdueSum: 1250000 },
      { id: '12346', name: 'Николаев Николай Николаевич', overdueSum: 980000 },
      { id: '12347', name: 'Александров Александр Александрович', overdueSum: 875000 },
      { id: '12348', name: 'Дмитриев Дмитрий Дмитриевич', overdueSum: 720000 },
      { id: '12349', name: 'Сергеев Сергей Сергеевич', overdueSum: 650000 },
    ],
    byLoans: [
      { id: '45601', name: 'Федоров Федор Федорович', loanAmount: 8500000 },
      { id: '45602', name: 'Михайлов Михаил Михайлович', loanAmount: 7200000 },
      { id: '45603', name: 'Андреев Андрей Андреевич', loanAmount: 6800000 },
      { id: '45604', name: 'Владимиров Владимир Владимирович', loanAmount: 6200000 },
      { id: '45605', name: 'Павлов Павел Павлович', loanAmount: 5800000 },
    ],
    byBalance: [
      { id: '32101', name: 'Романов Роман Романович', balance: 15000000 },
      { id: '32102', name: 'Тимофеев Тимофей Тимофеевич', balance: 12800000 },
      { id: '32103', name: 'Артемьев Артем Артемович', balance: 11500000 },
      { id: '32104', name: 'Максимов Максим Максимович', balance: 10200000 },
      { id: '32105', name: 'Егоров Егор Егорович', balance: 9500000 },
    ],
  },

  // Поведенческая аналитика
  behaviorMetrics: {
    mobileSessions: 28.5, // AVG(['mob_total_sessions'])
    supermarketSpending: 1250000000, // SUM(['transaction_category_supermarket_sum_amt_d15'])
    cafeSpending: 45000, // AVG(['avg_by_category__amount__sum__cashflowcategory_name__kafe'])
  },
};

