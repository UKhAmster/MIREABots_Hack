// API утилиты для работы с бэкендом

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Получает данные клиента по ID
 * @param {string} clientId - ID клиента
 * @returns {Promise<Object>} Данные клиента с бэкенда
 */
export const fetchClientData = async (clientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching client data:', error);
    throw error;
  }
};

/**
 * Получает SHAP значения для клиента
 * @param {string} clientId - ID клиента
 * @returns {Promise<Array>} Массив SHAP значений
 */
export const fetchShapValues = async (clientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/shap`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching SHAP values:', error);
    throw error;
  }
};

/**
 * Получает сводную информацию по доходам банка
 * @returns {Promise<Object>} Сводная информация
 */
export const fetchDashboardSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

/**
 * Получает агрегированные данные по банку
 * @returns {Promise<Object>} Агрегированные данные
 */
export const fetchBankAggregations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/aggregations`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bank aggregations:', error);
    throw error;
  }
};

/**
 * Получает динамику по датам
 * @param {number} days - Количество дней (по умолчанию 30)
 * @returns {Promise<Array>} Массив данных по датам
 */
export const fetchDynamics = async (days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/dynamics?days=${days}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dynamics:', error);
    throw error;
  }
};

/**
 * Получает ТОП списки клиентов
 * @param {string} sortBy - Поле для сортировки (income, overdue, loans, balance)
 * @param {number} limit - Количество записей (по умолчанию 5)
 * @returns {Promise<Array>} Массив клиентов
 */
export const fetchTopClients = async (sortBy = 'income', limit = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/top?sort_by=${sortBy}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top clients:', error);
    throw error;
  }
};

/**
 * Получает данные сегментации клиентов
 * @returns {Promise<Object>} Данные сегментации
 */
export const fetchSegmentation = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/segmentation`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching segmentation:', error);
    throw error;
  }
};

/**
 * Получает основные KPI для нового дашборда
 * @returns {Promise<Object>} KPI данные
 */
export const fetchKPIDashboard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/kpi`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching KPI dashboard:', error);
    throw error;
  }
};

/**
 * Получает месячные тренды
 * @param {number} months - Количество месяцев (по умолчанию 12)
 * @returns {Promise<Array>} Массив данных по месяцам
 */
export const fetchMonthlyTrends = async (months = 12) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/monthly-trends?months=${months}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    throw error;
  }
};

/**
 * Получает персональные рекомендации (офферы) для клиента
 * @param {string} clientId - ID клиента
 * @returns {Promise<Object>} Рекомендации с офферами
 */
export const fetchClientOffers = async (clientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/offers`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching client offers:', error);
    throw error;
  }
};

/**
 * Выполняет симуляцию What-If Analysis для клиента
 * @param {string} clientId - ID клиента
 * @param {Object} simulationParams - Параметры симуляции
 * @returns {Promise<Object>} Результат симуляции
 */
export const simulateClient = async (clientId, simulationParams) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationParams),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error simulating client:', error);
    throw error;
  }
};

/**
 * Экспортирует отчет по клиенту в PDF
 * @param {string} clientId - ID клиента
 * @returns {Promise<Blob>} PDF файл
 */
export const exportClientReport = async (clientId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error;
  }
};

