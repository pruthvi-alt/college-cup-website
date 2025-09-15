import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import NotificationCenter from './components/NotificationCenter';

// Pages
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import Teams from './pages/Teams';
import Results from './pages/Results';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <div className="min-h-screen bg-red-500">
            <div className="bg-green-500 text-white p-4 text-center">
              <h1 className="text-4xl font-bold">TAILWIND TEST - IF YOU SEE THIS IN GREEN, TAILWIND IS WORKING!</h1>
            </div>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/results" element={<Results />} />
              </Routes>
            </main>
            <Footer />
            <NotificationCenter />
          </div>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
