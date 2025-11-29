import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = ({ children, breadcrumbs = [] }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        <TopBar breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

