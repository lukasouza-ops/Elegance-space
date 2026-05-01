import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  const navItems = [
    { label: 'Início', section: 'home' },
    { label: 'Profissionais', section: 'professionals' },
    { label: 'Serviços', section: 'services' },
    { label: 'Agendamento', section: 'booking' },
  ];

  const handleNavClick = (section: string) => {
    if (location.pathname === '/') {
      onNavigate?.(section);
    }
  };

  if (isAdminPage) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-serif font-bold text-pink-600">
              Elegance Space
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium text-sm uppercase tracking-wide"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/admin"
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium text-sm uppercase tracking-wide"
            >
              Admin
            </Link>
          </div>

          {/* Botão Agendar - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={() => onNavigate?.('booking')}
              className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200"
            >
              Agendar agora
            </button>
          </div>

          {/* Menu Mobile - Botão */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-pink-500 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;