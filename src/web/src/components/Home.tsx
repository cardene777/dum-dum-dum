import { useState, useEffect } from "react";
import { Image, BookImage, ShoppingCart } from "lucide-react";
import { Header } from "./Header";
import { Link } from "react-router-dom";

export const Home = () => {
  const [playerCount, setPlayerCount] = useState(1337);
  const [battleCount, setBattleCount] = useState(100);
  const [prizePool, setPrizePool] = useState(1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount((prev) => prev + Math.floor(Math.random() * 10));
      setBattleCount((prev) => prev + Math.floor(Math.random() * 50));
      setPrizePool((prev) => prev + Math.floor(Math.random() * 1000));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
    return (
      <div className="bg-bg-main h-full w-full">
        <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white">
          <Header />

          {/* Main Content */}
          <main className="container mx-auto mt-12">
            {/* Hero Section */}
            <section className="text-center mb-16">
              <div className="z-10 flex flex-col items-center justify-center">
                <h2 className="text-6xl font-bold mb-6 text-[#b19cd9] animate-bounce">
                  Dum Dum Dum
                </h2>
                <p className="text-2xl mb-8 text-[#7fffd4]">
                  Dum Dum Card Battle
                </p>
                <Link
                  to="/battle-user"
                  className="shadow-lg transition-all transform hover:scale-105 animate-pulse relative w-60 h-60"
                >
                  <img src="./img/dumdum.png" alt="DumDum Card Battle" />
                  <span className="font-semibold absolute top-3 inset-0 text-center text-white">
                    Join the Battle
                  </span>
                </Link>
              </div>
            </section>

            {/* Game Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-center">
              <div className="bg-[#2a1b3d] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all">
                <h3 className="text-2xl font-bold text-[#7fffd4]">
                  Players Amount
                </h3>
                <p className="text-4xl font-bold text-[#b19cd9]">
                  {playerCount.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#2a1b3d] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all">
                <h3 className="text-2xl font-bold text-[#7fffd4]">
                  Number of Cards
                </h3>
                <p className="text-4xl font-bold text-[#b19cd9]">
                  {battleCount.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#2a1b3d] p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all">
                <h3 className="text-2xl font-bold text-[#7fffd4]">
                  Prize Pool
                </h3>
                <p className="text-4xl font-bold text-[#b19cd9]">
                  {prizePool.toLocaleString()} AR
                </p>
              </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
              <Link
                to="/shop"
                className="bg-[#2a1b3d] border-[#b19cd9] border-2 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
              >
                <div className="flex items-center mb-4">
                  <ShoppingCart className="mr-3 text-[#b19cd9]" size={28} />
                  <h3 className="text-2xl font-bold text-[#7fffd4]">Shop</h3>
                </div>
                <p>Purchase a pack of cards.</p>
              </Link>
              <Link
                to="/collections"
                className="bg-[#2a1b3d] border-[#b19cd9] border-2 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
              >
                <div className="flex items-center mb-4">
                  <BookImage className="mr-3 text-[#b19cd9]" size={28} />
                  <h3 className="text-2xl font-bold text-[#7fffd4]">
                    Collection
                  </h3>
                </div>
                <p>Collection of cards</p>
              </Link>
              <Link
                to="/illustration"
                className="bg-[#2a1b3d] border-[#b19cd9] border-2 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
              >
                <div className="flex items-center mb-4">
                  <Image className="mr-3 text-[#b19cd9]" size={28} />
                  <h3 className="text-2xl font-bold text-[#7fffd4]">
                    Illustrations
                  </h3>
                </div>
                <p>Submit and vote on visuals for weapons and armor</p>
              </Link>
            </section>

            {/* CTA Section */}
            <section className="text-center bg-[#2a1b3d] p-10 rounded-lg shadow-lg">
              <h3 className="text-4xl font-bold mb-10 text-[#7fffd4]">
                Check Dum Dum Site
              </h3>
              <Link
                to="https://dumdumz.xyz"
                className="bg-[#b19cd9] hover:bg-[#9370db] text-xl py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105 animate-pulse"
                target="_blank"
              >
                Dum Dum Site
              </Link>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-[#0f0518] p-6 mt-16">
            <div className="container mx-auto text-center text-sm">
              <p>
                &copy; 2024 HipHop Tycoon. All rights reserved. Prepare to drop
                some sick beats!
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
};
