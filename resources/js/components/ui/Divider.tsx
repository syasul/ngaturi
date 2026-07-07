import React from 'react';

interface DividerProps {
    className?: string;
    text?: string;
}

export const Divider: React.FC<DividerProps> = ({ className = '', text }) => {
    if (text) {
        return (
            <div className={`my-6 flex items-center ${className}`}>
                <div className="flex-grow border-t border-gray-200/60"></div>
                <span className="px-4 font-poppins text-xs font-semibold uppercase tracking-wider text-gold-500">
                    {text}
                </span>
                <div className="flex-grow border-t border-gray-200/60"></div>
            </div>
        );
    }
    return <div className={`my-6 border-t border-gray-100 ${className}`} />;
};

export default Divider;
