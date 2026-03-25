import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RoadmapView from './pages/RoadmapView';
import PublicProfile from './pages/PublicProfile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import LoadingScreen from './components/LoadingScreen';
import Profile from './pages/Profile';
import CareerRecommendation from './pages/CareerRecommendation';
import PrivateRoute from './components/PrivateRoute';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

// Layout Component to handle Sidebar logic
const AppLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-ui-bg text-ui-text font-sans selection:bg-brand-primary/20">
      {user && !isHome && !isAuthPage && <Sidebar />}
      {(isHome || isAuthPage || !user) && <Navbar />}

      <main className={`transition-all duration-300 ${user && !isHome && !isAuthPage ? 'lg:pl-72' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/profile/:username" element={<PublicProfile />} />
            <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/career/resume" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
            <Route path="/career-recommendation" element={<PrivateRoute><CareerRecommendation /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/roadmap/:id" element={<PrivateRoute><RoadmapView /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
