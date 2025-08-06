import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import WebPage from './components/WebPage';
import DataPage from './components/DataPage';
import MobilePage from './components/MobilePage';
import AuthPage from './components/AuthPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/web" element={<WebPage />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/mobile" element={<MobilePage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
