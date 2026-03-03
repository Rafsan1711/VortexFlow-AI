import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, className = '', children, ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return 'bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white hover:shadow-lg hover:shadow-[#00D4FF]/20 border-none';
        case 'secondary':
          return 'bg-[#1A1A24] text-white hover:bg-[#2A2A3A] border border-[#2A2A3A]';
        case 'danger':
          return 'bg-[#FF4D6A]/10 text-[#FF4D6A] hover:bg-[#FF4D6A]/20 border border-[#FF4D6A]/20';
        case 'outline':
          return 'bg-transparent text-white border border-[#2A2A3A] hover:border-[#5C5C7A] hover:bg-[#1A1A24]/50';
        default:
          return 'bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white';
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'py-2 px-4 text-xs';
        case 'md':
          return 'py-3.5 px-6 text-sm';
        case 'lg':
          return 'py-4 px-8 text-base';
        default:
          return 'py-3.5 px-6 text-sm';
      }
    };

    return (
      <button
        ref={ref}
        className={`
          font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className}
        `}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
