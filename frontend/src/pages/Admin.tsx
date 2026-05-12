import { useState, useEffect } from 'react';
import ScheduleBlockForm from '../components/schedule/ScheduleBlockForm';
import { MonthlySchedule, ScheduleBlock, WeeklyRule, WeekDay } from '../components/schedule/types';

// ============================================
// CONSTANTES
// ============================================

const STORAGE_KEY = 'elegance_space_professionals';
const APPOINTMENT_STORAGE_KEY = 'elegance_space_appointments';
const SITE_CONFIG_STORAGE_KEY = 'elegance_space_site_config';

const getCurrentMonthYear = () => new Date().toISOString().slice(0, 7);

const createDefaultWeeklyRules = (): Record<WeekDay, WeeklyRule> => ({
  monday: { enabled: false, startTime: '08:00', endTime: '18:00', intervalMinutes: 30, hasLunchBreak: false, lunchStartTime: '12:00', lunchEndTime: '13:00' },
  tuesday: { enabled: false, startTime: '08:00', endTime: '18:00', intervalMinutes: 30, hasLunchBreak: false, lunchStartTime: '12:00', lunchEndTime: '13:00' },
  wednesday: { enabled: false, startTime: '08:00', endTime: '18:00', intervalMinutes: 30, hasLunchBreak: false, lunchStartTime: '12:00', lunchEndTime: '13:00' },
  thursday: { enabled: false, startTime: '08:00', endTime: '18:00', intervalMinutes: 30, hasLunchBreak: false, lunchStartTime: '12:00', lunchEndTime: '13:00' },
  friday: { enabled: false, startTime: '08:00', endTime: '18:00', intervalMinutes: 30, hasLunchBreak: false, lunchStartTime: '12:00', lunchEndTime: '13:00' },
  saturday: { enabled: false, startTime: '09:00', endTime: '14:00', intervalMinutes: 30, hasLunchBreak: false, lunchStartTime: '12:00', lunchEndTime: '13:00' },
  sunday: { enabled: false, startTime: '09:00', endTime: '14:00', intervalMinutes: 30, hasLunchBreak: false, lunchStartTime: '12:00', lunchEndTime: '13:00' },
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
  intervalMinutes?: 30 | 60;
  hasLunchBreak?: boolean;
  lunchStartTime?: string;
  lunchEndTime?: string;
}

interface SiteService {
  id: number;
  name: string;
  description: string;
}

interface SiteConfig {
  siteName: string;
  footerDescription: string;
  contactEmail: string;
  contactPhone: string;
  servicesBadge: string;
  servicesTitle: string;
  servicesSubtitle: string;
  services: SiteService[];
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

interface VacationPeriod {
  enabled: boolean;
  startDate: string;
  endDate: string;
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
  vacation?: VacationPeriod;
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


const defaultSiteConfig: SiteConfig = {
  siteName: 'Elegance Space',
  footerDescription:
    'Sistema de agendamento moderno para salões de beleza. Transformando a experiência de agendamento com elegância e praticidade.',
  contactEmail: 'contato@elegancespace.com',
  contactPhone: '(11) 99999-9999',
  servicesBadge: 'O que oferecemos',
  servicesTitle: 'Nossos Serviços',
  servicesSubtitle: 'Uma variedade de serviços para realçar sua beleza e bem-estar.',
  services: [
    { id: 1, name: 'Corte e Pintura', description: 'Transformação completa dos fios' },
    { id: 2, name: 'Manicure e Pedicure', description: 'Cuidados completos para as unhas' },
    { id: 3, name: 'Tratamentos Faciais', description: 'Limpeza e rejuvenescimento' },
    { id: 4, name: 'Massagem Relaxante', description: 'Bem-estar e relaxamento' },
  ],
};

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
  const selected = monthlySchedules[0];
  const enabledDays = Object.entries(selected.weeklyRules).filter(([, rule]) => rule.enabled);
  if (enabledDays.length === 0) {
    return 'Agenda semanal não configurada';
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
  return `Agenda semanal: ${summary}`;
};

const getInitialWeeklyRules = (professional: Professional | null): Record<WeekDay, WeeklyRule> => {
  const defaults = createDefaultWeeklyRules();

  if (professional?.monthlySchedules?.[0]?.weeklyRules) {
    const rules = professional.monthlySchedules[0].weeklyRules;
    return {
      monday: { ...defaults.monday, ...rules.monday },
      tuesday: { ...defaults.tuesday, ...rules.tuesday },
      wednesday: { ...defaults.wednesday, ...rules.wednesday },
      thursday: { ...defaults.thursday, ...rules.thursday },
      friday: { ...defaults.friday, ...rules.friday },
      saturday: { ...defaults.saturday, ...rules.saturday },
      sunday: { ...defaults.sunday, ...rules.sunday },
    };
  }

  if (professional?.schedule) {
    return {
      monday: { ...defaults.monday, ...professional.schedule.monday },
      tuesday: { ...defaults.tuesday, ...professional.schedule.tuesday },
      wednesday: { ...defaults.wednesday, ...professional.schedule.wednesday },
      thursday: { ...defaults.thursday, ...professional.schedule.thursday },
      friday: { ...defaults.friday, ...professional.schedule.friday },
      saturday: { ...defaults.saturday, ...professional.schedule.saturday },
      sunday: { ...defaults.sunday, ...professional.schedule.sunday },
    };
  }

  return defaults;
};

const buildAutomaticSchedules = (
  weeklyRules: Record<WeekDay, WeeklyRule>,
  currentSchedules: MonthlySchedule[],
): MonthlySchedule[] => {
  const allBlocks = currentSchedules.flatMap((schedule) => schedule.blocks ?? []);

  return [
    {
      monthYear: getCurrentMonthYear(),
      weeklyRules,
      blocks: allBlocks,
      released: true,
    },
  ];
};

const weeklyDayLabels: Record<WeekDay, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const weekDayOrder: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const WeeklyScheduleEditor = ({
  weeklyRules,
  onChange,
}: {
  weeklyRules: Record<WeekDay, WeeklyRule>;
  onChange: (rules: Record<WeekDay, WeeklyRule>) => void;
}) => {
  const updateDay = (day: WeekDay, update: Partial<WeeklyRule>) => {
    onChange({
      ...weeklyRules,
      [day]: {
        ...weeklyRules[day],
        ...update,
      },
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
        <p className="text-sm font-semibold text-pink-700">Liberação automática</p>
        <p className="mt-1 text-sm text-gray-600">
          A agenda dos clientes será liberada automaticamente de hoje até o mesmo dia do próximo mês.
          Amanhã, um novo dia será liberado sozinho. Não precisa liberar mês manualmente.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Configuração semanal de dias e horários
        </h3>

        <div className="space-y-3">
          {weekDayOrder.map((day) => {
            const rule = weeklyRules[day];

            return (
              <div
                key={day}
                className="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4 xl:grid-cols-[1fr_auto_130px_130px_150px_auto_130px_130px]"
              >
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-700">{weeklyDayLabels[day]}</p>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(event) => updateDay(day, { enabled: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                  />
                  Trabalha
                </label>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Início</label>
                  <input
                    type="time"
                    value={rule.startTime}
                    onChange={(event) => updateDay(day, { startTime: event.target.value })}
                    disabled={!rule.enabled}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fim</label>
                  <input
                    type="time"
                    value={rule.endTime}
                    onChange={(event) => updateDay(day, { endTime: event.target.value })}
                    disabled={!rule.enabled}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Intervalo</label>
                  <select
                    value={rule.intervalMinutes || 30}
                    onChange={(event) => updateDay(day, { intervalMinutes: Number(event.target.value) as 30 | 60 })}
                    disabled={!rule.enabled}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  >
                    <option value={30}>30 em 30 min</option>
                    <option value={60}>1 em 1 hora</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rule.hasLunchBreak || false}
                    onChange={(event) => updateDay(day, { hasLunchBreak: event.target.checked })}
                    disabled={!rule.enabled}
                    className="h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  Almoço
                </label>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Início almoço</label>
                  <input
                    type="time"
                    value={rule.lunchStartTime || '12:00'}
                    onChange={(event) => updateDay(day, { lunchStartTime: event.target.value })}
                    disabled={!rule.enabled || !rule.hasLunchBreak}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fim almoço</label>
                  <input
                    type="time"
                    value={rule.lunchEndTime || '13:00'}
                    onChange={(event) => updateDay(day, { lunchEndTime: event.target.value })}
                    disabled={!rule.enabled || !rule.hasLunchBreak}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Modal para editar/adicionar profissional
const ProfessionalModal = ({
  professional,
  onSave,
  onClose,
}: {
  professional: Professional | null;
  onSave: (data: {
    name: string;
    specialty: string;
    status: 'active' | 'inactive';
    image: string;
    monthlySchedules: MonthlySchedule[];
    vacation?: VacationPeriod;
  }) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(professional?.name || '');
  const [specialty, setSpecialty] = useState(professional?.specialty || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(professional?.status || 'active');
  const [image, setImage] = useState(professional?.image || '');
  const [monthlySchedules, setMonthlySchedules] = useState<MonthlySchedule[]>(professional?.monthlySchedules || []);
  const [weeklyRules, setWeeklyRules] = useState<Record<WeekDay, WeeklyRule>>(getInitialWeeklyRules(professional));
  const [vacation, setVacation] = useState<VacationPeriod>(
    professional?.vacation || {
      enabled: false,
      startDate: '',
      endDate: '',
    },
  );
  const [activeTab, setActiveTab] = useState<'Dados' | 'Serviços' | 'Agenda semanal' | 'Férias' | 'Bloqueios'>('Dados');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      specialty,
      status,
      image,
      monthlySchedules: buildAutomaticSchedules(weeklyRules, monthlySchedules),
      vacation,
    });
  };

  const tabs: Array<{ key: 'Dados' | 'Serviços' | 'Agenda semanal' | 'Férias' | 'Bloqueios'; label: string }> = [
    { key: 'Dados', label: 'Dados da profissional' },
    { key: 'Serviços', label: 'Serviços' },
    { key: 'Agenda semanal', label: 'Agenda semanal' },
    { key: 'Férias', label: 'Férias' },
    { key: 'Bloqueios', label: 'Bloqueios' },
  ];

  const updateMonthlySchedule = (update: MonthlySchedule) => {
    const updated = monthlySchedules.some((item) => item.monthYear === update.monthYear)
      ? monthlySchedules.map((item) => (item.monthYear === update.monthYear ? update : item))
      : [...monthlySchedules, update];
    setMonthlySchedules(updated);
  };

  const handleAddBlock = (block: ScheduleBlock) => {
    const scheduleMonth = getCurrentMonthYear();
    const schedule = monthlySchedules.find((item) => item.monthYear === scheduleMonth);

    if (schedule) {
      updateMonthlySchedule({
        ...schedule,
        blocks: [...schedule.blocks, block],
      });
      return;
    }

    updateMonthlySchedule({
      ...createMonthlySchedule(scheduleMonth),
      blocks: [block],
      released: true,
    });
  };

  const handleRemoveBlock = (blockId: string) => {
    setMonthlySchedules(
      monthlySchedules.map((schedule) => ({
        ...schedule,
        blocks: schedule.blocks.filter((block) => block.id !== blockId),
      })),
    );
  };

  const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatDateLabel = (date: Date) => {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const dayLabels: Record<WeekDay, string> = {
    monday: 'Seg',
    tuesday: 'Ter',
    wednesday: 'Qua',
    thursday: 'Qui',
    friday: 'Sex',
    saturday: 'Sáb',
    sunday: 'Dom',
  };

  const weekdayFromIndex: WeekDay[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const getRollingAvailableDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const limitDate = new Date(today);
    limitDate.setMonth(limitDate.getMonth() + 1);

    const dates: { dateKey: string; label: string }[] = [];
    const current = new Date(today);

    while (current <= limitDate) {
      const dayKey = weekdayFromIndex[current.getDay()];
      const rule = weeklyRules[dayKey];

      if (rule.enabled) {
        dates.push({
          dateKey: toLocalDateKey(current),
          label: `${formatDateLabel(current)} • ${dayLabels[dayKey]}`,
        });
      }

      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const availableBlockDates = getRollingAvailableDates();
  const availableBlockDateKeys = availableBlockDates.map((item) => item.dateKey);
  const allBlocks = monthlySchedules.flatMap((schedule) => schedule.blocks ?? []);
  const visibleBlocks = allBlocks.filter((block) => availableBlockDateKeys.includes(block.date));

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
                Gerencie os dados, serviços e disponibilidade semanal.
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
                <div className="space-y-3 sm:space-y-4">
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

                <div className="space-y-3 sm:space-y-4">
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
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                    <p className="text-sm text-gray-700 font-medium">Resumo</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Nome, especialidade, status e imagem são campos principais da profissional.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Serviços' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Serviços vinculados</p>
                  {professional?.services.length ? (
                    <div className="grid gap-2 sm:gap-3">
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
                    <p className="text-xs text-gray-500 sm:text-sm">Nenhum serviço vinculado a esta profissional.</p>
                  )}
                  <p className="text-sm text-gray-500 mt-3">Gerencie serviços no painel principal do Admin.</p>
                </div>
              </div>
            )}

            {activeTab === 'Agenda semanal' && (
              <WeeklyScheduleEditor
                weeklyRules={weeklyRules}
                onChange={setWeeklyRules}
              />
            )}

            {activeTab === 'Férias' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
                  <p className="text-sm font-semibold text-pink-700">
                    Período de férias da profissional
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Quando marcado, a profissional não ficará disponível para agendamentos dentro do período escolhido.
                    Você pode desmarcar depois caso ela decida trabalhar.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={vacation.enabled}
                      onChange={(event) =>
                        setVacation((current) => ({
                          ...current,
                          enabled: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                    />
                    Vai tirar férias
                  </label>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Início das férias
                      </label>
                      <input
                        type="date"
                        value={vacation.startDate}
                        onChange={(event) =>
                          setVacation((current) => ({
                            ...current,
                            startDate: event.target.value,
                          }))
                        }
                        disabled={!vacation.enabled}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fim das férias
                      </label>
                      <input
                        type="date"
                        value={vacation.endDate}
                        onChange={(event) =>
                          setVacation((current) => ({
                            ...current,
                            endDate: event.target.value,
                          }))
                        }
                        disabled={!vacation.enabled}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {vacation.enabled && vacation.startDate && vacation.endDate && (
                    <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
                      Férias configuradas de {vacation.startDate} até {vacation.endDate}.
                    </div>
                  )}

                  {vacation.enabled && (!vacation.startDate || !vacation.endDate) && (
                    <div className="mt-5 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
                      Informe a data de início e fim para bloquear o período de férias.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Bloqueios' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4">
                  <p className="text-sm font-semibold text-pink-700">
                    Bloqueios dentro da agenda liberada
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Só é possível bloquear datas disponíveis entre hoje e o mesmo dia do próximo mês.
                    Amanhã, um novo dia será liberado automaticamente.
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Adicionar bloqueio</h3>
                  <ScheduleBlockForm
                    availableDates={availableBlockDates}
                    onAdd={handleAddBlock}
                  />
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Bloqueios cadastrados</h3>
                  {visibleBlocks.length ? (
                    <div className="space-y-3">
                      {visibleBlocks.map((block) => (
                        <div key={block.id} className="rounded-2xl border border-gray-200 p-4 bg-gray-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{block.date}</p>
                            <p className="text-sm text-gray-600">
                              {block.type === 'full-day'
                                ? 'Dia inteiro'
                                : `${block.startTime} às ${block.endTime}`}
                            </p>
                            {block.reason && <p className="text-xs text-gray-500 sm:text-sm">Motivo: {block.reason}</p>}
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
                    <p className="text-xs text-gray-500 sm:text-sm">Nenhum bloqueio registrado dentro da janela atual de agenda.</p>
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
          <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
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
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [siteConfigSaved, setSiteConfigSaved] = useState(false);
  const [adminSection, setAdminSection] = useState<'site' | 'home' | 'professionals' | 'appointments'>('site');

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
    const savedConfig = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (!savedConfig) return;

    try {
      setSiteConfig({ ...defaultSiteConfig, ...JSON.parse(savedConfig) });
    } catch {
      setSiteConfig(defaultSiteConfig);
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


  const updateSiteConfig = (update: Partial<SiteConfig>) => {
    setSiteConfig((current) => ({
      ...current,
      ...update,
    }));
    setSiteConfigSaved(false);
  };

  const updateSiteService = (serviceId: number, update: Partial<SiteService>) => {
    setSiteConfig((current) => ({
      ...current,
      services: current.services.map((service) =>
        service.id === serviceId ? { ...service, ...update } : service,
      ),
    }));
    setSiteConfigSaved(false);
  };

  const handleSaveSiteConfig = () => {
    localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(siteConfig));
    setSiteConfigSaved(true);
    window.setTimeout(() => setSiteConfigSaved(false), 2500);
  };

  const handleResetSiteConfig = () => {
    if (!confirm('Tem certeza que deseja restaurar as informações padrão do site?')) return;
    setSiteConfig(defaultSiteConfig);
    localStorage.setItem(SITE_CONFIG_STORAGE_KEY, JSON.stringify(defaultSiteConfig));
    setSiteConfigSaved(true);
    window.setTimeout(() => setSiteConfigSaved(false), 2500);
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

  const handleSaveProfessional = (data: {
    name: string;
    specialty: string;
    status: 'active' | 'inactive';
    image: string;
    monthlySchedules: MonthlySchedule[];
    vacation?: VacationPeriod;
  }) => {
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
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-serif text-2xl font-bold leading-tight text-gray-800 sm:text-2xl">
                Painel Administrativo
              </h1>
              <p className="mt-1 max-w-[190px] text-xs leading-relaxed text-gray-500 sm:max-w-none sm:text-sm">
                Gerencie profissionais e seus serviços
              </p>
            </div>
            <a
              href="/"
              className="shrink-0 rounded-full bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-500 hover:bg-pink-100 hover:text-pink-600 sm:text-sm"
            >
              ← Site
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-3">
{[
  { key: 'professionals', label: 'Profissionais' },
  { key: 'appointments', label: 'Agendamentos' },
  { key: 'site', label: 'Site e contato' },
  { key: 'home', label: 'Textos da Home' },
].map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setAdminSection(section.key as typeof adminSection)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  adminSection === section.key
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Configurações do Site */}
      {adminSection === 'site' && (
      <div className="mx-auto max-w-7xl px-3 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-800 sm:text-lg">Configurações do site</h2>
              <p className="text-xs text-gray-500 sm:text-sm">
                Edite nome do site, rodapé e informações de contato.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleResetSiteConfig}
                className="rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm"
              >
                Restaurar padrão
              </button>
              <button
                type="button"
                onClick={handleSaveSiteConfig}
                className="rounded-full bg-pink-500 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-600 sm:px-4 sm:text-sm"
              >
                Salvar configurações
              </button>
            </div>
          </div>

          {siteConfigSaved && (
            <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
              Configurações salvas com sucesso.
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2 sm:gap-5">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">Identidade do site</h3>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Nome do site</label>
                <input
                  type="text"
                  value={siteConfig.siteName}
                  onChange={(event) => updateSiteConfig({ siteName: event.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 sm:rounded-2xl sm:px-4 sm:py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Descrição do rodapé</label>
                <textarea
                  value={siteConfig.footerDescription}
                  onChange={(event) => updateSiteConfig({ footerDescription: event.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 sm:rounded-2xl sm:px-4 sm:py-3"
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">Contato</h3>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">E-mail</label>
                <input
                  type="email"
                  value={siteConfig.contactEmail}
                  onChange={(event) => updateSiteConfig({ contactEmail: event.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 sm:rounded-2xl sm:px-4 sm:py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Telefone</label>
                <input
                  type="text"
                  value={siteConfig.contactPhone}
                  onChange={(event) => updateSiteConfig({ contactPhone: event.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 sm:rounded-2xl sm:px-4 sm:py-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {adminSection === 'home' && (
      <div className="mx-auto max-w-7xl px-3 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-800 sm:text-lg">Textos da Home</h2>
              <p className="text-xs text-gray-500 sm:text-sm">
                Edite a seção de serviços exibida na página inicial.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleResetSiteConfig}
                className="rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:px-4 sm:text-sm"
              >
                Restaurar padrão
              </button>
              <button
                type="button"
                onClick={handleSaveSiteConfig}
                className="rounded-full bg-pink-500 px-3 py-2 text-xs font-semibold text-white hover:bg-pink-600 sm:px-4 sm:text-sm"
              >
                Salvar configurações
              </button>
            </div>
          </div>

          {siteConfigSaved && (
            <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
              Configurações salvas com sucesso.
            </div>
          )}

          <div className="space-y-5">
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Etiqueta acima do título</label>
                <input
                  type="text"
                  value={siteConfig.servicesBadge}
                  onChange={(event) => updateSiteConfig({ servicesBadge: event.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 sm:rounded-2xl sm:px-4 sm:py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Título</label>
                <input
                  type="text"
                  value={siteConfig.servicesTitle}
                  onChange={(event) => updateSiteConfig({ servicesTitle: event.target.value })}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 sm:rounded-2xl sm:px-4 sm:py-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 sm:text-sm">Subtítulo</label>
                <textarea
                  value={siteConfig.servicesSubtitle}
                  onChange={(event) => updateSiteConfig({ servicesSubtitle: event.target.value })}
                  rows={1}
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 sm:rounded-2xl sm:px-4 sm:py-3"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {siteConfig.services.map((service, index) => (
                <div key={service.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:rounded-2xl sm:p-4">
                  <p className="mb-2 text-xs font-semibold text-gray-700 sm:text-sm">Card {index + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={service.name}
                      onChange={(event) => updateSiteService(service.id, { name: event.target.value })}
                      placeholder="Nome do serviço"
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                    <input
                      type="text"
                      value={service.description}
                      onChange={(event) => updateSiteService(service.id, { description: event.target.value })}
                      placeholder="Descrição"
                      className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Lista de Profissionais */}
      {adminSection === 'professionals' && (
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
            Profissionais ({professionals.length})
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50 sm:text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restaurar dados padrão
            </button>
            <button
              onClick={handleAddProfessional}
              className="inline-flex items-center rounded-full bg-pink-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-pink-600 sm:px-4 sm:text-sm"
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
              className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-xl sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
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
                  <p className="text-xs text-gray-500 sm:text-sm">{professional.specialty}</p>
                  <p className="mt-1 text-xs text-pink-600 sm:text-sm">
                    {professional.services.length} serviço(s) vinculado(s)
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-gray-400 sm:text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {professional.monthlySchedules?.length
                      ? formatMonthlyScheduleSummary(professional.monthlySchedules)
                      : formatScheduleSummary(professional.schedule)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProfessional(professional);
                    }}
                    className="rounded-full px-3 py-1.5 text-xs text-pink-600 transition-colors hover:bg-pink-50 sm:text-sm"
                  >
                    Ver serviços
                  </button>
                  <button
                    onClick={() => handleEditProfessional(professional)}
                    className="rounded-full px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-100 sm:text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProfessional(professional.id)}
                    className="rounded-full px-3 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-50 sm:text-sm"
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
      )}

      {adminSection === 'appointments' && (
      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800 sm:text-lg">Agendamentos</h2>
            <p className="text-xs text-gray-500 sm:text-sm">
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
              className="rounded-full border border-pink-200 bg-white px-3 py-2 text-xs font-semibold text-pink-600 hover:bg-pink-50 sm:px-4 sm:text-sm"
            >
              Atualizar lista
            </button>
          </div>
        </div>

        {appointmentTab === 'por-profissional' ? (
          <div className="space-y-6">
            {/* Filtros para "Por profissional" */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:rounded-3xl sm:p-6">
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
                <p className="text-xs text-gray-500 sm:text-sm">
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
                    <div key={professional.id} className="rounded-2xl border border-gray-200 bg-white p-4 sm:rounded-3xl sm:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800 sm:text-lg">{professional.name}</h3>
                          <p className="text-xs text-gray-500 sm:text-sm">{professional.specialty}</p>
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
                                  <p className="text-xs text-gray-500 sm:text-sm">Cliente</p>
                                  <p className="text-sm font-medium text-gray-800">{appointment.clientName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 sm:text-sm">Telefone</p>
                                  <p className="text-sm font-medium text-gray-800">{appointment.phone}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 sm:text-sm">Serviço</p>
                                  <p className="text-sm font-medium text-gray-800">
  {appointment.serviceName} • {getServiceDuration(appointment)} min
</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 sm:text-sm">Data / Horário</p>
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
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:rounded-3xl sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Filtros</h3>
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
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:rounded-3xl sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800 sm:text-lg">Base geral de agendamentos</h3>
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="inline-flex items-center rounded-full bg-pink-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-pink-600 sm:px-4 sm:text-sm"
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
      )}

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
