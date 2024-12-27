// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
//           <li className="mb-2">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }


'use client'

import { useState, useEffect } from 'react'

const StarField = () => {
  const [stars, setStars] = useState<{ x: number; y: number; size: number }[]>([])

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
      }))
      setStars(newStars)
    }

    generateStars()
    window.addEventListener('resize', generateStars)
    return () => window.removeEventListener('resize', generateStars)
  }, [])

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
  )
}

const FloatingIsland = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="absolute inset-0 bg-[url('/magical-texture.png')] opacity-10" />
      <div className="relative z-10 p-8">{children}</div>
    </div>
  )
}

const MagicText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-pink-500 to-red-500 animate-gradient-x">
      {children}
    </span>
  )
}

const MagicButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-105">
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-50" />
    </button>
  )
}

export default function MagicalLandingPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <StarField />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 200px at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,255,255,0.1), transparent 80%)`,
        }}
      />

      <header className="fixed w-full z-50 bg-black bg-opacity-50 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <MagicText>
              <span className="text-2xl font-bold">Connecto</span>
            </MagicText>
            <div className="space-x-6">
              {['Spells', 'Potions', 'Creatures', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-purple-400 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="opacity-0 animate-fade-in">
            <h1 className="text-6xl font-extrabold mb-8">
              <MagicText>Let us connect</MagicText>
            </h1>
            <p className="text-xl mb-12 max-w-2xl mx-auto">
              Step into a world where you learn, interact and create. A special for you.
            </p>
            <div className="flex justify-center space-x-6">
              <MagicButton>Begin Your Journey</MagicButton>
              <MagicButton>Explore it</MagicButton>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}</style>
    </div>
  )
}