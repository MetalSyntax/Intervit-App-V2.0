import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Icon } from '../components/UI';
import { Client, VisitState } from '../types';
import { CLIENTS_DATA } from '../data';

// Map raw data to Client objects
const mapClient = (raw: any): Client => ({
    id: raw.id.toString(),
    initials: raw.cliente.substring(0, 2).toUpperCase(),
    name: raw.cliente,
    address: raw.zona,
    lastVisit: 'Pendiente', 
    tags: [
        { label: raw.region, color: 'blue' }
    ],
    colorClass: '',
    frecuencia: raw.frecuencia,
    region: raw.region,
    zona: raw.zona,
    atencion: raw.atención, // Note: accent in JSON key
    mercaderistaNombre: raw.nombre,
    mercaderistaRol: raw.mercaderista
});

const ClientSelection: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [currentUser, setCurrentUser] = useState<{nombre: string, mercaderista: string} | null>(null);

  useEffect(() => {
      const saved = localStorage.getItem('visitState');
      if (saved) {
          const state: VisitState = JSON.parse(saved);
          if (state.user) {
              setCurrentUser(state.user);
          } else {
              navigate('/');
          }
      } else {
          navigate('/');
      }
  }, [navigate]);

  useEffect(() => {
      if (!currentUser) return;

      // Determine if current user has "Nacional" access
      // We check if any record associated with this user has 'NACIONAL' as region or cliente
      // Based on prompt: "Sí el cliente dice 'Nacional' entonces este ve a todos los clientes."
      const isNacionalUser = CLIENTS_DATA.some(c => 
          c.nombre === currentUser.nombre && 
          c.mercaderista === currentUser.mercaderista && 
          c.cliente === 'NACIONAL'
      );

      let visibleRawClients = [];

      if (isNacionalUser) {
          // Show all clients EXCEPT those named 'NACIONAL'
          visibleRawClients = CLIENTS_DATA.filter(c => c.cliente !== 'NACIONAL');
      } else {
          // Show only clients assigned to this user (Name + Mercaderista)
          // Filtering out 'NACIONAL' just in case
          visibleRawClients = CLIENTS_DATA.filter(c => 
              c.nombre === currentUser.nombre && 
              c.mercaderista === currentUser.mercaderista &&
              c.cliente !== 'NACIONAL'
          );
      }

      setFilteredClients(visibleRawClients.map(mapClient));

  }, [currentUser]);

  const handleClientClick = (client: Client) => {
    const saved = localStorage.getItem('visitState');
    if (saved) {
        const state: VisitState = JSON.parse(saved);
        state.client = client;
        localStorage.setItem('visitState', JSON.stringify(state));
    }
    navigate('/dashboard');
  };

  const displayClients = filteredClients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.includes(searchTerm)
  );

  return (
    <Container>
      <header className="bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 relative flex items-center justify-center min-h-[60px]">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="absolute left-4 p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <Icon name="arrow_back" />
          </button>

          <div className="h-10 w-auto flex items-center justify-center">
            <svg className="h-10 w-auto" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="30" rx="95" ry="25" fill="none" stroke="#EBB105" strokeWidth="3"></ellipse>
                <path d="M140 10 Q 160 5, 180 15" fill="none" stroke="#EBB105" strokeWidth="2"></path>
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif" fill="#333" className="dark:fill-white">INTERVIT</text>
                <text x="135" y="32" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif" fill="#DC2626">V</text>
            </svg>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 pb-4 pt-1 text-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
            <Icon name="store" className="text-primary" />
            Selección de Cliente
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
             {currentUser ? `${currentUser.nombre} - ${currentUser.mercaderista}` : 'Seleccione el punto de venta'}
          </p>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" className="text-gray-400 group-focus-within:text-primary" />
          </div>
          <input 
            type="text" 
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out shadow-sm" 
            placeholder="Buscar cliente, código o zona..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cartera de Clientes</h2>
            <span className="text-xs text-primary font-medium">{displayClients.length} encontrados</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayClients.map((client, idx) => (
              <div key={idx} onClick={() => handleClientClick(client)} className="group bg-surface-light dark:bg-surface-dark rounded-lg p-4 shadow-sm border border-transparent hover:border-primary cursor-pointer transition-all duration-200 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                      <span className="font-bold text-xs">{client.initials}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">{client.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Zona: {client.zona}</p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-gray-400 group-hover:text-primary" />
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                        <span className="block text-gray-400">Región</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{client.region}</span>
                    </div>
                    <div>
                        <span className="block text-gray-400">Frecuencia</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{client.frecuencia}</span>
                    </div>
                    <div className="col-span-2">
                        <span className="block text-gray-400">Atención</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{client.atencion}</span>
                    </div>
                </div>
              </div>
            ))}
            {displayClients.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                    <Icon name="search_off" className="text-4xl mb-2 opacity-50" />
                    <p>No se encontraron clientes para esta ruta.</p>
                </div>
            )}
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-surface-light dark:bg-surface-dark text-center border-t border-gray-100 dark:border-gray-800 mt-auto">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Todos los derechos reservados © 2025.<br />
          Creado por <span className="font-medium text-gray-700 dark:text-gray-300">MetaSyntax</span> para Intervit.
        </p>
      </footer>
    </Container>
  );
};

export default ClientSelection;