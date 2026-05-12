import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

const navItems = [
  { label: 'Início', section: 'home' },
  { label: 'Profissionais', section: 'professionals' },
  { label: 'Serviços', section: 'services' },
  { label: 'Agendamento', section: 'booking' },
];

const Navbar = ({ onNavigate }: NavbarProps) => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    setMenuOpen(false);

    if (location.pathname === '/') {
      onNavigate?.(section);
    }
  };

  if (isAdminPage) return null;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-pink-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="font-serif text-2xl font-bold text-pink-600 sm:text-3xl"
          >
            Elegance Space
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.section}
                type="button"
                onClick={() => handleNavClick(item.section)}
                className="text-sm font-medium uppercase tracking-wide text-gray-600 transition-colors duration-200 hover:text-pink-500"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/admin"
              className="text-sm font-medium uppercase tracking-wide text-gray-600 transition-colors duration-200 hover:text-pink-500"
            >
              Admin
            </Link>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.('booking')}
            className="hidden rounded-full bg-pink-500 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-pink-600 md:block"
          >
            Agendar agora
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-pink-500 transition hover:bg-pink-50 md:hidden"
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-pink-100 py-3 md:hidden">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <button
                  key={item.section}
                  type="button"
                  onClick={() => handleNavClick(item.section)}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={() => handleNavClick('booking')}
                className="mt-1 rounded-full bg-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                Agendar agora
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
