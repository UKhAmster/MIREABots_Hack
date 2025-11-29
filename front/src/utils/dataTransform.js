export const transformClientData = (backendData) => {
  return {
    id: backendData.id,
    age: backendData.age,
    gender: backendData.gender === 1 ? 'Мужской' : 'Женский',
    city: backendData.city_smart_name,
    lastActivityDate: backendData.dt,
    position: backendData.dp_ewb_last_employment_position || 'Не указано',
    
    predictedIncome: backendData.incomeValue || 0,
    incomeCategory: backendData.incomeValueCategoryLabel || backendData.incomeValueCategory || 'Не определено',
    confidence: backendData.confidence || 'Средняя',
    averageRegionalIncome: backendData.averageRegionalIncome || 0,
    incomeStatus: backendData.incomeStatus || 'normal',
    incomeStatusLabel: backendData.incomeStatusLabel || 'В норме',
    debtLoadPercent: backendData.debtLoadPercent || 0,
    
    bki: {
      totalMaxLimit: backendData.hdb_bki_total_max_limit || 0,
      totalProducts: backendData.hdb_bki_total_cnt || 0,
      maxOverdueSum: backendData.hdb_bki_total_max_overdue_sum || 0,
      activeCcMaxLimit: backendData.hdb_bki_active_cc_max_limit || 0,
      pilMaxLimit: backendData.hdb_bki_total_pil_max_limit || 0,
      totalProductsCount: backendData.bki_total_products || 0,
    },
    
    finances: {
      avgBalance: backendData.curr_rur_amt_cm_avg || 0,
      avgSalary1y: backendData.dp_ils_avg_salary_1y || 0,
      avgLoanAmount: backendData.loanacc_rur_amt_cm_avg || 0,
      creditTurnover: backendData.turn_cur_cr_sum_v2 || 0,
      debitTurnover: backendData.turn_cur_db_sum_v2 || 0,
      avgDailyTransactions90d: backendData.avg_amount_daily_transactions_90d || 0,
    },
    
    risks: {
      blacklistFlag: backendData.blacklist_flag === 1,
      currentOverdueSum: backendData.ovrd_sum || 0,
      maxOverdueSum: backendData.hdb_bki_total_max_overdue_sum || 0,
      probBelow50k: backendData.label_Below_50k_share_r1 || 0,
      probAbove1M: backendData.label_Above_1M_share_r1 || 0,
    },
    
    activity: {
      mobileDays: backendData.mob_cnt_days || 0,
      supermarketPercent: backendData.transaction_category_supermarket_percent_cnt_2m || 0,
      restaurantsPercent: backendData.transaction_category_restaurants_percent_cnt_2m || 0,
      supermarketAmount: backendData.avg_by_category__amount__sum__cashflowcategory_name__supermarkety || 0,
      cafeAmount: backendData.avg_by_category__amount__sum__cashflowcategory_name__kafe || 0,
    },
    
    employment: {
      totalSeniority: backendData.dp_ils_total_seniority || 0,
      maxSeniority: backendData.dp_ils_max_seniority || 0,
      jobChanges1y: backendData.dp_ils_cnt_changes_1y || 0,
      employersLastMonth: backendData.dp_ils_employeers_cnt_last_month || 0,
      simultaneousJobs5y: backendData.dp_ils_avg_simultanious_jobs_5y || 0,
    },
    
    bankProducts: backendData.hdb_bki_total_products || 0,
  };
};


export const formatCurrency = (value) => {
  if (!value && value !== 0) return '0 ₽';
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
};

export const formatPercent = (value) => {
  if (!value && value !== 0) return '0%';
  return `${(value * 100).toFixed(1)}%`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Не указано';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getIncomeStatus = (clientData) => {
  if (clientData.incomeStatus && clientData.incomeStatusLabel) {
    return {
      status: clientData.incomeStatus,
      label: clientData.incomeStatusLabel,
    };
  }
  return { status: 'normal', label: 'В норме' };
};

