import { useEffect } from 'react';
import { X } from 'lucide-react';

const GlobalModal = ({ title, children, open, onClose }) => {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if(!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-primary">{title}</h3>
                <button onClick={onClose}>
                    <X size={18} />
                </button>
            </div>

            { children }
        </div>
    </div>
  )
}

export default GlobalModal