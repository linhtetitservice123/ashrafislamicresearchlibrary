import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { AdminContactSection } from './AdminContactSection';

interface AdminContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const AdminContactsModal: React.FC<AdminContactsModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DFD1BF] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Close Floating Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/80 hover:bg-white text-[#2C1810] shadow-md border border-[#D9C4AC] transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <AdminContactSection initialTopic={initialTopic} onClose={onClose} isModal={true} />
        </div>
      </div>
    </div>
  );
};
