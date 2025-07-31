"use client"

import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface MathProps {
  children: string
  block?: boolean
  className?: string
}

export function Math({ children, block = false, className = "" }: MathProps) {
  if (block) {
    return (
      <div className={`my-4 ${className}`}>
        <BlockMath math={children} />
      </div>
    )
  }
  
  return <InlineMath math={children} />
}

export function MathBlock({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`my-4 ${className}`}>
      <BlockMath math={children} />
    </div>
  )
}

export function MathInline({ children, className = "" }: { children: string; className?: string }) {
  return <InlineMath math={children} className={className} />
}