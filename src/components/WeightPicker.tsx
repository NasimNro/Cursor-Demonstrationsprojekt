"use client";

import { useEffect, useRef, useState, useMemo, UIEvent } from "react";

interface WeightPickerProps {
  value: number;
  onChange: (value: number) => void;
}

export default function WeightPicker({ value, onChange }: WeightPickerProps) {
  // Ensure value is properly constrained and formatted
  console.log("WeightPicker received value:", value);
  const safeValue = isNaN(value) ? 80.0 : value;
  
  // Extract integer and decimal parts
  const initialInt = Math.floor(safeValue);
  const initialDec = safeValue - initialInt;

  // Generate ranges: Integers 20..500
  const integers = useMemo(() => Array.from({ length: 500 - 20 + 1 }, (_, i) => i + 20), []);
  // Decimals .00, .05, .10 ... .95
  const decimals = useMemo(() => Array.from({ length: 20 }, (_, i) => i * 0.05), []);

  const [intVal, setIntVal] = useState(initialInt);
  const [decVal, setDecVal] = useState(() => {
    // find nearest decimal in 0.05 increments
    const index = Math.round(initialDec / 0.05);
    return decimals[Math.min(index, decimals.length - 1)] || 0;
  });

  const intRef = useRef<HTMLDivElement>(null);
  const decRef = useRef<HTMLDivElement>(null);

  const itemHeight = 48; // px

  // Emit changes upward
  useEffect(() => {
    onChange(intVal + decVal);
  }, [intVal, decVal, onChange]);

  // Set initial scroll positions on mount
  useEffect(() => {
    if (intRef.current) {
      const idx = integers.indexOf(initialInt);
      if (idx !== -1) {
        intRef.current.scrollTop = idx * itemHeight;
      }
    }
    if (decRef.current) {
      const idx = decimals.findIndex(d => Math.abs(d - initialDec) < 0.01);
      if (idx !== -1) {
        decRef.current.scrollTop = idx * itemHeight;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIntScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const index = Math.round(el.scrollTop / itemHeight);
    if (integers[index] !== undefined && integers[index] !== intVal) {
      setIntVal(integers[index]);
    }
  };

  const handleDecScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const index = Math.round(el.scrollTop / itemHeight);
    if (decimals[index] !== undefined && decimals[index] !== decVal) {
      setDecVal(decimals[index]);
    }
  };

  return (
    <div className="relative h-[220px] bg-[#1e1e21] rounded-2xl overflow-hidden flex font-medium text-3xl select-none w-full"
         style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)' }}>
      
      {/* Dark central selection indicator */}
      <div className="absolute top-1/2 left-4 right-4 h-[48px] -mt-[24px] bg-white/[0.05] rounded-xl pointer-events-none" />
      
      {/* Comma separator */}
      <div className="absolute top-1/2 left-1/2 -mt-[24px] h-[48px] flex items-center justify-center pointer-events-none text-white w-4 -ml-2 text-4xl pb-3 font-light">
        ,
      </div>

      <div 
        ref={intRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onScroll={handleIntScroll}
      >
        <div style={{ height: `${220 / 2 - itemHeight / 2}px` }} />
        {integers.map(num => (
          <div 
            key={`int-${num}`} 
            className="h-[48px] flex items-center justify-end pr-5 snap-center transition-colors duration-150"
            style={{ color: num === intVal ? '#ffffff' : 'rgba(255, 255, 255, 0.4)' }}
          >
            {num}
          </div>
        ))}
        <div style={{ height: `${220 / 2 - itemHeight / 2}px` }} />
      </div>

      <div 
        ref={decRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory relative z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onScroll={handleDecScroll}
      >
        <div style={{ height: `${220 / 2 - itemHeight / 2}px` }} />
        {decimals.map(num => {
          const isSelected = Math.abs(num - decVal) < 0.01;
          return (
            <div 
              key={`dec-${num}`} 
              className="h-[48px] flex items-center justify-start pl-5 snap-center transition-colors duration-150"
              style={{ color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.4)' }}
            >
              {num.toFixed(2).substring(2)}
            </div>
          );
        })}
        <div style={{ height: `${220 / 2 - itemHeight / 2}px` }} />
      </div>
    </div>
  );
}
