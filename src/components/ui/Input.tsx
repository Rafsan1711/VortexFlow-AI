import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconDefinition;
  rightIcon?: React.ReactNode;
  error?: string;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, rightIcon, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#9898B8] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5C5C7A] group-focus-within:text-[#00D4FF] transition-colors">
              <FontAwesomeIcon icon={icon} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-[#1A1A24] text-white border rounded-xl py-3.5 
              ${icon ? 'pl-11' : 'pl-4'} 
              ${rightIcon ? 'pr-12' : 'pr-4'}
              focus:outline-none focus:ring-2 focus:ring-[#00D4FF]/20 transition-all duration-200
              placeholder-[#5C5C7A]
              ${error 
                ? 'border-[#FF4D6A] focus:border-[#FF4D6A]' 
                : 'border-[#2A2A3A] focus:border-[#00D4FF] hover:border-[#5C5C7A]'
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5C5C7A] hover:text-white transition-colors cursor-pointer">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[#FF4D6A] flex items-center gap-1 animate-shake">
            <FontAwesomeIcon icon={["fas", "exclamation-circle"] as any} />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
