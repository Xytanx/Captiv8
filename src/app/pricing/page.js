"use client";
import { useState } from "react";
import PageHeaders from "../components/PageHeaders";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function PricingPage() {
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  const triggerConfetti = () => {
    if (!confettiTriggered) {
      // Explosive confetti from the center of the card
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        startVelocity: 30,
        ticks: 200,
      });

      // Falling confetti effect over 5 seconds
      const duration = 5000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 0.1, spread: 360, ticks: 60, zIndex: 0 };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: Math.random(), y: 0 },
        });
      }, 250);

      setConfettiTriggered(true);
      setTimeout(() => setConfettiTriggered(false), duration);
    }
  };

  return (
    <>
      <PageHeaders 
        h1Text="Check out our pricing"
        h2Text="Our pricing is very simple"
      />

      <div className="flex justify-center mt-12">
        <div 
          onMouseEnter={triggerConfetti}
          className="relative group bg-white text-slate-700 rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl transform hover:-translate-y-3 transition-all duration-300 ease-out overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="font-extrabold text-4xl mb-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-indigo-600">
              Free
            </h3>
            <h4 className="text-xl mb-6 uppercase tracking-wider text-indigo-600">
              Free Forever
            </h4>
            <p className="text-md text-slate-600 mb-8">
              Enjoy unlimited access to our basic features at no cost!
            </p>
            <Link href="/" legacyBehavior>
              <a>
                <button className="mt-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 ease-in-out">
                  Get Started
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
