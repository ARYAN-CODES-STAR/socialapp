"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const StarField = () => {
  const [stars, setStars] = useState<{ x: number; y: number; size: number }[]>(
    []
  );

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
      }));
      setStars(newStars);
    };

    generateStars();
    window.addEventListener("resize", generateStars);
    return () => window.removeEventListener("resize", generateStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {stars.map((star, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

const FloatingIsland = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="absolute inset-0 bg-[url('/magical-texture.png')] opacity-10" />
      <div className="relative z-10 p-8">{children}</div>
    </div>
  );
};

const MagicText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-pink-500 to-red-500 animate-gradient-x">
      {children}
    </span>
  );
};

const MagicButton = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <a
      href={href}
      className="relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-105"
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-50" />
    </a>
  );
};

export default function MagicalLandingPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <StarField />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,255,255,0.1), transparent 80%)`,
        }}
      />

      <main className="pt-24">
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="opacity-0 animate-fade-in">
            <h1 className="text-6xl font-extrabold mb-8">
              <MagicText>Let us connect</MagicText>
            </h1>
            <p className="text-xl mb-12 max-w-2xl mx-auto">
              Step into a world where you learn, interact and create. A special
              space for you.
            </p>
            <div className="flex justify-center space-x-6">
              <MagicButton href="/auth/signin">SignIn</MagicButton>
              <MagicButton href="/profile">Visit Profile</MagicButton>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}