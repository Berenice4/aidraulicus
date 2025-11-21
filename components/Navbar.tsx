import React from 'react';
import { Wrench, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isDashboard = location.pathname === '/dashboard';

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-primary p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-secondary tracking-tight">
              AIdraulicus
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {!isDashboard && (
              <>
                <a href="#demo" onClick={(e) => scrollToSection(e, 'demo')} className="text-slate-600 hover:text-primary font-medium transition-colors">Prova Demo</a>
                <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-slate-600 hover:text-primary font-medium transition-colors">Funzionalità</a>
                <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-slate-600 hover:text-primary font-medium transition-colors">Contatta Agenzia</a>
              </>
            )}
          </div>

          {/* Auth Controls */}
          <div className="flex items-center space-x-4">
             {user ? (
               <>
                 <button 
                   onClick={() => navigate('/dashboard')} 
                   className={`hidden md:flex items-center font-medium transition-colors ${isDashboard ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
                 >
                   <LayoutDashboard className="h-4 w-4 mr-2" />
                   Dashboard
                 </button>
                 <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                 <div className="flex items-center gap-3">
                   <span className="text-sm text-slate-600 hidden lg:block">{user.email}</span>
                   <button 
                     onClick={handleLogout}
                     className="flex items-center text-slate-500 hover:text-red-600 transition-colors"
                     title="Esci"
                   >
                     <LogOut className="h-5 w-5" />
                   </button>
                 </div>
               </>
             ) : (
               <>
                 <button 
                   onClick={() => navigate('/auth')} 
                   className="text-slate-600 hover:text-primary font-medium transition-colors hidden sm:block"
                 >
                   Accedi
                 </button>
                 <button 
                   onClick={() => navigate('/auth')}
                   className="bg-secondary text-white px-5 py-2 rounded-full font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-lg shadow-slate-900/20"
                 >
                   Inizia Ora
                 </button>
               </>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;