import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// --- Icons ---
export const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = "" }) => (
  <span className={`material-icons-round ${className}`}>{name}</span>
);

// --- Layout ---
export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`min-h-screen flex flex-col w-full max-w-4xl mx-auto bg-background-light dark:bg-background-dark relative shadow-2xl shadow-gray-200 dark:shadow-none ${className}`}>
    {children}
  </div>
);

// --- Headers ---
export const HeaderSimple: React.FC<{ title: string; subtitle?: string; icon?: string }> = ({ title, subtitle, icon }) => (
  <header className="px-6 py-8 flex flex-col items-center justify-center text-center animate-fade-in-down w-full">
    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight flex items-center justify-center gap-2">
      {icon && <Icon name={icon} className="text-primary" />}
      {title}
    </h1>
    {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm">{subtitle}</p>}
  </header>
);

export const HeaderInternal: React.FC<{ 
  title: string; 
  showCart?: boolean; 
  showBack?: boolean;
  showFilter?: boolean;
}> = ({ title, showCart, showBack = true, showFilter }) => {
  const navigate = useNavigate();
  return (
    <>
      <header className="bg-surface-light dark:bg-surface-dark shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 w-full">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Icon name="arrow_back" className="text-gray-500 dark:text-gray-400" />
            </button>
          ) : (
            <div className="w-10"></div>
          )}
          
          <div className="flex items-center space-x-2">
             <div className="h-8 w-auto flex items-center justify-center">
                <svg className="h-8 w-auto" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="100" cy="30" rx="95" ry="25" fill="none" stroke="#EBB105" strokeWidth="3"></ellipse>
                  <path d="M140 10 Q 160 5, 180 15" fill="none" stroke="#EBB105" strokeWidth="2"></path>
                  <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif" fill="#333" className="dark:fill-white">INTERVIT</text>
                  <text x="135" y="32" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif" fill="#DC2626">V</text>
                </svg>
             </div>
          </div>

          <div className="flex items-center -mr-2">
            {showFilter && (
               <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                 <Icon name="filter_alt" className="text-gray-500 dark:text-gray-400" />
               </button>
            )}
            {showCart ? (
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                <Icon name="shopping_bag" className="text-gray-500 dark:text-gray-400" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white dark:border-surface-dark"></span>
              </button>
            ) : !showFilter ? (
              <div className="w-10"></div>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
};

// --- Bottom Navigation ---
export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 sticky bottom-0 z-50 w-full max-w-4xl mx-auto">
      <div className="px-6 h-16 flex items-center justify-between">
        <button 
          onClick={() => navigate('/clients')}
          className={`flex flex-col items-center justify-center w-16 transition-colors ${isActive('/clients') ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
        >
          <Icon name="home" className="text-2xl" />
          <span className="text-[10px] font-medium mt-1">Inicio</span>
        </button>
        <button className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-primary transition-colors">
          <Icon name="history" className="text-2xl" />
          <span className="text-[10px] font-medium mt-1">Historial</span>
        </button>
        
        <div className="relative -top-6">
          <button className="bg-primary hover:bg-primary-dark text-white rounded-full h-14 w-14 flex items-center justify-center shadow-lg transform transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/30">
            <Icon name="add" className="text-3xl" />
          </button>
        </div>

        <button className="flex flex-col items-center justify-center w-16 text-gray-400 hover:text-primary transition-colors">
          <Icon name="inventory_2" className="text-2xl" />
          <span className="text-[10px] font-medium mt-1">Pedidos</span>
        </button>
        <button 
          onClick={() => navigate('/dashboard')} 
          className={`flex flex-col items-center justify-center w-16 transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
        >
          <Icon name="person" className="text-2xl" />
          <span className="text-[10px] font-medium mt-1">Perfil</span>
        </button>
      </div>
    </nav>
  );
};

// --- Form Elements ---
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: string }> = ({ icon, className, ...props }) => (
  <div className="relative rounded-md shadow-sm group w-full">
    {icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon name={icon} className="text-gray-400 group-focus-within:text-primary text-xl" />
      </div>
    )}
    <input 
      className={`block w-full ${icon ? 'pl-10' : 'pl-4'} pr-3 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 ease-in-out ${className}`} 
      {...props} 
    />
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'; 
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}> = ({ children, variant = 'primary', className = "", onClick, type="button" }) => {
  const baseStyles = "w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-md text-sm font-semibold transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "text-white bg-primary hover:bg-primary-dark focus:ring-primary",
    secondary: "bg-surface-light text-gray-700 hover:bg-gray-50 border border-gray-200",
    danger: "bg-surface-light text-danger border border-gray-200 hover:bg-red-50",
    outline: "bg-transparent border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary hover:text-primary shadow-none",
  };

  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

// --- Counter ---
export const Counter: React.FC<{ value: number; onChange: (val: number) => void; min?: number; readOnly?: boolean }> = ({ value, onChange, min = 0, readOnly = false }) => (
  <div className={`flex items-center bg-gray-50 dark:bg-gray-800 rounded-xl p-0.5 border border-gray-100 dark:border-gray-700 ${readOnly ? 'opacity-75' : ''}`}>
    {!readOnly && (
      <button 
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 text-gray-500 hover:text-primary shadow-sm active:scale-90 transition-transform"
        type="button"
      >
        <Icon name="remove" className="text-sm" />
      </button>
    )}
    <input 
      className={`w-full bg-transparent border-none text-center text-sm font-bold p-0 text-gray-800 dark:text-white focus:ring-0 appearance-none ${readOnly ? 'py-1.5' : ''}`} 
      readOnly 
      type="number" 
      value={value} 
    />
    {!readOnly && (
      <button 
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white shadow-sm active:scale-90 transition-transform"
        type="button"
      >
        <Icon name="add" className="text-sm" />
      </button>
    )}
  </div>
);