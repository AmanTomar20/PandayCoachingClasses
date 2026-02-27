
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
    const typeset = () => {
      if (containerRef.current && window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => 
          console.error('MathJax typeset failed: ', err)
        );
      }
    };

    // Initial attempt
    typeset();

    // Delayed retry in case MathJax was still initializing
    const timer = setTimeout(typeset, 500);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <span ref={containerRef} className={className} style={{ display: 'inline-block', width: '100%' }}>
      {text}
    </span>
  );
};
