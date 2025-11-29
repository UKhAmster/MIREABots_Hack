import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, TrendingDown, RotateCcw, CheckCircle, CreditCard, Wallet, Building2, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/dataTransform';
import { simulateClient } from '../utils/api';

const SimulationPanel = ({ client, clientData, onApply, onSimulationChange, isActive: externalActive, onToggle }) => {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  
  useEffect(() => {
    if (externalActive !== undefined) {
      setIsActive(externalActive);
    }
  }, [externalActive]);

  const handleToggle = (active) => {
    setIsActive(active);
    if (onToggle) {
      onToggle(active);
    }
    if (!active) {
      setSimulationResult(null);
    }
  };

  const [values, setValues] = useState({
    debtLoadPercent: 100,
    monthlySpend: 0,
    salaryProject: false,
    hasDeposit: false,
  });

  const originalIncome = client?.predictedIncome || client?.incomeValue || 0;
  const originalDebtLoadPercent = client?.debtLoadPercent || 0;
  const originalMonthlySpend = clientData?.finances?.debitTurnover || 0;

  useEffect(() => {
    if (clientData && client) {
      setValues({
        debtLoadPercent: originalDebtLoadPercent,
        monthlySpend: originalMonthlySpend,
        salaryProject: false,
        hasDeposit: false,
      });
    }
  }, [clientData, client, originalDebtLoadPercent, originalMonthlySpend]);

  useEffect(() => {
    if (isActive && client?.id) {
      const debounceTimer = setTimeout(() => {
        performSimulation();
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSimulationResult(null);
    }
  }, [isActive, values, client?.id]);

  const performSimulation = async () => {
    if (!client?.id) return;
    
    setIsLoading(true);
    try {
      const result = await simulateClient(client.id, {
        debtLoadPercent: values.debtLoadPercent,
        monthlySpend: values.monthlySpend,
        salaryProject: values.salaryProject,
        hasDeposit: values.hasDeposit,
      });
      
      setSimulationResult(result);
      
      if (onSimulationChange) {
        onSimulationChange({
          isActive,
          newIncome: result.newIncome,
          delta: result.delta,
          values,
        });
      }
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setValues({
      debtLoadPercent: originalDebtLoadPercent,
      monthlySpend: originalMonthlySpend,
      salaryProject: false,
      hasDeposit: false,
    });
  };

  const handleApply = () => {
    if (onApply && simulationResult) {
      onApply({
        ...client,
        predictedIncome: simulationResult.newIncome,
        simulated: true,
        simulationDelta: simulationResult.delta,
        simulationValues: values,
      });
    }
  };

  if (!client) return null;

  if (!client) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 border-2 border-blue-300 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Calculator className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    What-If Analysis
                  </h3>
                  <p className="text-sm text-gray-600">Симуляция изменений параметров</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <RotateCcw size={16} />
                <span>Сбросить</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="text-blue-600" size={20} />
                  <label className="block text-sm font-semibold text-gray-700">
                    Кредитная нагрузка
                  </label>
                </div>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={values.debtLoadPercent}
                    onChange={(e) => handleChange('debtLoadPercent', Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{Math.round(values.debtLoadPercent)}%</span>
                    <span className="text-sm text-gray-500">
                      Исходное: {Math.round(originalDebtLoadPercent)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Каждые 10% снижения = +5 000 ₽ к прогнозу
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <Wallet className="text-green-600" size={20} />
                  <label className="block text-sm font-semibold text-gray-700">
                    Транзакции по картам (месяц)
                  </label>
                </div>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={Math.round(values.monthlySpend)}
                    onChange={(e) => handleChange('monthlySpend', Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg font-semibold"
                    min={0}
                  />
                  <p className="text-xs text-gray-500">
                    Исходное: {formatCurrency(originalMonthlySpend)}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Building2 className="text-purple-600" size={20} />
                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-1">
                        Зарплатный проект
                      </span>
                      <span className="text-xs text-gray-500">
                        Подключение увеличивает прогноз на 15%
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values.salaryProject}
                      onChange={(e) => handleChange('salaryProject', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-purple-600"></div>
                  </label>
                </label>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="text-yellow-600" size={20} />
                    <div>
                      <span className="block text-sm font-semibold text-gray-700 mb-1">
                        Наличие вклада
                      </span>
                      <span className="text-xs text-gray-500">
                        Наличие вклада увеличивает прогноз на 8%
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values.hasDeposit}
                      onChange={(e) => handleChange('hasDeposit', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-500 peer-checked:to-yellow-600"></div>
                  </label>
                </label>
              </div>
            </div>

            {isLoading ? (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl mb-4">
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3">Пересчет...</span>
                </div>
              </div>
            ) : simulationResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-xl mb-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-2">Новый прогнозируемый доход</p>
                    <motion.p
                      key={simulationResult.newIncome}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-bold"
                    >
                      {formatCurrency(simulationResult.newIncome)}
                    </motion.p>
                  </div>
                  {simulationResult.delta !== 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`flex flex-col items-center px-6 py-4 rounded-xl ${
                        simulationResult.delta > 0 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      } shadow-lg`}
                    >
                      {simulationResult.delta > 0 ? (
                        <TrendingUp size={24} className="mb-2" />
                      ) : (
                        <TrendingDown size={24} className="mb-2" />
                      )}
                      <span className="text-2xl font-bold">
                        {simulationResult.delta > 0 ? '+' : ''}{formatCurrency(simulationResult.delta)}
                      </span>
                    </motion.div>
                  )}
                </div>
                <p className="text-sm opacity-75 mt-3">
                  Исходный прогноз: {formatCurrency(originalIncome)}
                </p>
                {simulationResult.factors && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs opacity-75 mb-2">Влияние факторов:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {simulationResult.factors.debtLoadImpact !== 0 && (
                        <div>Кредитная нагрузка: {simulationResult.factors.debtLoadImpact > 0 ? '+' : ''}{formatCurrency(simulationResult.factors.debtLoadImpact)}</div>
                      )}
                      {simulationResult.factors.salaryProjectImpact !== 0 && (
                        <div>Зарплатный проект: {simulationResult.factors.salaryProjectImpact > 0 ? '+' : ''}{formatCurrency(simulationResult.factors.salaryProjectImpact)}</div>
                      )}
                      {simulationResult.factors.monthlySpendImpact !== 0 && (
                        <div>Транзакции: {simulationResult.factors.monthlySpendImpact > 0 ? '+' : ''}{formatCurrency(simulationResult.factors.monthlySpendImpact)}</div>
                      )}
                      {simulationResult.factors.hasDepositImpact !== 0 && (
                        <div>Вклад: {simulationResult.factors.hasDepositImpact > 0 ? '+' : ''}{formatCurrency(simulationResult.factors.hasDepositImpact)}</div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => handleToggle(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Отменить
              </button>
              <button
                onClick={handleApply}
                disabled={!simulationResult || Math.abs(simulationResult.delta) < 100 || isLoading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
              >
                <CheckCircle size={18} />
                <span>Применить стратегию</span>
              </button>
            </div>

            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-gray-700 leading-relaxed">
                <strong>Бизнес-контекст:</strong> Сотрудник банка консультирует клиента: 
                "Если вы закроете кредитную карту и переведете зарплату к нам, оценка вашего дохода вырастет, 
                и мы одобрим ипотеку". Симулятор показывает реальное влияние изменений на прогноз.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SimulationPanel;

