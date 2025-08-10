import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ReservationProvider } from './contexts/ReservationContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Reservations from './components/Reservations/Reservations'
import Calendar from './components/Calendar/Calendar';
import './index.css';

function App() {
  return (
    <ReservationProvider>
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ReservationProvider>
  );
}

export default App;