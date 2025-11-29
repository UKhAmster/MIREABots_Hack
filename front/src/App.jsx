import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MyClientsPage from './pages/MyClientsPage';
import ClientProfilePage from './pages/ClientProfilePage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout breadcrumbs={['Мой портфель']}>
              <MyClientsPage />
            </Layout>
          }
        />
        <Route
          path="/client/:clientId"
          element={
            <Layout breadcrumbs={['Мой портфель', 'Профиль клиента']}>
              <ClientProfilePage />
            </Layout>
          }
        />
        <Route
          path="/monitoring"
          element={
            <Layout breadcrumbs={['Сводная информация']}>
              <DashboardPage />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout breadcrumbs={['Настройки']}>
              <SettingsPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

