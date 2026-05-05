import { useEffect, useState } from 'react';
import { MonthlySchedule, WeeklyRule, WeekDay } from './types';

const weekDayLabels: Record<WeekDay, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const weekDays: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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

const isScheduleConfigured = (schedule: MonthlySchedule) =>
  Object.values(schedule.weeklyRules).some((rule) => rule.enabled);

const isScheduleReleased = (schedule: MonthlySchedule) =>
  schedule.released ?? isScheduleConfigured(schedule);

const buildMonthLabel = (monthYear: string) => {
  const [year, month] = monthYear.split('-');
  return `${month}/${year}`;
};

const getWeekdayOrder = (day: WeekDay) => weekDays.indexOf(day) + 1;

const MonthlyScheduleEditor = ({
  monthlySchedules,
  onChange,
}: {
  monthlySchedules: MonthlySchedule[];
  onChange: (updated: MonthlySchedule[]) => void;
}) => {
  const defaultMonth = monthlySchedules[0]?.monthYear || getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  useEffect(() => {
    if (!monthlySchedules.some((item) => item.monthYear === selectedMonth)) {
      onChange([...monthlySchedules, createMonthlySchedule(selectedMonth)]);
    }
  }, [monthlySchedules, onChange, selectedMonth]);

  useEffect(() => {
    if (!monthlySchedules.some((item) => item.monthYear === selectedMonth) && monthlySchedules.length > 0) {
      setSelectedMonth(monthlySchedules[0].monthYear);
    }
  }, [monthlySchedules, selectedMonth]);

  const selectedSchedule =
    monthlySchedules.find((item) => item.monthYear === selectedMonth) ||
    createMonthlySchedule(selectedMonth);

  const selectedScheduleReleased = isScheduleReleased(selectedSchedule);
  const selectedScheduleConfigured = isScheduleConfigured(selectedSchedule);
  const releasedMonths = monthlySchedules
    .filter(isScheduleReleased)
    .sort((a, b) => a.monthYear.localeCompare(b.monthYear))
    .map((item) => buildMonthLabel(item.monthYear));

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
    if (!monthlySchedules.some((item) => item.monthYear === value)) {
      onChange([...monthlySchedules, createMonthlySchedule(value)]);
    }
  };

  const updateSelectedSchedule = (update: MonthlySchedule) => {
    const updated = monthlySchedules.some((item) => item.monthYear === update.monthYear)
      ? monthlySchedules.map((item) => (item.monthYear === update.monthYear ? update : item))
      : [...monthlySchedules, update];
    onChange(updated);
  };

  const handleRuleChange = (day: WeekDay, field: keyof WeeklyRule, value: string | boolean) => {
    updateSelectedSchedule({
      ...selectedSchedule,
      weeklyRules: {
        ...selectedSchedule.weeklyRules,
        [day]: {
          ...selectedSchedule.weeklyRules[day],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="grid gap-3 md:grid-cols-2 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês/Ano</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Meses liberados</p>
            {releasedMonths.length > 0 ? (
              <p className="text-sm text-gray-600">{releasedMonths.join(', ')}</p>
            ) : (
              <p className="text-sm text-gray-500">Nenhum mês liberado ainda.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-800">Configuração de dias e horários</h4>
          {!selectedScheduleConfigured && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase text-yellow-700">
              Sem configuração
            </span>
          )}
        </div>
        <div className="space-y-3">
          {weekDays.map((day) => {
            const rule = selectedSchedule.weeklyRules[day];
            return (
              <div key={day} className="grid gap-3 md:grid-cols-[1fr_80px_80px_1fr] items-center p-3 rounded-2xl border border-gray-100 bg-gray-50">
                <label className="text-sm font-medium text-gray-700">{weekDayLabels[day]}</label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => handleRuleChange(day, 'enabled', e.target.checked)}
                    className="h-4 w-4 text-pink-500 rounded"
                  />
                  Trabalha
                </label>
                <input
                  type="time"
                  value={rule.startTime}
                  onChange={(e) => handleRuleChange(day, 'startTime', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  disabled={!rule.enabled}
                />
                <input
                  type="time"
                  value={rule.endTime}
                  onChange={(e) => handleRuleChange(day, 'endTime', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  disabled={!rule.enabled}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-4">Liberação do mês</h4>
        <div className="space-y-4">
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={selectedScheduleReleased}
              disabled={!selectedScheduleConfigured}
              onChange={(e) => updateSelectedSchedule({ ...selectedSchedule, released: e.target.checked })}
              className="h-4 w-4 text-pink-500 rounded"
            />
            Liberar este mês para agendamentos
          </label>
          {!selectedScheduleConfigured ? (
            <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
              Configure os dias e horários antes de liberar este mês.
            </div>
          ) : selectedScheduleReleased ? (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
              Mês configurado e liberado para agendamentos.
            </div>
          ) : (
            <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4 text-sm text-pink-700">
              Mês configurado, mas ainda não liberado para clientes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyScheduleEditor;
