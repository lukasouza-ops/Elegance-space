import Navbar from '../components/common/Navbar';
import Button from '../components/common/Button';
import ProfessionalCard from '../components/common/ProfessionalCard';
import Footer from '../components/common/Footer';

interface Professional {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

const professionals: Professional[] = [
  {
    id: 1,
    name: 'Carla Mendes',
    specialty: 'Cabeleireira',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop',
  },
  {
    id: 2,
    name: 'Juliana Silva',
    specialty: 'Manicure',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop',
  },
  {
    id: 3,
    name: 'Patrícia Oliveira',
    specialty: 'Esteticista',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
  },
];

const services = [
  { name: 'Corte e Pintura', description: 'Transformação completa dos fios' },
  { name: 'Manicure e Pedicure', description: 'Cuidados completos para as unhas' },
  { name: 'Tratamentos Faciais', description: 'Limpeza e rejuvenescimento' },
  { name: 'Massagem Relaxante', description: 'Bem-estar e relaxamento' },
];

const Home = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewSchedule = (professionalId: number) => {
    console.log('Ver agenda do profissional:', professionalId);
    alert(`Em breve: Agenda do profissional #${professionalId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <Navbar onNavigate={scrollToSection} />

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-6">
              ✨ Sistema de Agendamento
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mb-6 leading-tight">
              Descubra a{' '}
              <span className="text-pink-500">beleza</span> que existe em você
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Agende seus serviços de beleza de forma simples e rápida. 
              Profissionais especializadas prontas para transformar seu visual.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => scrollToSection('booking')}>
                Agendar agora
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection('professionals')}>
                Ver profissionais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section id="professionals" className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-pink-50 text-pink-500 rounded-full text-sm font-medium mb-4">
              Nossa Equipe
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
              Profissionais Especializadas
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Conte com profissionais experientes e dedicadas para cuidar da sua beleza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {professionals.map((professional) => (
              <ProfessionalCard 
                key={professional.id} 
                professional={professional}
                onViewSchedule={handleViewSchedule}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-20 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-pink-100 text-pink-600 rounded-full text-sm font-medium mb-4">
              O que oferecemos
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
              Nossos Serviços
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Uma variedade de serviços para realçar sua beleza e bem-estar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section id="booking" className="py-16 md:py-20 px-4 bg-pink-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Pronto para se transformar?
          </h2>
          <p className="text-pink-100 text-lg mb-8 max-w-xl mx-auto">
            Agende seu horário agora e descubra uma nova versão de si mesma.
            Nossa equipe está pronta para atender você.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="bg-white text-pink-500 hover:bg-pink-50 border-white"
            onClick={() => alert('Em breve: sistema de agendamento!')}
          >
            Agendar horário
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
