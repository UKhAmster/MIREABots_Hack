import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, CheckCircle, X } from 'lucide-react';
import { mockMarketData } from '../mockVipData';
import { formatCurrency } from '../utils/dataTransform';

const InvestmentRecommendations = ({ client }) => {
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const predictedLiquidity = client?.predictedLiquidity || client?.predictedIncome || 0;
  const riskProfile = client?.riskProfile || 'Умеренный';
  
  // Рассчитываем Match Score на основе риск-профиля клиента и инструмента
  const calculateMatchScore = (instrument) => {
    const riskMap = {
      'Агрессивный': { high: 'High', medium: 'Medium', low: 'Low' },
      'Умеренный': { high: 'Medium', medium: 'High', low: 'Medium' },
      'Консервативный': { high: 'Low', medium: 'Medium', low: 'High' },
    };
    
    const riskMapping = riskMap[riskProfile] || riskMap['Умеренный'];
    return riskMapping[instrument.risk] || 'Medium';
  };
  
  const getMatchColor = (score) => {
    if (score === 'High') return 'bg-green-100 text-green-800 border-green-300';
    if (score === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };
  
  const handleGenerateProposal = (instrument) => {
    setSelectedInstrument(instrument);
    setShowModal(true);
  };
  
  const generateProposalText = (instrument) => {
    const clientName = client?.name?.split(' ')[0] || 'Иван Иванович';
    return `Уважаемый ${clientName},

Учитывая прогнозируемое поступление средств в размере ${formatCurrency(predictedLiquidity)}, предлагаю рассмотреть покупку ${instrument.name} (${instrument.id}).

Текущая цена: ${instrument.currentPrice.toLocaleString('ru-RU')} ₽
Изменение за неделю: ${instrument.changePercent > 0 ? '+' : ''}${instrument.changePercent}%

${instrument.description}

Рекомендуемый объем инвестирования: ${formatCurrency(Math.min(predictedLiquidity * 0.3, instrument.minInvestment))}

Совместимость с вашим риск-профилем: ${calculateMatchScore(instrument)}

Готов обсудить детали и ответить на ваши вопросы.

С уважением,
Ваш персональный менеджер`;
  };
  
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Рекомендации для портфеля
          </h3>
          <p className="text-sm text-gray-600">
            Инвестиционные идеи Альфа-Инвестиций на основе прогноза ликвидности
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockMarketData.map((instrument, index) => {
            const matchScore = calculateMatchScore(instrument);
            const isAffordable = predictedLiquidity >= instrument.minInvestment;
            
            return (
              <motion.div
                key={instrument.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-xl p-4 transition-all ${
                  isAffordable 
                    ? 'border-gray-200 hover:border-alpha-red hover:shadow-lg' 
                    : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs">{instrument.id}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{instrument.name}</h4>
                      <p className="text-xs text-gray-500">{instrument.type}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getMatchColor(matchScore)}`}>
                    {matchScore === 'High' ? 'Высокая' : matchScore === 'Medium' ? 'Средняя' : 'Низкая'} совместимость
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Текущая цена</span>
                    <span className="font-bold text-gray-900">
                      {instrument.currentPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Изменение за неделю</span>
                    <div className={`flex items-center space-x-1 ${
                      instrument.changeDirection === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {instrument.changeDirection === 'up' ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span className="font-bold">
                        {instrument.changePercent > 0 ? '+' : ''}{instrument.changePercent}%
                      </span>
                    </div>
                  </div>
                  {instrument.yield && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Доходность</span>
                      <span className="font-bold text-green-600">{instrument.yield}%</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Мин. инвестиция</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(instrument.minInvestment)}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mb-4 italic">{instrument.description}</p>
                
                <button
                  onClick={() => handleGenerateProposal(instrument)}
                  disabled={!isAffordable}
                  className={`w-full py-2.5 rounded-xl font-semibold transition-all ${
                    isAffordable
                      ? 'bg-gradient-to-r from-alpha-red to-red-600 text-white hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAffordable ? 'Сформировать предложение' : 'Недоступно'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedInstrument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Предложение для клиента
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 whitespace-pre-line font-mono">
                    {generateProposalText(selectedInstrument)}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generateProposalText(selectedInstrument));
                      alert('Текст скопирован в буфер обмена');
                    }}
                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Копировать текст
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-alpha-red to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Отправить клиенту
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InvestmentRecommendations;

