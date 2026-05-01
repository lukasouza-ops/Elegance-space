import { useState, useEffect } from 'react';

// ============================================
// CONSTANTES
// ============================================

const STORAGE_KEY = 'elegance_space_professionals';

// ============================================
// TIPOS
// ============================================

interface Service {
  id: number;
  name: string;
  duration: string;
  price: string;
}

interface Professional {
  id: number;
  name: string;
  specialty: string;
  status: 'active' | 'inactive';
  services: Service[];
}

// ============================================
// DADOS INICIAIS
// ============================================

const initialData: Professional[] = [
  {
    id: 1,
    name: 'Carla Mendes',
    specialty: 'Cabeleireira',
    status: 'active',
    services: [
      { id: 1, name: 'Corte Feminino', duration: '60 min', price: 'R$ 80,00' },
      { id: 2, name: 'Tintura', duration: '120 min', price: 'R$ 150,00' },
      { id: 3, name: 'Mechas', duration: '180 min', price: 'R$ 250,00' },
    ],
  },
  {
    id: 2,
    name: 'Juliana Silva',
    specialty: 'Manicure',
    status: 'active',
    services: [
      { id: 4, name: 'Manicure', duration: '45 min', price: 'R$ 45,00' },
      { id: 5, name: 'Pedicure', duration: '60 min', price: 'R$ 55,00' },
      { id: 6, name: 'Unhas de Gel', duration: '90 min', price: 'R$ 120,00' },
    ],
  },
  {
    id: 3,
    name: 'Patrícia Oliveira',
    specialty: 'Esteticista',
    status: 'active',
    services: [
      { id: 7, name: 'Limpeza de Pele', duration: '60 min', price: 'R$ 120,00' },
      { id: 8, name: 'Massagem Relaxante', duration: '60 min', price: 'R$ 100,00' },
    ],
  },
  {
    id: 4,
    name: 'Ana Paula Santos',
    specialty: 'Maquiadora',
    status: 'inactive',
    services: [],
  },
];

// ============================================
// COMPONENTES AUXILIARES
// ============================================

// Modal para editar/adicionar profissional
const ProfessionalModal = ({
  professional,
  onSave,
  onClose,
}: {
  professional: Professional | null;
  onSave: (data: { name: string; specialty: string; status: 'active' | 'inactive' }) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(professional?.name || '');
  const [specialty, setSpecialty] = useState(professional?.specialty || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(professional?.status || 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, specialty, status });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {professional ? 'Editar Profissional' : 'Nova Profissional'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidade
            </label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para editar/adicionar serviço
const ServiceModal = ({
  service,
  onSave,
  onClose,
}: {
  service: Service | null;
  onSave: (data: { name: string; duration: string; price: string }) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(service?.name || '');
  const [duration, setDuration] = useState(service?.duration || '');
  const [price, setPrice] = useState(service?.price || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, duration, price });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {service ? 'Editar Serviço' : 'Novo Serviço'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Serviço
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duração
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ex: 60 min"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: R$ 100,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const Admin = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // ============================================
  // CARREGAR DADOS DO LOCALSTORAGE
  // ============================================

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setProfessionals(JSON.parse(savedData));
      } catch {
        setProfessionals(initialData);
      }
    } else {
      setProfessionals(initialData);
    }
  }, []);

  // ============================================
  // SALVAR NO LOCALSTORAGE
  // ============================================

  const saveToLocalStorage = (data: Professional[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // ============================================
  // RESETAR PARA DADOS PADRÃO
  // ============================================

  const handleResetToDefault = () => {
    if (confirm('Tem certeza que deseja restaurar os dados padrão? Todos as alterações serão perdidas.')) {
      localStorage.removeItem(STORAGE_KEY);
      setProfessionals(initialData);
    }
  };

  // ============================================
  // HANDLERS - PROFISSIONAIS
  // ============================================

  const handleAddProfessional = () => {
    setEditingProfessional(null);
    setShowProfessionalModal(true);
  };

  const handleEditProfessional = (professional: Professional) => {
    setEditingProfessional(professional);
    setSelectedProfessional(professional);
    setShowProfessionalModal(true);
  };

  const handleSaveProfessional = (data: { name: string; specialty: string; status: 'active' | 'inactive' }) => {
    let updatedProfessionals: Professional[];
    
    if (editingProfessional) {
      // Editar profissional existente
      updatedProfessionals = professionals.map((p) =>
        p.id === editingProfessional.id
          ? { ...p, ...data }
          : p
      );
    } else {
      // Criar nova profissional
      const newId = Math.max(...professionals.map((p) => p.id), 0) + 1;
      updatedProfessionals = [
        ...professionals,
        { id: newId, ...data, services: [] },
      ];
    }
    
    setProfessionals(updatedProfessionals);
    saveToLocalStorage(updatedProfessionals);
    setShowProfessionalModal(false);
    setEditingProfessional(null);
  };

  const handleDeleteProfessional = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta profissional?')) {
      const updatedProfessionals = professionals.filter((p) => p.id !== id);
      setProfessionals(updatedProfessionals);
      saveToLocalStorage(updatedProfessionals);
      if (selectedProfessional?.id === id) {
        setSelectedProfessional(null);
      }
    }
  };

  // ============================================
  // HANDLERS - SERVIÇOS
  // ============================================

  const handleAddService = (professionalId: number) => {
    const professional = professionals.find((p) => p.id === professionalId);
    if (professional) {
      setSelectedProfessional(professional);
    }
    setEditingService(null);
    setShowServiceModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleSaveService = (data: { name: string; duration: string; price: string }) => {
    if (!selectedProfessional) return;

    let updatedProfessionals: Professional[];

    if (editingService) {
      // Editar serviço existente
      updatedProfessionals = professionals.map((p) =>
        p.id === selectedProfessional.id
          ? {
              ...p,
              services: p.services.map((s) =>
                s.id === editingService.id ? { ...s, ...data } : s
              ),
            }
          : p
      );
    } else {
      // Criar novo serviço
      const newId = Math.max(0, ...professionals.flatMap((p) => p.services.map((s) => s.id))) + 1;
      updatedProfessionals = professionals.map((p) =>
        p.id === selectedProfessional.id
          ? { ...p, services: [...p.services, { id: newId, ...data }] }
          : p
      );
    }
    
    setProfessionals(updatedProfessionals);
    saveToLocalStorage(updatedProfessionals);
    setShowServiceModal(false);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: number) => {
    if (!selectedProfessional) return;
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      const updatedProfessionals = professionals.map((p) =>
        p.id === selectedProfessional.id
          ? { ...p, services: p.services.filter((s) => s.id !== serviceId) }
          : p
      );
      setProfessionals(updatedProfessionals);
      saveToLocalStorage(updatedProfessionals);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-800">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Gerencie profissionais e seus serviços
              </p>
            </div>
            <a
              href="/"
              className="text-pink-500 hover:text-pink-600 text-sm font-medium"
            >
              ← Voltar ao site
            </a>
          </div>
        </div>
      </div>

      {/* Lista de Profissionais */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Profissionais ({professionals.length})
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restaurar dados padrão
            </button>
            <button
              onClick={handleAddProfessional}
              className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar profissional
          </button>
        </div>
      </div>

      <div className="grid gap-4">
          {professionals.map((professional) => (
            <div
              key={professional.id}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {professional.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        professional.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {professional.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{professional.specialty}</p>
                  <p className="text-sm text-pink-600 mt-1">
                    {professional.services.length} serviço(s) vinculado(s)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProfessional(professional);
                    }}
                    className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                  >
                    Ver serviços
                  </button>
                  <button
                    onClick={() => handleEditProfessional(professional)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProfessional(professional.id)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>

              {/* Serviços da Profissional Selecionada */}
              {selectedProfessional?.id === professional.id && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Serviços de {professional.name}
                    </h4>
                    <button
                      onClick={() => handleAddService(professional.id)}
                      className="text-sm text-pink-500 hover:text-pink-600 font-medium"
                    >
                      + Adicionar serviço
                    </button>
                  </div>

                  {professional.services.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      Nenhum serviço cadastrado para esta profissional.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 rounded-lg">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Serviço
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Duração
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Preço
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {professional.services.map((service) => (
                            <tr key={service.id}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {service.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {service.duration}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {service.price}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleEditService(service)}
                                  className="text-sm text-pink-600 hover:text-pink-800 mr-3"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="text-sm text-red-600 hover:text-red-800"
                                >
                                  Excluir
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Profissional */}
      {showProfessionalModal && (
        <ProfessionalModal
          professional={editingProfessional}
          onSave={handleSaveProfessional}
          onClose={() => {
            setShowProfessionalModal(false);
            setEditingProfessional(null);
          }}
        />
      )}

          {/* Modal de Serviço */}
      {showServiceModal && selectedProfessional && (
        <ServiceModal
          service={editingService}
          onSave={handleSaveService}
          onClose={() => {
            setShowServiceModal(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
};

export default Admin;
