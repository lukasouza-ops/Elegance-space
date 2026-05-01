import { useEffect, useState } from 'react';
import { MonthlySchedule, ScheduleBlock, WeeklyRule, WeekDay } from './types';
import ScheduleBlockForm from './ScheduleBlockForm';
import SchedulePreview from './SchedulePreview';

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
});

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

  const handleAddBlock = (block: ScheduleBlock) => {
    updateSelectedSchedule({
      ...selectedSchedule,
      blocks: [...selectedSchedule.blocks, block],
    });
  };

  const handleRemoveBlock = (id: string) => {
    updateSelectedSchedule({
      ...selectedSchedule,
      blocks: selectedSchedule.blocks.filter((block) => block.id !== id),
    });
  };

  const monthOptions = monthlySchedules
    .map((item) => item.monthYear)
    .sort()
    .filter((value, index, list) => list.indexOf(value) === index);

  return (
    <div className="space-y-6">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agendas existentes</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {buildMonthLabel(month)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-4">Regra base por dia da semana</h4>
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

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-4">Bloqueios específicos</h4>
            <ScheduleBlockForm monthYear={selectedMonth} onAdd={handleAddBlock} />
            {selectedSchedule.blocks.length > 0 && (
              <div className="mt-4 space-y-3">
                {selectedSchedule.blocks.map((block) => (
                  <div key={block.id} className="rounded-2xl border border-gray-200 p-3 bg-gray-50 flex justify-between items-center gap-3">
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {block.date} • {block.type === 'full-day' ? 'Dia inteiro' : `${block.startTime} às ${block.endTime}`}
                      </div>
                      {block.reason && <p className="text-xs text-gray-500 mt-1">{block.reason}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(block.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <SchedulePreview schedule={selectedSchedule} />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Resumo do mês</h4>
          <p className="text-sm text-gray-600">Está selecionado o mês de {buildMonthLabel(selectedMonth)}.</p>
          <p className="text-sm text-gray-600 mt-2">Use as regras semanais para aplicar a disponibilidade ao mês e adicione bloqueios específicos sempre que precisar interromper um dia ou horário.</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyScheduleEditor;
