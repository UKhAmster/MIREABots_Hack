import { Bell, User } from 'lucide-react';

const TopBar = ({ breadcrumbs = [] }) => {
  return (
    <div className="h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-2">
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
              {index > 0 && <span className="text-gray-300">/</span>}
              <span
                className={`${
                  index === breadcrumbs.length - 1
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
              >
                {crumb}
              </span>
            </div>
          ))
        ) : (
          <span className="text-gray-500 font-medium">Главная</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2.5 text-gray-600 hover:text-alpha-red hover:bg-red-50 rounded-xl transition-all duration-200 group">
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-r from-alpha-red to-red-600 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-alpha-red to-red-600 rounded-full flex items-center justify-center shadow-md">
            <User size={18} className="text-white" />
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">Сотрудник Банка</p>
            <p className="text-gray-500 text-xs">Менеджер</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

