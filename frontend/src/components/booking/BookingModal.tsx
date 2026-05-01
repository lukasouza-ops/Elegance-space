import { FormEvent, useEffect, useMemo, useState } from 'react';
import Button from '../common/Button';
import SchedulePreview from '../schedule/SchedulePreview';
import { MonthlySchedule } from '../schedule/types';

interface Service {
  id: number;
  name: string;
  duration: string;
  price: string;
}

interface WeeklyRule {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

interface WorkSchedule {
  monday: WeeklyRule;
  tuesday: WeeklyRule;
  wednesday: WeeklyRule;
  thursday: WeeklyRule;
  friday: WeeklyRule;
  saturday: WeeklyRule;
  sunday: WeeklyRule;
}

export interface Professional {
  id: number;
  name: string;
  specialty: string;
  status: 'active' | 'inactive';
  image: string;
  services: Service[];
  monthlySchedules?: MonthlySchedule[];
  schedule?: WorkSchedule;
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
}

interface BookingModalProps {
  isOpen: boolean;
  professionals: Professional[];
  initialProfessionalId?: number | null;
  onClose: () => void;
}

const APPOINTMENT_STORAGE_KEY = 'elegance_space_appointments';

const weekdayFromIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

type WeekDay = typeof weekdayFromIndex[number];

const getCurrentMonthYear = () => new Date().toISOString().slice(0, 7);

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const fromMinutes = (minutes: number) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
};

const formatDateLabel = (date: Date) => {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const parseDurationMinutes = (duration: string) => {
  const parsed = parseInt(duration, 10);
  return Number.isNaN(parsed) ? 60 : parsed;
};

const rangesOverlap = (aStart: number, aEnd: number, bStart: number, bEnd: number) => {
  return aStart < bEnd && bStart < aEnd;
};

const normalizeWeeklyRules = (schedule?: WorkSchedule): Record<WeekDay, WeeklyRule> => ({
  monday: schedule?.monday ?? { enabled: false, startTime: '08:00', endTime: '18:00' },
  tuesday: schedule?.tuesday ?? { enabled: false, startTime: '08:00', endTime: '18:00' },
  wednesday: schedule?.wednesday ?? { enabled: false, startTime: '08:00', endTime: '18:00' },
  thursday: schedule?.thursday ?? { enabled: false, startTime: '08:00', endTime: '18:00' },
  friday: schedule?.friday ?? { enabled: false, startTime: '08:00', endTime: '18:00' },
  saturday: schedule?.saturday ?? { enabled: false, startTime: '09:00', endTime: '14:00' },
  sunday: schedule?.sunday ?? { enabled: false, startTime: '09:00', endTime: '14:00' },
});

const buildScheduleFromWork = (schedule?: WorkSchedule, monthYear = getCurrentMonthYear()): MonthlySchedule => ({
  monthYear,
  weeklyRules: normalizeWeeklyRules(schedule),
  blocks: [],
});

const loadAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(APPOINTMENT_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Appointment[];
  } catch {
    return [];
  }
};

const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(appointments));
};

const getMonthDates = (monthYear: string) => {
  const [year, month] = monthYear.split('-').map(Number);
  const days = new Date(year, month, 0).getDate();
  return Array.from({ length: days }, (_, index) => new Date(year, month - 1, index + 1));
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

const getAvailableDates = (schedule: MonthlySchedule) => {
  const dates = getMonthDates(schedule.monthYear);
  return dates.map((date) => {
    const dayKey = weekdayFromIndex[date.getDay()];
    const rule = schedule.weeklyRules[dayKey];
    const dateKey = date.toISOString().slice(0, 10);
    const fullDayBlock = schedule.blocks.some((block) => block.date === dateKey && block.type === 'full-day');
    const blockedRanges = schedule.blocks
      .filter((block) => block.date === dateKey && block.type === 'time-range')
      .map((block) => ({ start: toMinutes(block.startTime ?? '00:00'), end: toMinutes(block.endTime ?? '00:00') }));

    return {
      date,
      dateKey,
      label: `${formatDateLabel(date)} • ${dayLabels[dayKey]}`,
      available: rule.enabled && !fullDayBlock,
      reason: !rule.enabled ? 'Indisponível' : fullDayBlock ? 'Bloqueado' : blockedRanges.length > 0 ? 'Parcialmente disponível' : 'Disponível',
      blockedRanges,
      startTime: rule.startTime,
      endTime: rule.endTime,
    };
  });
};

const getAvailableTimeSlots = (
  schedule: MonthlySchedule,
  selectedDate: string,
  durationMinutes: number,
  appointments: Appointment[],
  professionalId: number,
) => {
  if (!selectedDate || !schedule) return [];
  const date = new Date(selectedDate);
  const dayKey = weekdayFromIndex[date.getDay()];
  const rule = schedule.weeklyRules[dayKey];
  if (!rule.enabled) return [];

  const fullDayBlock = schedule.blocks.some((block) => block.date === selectedDate && block.type === 'full-day');
  if (fullDayBlock) return [];

  const blockedRanges = schedule.blocks
    .filter((block) => block.date === selectedDate && block.type === 'time-range')
    .map((block) => ({ start: toMinutes(block.startTime ?? '00:00'), end: toMinutes(block.endTime ?? '00:00') }));

  const dayStart = toMinutes(rule.startTime);
  const dayEnd = toMinutes(rule.endTime);
  const lastStart = dayEnd - durationMinutes;
  if (lastStart < dayStart) return [];

  const existingAppointments = appointments
    .filter((item) => item.professionalId === professionalId && item.date === selectedDate)
    .map((item) => toMinutes(item.time));

  const slots: string[] = [];
  for (let current = dayStart; current <= lastStart; current += 30) {
    const slotEnd = current + durationMinutes;
    const isBlocked = blockedRanges.some((block) => rangesOverlap(current, slotEnd, block.start, block.end));
    const hasConflict = existingAppointments.includes(current);
    if (isBlocked || hasConflict) continue;
    slots.push(fromMinutes(current));
  }

  return slots;
};

const BookingModal = ({
  isOpen,
  professionals,
  initialProfessionalId,
  onClose,
}: BookingModalProps) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [professionalId, setProfessionalId] = useState<number>(initialProfessionalId ?? professionals[0]?.id ?? 0);
  const [serviceId, setServiceId] = useState<number>(professionals[0]?.services[0]?.id ?? 0);
  const [monthYear, setMonthYear] = useState(getCurrentMonthYear());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const selectedProfessional = useMemo(
    () => professionals.find((professional) => professional.id === professionalId) ?? professionals[0],
    [professionalId, professionals],
  );

  const effectiveSchedules = useMemo(() => {
    if (!selectedProfessional) return [];
    if (selectedProfessional.monthlySchedules?.length) {
      return selectedProfessional.monthlySchedules;
    }
    return [buildScheduleFromWork(selectedProfessional.schedule, getCurrentMonthYear())];
  }, [selectedProfessional]);

  const scheduleOptions = useMemo(() => effectiveSchedules.map((schedule) => schedule.monthYear), [effectiveSchedules]);

  const selectedSchedule = useMemo(
    () => effectiveSchedules.find((schedule) => schedule.monthYear === monthYear) ?? effectiveSchedules[0],
    [effectiveSchedules, monthYear],
  );

  const availableDates = useMemo(
    () => (selectedSchedule ? getAvailableDates(selectedSchedule) : []),
    [selectedSchedule],
  );

  const selectedService = selectedProfessional?.services.find((service) => service.id === serviceId);

  const appointmentSlots = useMemo(() => {
    const duration = parseDurationMinutes(selectedService?.duration ?? '60');
    return selectedSchedule ? getAvailableTimeSlots(selectedSchedule, selectedDate, duration, loadAppointments(), selectedProfessional?.id ?? 0) : [];
  }, [selectedSchedule, selectedDate, selectedService, selectedProfessional]);

  useEffect(() => {
    if (!isOpen || !selectedProfessional) return;
    const service = selectedProfessional.services[0];
    setProfessionalId(initialProfessionalId ?? selectedProfessional.id);
    setServiceId(service?.id ?? 0);
    setMonthYear(effectiveSchedules[0]?.monthYear ?? getCurrentMonthYear());
    setSelectedDate('');
    setSelectedTime('');
    setClientName('');
    setPhone('');
    setMessage('');
    setError('');
  }, [isOpen, initialProfessionalId, selectedProfessional, effectiveSchedules]);

  useEffect(() => {
    if (!scheduleOptions.includes(monthYear) && scheduleOptions.length > 0) {
      setMonthYear(scheduleOptions[0]);
      setSelectedDate('');
      setSelectedTime('');
    }
  }, [scheduleOptions, monthYear]);

  const handleProfessionalChange = (value: string) => {
    const id = Number(value);
    const professional = professionals.find((item) => item.id === id);
    if (!professional) return;
    const service = professional.services[0];
    const scheduleMonth = professional.monthlySchedules?.[0]?.monthYear ?? getCurrentMonthYear();
    setProfessionalId(id);
    setServiceId(service?.id ?? 0);
    setMonthYear(scheduleMonth);
    setSelectedDate('');
    setSelectedTime('');
    setMessage('');
    setError('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!clientName.trim() || !phone.trim() || !selectedProfessional || !selectedService || !selectedDate || !selectedTime) {
      setError('Preencha todos os campos para continuar.');
      return;
    }

    const appointments = loadAppointments();
    const conflict = appointments.some(
      (appointment) =>
        appointment.professionalId === selectedProfessional.id &&
        appointment.date === selectedDate &&
        appointment.time === selectedTime,
    );

    if (conflict) {
      setError('Já existe um agendamento para esse horário com essa profissional. Escolha outro horário.');
      return;
    }

    const newBooking: Appointment = {
      id: `${selectedProfessional.id}-${selectedDate}-${selectedTime}-${Date.now()}`,
      clientName: clientName.trim(),
      phone: phone.trim(),
      professionalId: selectedProfessional.id,
      professionalName: selectedProfessional.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
    };

    const updatedAppointments = [...appointments, newBooking];
    saveAppointments(updatedAppointments);
    setMessage('Agendamento confirmado com sucesso!');
    setError('');
    setClientName('');
    setPhone('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const availableCount = availableDates.filter((item) => item.available).length;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5 flex flex-col">
        <div className="border-b border-gray-200 bg-white px-6 py-5 flex-shrink-0">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-pink-600">Agendamento</p>
              <h2 className="text-2xl font-semibold text-gray-900">Reserve seu horário</h2>
              <p className="mt-1 text-sm text-gray-500">
                Selecione a profissional, serviço, dia e horário disponíveis. Seu agendamento será salvo localmente.
              </p>
            </div>
            <button onClick={onClose} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition hover:border-pink-300 hover:text-pink-600">
              Fechar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
            <div className="space-y-6">
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Dados do cliente</h3>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(event) => setClientName(event.target.value)}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      placeholder="Seu nome"
                      required
                    />
                  </div>
                  <div className="space-y-4 mt-4">
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                      placeholder="(XX) XXXXX-XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Escolha profissional e serviço</h3>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Profissional</label>
                    <select
                      value={professionalId}
                      onChange={(event) => handleProfessionalChange(event.target.value)}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    >
                      {professionals.map((professional) => (
                        <option key={professional.id} value={professional.id}>
                          {professional.name} — {professional.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4 mt-4">
                    <label className="block text-sm font-medium text-gray-700">Serviço</label>
                    <select
                      value={serviceId}
                      onChange={(event) => {
                        setServiceId(Number(event.target.value));
                        setSelectedDate('');
                        setSelectedTime('');
                      }}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    >
                      {selectedProfessional?.services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} • {service.duration}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <section className="rounded-3xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Escolha data e horário</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Mês da agenda</span>
                    <select
                      value={monthYear}
                      onChange={(event) => {
                        setMonthYear(event.target.value);
                        setSelectedDate('');
                        setSelectedTime('');
                      }}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    >
                      {scheduleOptions.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Data</span>
                    <select
                      value={selectedDate}
                      onChange={(event) => {
                        setSelectedDate(event.target.value);
                        setSelectedTime('');
                      }}
                      disabled={availableDates.length === 0}
                      className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">Selecione uma data</option>
                      {availableDates.map((item) => {
                        const displayLabel = item.available ? item.label : `${item.label} (${item.reason})`;
                        return (
                          <option 
                            key={item.dateKey} 
                            value={item.dateKey} 
                            disabled={!item.available}
                          >
                            {displayLabel}
                          </option>
                        );
                      })}
                    </select>
                  </label>
                </div>

                <label className="space-y-2 mt-4">
                  <span className="text-sm font-medium text-gray-700">Horário</span>
                  <select
                    value={selectedTime}
                    onChange={(event) => setSelectedTime(event.target.value)}
                    disabled={!selectedDate || appointmentSlots.length === 0}
                    className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">Selecione um horário</option>
                    {appointmentSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </label>

                {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
                {message && <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}
              </section>

              <section className="rounded-3xl border border-pink-100 bg-pink-50 p-5">
                <h3 className="text-sm font-semibold text-pink-700">Resumo</h3>
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  <p>Profissional: {selectedProfessional?.name}</p>
                  <p>Serviço: {selectedService?.name || 'Selecione um serviço'}</p>
                  <p>Mês: {selectedSchedule?.monthYear}</p>
                  <p>{selectedDate ? `Data escolhida: ${selectedDate}` : 'Selecione uma data disponível'}</p>
                  <p>{selectedTime ? `Horário escolhido: ${selectedTime}` : 'Selecione um horário disponível'}</p>
                </div>
              </section>
            </form>
          </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 flex flex-col h-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Disponibilidade mensal</h3>
                  <p className="mt-2 text-sm text-gray-600">Use a visualização para conferir dias e bloqueios configurados no Admin.</p>
                </div>
                <div className="mt-4 flex-1 min-h-[300px] rounded-3xl border border-gray-200 bg-white p-4">
                  {selectedSchedule ? (
                    <SchedulePreview schedule={selectedSchedule} />
                  ) : (
                    <div className="rounded-3xl bg-white p-4 text-sm text-gray-600">Não há agenda mensal disponível para essa profissional.</div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <h3 className="text-lg font-semibold text-gray-900">Como funciona</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li>1. Escolha a profissional e o serviço.</li>
                  <li>2. Selecione um dia disponível conforme a agenda mensal.</li>
                  <li>3. Escolha um horário que não esteja bloqueado ou reservado.</li>
                  <li>4. Confirme e receba a mensagem de sucesso.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white px-6 py-4 flex-shrink-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">{availableCount} dias disponíveis neste mês.</p>
            <Button type="submit" form="booking-form" size="lg">Confirmar agendamento</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
