import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getIncomeStatus, formatDate } from '../utils/dataTransform';
import { useEffect, useState } from 'react';

const ClientHeader = ({ client, onSimulationToggle }) => {
  const predictedIncome = client.predictedIncome || client.incomeValue || 0;
  const averageRegionalIncome = client.averageRegionalIncome || 0;
  const age = client.age;
  const city = client.city || client.region || client.city_smart_name || 'Не указано';
  const position = client.position || client.dp_ewb_last_employment_position || 'Не указано';
  const lastActivityDate = client.lastActivityDate || client.dt;
  const confidence = client.confidence || 'Средняя';
  
  const incomeStatusData = getIncomeStatus(client);
  const incomeStatus = {
    status: incomeStatusData.status,
    label: incomeStatusData.label,
    icon: incomeStatusData.status === 'above' ? TrendingUp : 
          incomeStatusData.status === 'below' ? TrendingDown : Minus,
    color: incomeStatusData.status === 'above' ? 'text-green-600' :
           incomeStatusData.status === 'below' ? 'text-red-600' : 'text-yellow-600',
  };
  
  const StatusIcon = incomeStatus.icon;
  const progress = averageRegionalIncome > 0 
    ? Math.min((predictedIncome / averageRegionalIncome) * 50, 100)
    : 50;

  const isSimulationActive = client?.simulationActive || false;

  const IncomeCounter = ({ income }) => {
    const motionValue = useMotionValue(income);
    const spring = useSpring(motionValue, {
      damping: 30,
      stiffness: 200,
    });
    const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString('ru-RU'));

    useEffect(() => {
      motionValue.set(income);
    }, [income, motionValue]);

    return (
      <motion.p
        key={income}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-5xl font-bold bg-gradient-to-r from-alpha-red to-red-600 bg-clip-text text-transparent"
      >
        <motion.span>{display}</motion.span> ₽
      </motion.p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border-2 transition-all ${
        isSimulationActive 
          ? 'border-blue-400 ring-4 ring-blue-200 shadow-blue-200' 
          : 'border-gray-100'
      } card-hover`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <img
              src={client.photo}
              alt={client.name}
              className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {client.name || `Клиент #${client.id}`}
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-gray-600 font-medium">Возраст: {age} лет</p>
              <p className="text-gray-600 font-medium">Город: {city}</p>
              {position && <p className="text-gray-500 text-sm">Должность: {position}</p>}
              {lastActivityDate && (
                <p className="text-gray-400 text-xs mt-2">
                  Активность: {formatDate(lastActivityDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 md:text-right">
          <div className="flex items-center justify-end space-x-3 mb-3">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500 font-medium">Прогноз свободной ликвидности</p>
              <div className="group relative">
                <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  Сумма, доступная для инвестирования в следующем месяце без снижения качества жизни
                </div>
              </div>
            </div>
            {client.simulated && (
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-lg">
                СИМУЛЯЦИЯ
              </span>
            )}
            {onSimulationToggle && (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSimulationActive}
                  onChange={(e) => onSimulationToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600"></div>
                <span className="ml-2 text-xs font-medium text-gray-600">🛠 Режим симуляции</span>
              </label>
            )}
          </div>
          <div className="flex items-baseline space-x-4 flex-wrap justify-end">
            <IncomeCounter income={predictedIncome} />
            {client.simulationDelta && client.simulationDelta !== 0 && (
              <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                client.simulationDelta > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {client.simulationDelta > 0 ? '+' : ''}{client.simulationDelta.toLocaleString('ru-RU')} ₽
              </span>
            )}
            <span className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${
              confidence === 'Высокая' 
                ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200' 
                : confidence === 'Средняя'
                ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200'
                : 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200'
            }`}>
              {confidence} уверенность
            </span>
          </div>
          {client.incomeCategory && (
            <p className="text-sm text-gray-500 mt-3 font-medium">Категория: {client.incomeCategory}</p>
          )}

          {averageRegionalIncome > 0 && (
            <div className="mt-6 max-w-md md:ml-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600 font-medium">Средний доход по региону</span>
                <div className={`flex items-center space-x-2 ${incomeStatus.color} font-semibold`}>
                  <StatusIcon size={18} />
                  <span className="text-sm">{incomeStatus.label}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`h-full rounded-full shadow-lg ${
                    incomeStatus.status === 'above' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    incomeStatus.status === 'below' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                    'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                Средний: {averageRegionalIncome.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ClientHeader;

