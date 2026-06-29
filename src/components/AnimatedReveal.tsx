'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'pop';
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  style = {}
}) => {
  const [hasRevealed, setHasRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getTransform = () => {
    if (hasRevealed) return 'translate(0, 0) scale(1)';
    switch (direction) {
      case 'up': return 'translateY(40px) scale(1)';
      case 'down': return 'translateY(-40px) scale(1)';
      case 'left': return 'translateX(40px) scale(1)';
      case 'right': return 'translateX(-40px) scale(1)';
      case 'pop': return 'translateY(20px) scale(0.95)';
      default: return 'translateY(40px) scale(1)';
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        opacity: hasRevealed ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  value, 
  suffix = '', 
  duration = 1500 
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function for smooth slowing down at the end (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, value, duration]);

  return (
    <span ref={containerRef} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};
