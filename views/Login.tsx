import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, HeaderInternal, Button, Icon } from '../components/UI';
import { VisitState } from '../types';
import { CLIENTS_DATA } from '../data';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('');

  const users = useMemo(() => {
      const map = new Map<string, { nombre: string; mercaderista: string }>();
      CLIENTS_DATA.forEach(c => {
          const key = `${c.nombre} - ${c.mercaderista}`;
          if (!map.has(key)) {
              map.set(key, { nombre: c.nombre, mercaderista: c.mercaderista });
          }
      });
      return Array.from(map.entries())
          .map(([key, value]) => ({ key, ...value }))
          .sort((a, b) => a.key.localeCompare(b.key));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userObj = users.find(u => u.key === selectedKey);
    
    if (userObj) {
      // Initialize or update visit state
      const existingState = localStorage.getItem('visitState');
      const today = new Date().toISOString().split('T')[0];
      
      const newState: VisitState = existingState 
        ? { ...JSON.parse(existingState), user: { nombre: userObj.nombre, mercaderista: userObj.mercaderista } }
        : { 
            user: { nombre: userObj.nombre, mercaderista: userObj.mercaderista }, 
            visitDate: today, 
            client: null, 
            products: [], 
            competitors: [] 
          };
      
      localStorage.setItem('visitState', JSON.stringify(newState));
      navigate('/dashboard');
    }
  };

  return (
    <Container className="justify-start">
      <HeaderInternal title="" showBack={false} />

      <div className="flex-grow flex flex-col items-center justify-center px-6 py-8 w-full max-w-sm mx-auto">
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight">
            Bienvenido
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Ingrese sus credenciales para acceder al portal de ventas Intervit
          </p>
        </div>

        <div className="w-full bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-400"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccione Mercaderista
              </label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Icon name="person" className="text-gray-400 text-xl" />
                 </div>
                 <select 
                   value={selectedKey}
                   onChange={(e) => setSelectedKey(e.target.value)}
                   className="block w-full pl-10 pr-10 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 ease-in-out appearance-none"
                   required
                 >
                   <option value="" disabled>Seleccione un usuario...</option>
                   {users.map(u => (
                       <option key={u.key} value={u.key}>{u.key}</option>
                   ))}
                 </select>
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Icon name="expand_more" className="text-gray-400 text-lg" />
                  </div>
              </div>
            </div>

            <Button type="submit">Ingresar al Sistema</Button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto">
              <Icon name="help_outline" className="text-sm" />
              ¿Problemas para ingresar?
            </button>
          </div>
        </div>
      </div>

      <footer className="w-full py-6 bg-surface-light dark:bg-surface-dark text-center border-t border-gray-100 dark:border-gray-800 mt-auto">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Todos los derechos reservados © 2025.<br />
          Creado por <span className="font-medium text-gray-700 dark:text-gray-300">MetaSyntax</span> para Intervit.
        </p>
      </footer>
    </Container>
  );
};

export default Login;