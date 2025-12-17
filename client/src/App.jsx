import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RoadmapView from './pages/RoadmapView';
import PublicProfile from './pages/PublicProfile';
import PrivateRoute from './components/PrivateRoute';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';

// Layout Component to handle Sidebar logic
const AppLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="min-h-screen bg-transparent font-sans flex">
      {user && <Sidebar />}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${user ? 'lg:ml-64' : ''}`}>
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
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
            <Route path="/u/:id" element={<PublicProfile />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/roadmap/:id" element={<PrivateRoute><RoadmapView /></PrivateRoute>} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
