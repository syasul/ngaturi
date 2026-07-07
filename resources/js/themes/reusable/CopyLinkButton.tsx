import { Check, Copy } from 'lucide-react';
import React, { useState } from 'react';
import Button from '../../components/ui/Button';

interface CopyLinkButtonProps {
    url: string;
    label?: string;
    className?: string;
}

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({
    url,
    label = 'Salin Tautan',
    className = '',
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={`flex items-center justify-center gap-1.5 rounded-xl border border-sand/40 px-4 py-2 text-xs font-semibold transition-all ${
                copied
                    ? 'border-emerald-500/30 bg-emerald-50 text-emerald-600'
                    : ''
            } ${className}`}
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Tersalin!' : label}</span>
        </Button>
    );
};

export default CopyLinkButton;
