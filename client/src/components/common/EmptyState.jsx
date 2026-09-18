import { Coffee } from 'lucide-react';
import Reveal from './Reveal';

const EmptyState = ({ title = "Nothing here yet", description = "Check back soon for updates.", icon: Icon = Coffee }) => {
  return (
    <Reveal className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-6 text-muted">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl font-heading text-primary mb-2">{title}</h3>
      <p className="text-muted max-w-md">{description}</p>
    </Reveal>
  );
};

export default EmptyState;