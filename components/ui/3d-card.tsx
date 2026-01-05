"use client";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterContext");
  }
  return context;
};

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    
    setRotation({ x, y });
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${
      -1 * y
    }deg)`;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    setRotation({ x: 0, y: 0 });
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={`flex items-center justify-center ${containerClassName}`}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`flex items-center justify-center relative transition-all duration-200 ease-linear ${className}`}
          style={{
            transformStyle: "preserve-3d",
            // Pass rotation as CSS variables for children (Hologram) to use
            // @ts-ignore
            "--rotate-x": `${rotation.y}deg`, // Inverted logic for CSS visual
            "--rotate-y": `${rotation.x}deg`,
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`h-auto w-full [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d] relative overflow-hidden ${className}`}
    >
      {/* 
          HOLOGRAM LAYER 
          Uses the CSS variables set by CardContainer to shift the gradient background.
      */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-0 group-hover/card:opacity-60 transition-opacity duration-500"
        style={{
            background: "linear-gradient(115deg, transparent 20%, rgba(0, 255, 255, 0.2) 40%, rgba(255, 0, 255, 0.2) 45%, rgba(255, 255, 0, 0.1) 50%, transparent 60%)",
            backgroundSize: "200% 200%",
            mixBlendMode: "color-dodge",
            // We use the rotation variables to shift the background position
            backgroundPosition: "calc(50% + (var(--rotate-y) * 2)) calc(50% + (var(--rotate-x) * 2))"
        }}
      />
      {/* Noise Texture for Realism */}
      <div 
        className="absolute inset-0 pointer-events-none z-[2] opacity-0 group-hover/card:opacity-10 transition-opacity duration-500"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay"
        }}
      />

      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  [key: string]: any;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={`w-fit transition-transform duration-200 ease-linear ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};