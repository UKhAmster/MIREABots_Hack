import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Shield, AlertCircle, Users } from 'lucide-react';
import { mockVipClients } from '../mockVipData';
import { formatCurrency } from '../utils/dataTransform';
import { useNavigate } from 'react-router-dom';

const MyClientsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    return status === 'Platinum' 
      ? 'from-purple-500 to-pink-500' 
      : 'from-yellow-400 to-orange-500';
  };

  const getStatusBadge = (status) => {
    return status === 'Platinum' 
      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
      : 'bg-gradient-to-r from-yellow-400 to-orange-500';
  };

  const getRiskColor = (risk) => {
    if (risk === 'Агрессивный') return 'text-red-600 bg-red-50';
    if (risk === 'Консервативный') return 'text-green-600 bg-green-50';
    return 'text-blue-600 bg-blue-50';
  };

  const filteredClients = mockVipClients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filter === 'all' ||
        (filter === 'high' && client.predictedLiquidity >= 1000000) ||
        (filter === 'attention' && client.predictedLiquidity < 1000000);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.predictedLiquidity - a.predictedLiquidity);

  const handleOpenProfile = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Мой портфель (A-Club)
          </h1>
          <p className="text-gray-600">
            Управление VIP-клиентами и прогнозирование ликвидности
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти клиента по ФИО..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-alpha-red focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-alpha-red text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
            filter === 'high'
              ? 'bg-alpha-red text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <TrendingUp size={16} />
          <span>Высокая ликвидность</span>
        </button>
        <button
          onClick={() => setFilter('attention')}
          className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center space-x-2 ${
            filter === 'attention'
              ? 'bg-alpha-red text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <AlertCircle size={16} />
          <span>Требуют внимания</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Всего клиентов</p>
              <p className="text-2xl font-bold text-gray-900">{filteredClients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Суммарная ликвидность</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredClients.reduce((sum, c) => sum + c.predictedLiquidity, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Средний AUM</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  filteredClients.length > 0
                    ? filteredClients.reduce((sum, c) => sum + c.aum, 0) / filteredClients.length
                    : 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getStatusColor(client.status)} p-4 text-white`}>
              <div className="flex items-center space-x-3">
                <img
                  src={client.photo}
                  alt={client.name}
                  className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{client.name}</h3>
                  <div className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold mt-1 ${getStatusBadge(client.status)}`}>
                    {client.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-5">
              {/* Main Metric */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1 font-medium">Прогноз свободной ликвидности</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {formatCurrency(client.predictedLiquidity)}
                </p>
                <p className="text-xs text-gray-500 mt-1">ML Prediction</p>
              </div>

              {/* Secondary Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AUM</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(client.aum)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Риск-профиль</span>
                  <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getRiskColor(client.riskProfile)}`}>
                    {client.riskProfile}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Последний контакт</span>
                  <span className="text-sm text-gray-900">
                    {new Date(client.lastContact).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {client.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 italic">{client.notes}</p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleOpenProfile(client.id)}
                className="w-full py-2.5 bg-gradient-to-r from-alpha-red to-red-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                Открыть профиль
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Клиенты не найдены</p>
        </div>
      )}
    </div>
  );
};

export default MyClientsPage;

