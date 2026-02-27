
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    SmilesDrawer: any;
  }
}

interface MoleculeRendererProps {
  smiles: string;
  width?: number;
  height?: number;
  id?: string;
  theme?: 'light' | 'dark';
}

export const MoleculeRenderer: React.FC<MoleculeRendererProps> = ({ 
  smiles, 
  width = 200, 
  height = 200, 
  id,
  theme = 'light'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasId = id || `molecule-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (!smiles || !window.SmilesDrawer) return;

    const options = { width, height, bondThickness: 2 };
    const smilesDrawer = new window.SmilesDrawer.Drawer(options);

    window.SmilesDrawer.parse(smiles, (tree: any) => {
      smilesDrawer.draw(tree, canvasRef.current, theme, false);
    }, (err: any) => {
      console.error("SMILES Error: ", err);
    });
  }, [smiles, width, height, theme]);

  return (
    <canvas 
      ref={canvasRef} 
      id={canvasId} 
      width={width} 
      height={height}
      className="max-w-full h-auto"
    />
  );
};
