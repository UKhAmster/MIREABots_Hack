import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockBackendClientData, mockShapValues, mockClientDetails, mockOffers } from '../mockData';
import { mockVipClients } from '../mockVipData';
import { transformClientData } from '../utils/dataTransform';
import { fetchClientOffers } from '../utils/api';
import ClientHeader from '../components/ClientHeader';
import ShapChart from '../components/ShapChart';
import ClientDetails from '../components/ClientDetails';
import SimulationPanel from '../components/SimulationPanel';
import LiquidityChart from '../components/LiquidityChart';
import InvestmentRecommendations from '../components/InvestmentRecommendations';
import PortfolioStructure from '../components/PortfolioStructure';

const ClientProfilePage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationData, setSimulationData] = useState(null);

  useEffect(() => {
    const loadClient = async () => {
      if (!clientId) return;
      
      setIsLoading(true);
      try {
        // Ищем VIP-клиента
        const vipClient = mockVipClients.find(c => c.id === clientId);
        
        if (vipClient) {
          // Используем данные VIP-клиента
          const transformedData = {
            ...vipClient,
            predictedIncome: vipClient.predictedLiquidity,
            incomeValue: vipClient.predictedLiquidity,
            aum: vipClient.aum,
            riskProfile: vipClient.riskProfile,
            status: vipClient.status,
            confidence: 'Высокая',
            averageRegionalIncome: 0,
          };
          
          setClient(transformedData);
          setClientData(transformedData);
        } else {
          // Fallback на обычные данные
          const backendData = mockBackendClientData;
          const transformedData = transformClientData(backendData);
          transformedData.name = `Клиент #${backendData.id}`;
          transformedData.photo = 'https://via.placeholder.com/120';
          
          setClient(transformedData);
          setClientData(transformedData);
        }
        
        try {
          const offersData = await fetchClientOffers(clientId);
          setOffers(offersData.offers || []);
        } catch (error) {
          console.error('Failed to fetch offers, using mock data:', error);
          setOffers(mockOffers);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading client:', error);
        setIsLoading(false);
      }
    };
    
    loadClient();
  }, [clientId]);

  const handleDownloadReport = () => {
    alert('Функция экспорта отчета будет реализована');
  };

  const handleApplySimulation = (simulatedClient) => {
    setClient(simulatedClient);
    setSimulationActive(false);
    setSimulationData(null);
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center space-x-2';
    toast.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <span class="font-semibold">План действий сохранен в профиль клиента</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const handleSimulationToggle = (active) => {
    setSimulationActive(active);
    if (!active) {
      setSimulationData(null);
    }
  };

  const handleSimulationChange = (data) => {
    setSimulationData(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-alpha-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Клиент не найден</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-alpha-red text-white rounded-xl hover:shadow-lg transition-all"
        >
          Вернуться к портфелю
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {client && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Профиль клиента
                </h2>
              </div>
              <button
                onClick={handleDownloadReport}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-alpha-red hover:text-alpha-red hover:shadow-md transition-all font-medium"
              >
                <Download size={18} />
                <span>Скачать отчет</span>
              </button>
            </div>

            <ClientHeader 
              client={{
                ...client,
                simulationActive: simulationActive
              }} 
              onSimulationToggle={handleSimulationToggle}
            />

            <SimulationPanel 
              client={client} 
              clientData={clientData}
              onApply={handleApplySimulation}
              onSimulationChange={handleSimulationChange}
              isActive={simulationActive}
              onToggle={handleSimulationToggle}
            />

            {/* График ликвидности */}
            <LiquidityChart client={client} />

            {/* Структура портфеля и факторы влияния */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PortfolioStructure client={client} />
              <ShapChart 
                shapValues={mockShapValues} 
                simulationData={simulationData}
              />
            </div>

            {/* Детали клиента */}
            <ClientDetails details={mockClientDetails} clientData={clientData} />

            {/* Инвестиционные рекомендации */}
            <InvestmentRecommendations client={client} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ClientProfilePage;

