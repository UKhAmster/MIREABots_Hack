// Утилиты для преобразования данных дашборда с бэкенда

import { formatCurrency, formatPercent } from './dataTransform';

/**
 * Преобразует агрегированные данные с бэкенда в формат для UI
 */
export const transformAggregations = (backendData) => {
  return {
    totalClients: backendData.total_clients || backendData.count_id || 0,
    avgIncome: backendData.avg_income || backendData.avg_incomeValue || 0,
    totalLoans: backendData.total_loans || backendData.sum_loanacc_rur_amt_cm_avg || 0,
    avgAge: backendData.avg_age || backendData.avg_age || 0,
    blacklistCount: backendData.blacklist_count || backendData.count_blacklist_flag || 0,
    totalCreditLimit: backendData.total_credit_limit || backendData.sum_hdb_bki_total_max_limit || 0,
    avgCreditsPerClient: backendData.avg_credits || backendData.avg_hdb_bki_total_cnt || 0,
    totalOverdueSum: backendData.total_overdue || backendData.sum_hdb_bki_total_max_overdue_sum || 0,
    clientsWithOverdue: backendData.clients_with_overdue || backendData.count_overdue || 0,
  };
};

/**
 * Преобразует данные динамики с бэкенда
 */
export const transformDynamics = (backendData) => {
  if (!Array.isArray(backendData)) {
    return [];
  }

  return backendData.map(item => ({
    date: formatDateShort(item.dt || item.date),
    fullDate: item.dt || item.date,
    totalIncome: item.sum_incomeValue || item.total_income || 0,
    totalLoans: item.sum_loanacc_rur_amt_cm_avg || item.total_loans || 0,
    newClients: item.count_id || item.new_clients || 0,
    totalOverdue: item.sum_ovrd_sum || item.total_overdue || 0,
  }));
};

/**
 * Преобразует данные сегментации с бэкенда
 */
export const transformSegmentation = (backendData) => {
  return {
    withoutOverdue: backendData.without_overdue || backendData.count_no_overdue || 0,
    newClients: backendData.new_clients || backendData.count_new_clients || 0,
    riskyClients: backendData.risky_clients || backendData.count_blacklist || 0,
    totalClients: backendData.total_clients || 0,
  };
};

/**
 * Преобразует ТОП список клиентов
 */
export const transformTopList = (backendData, sortBy = 'income') => {
  if (!Array.isArray(backendData)) {
    return [];
  }

  const valueKeyMap = {
    income: 'incomeValue',
    overdue: 'hdb_bki_total_max_overdue_sum',
    loans: 'loanacc_rur_amt_cm_avg',
    balance: 'curr_rur_amt_cm_avg',
  };

  const valueKey = valueKeyMap[sortBy] || 'incomeValue';

  return backendData.map((item, index) => ({
    id: item.id || `client_${index}`,
    name: item.name || `Клиент #${item.id}`,
    [sortBy]: item[valueKey] || 0,
  }));
};

/**
 * Преобразует дополнительные метрики
 */
export const transformAdditionalMetrics = (backendData) => {
  return {
    avgMobileActivity: backendData.avg_mob_total_sessions || backendData.avg_mobile_activity || 0,
    totalSupermarketSpending: backendData.sum_supermarket || 
      backendData.sum_transaction_category_supermarket_sum_amt_d15 || 0,
    avgCafeSpending: backendData.avg_cafe || 
      backendData.avg_by_category__amount__sum__cashflowcategory_name__kafe || 0,
    investingUsers: backendData.count_investing || 
      backendData.count_vert_has_app_ru_tinkoff_investing || 0,
    currentOverdueSum: backendData.sum_current_overdue || backendData.sum_ovrd_sum_positive || 0,
    avgLowIncomeProbability: backendData.avg_low_income_prob || 
      backendData.avg_label_Below_50k_share_r1 || 0,
    largeOverdueCount: backendData.count_large_overdue || 
      backendData.count_hdb_bki_total_max_overdue_sum_large || 0,
  };
};

/**
 * Преобразует основные KPI для нового дашборда
 */
export const transformKPIDashboard = (backendData) => {
  return {
    kpi: {
      totalClients: backendData.total_clients || backendData.count_id || 0,
      avgIncome: backendData.avg_income || backendData.avg_incomeValue || 0,
      totalLoans: backendData.total_loans || backendData.sum_loanacc_rur_amt_cm_avg || 0,
      riskClients: backendData.risk_clients || backendData.count_blacklist_flag || 0,
      avgCreditScore: backendData.avg_credit_score || backendData.avg_calculated_credit_score || 0,
    },
  };
};

/**
 * Преобразует месячные тренды с бэкенда
 */
export const transformMonthlyTrends = (backendData) => {
  if (!Array.isArray(backendData)) {
    return [];
  }

  return backendData.map(item => {
    const date = new Date(item.month || item.dt || item.date);
    const monthShort = date.toLocaleDateString('ru-RU', { month: 'short' });
    const monthFull = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    
    return {
      month: monthShort,
      monthFull: monthFull,
      monthKey: item.month || item.dt || item.date,
      monthlyIncome: item.monthly_income || item.sum_incomeValue || item.total_income || 0,
      monthlyLoans: item.monthly_loans || item.sum_loanacc_rur_amt_cm_avg || item.total_loans || 0,
      newClients: item.new_clients || item.count_id || item.new_clients_count || 0,
    };
  }).sort((a, b) => {
    // Сортируем по дате
    return new Date(a.monthKey) - new Date(b.monthKey);
  });
};

/**
 * Форматирует дату в короткий формат (дд.мм)
 */
const formatDateShort = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
};

/**
 * Форматирует дату
 */
const formatDate = (dateString) => {
  if (!dateString) return 'Не указано';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

