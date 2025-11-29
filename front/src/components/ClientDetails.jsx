import { Wallet, BarChart3, Shield, AlertTriangle, Building2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/dataTransform';

const ClientDetails = ({ details, clientData }) => {
  const DetailCard = ({ icon: Icon, title, items, color = 'red' }) => {
    const colorClasses = {
      red: 'from-red-50 to-red-100/50 border-red-200',
      blue: 'from-blue-50 to-blue-100/50 border-blue-200',
      green: 'from-green-50 to-green-100/50 border-green-200',
      yellow: 'from-yellow-50 to-yellow-100/50 border-yellow-200',
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 border shadow-sm hover:shadow-md transition-all`}>
        <div className="flex items-center space-x-2 mb-3">
          <div className={`p-1.5 bg-white rounded-lg shadow-sm`}>
            <Icon className={`text-${color === 'red' ? 'alpha-red' : color === 'blue' ? 'blue-600' : color === 'green' ? 'green-600' : 'yellow-600'}`} size={18} />
          </div>
          <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1.5 border-b border-white/50 last:border-0">
              <span className="text-gray-700 font-medium text-xs leading-tight pr-2 flex-1">{item.label}</span>
              <span className={`font-bold text-xs text-right whitespace-nowrap ${item.highlight ? 'text-alpha-red' : 'text-gray-900'}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const bki = clientData?.bki || details?.bki;
  const finances = clientData?.finances || details?.finances;
  const risks = clientData?.risks || details?.risks;
  const activity = clientData?.activity || details?.activity;
  const employment = clientData?.employment || details?.employment;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100 card-hover">
      <div className="flex items-center space-x-2 mb-5">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
          <BarChart3 className="text-purple-600" size={20} />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Цифровой профиль
        </h3>
      </div>
      
      <div className="space-y-4">
        {bki && (
          <DetailCard
            icon={Shield}
            title="БКИ данные"
            color="blue"
            items={[
              { label: 'Всего продуктов в БКИ', value: bki.totalProductsCount || 0 },
              { label: 'Максимальный кредитный лимит', value: formatCurrency(bki.totalMaxLimit) },
              { label: 'Всего кредитных продуктов', value: bki.totalProducts || 0 },
              { label: 'Лимит по активным КК', value: formatCurrency(bki.activeCcMaxLimit) },
              { label: 'Лимит по потребительским кредитам', value: formatCurrency(bki.pilMaxLimit) },
              { 
                label: 'Макс. сумма просрочки в истории', 
                value: formatCurrency(bki.maxOverdueSum),
                highlight: bki.maxOverdueSum > 0
              },
            ]}
          />
        )}

        {finances && (
          <DetailCard
            icon={Wallet}
            title="Финансовые показатели"
            color="green"
            items={[
              { label: 'Средний баланс в рублях', value: formatCurrency(finances.avgBalance) },
              { label: 'Средняя зарплата за 1 год', value: formatCurrency(finances.avgSalary1y) },
              { label: 'Средняя сумма кредита', value: formatCurrency(finances.avgLoanAmount) },
              { label: 'Обороты по кредиту', value: formatCurrency(finances.creditTurnover) },
              { label: 'Обороты по дебету', value: formatCurrency(finances.debitTurnover) },
              { label: 'Средний дневной оборот (90 дней)', value: formatCurrency(finances.avgDailyTransactions90d) },
            ]}
          />
        )}

        {activity && (
          <DetailCard
            icon={BarChart3}
            title="Транзакционная активность"
            color="blue"
            items={[
              { label: 'Дней мобильной активности', value: activity.mobileDays || 0 },
              { label: 'Траты в супермаркетах (%)', value: formatPercent(activity.supermarketPercent) },
              { label: 'Траты в ресторанах (%)', value: formatPercent(activity.restaurantsPercent) },
              { label: 'Сумма трат в супермаркетах', value: formatCurrency(activity.supermarketAmount) },
              { label: 'Сумма трат в кафе', value: formatCurrency(activity.cafeAmount) },
            ]}
          />
        )}

        {employment && (
          <DetailCard
            icon={Building2}
            title="Трудовой стаж"
            color="yellow"
            items={[
              { label: 'Общий стаж работы (мес.)', value: `${employment.totalSeniority || 0} мес.` },
              { label: 'Максимальный стаж в одной компании (мес.)', value: `${employment.maxSeniority || 0} мес.` },
              { label: 'Смен работы за 1 год', value: employment.jobChanges1y || 0 },
              { label: 'Работодателей за последний месяц', value: employment.employersLastMonth || 0 },
              { label: 'Среднее одновременных работ за 5 лет', value: (employment.simultaneousJobs5y || 0).toFixed(1) },
            ]}
          />
        )}

        {risks && (
          <DetailCard
            icon={AlertTriangle}
            title="Оценка рисков"
            color="red"
            items={[
              { 
                label: 'В черном списке', 
                value: risks.blacklistFlag ? 'Да' : 'Нет',
                highlight: risks.blacklistFlag
              },
              { 
                label: 'Текущая сумма просрочек', 
                value: formatCurrency(risks.currentOverdueSum),
                highlight: risks.currentOverdueSum > 0
              },
              { 
                label: 'Макс. сумма просрочки', 
                value: formatCurrency(risks.maxOverdueSum),
                highlight: risks.maxOverdueSum > 0
              },
              { label: 'Вероятность дохода ниже 50к', value: formatPercent(risks.probBelow50k) },
              { label: 'Вероятность дохода выше 1М', value: formatPercent(risks.probAbove1M) },
            ]}
          />
        )}

        {details?.transactionActivity && !activity && (
          <DetailCard
            icon={BarChart3}
            title="Транзакционная активность"
            color="blue"
            items={[
              { label: 'Транзакций в месяц', value: details.transactionActivity.monthlyTransactions },
              { label: 'Средняя сумма', value: formatCurrency(details.transactionActivity.avgTransactionAmount) },
              { label: 'Категории', value: details.transactionActivity.categories?.join(', ') || 'Не указано' },
            ]}
          />
        )}

        {details?.creditHistory && !bki && (
          <DetailCard
            icon={Shield}
            title="Кредитная история"
            color="blue"
            items={[
              { label: 'Всего кредитов', value: details.creditHistory.totalCredits },
              { label: 'Активных', value: details.creditHistory.activeCredits },
              { label: 'Просрочек', value: details.creditHistory.overduePayments },
              { label: 'Кредитный скоринг', value: details.creditHistory.creditScore },
            ]}
          />
        )}

        {details?.assets && !finances && (
          <DetailCard
            icon={Wallet}
            title="Активы"
            color="green"
            items={[
              { label: 'Вклады', value: `${(details.assets.deposits / 1000000).toFixed(1)} млн ₽` },
              { label: 'Карты', value: details.assets.cards?.join(', ') || 'Не указано' },
              { label: 'Инвестиции', value: `${(details.assets.investments / 1000).toFixed(0)} тыс ₽` },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ClientDetails;

