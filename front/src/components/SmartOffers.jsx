import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Sparkles } from 'lucide-react';

const SmartOffers = ({ offers = [], simulationActive = false }) => {
  const getOfferIcon = (category) => {
    switch (category) {
      case 'premium':
        return Sparkles;
      case 'investment':
        return TrendingUp;
      case 'credit':
        return CreditCard;
      default:
        return CreditCard;
    }
  };

  const getGradient = (category) => {
    switch (category) {
      case 'premium':
        return 'from-purple-500 to-pink-500';
      case 'investment':
        return 'from-blue-500 to-cyan-500';
      case 'credit':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100 card-hover">
      <div className="mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Персональные рекомендации
        </h3>
        <p className="text-gray-600">
          На основе прогнозируемого дохода мы подобрали для вас специальные предложения
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, index) => {
          const Icon = getOfferIcon(offer.category);
          const gradient = getGradient(offer.category);
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl border-2 overflow-hidden hover:shadow-xl transition-all group ${
                !offer.isAvailable
                  ? 'border-gray-200 grayscale opacity-60'
                  : 'border-gray-200 hover:border-alpha-red'
              } ${simulationActive && offer.isAvailable && offer.category === 'premium' ? 'ring-4 ring-green-300 border-green-400' : ''}`}
            >
              <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden ${
                !offer.isAvailable ? 'grayscale' : ''
              }`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <Icon className="text-white relative z-10" size={56} />
                {!offer.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                    <div className="bg-white rounded-full p-3">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                )}
                {simulationActive && offer.isAvailable && offer.category === 'premium' && (
                  <div className="absolute top-4 right-4 bg-green-500 backdrop-blur-sm rounded-full px-3 py-1 z-20 animate-pulse">
                    <span className="text-white text-xs font-bold">РАЗБЛОКИРОВАНО</span>
                  </div>
                )}
                {!simulationActive && offer.isAvailable && (
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-bold">NEW</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{offer.name}</h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{offer.description}</p>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Лимит</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-alpha-red to-red-600 bg-clip-text text-transparent">
                    до {Math.round(offer.limit).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <button 
                  disabled={!offer.isAvailable}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    !offer.isAvailable
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-alpha-red to-red-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {!offer.isAvailable ? 'Недоступно' : 'Оформить'}
                </button>
                {!offer.isAvailable && offer.requirement && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    {offer.requirement}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartOffers;

