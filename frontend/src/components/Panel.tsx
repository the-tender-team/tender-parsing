import { ReactNode } from 'react';

interface PanelProps {
  title: string;
  children: ReactNode;
  titleExtra?: ReactNode;
  className?: string;
}

export default function Panel({ 
  title, 
  children, 
  titleExtra, 
  className = ''
}: PanelProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        {titleExtra}
      </div>
      <div className="px-6 pb-6">
        {children}
      </div>
    </div>
  );
} 