
import React, { useEffect, useRef } from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => 
        console.error('MathJax typeset failed: ', err)
      );
    }
  }, [text]);

  return (
    <span ref={containerRef} className={className}>
      {text}
    </span>
  );
};
