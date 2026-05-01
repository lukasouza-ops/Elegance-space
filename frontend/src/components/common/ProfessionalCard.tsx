interface Professional {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

interface ProfessionalCardProps {
  professional: Professional;
  onViewSchedule: (professionalId: number) => void;
}

const ProfessionalCard = ({ professional, onViewSchedule }: ProfessionalCardProps) => {
  // Imagem placeholder padrão se não houver imagem
  const defaultImage = 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop';
  const imageUrl = professional.image || defaultImage;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Imagem */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={professional.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Conteúdo */}
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {professional.name}
        </h3>
        <p className="text-pink-500 font-medium text-sm uppercase tracking-wide mb-4">
          {professional.specialty}
        </p>
        <button
          onClick={() => onViewSchedule(professional.id)}
          className="inline-flex items-center justify-center px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-full transition-colors duration-200"
        >
          Ver agenda
        </button>
      </div>
    </div>
  );
};

export default ProfessionalCard;