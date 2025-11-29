import { Link, useLocation } from 'react-router-dom';
import { Users, Activity, Settings } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Мой портфель', icon: Users },
    { path: '/monitoring', label: 'Сводная информация', icon: Activity },
    { path: '/settings', label: 'Настройки', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-white to-gray-50 shadow-xl h-screen fixed left-0 top-0 flex flex-col border-r border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-alpha-red to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Alpha Pred
            </h1>
            <p className="text-xs text-gray-500 font-medium">ML Prediction System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-alpha-red to-red-600 text-white shadow-lg shadow-red-500/30'
                      : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center font-medium">
          © 2024 Alpha Bank
        </p>
      </div>
    </div>
  );
};

export default Sidebar;

