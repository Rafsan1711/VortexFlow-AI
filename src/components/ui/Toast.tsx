import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faExclamationTriangle, 
  faInfoCircle, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { useAppStore } from '../../store/useAppStore';
import { Toast as ToastType } from '../../types';

const ToastItem = ({ toast }: { toast: ToastType }) => {
  const { removeToast } = useAppStore();

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return faCheckCircle;
      case 'error': return faExclamationCircle;
      case 'warning': return faExclamationTriangle;
      case 'info': return faInfoCircle;
      default: return faInfoCircle;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success': return 'bg-green-500/10 border-green-500/20 text-green-200';
      case 'error': return 'bg-red-500/10 border-red-500/20 text-red-200';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200';
      case 'info': return 'bg-blue-500/10 border-blue-500/20 text-blue-200';
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-200';
    }
  };

  const getIconColor = () => {
    switch (toast.type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`
        pointer-events-auto w-full max-w-sm md:min-w-[300px] md:max-w-md p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-start gap-3
        ${getStyles()}
      `}
    >
      <div className={`mt-0.5 ${getIconColor()}`}>
        <FontAwesomeIcon icon={getIcon()} />
      </div>
      <p className="text-sm font-medium flex-1 leading-relaxed">{toast.message}</p>
      <button 
        onClick={() => removeToast(toast.id)}
        className="text-white/50 hover:text-white transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 -mt-1 -mr-1"
      >
        <FontAwesomeIcon icon={faTimes} size="sm" />
      </button>
    </motion.div>
  );
};

const ToastContainer = () => {
  const { toasts } = useAppStore();

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-6 md:right-6 z-50 flex flex-col gap-2 pointer-events-none items-center md:items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
