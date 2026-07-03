import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Button from '../../components/ui/Button'

interface CopyLinkButtonProps {
  url: string
  label?: string
  className?: string
}

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({
  url,
  label = 'Salin Tautan',
  className = '',
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-sand/40 transition-all ${
        copied ? 'bg-emerald-50 text-emerald-600 border-emerald-500/30' : ''
      } ${className}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'Tersalin!' : label}</span>
    </Button>
  )
}

export default CopyLinkButton
