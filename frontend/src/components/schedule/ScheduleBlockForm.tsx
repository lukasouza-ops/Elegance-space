import { useState } from 'react';
import { ScheduleBlock } from './types';

const getMonthEnd = (monthYear: string) => {
  const [year, month] = monthYear.split('-').map(Number);
  return new Date(year, month, 0).getDate();
};

const ScheduleBlockForm = ({
  monthYear,
  onAdd,
}: {
  monthYear: string;
  onAdd: (block: ScheduleBlock) => void;
}) => {
  const [date, setDate] = useState(`${monthYear}-01`);
  const [type, setType] = useState<'full-day' | 'time-range'>('full-day');
  const [startTime, setStartTime] = useState('13:00');
  const [endTime, setEndTime] = useState('15:00');
  const [reason, setReason] = useState('');

  const dayCount = getMonthEnd(monthYear);
  const maxDate = `${monthYear}-${String(dayCount).padStart(2, '0')}`;

  const handleAdd = () => {
    if (type === 'time-range' && (!startTime || !endTime)) return;
    onAdd({
      id: `${monthYear}-${date}-${Date.now()}`,
      date,
      type,
      startTime: type === 'time-range' ? startTime : undefined,
      endTime: type === 'time-range' ? endTime : undefined,
      reason: reason.trim() || undefined,
    });
    setReason('');
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data do bloqueio</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={`${monthYear}-01`}
            max={maxDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'full-day' | 'time-range')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            <option value="full-day">Dia inteiro</option>
            <option value="time-range">Intervalo de horário</option>
          </select>
        </div>
      </div>

      {type === 'time-range' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: almoço, consulta médica, folga parcial"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex items-center justify-center w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
      >
        Adicionar bloqueio
      </button>
    </div>
  );
};

export default ScheduleBlockForm;
