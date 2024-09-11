import { Link } from "react-router-dom";
import {
  ConnectButton,
  useActiveAddress,
  useProfileModal,
} from "arweave-wallet-kit";

export const Header = () => {
  const profileModal = useProfileModal();

  const address = useActiveAddress();
  return (
    <header className="bg-[#0f0518] p-4 shadow-lg">
      <div className="px-10 flex justify-between items-center text-white">
        <Link to="/" className="text-3xl font-bold text-[#b19cd9]">
          Dum Dum Dum
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center justify-center">
            <li>
              <Link
                to="/my-card"
                className="hover:text-[#b19cd9] transition-colors"
              >
                My Card
              </Link>
            </li>
            <li>
              <Link
                to="/ranking"
                className="hover:text-[#b19cd9] transition-colors"
              >
                Ranking
              </Link>
            </li>
            <li>
              {address ? (
                <button
                  onClick={() => profileModal.setOpen(true)}
                  className="px-4 py-2 bg-[#B19CD9] text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-transparent"
                >
                  {address.slice(0, 6)}...{address.slice(-4)}
                </button>
              ) : (
                <ConnectButton
                  accent="rgb(238, 130, 238)"
                  showBalance={true}
                  showProfilePicture={true}
                  useAns={true}
                  profileModal={false}
                />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
