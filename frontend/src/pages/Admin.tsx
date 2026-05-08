import { useState, useEffect } from 'react';
import MonthlyScheduleEditor from '../components/schedule/MonthlyScheduleEditor';
import ScheduleBlockForm from '../components/schedule/ScheduleBlockForm';
import { MonthlySchedule, ScheduleBlock, WeeklyRule, WeekDay } from '../components/schedule/types';

// ============================================
// CONSTANTES
// ============================================

const STORAGE_KEY = 'elegance_space_professionals';
const APPOINTMENT_STORAGE_KEY = 'elegance_space_appointments';

const getCurrentMonthYear = () => new Date().toISOString().slice(0, 7);

const createDefaultWeeklyRules = (): Record<WeekDay, WeeklyRule> => ({
  monday: { enabled: false, startTime: '08:00', endTime: '18:00' },
  tuesday: { enabled: false, startTime: '08:00', endTime: '18:00' },
  wednesday: { enabled: false, startTime: '08:00', endTime: '18:00' },
  thursday: { enabled: false, startTime: '08:00', endTime: '18:00' },
  friday: { enabled: false, startTime: '08:00', endTime: '18:00' },
  saturday: { enabled: false, startTime: '09:00', endTime: '14:00' },
  sunday: { enabled: false, startTime: '09:00', endTime: '14:00' },
});

const createMonthlySchedule = (monthYear: string): MonthlySchedule => ({
  monthYear,
  weeklyRules: createDefaultWeeklyRules(),
  blocks: [],
  released: false,
});

// ============================================
// TIPOS
// ============================================

interface Service {
  id: number;
  name: string;
  duration: string;
  price: string;
}

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface WorkSchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface Professional {
  id: number;
  name: string;
  specialty: string;
  status: 'active' | 'inactive';
  image: string;
  services: Service[];
  schedule?: WorkSchedule;
  monthlySchedules?: MonthlySchedule[];
}

interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  professionalId: number;
  professionalName: string;
  serviceId: number;
  serviceName: string;
  date: string;
  time: string;
  duration?: string;
  createdAt?: string;
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
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop',
    services: [
      { id: 1, name: 'Corte Feminino', duration: '60 min', price: 'R$ 80,00' },
      { id: 2, name: 'Tintura', duration: '120 min', price: 'R$ 150,00' },
      { id: 3, name: 'Mechas', duration: '180 min', price: 'R$ 250,00' },
    ],
    schedule: {
      monday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      tuesday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      wednesday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      thursday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      friday: { enabled: true, startTime: '08:00', endTime: '18:00' },
      saturday: { enabled: true, startTime: '09:00', endTime: '14:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '14:00' },
    },
  },
  {
    id: 2,
    name: 'Juliana Silva',
    specialty: 'Manicure',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop',
    services: [
      { id: 4, name: 'Manicure', duration: '45 min', price: 'R$ 45,00' },
      { id: 5, name: 'Pedicure', duration: '60 min', price: 'R$ 55,00' },
      { id: 6, name: 'Unhas de Gel', duration: '90 min', price: 'R$ 120,00' },
    ],
    schedule: {
      monday: { enabled: true, startTime: '09:00', endTime: '19:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '19:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '19:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '19:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '19:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '14:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '14:00' },
    },
  },
  {
    id: 3,
    name: 'Patrícia Oliveira',
    specialty: 'Esteticista',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop',
    services: [
      { id: 7, name: 'Limpeza de Pele', duration: '60 min', price: 'R$ 120,00' },
      { id: 8, name: 'Massagem Relaxante', duration: '60 min', price: 'R$ 100,00' },
    ],
    schedule: {
      monday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '08:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '14:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '14:00' },
    },
  },
  {
    id: 4,
    name: 'Ana Paula Santos',
    specialty: 'Maquiadora',
    status: 'inactive',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop',
    services: [],
    schedule: {
      monday: { enabled: false, startTime: '08:00', endTime: '18:00' },
      tuesday: { enabled: false, startTime: '08:00', endTime: '18:00' },
      wednesday: { enabled: false, startTime: '08:00', endTime: '18:00' },
      thursday: { enabled: false, startTime: '08:00', endTime: '18:00' },
      friday: { enabled: false, startTime: '08:00', endTime: '18:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '14:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '14:00' },
    },
  },
];

// ============================================
// COMPONENTES AUXILIARES
// ============================================

// Função para formatar resumo da agenda
const formatScheduleSummary = (schedule?: WorkSchedule): string => {
  if (!schedule) return 'Não configurado';
  
  const days = [
    { key: 'monday', label: 'Seg' },
    { key: 'tuesday', label: 'Ter' },
    { key: 'wednesday', label: 'Qua' },
    { key: 'thursday', label: 'Qui' },
    { key: 'friday', label: 'Sex' },
    { key: 'saturday', label: 'Sáb' },
    { key: 'sunday', label: 'Dom' },
  ];
  
  const enabledDays = days.filter(d => schedule[d.key as keyof WorkSchedule]?.enabled);
  
  if (enabledDays.length === 0) return 'Não configurado';
  
  // Agrupar dias com mesmo horário
  const dayGroups: { days: string[]; start: string; end: string }[] = [];
  
  enabledDays.forEach(({ key, label }) => {
    const day = schedule[key as keyof WorkSchedule];
    const existing = dayGroups.find(g => g.start === day.startTime && g.end === day.endTime);
    if (existing) {
      existing.days.push(label);
    } else {
      dayGroups.push({ days: [label], start: day.startTime, end: day.endTime });
    }
  });
  
  return dayGroups.map(g => `${g.days.join(' a ')}: ${g.start} às ${g.end}`).join(' | ');
};

const formatMonthlyScheduleSummary = (monthlySchedules?: MonthlySchedule[]): string => {
  if (!monthlySchedules || monthlySchedules.length === 0) return '';
  const selected = [...monthlySchedules].sort((a, b) => b.monthYear.localeCompare(a.monthYear))[0];
  const monthLabel = selected.monthYear.split('-').reverse().join('/');
  const enabledDays = Object.entries(selected.weeklyRules).filter(([, rule]) => rule.enabled);
  if (enabledDays.length === 0) {
    return `Agenda ${monthLabel} não configurada`;
  }
  const groups: { days: string[]; start: string; end: string }[] = [];
  enabledDays.forEach(([dayKey, rule]) => {
    const labelMap: Record<string, string> = {
      monday: 'Seg',
      tuesday: 'Ter',
      wednesday: 'Qua',
      thursday: 'Qui',
      friday: 'Sex',
      saturday: 'Sáb',
      sunday: 'Dom',
    };
    const label = labelMap[dayKey];
    const existing = groups.find((g) => g.start === rule.startTime && g.end === rule.endTime);
    if (existing) existing.days.push(label);
    else groups.push({ days: [label], start: rule.startTime, end: rule.endTime });
  });
  const summary = groups.map((g) => `${g.days.join(' a ')}: ${g.start} às ${g.end}`).join(' | ');
  return `${monthLabel}: ${summary}`;
};

// Modal para editar/adicionar profissional
const ProfessionalModal = ({
  professional,
  onSave,
  onClose,
}: {
  professional: Professional | null;
  onSave: (data: { name: string; specialty: string; status: 'active' | 'inactive'; image: string; monthlySchedules: MonthlySchedule[] }) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(professional?.name || '');
  const [specialty, setSpecialty] = useState(professional?.specialty || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(professional?.status || 'active');
  const [image, setImage] = useState(professional?.image || '');
  const [monthlySchedules, setMonthlySchedules] = useState<MonthlySchedule[]>(professional?.monthlySchedules || []);
  const [activeTab, setActiveTab] = useState<'Dados' | 'Serviços' | 'Agenda mensal' | 'Bloqueios'>('Dados');
  const [blockMonth, setBlockMonth] = useState<string>(professional?.monthlySchedules?.[0]?.monthYear || getCurrentMonthYear());

  useEffect(() => {
    if (!monthlySchedules.some((item) => item.monthYear === blockMonth)) {
      setBlockMonth(monthlySchedules[0]?.monthYear || getCurrentMonthYear());
    }
  }, [monthlySchedules, blockMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, specialty, status, image, monthlySchedules });
  };

  const tabs: Array<{ key: 'Dados' | 'Serviços' | 'Agenda mensal' | 'Bloqueios'; label: string }> = [
    { key: 'Dados', label: 'Dados da profissional' },
    { key: 'Serviços', label: 'Serviços' },
    { key: 'Agenda mensal', label: 'Agenda mensal' },
    { key: 'Bloqueios', label: 'Bloqueios' },
  ];

  const updateMonthlySchedule = (update: MonthlySchedule) => {
    const updated = monthlySchedules.some((item) => item.monthYear === update.monthYear)
      ? monthlySchedules.map((item) => (item.monthYear === update.monthYear ? update : item))
      : [...monthlySchedules, update];
    setMonthlySchedules(updated);
  };

  const handleAddBlock = (block: ScheduleBlock) => {
    const schedule = monthlySchedules.find((item) => item.monthYear === blockMonth);
    if (schedule) {
      updateMonthlySchedule({
        ...schedule,
        blocks: [...schedule.blocks, block],
      });
      return;
    }

    updateMonthlySchedule({
      ...createMonthlySchedule(blockMonth),
      blocks: [block],
    });
  };

  const handleRemoveBlock = (blockId: string) => {
    setMonthlySchedules(
      monthlySchedules.map((schedule) =>
        schedule.monthYear === blockMonth
          ? { ...schedule, blocks: schedule.blocks.filter((block) => block.id !== blockId) }
          : schedule,
      ),
    );
  };

  const selectedBlockSchedule = monthlySchedules.find((item) => item.monthYear === blockMonth);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
        <div className="px-6 py-4 border-b bg-white z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {professional ? 'Editar Profissional' : 'Nova Profissional'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Gerencie os dados, serviços e disponibilidade mensal.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700"
            >
              Fechar
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.key
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-5 flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'Dados' && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
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
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://exemplo.com/foto.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm text-gray-700 font-medium">Resumo</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Nome, especialidade, status e imagem são campos principais da profissional.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Serviços' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Serviços vinculados</p>
                  {professional?.services.length ? (
                    <div className="grid gap-3">
                      {professional.services.map((service) => (
                        <div key={service.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-gray-800">{service.name}</p>
                            <span className="text-xs text-gray-500">{service.duration} min</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{service.price}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum serviço vinculado a esta profissional.</p>
                  )}
                  <p className="text-sm text-gray-500 mt-3">Gerencie serviços no painel principal do Admin.</p>
                </div>
              </div>
            )}

            {activeTab === 'Agenda mensal' && (
              <div>
                <MonthlyScheduleEditor
                  monthlySchedules={monthlySchedules}
                  onChange={setMonthlySchedules}
                />
              </div>
            )}

            {activeTab === 'Bloqueios' && (
              <div className="space-y-6">
                <div className="grid gap-3 md:grid-cols-2 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mês/Ano</label>
                    <input
                      type="month"
                      value={blockMonth}
                      onChange={(e) => setBlockMonth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Blocos no mês</p>
                    {selectedBlockSchedule?.blocks.length ? (
                      <p className="text-sm text-gray-600">{selectedBlockSchedule.blocks.length} bloqueio(s) cadastrados</p>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum bloqueio cadastrado para este mês.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Adicionar bloqueio</h3>
                  <ScheduleBlockForm monthYear={blockMonth} onAdd={handleAddBlock} />
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Bloqueios cadastrados</h3>
                  {selectedBlockSchedule?.blocks.length ? (
                    <div className="space-y-3">
                      {selectedBlockSchedule.blocks.map((block) => (
                        <div key={block.id} className="rounded-2xl border border-gray-200 p-4 bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{block.date}</p>
                            <p className="text-sm text-gray-600">
                              {block.type === 'full-day'
                                ? 'Dia inteiro'
                                : `${block.startTime} às ${block.endTime}`}
                            </p>
                            {block.reason && <p className="text-sm text-gray-500">Motivo: {block.reason}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBlock(block.id)}
                            className="inline-flex items-center justify-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                          >
                            Excluir
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum bloqueio registrado para este mês.</p>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-4 border-t bg-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Salvar
          </button>
        </div>
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
              type="number"
              min="1"
step="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentTab, setAppointmentTab] = useState<'por-profissional' | 'base-geral'>('por-profissional');

  // Filtros para "Por profissional"
  const [professionalDateFilter, setProfessionalDateFilter] = useState<string>('');

  // Filtros para "Base geral"
  const [clientFilter, setClientFilter] = useState<string>('');
  const [phoneFilter, setPhoneFilter] = useState<string>('');
  const [professionalFilter, setProfessionalFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<string>('');
  const [durationFilter, setDurationFilter] = useState<string>('');
  const [createdAtFilter, setCreatedAtFilter] = useState<string>('');

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

  useEffect(() => {
    const storedAppointments = localStorage.getItem(APPOINTMENT_STORAGE_KEY);
    if (!storedAppointments) {
      setAppointments([]);
      return;
    }

    try {
      setAppointments(JSON.parse(storedAppointments));
    } catch {
      setAppointments([]);
    }
  }, []);

  const refreshAppointments = () => {
    const storedAppointments = localStorage.getItem(APPOINTMENT_STORAGE_KEY);
    if (!storedAppointments) {
      setAppointments([]);
      return;
    }

    try {
      setAppointments(JSON.parse(storedAppointments));
    } catch {
      setAppointments([]);
    }
  };
const handleDeleteAppointment = (appointmentId: string) => {
  if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

  const updatedAppointments = appointments.filter(
    (appointment) => appointment.id !== appointmentId
  );

  setAppointments(updatedAppointments);

  localStorage.setItem(
    APPOINTMENT_STORAGE_KEY,
    JSON.stringify(updatedAppointments)
  );
};
  // Funções de filtro
  const clearProfessionalFilters = () => {
    setProfessionalDateFilter('');
  };

  const clearGeneralFilters = () => {
    setClientFilter('');
    setPhoneFilter('');
    setProfessionalFilter('');
    setServiceFilter('');
    setDateFilter('');
    setTimeFilter('');
    setDurationFilter('');
    setCreatedAtFilter('');
  };

  // Obter opções únicas para filtros
  const getUniqueProfessionals = () => {
    const unique = new Set(appointments.map(a => a.professionalName));
    return Array.from(unique).sort();
  };

  const getUniqueServices = () => {
    const unique = new Set(appointments.map(a => a.serviceName));
    return Array.from(unique).sort();
  };

  const getUniqueDurations = () => {
    const unique = new Set(appointments.map(a => a.duration || '').filter(d => d));
    return Array.from(unique).sort();
  };

  // Aplicar filtros aos agendamentos
  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      if (clientFilter && !appointment.clientName.toLowerCase().includes(clientFilter.toLowerCase())) return false;
      if (phoneFilter && !appointment.phone.includes(phoneFilter)) return false;
      if (professionalFilter && appointment.professionalName !== professionalFilter) return false;
      if (serviceFilter && appointment.serviceName !== serviceFilter) return false;
      if (dateFilter && appointment.date !== dateFilter) return false;
      if (timeFilter && !appointment.time.includes(timeFilter)) return false;
      if (durationFilter && appointment.duration !== durationFilter) return false;
      if (createdAtFilter && appointment.createdAt && !appointment.createdAt.includes(createdAtFilter)) return false;
      return true;
    });
  };

  const getFilteredAppointmentsByDate = (date: string) => {
    if (!date) return appointments;
    return appointments.filter(appointment => appointment.date === date);
  };

  // Função de exportação CSV
  const exportToCSV = () => {
    const filteredAppointments = getFilteredAppointments();
    const headers = ['Cliente', 'Telefone', 'Profissional', 'Serviço', 'Data', 'Horário', 'Duração', 'Criado em'];
    const rows = filteredAppointments.map(appointment => [
      appointment.clientName,
      appointment.phone,
      appointment.professionalName,
      appointment.serviceName,
      appointment.date,
      appointment.time,
      appointment.duration || '',
      appointment.createdAt ? new Date(appointment.createdAt).toLocaleString('pt-BR') : '',
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'agendamentos-elegance-space.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const handleSaveProfessional = (data: { name: string; specialty: string; status: 'active' | 'inactive'; image: string; monthlySchedules: MonthlySchedule[] }) => {
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

  const getServiceDuration = (appointment: Appointment) => {
    const professional = professionals.find((p) => p.id === appointment.professionalId);
    const service = professional?.services.find((s) => s.id === appointment.serviceId);
    return service?.duration ?? appointment.duration ?? '-';
  };

  const formatCreatedAt = (value?: string) => {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return value;
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
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {professional.monthlySchedules?.length
                      ? formatMonthlyScheduleSummary(professional.monthlySchedules)
                      : formatScheduleSummary(professional.schedule)}
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
                                {service.duration} min
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Agendamentos</h2>
            <p className="text-sm text-gray-500">
              Visualize os agendamentos realizados por profissional ou na base geral.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => setAppointmentTab('por-profissional')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                appointmentTab === 'por-profissional'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Por profissional
            </button>
            <button
              type="button"
              onClick={() => setAppointmentTab('base-geral')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                appointmentTab === 'base-geral'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Base geral
            </button>
            <button
              type="button"
              onClick={refreshAppointments}
              className="rounded-full px-4 py-2 text-sm font-medium text-pink-600 border border-pink-200 bg-white hover:bg-pink-50"
            >
              Atualizar lista
            </button>
          </div>
        </div>

        {appointmentTab === 'por-profissional' ? (
          <div className="space-y-6">
            {/* Filtros para "Por profissional" */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filtrar por data
                    </label>
                    <input
                      type="date"
                      value={professionalDateFilter}
                      onChange={(e) => setProfessionalDateFilter(e.target.value)}
                      className="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={clearProfessionalFilters}
                    className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Limpar filtro
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {professionalDateFilter ? `Mostrando agendamentos para ${professionalDateFilter}` : 'Mostrando todos os agendamentos'}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {professionals.length === 0 ? (
                <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
                  Nenhuma profissional encontrada para exibir agendamentos.
                </div>
              ) : (
                professionals.map((professional) => {
                  const professionalAppointments = getFilteredAppointmentsByDate(professionalDateFilter).filter(
                    (appointment) => appointment.professionalId === professional.id,
                  );

                  return (
                    <div key={professional.id} className="rounded-3xl border border-gray-200 bg-white p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{professional.name}</h3>
                          <p className="text-sm text-gray-500">{professional.specialty}</p>
                        </div>
                        <span className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-sm font-medium text-pink-700">
                          {professionalAppointments.length} agendamento(s)
                        </span>
                      </div>

                      {professionalAppointments.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">Nenhum agendamento encontrado para esta profissional.</p>
                      ) : (
                        <div className="mt-4 grid gap-4">
                          {professionalAppointments.map((appointment) => (
                            <div key={appointment.id} className="rounded-3xl border border-gray-200 bg-pink-50 p-4">
                              <div className="grid gap-2 sm:grid-cols-2">
                                <div>
                                  <p className="text-sm text-gray-500">Cliente</p>
                                  <p className="text-sm font-medium text-gray-800">{appointment.clientName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Telefone</p>
                                  <p className="text-sm font-medium text-gray-800">{appointment.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Serviço</p>
                                  <p className="text-sm font-medium text-gray-800">
  {appointment.serviceName} • {getServiceDuration(appointment)} min
</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Data / Horário</p>
                                  <p className="text-sm font-medium text-gray-800">{appointment.date} • {appointment.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filtros para "Base geral" */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
                  <button
                    type="button"
                    onClick={clearGeneralFilters}
                    className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Limpar filtros
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <input
                      type="text"
                      value={clientFilter}
                      onChange={(e) => setClientFilter(e.target.value)}
                      placeholder="Buscar cliente..."
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={phoneFilter}
                      onChange={(e) => setPhoneFilter(e.target.value)}
                      placeholder="Buscar telefone..."
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
                    <select
                      value={professionalFilter}
                      onChange={(e) => setProfessionalFilter(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    >
                      <option value="">Todas as profissionais</option>
                      {getUniqueProfessionals().map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    >
                      <option value="">Todos os serviços</option>
                      {getUniqueServices().map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                    <input
                      type="text"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      placeholder="Ex: 14:00"
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duração</label>
                    <select
                      value={durationFilter}
                      onChange={(e) => setDurationFilter(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    >
                      <option value="">Todas as durações</option>
                      {getUniqueDurations().map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Criado em</label>
                    <input
                      type="date"
                      value={createdAtFilter}
                      onChange={(e) => setCreatedAtFilter(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela e botão de exportação */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Base geral de agendamentos</h3>
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Cliente</th>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Telefone</th>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Profissional</th>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Serviço</th>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Data</th>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Horário</th>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Duração</th>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Criado em</th>
                      <th className="px-4 py-3 font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getFilteredAppointments().length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-500">
                          Nenhum agendamento encontrado com os filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      getFilteredAppointments().map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-4 py-3">{appointment.clientName}</td>
                          <td className="px-4 py-3">{appointment.phone}</td>
                          <td className="px-4 py-3">{appointment.professionalName}</td>
                          <td className="px-4 py-3">{appointment.serviceName}</td>
                          <td className="px-4 py-3">{appointment.date}</td>
                          <td className="px-4 py-3">{appointment.time}</td>
                          <td className="px-4 py-3">{getServiceDuration(appointment)}</td>
                          <td className="px-4 py-3">{formatCreatedAt(appointment.createdAt)}</td>
                          <td className="px-4 py-3">
  <button
    type="button"
    onClick={() => handleDeleteAppointment(appointment.id)}
    className="text-sm font-medium text-red-600 hover:text-red-800"
  >
    Excluir
  </button>
</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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
