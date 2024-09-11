import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";

const illustrations = [
  { id: 1, title: "Hip-Hop Legend", image: "/placeholder.svg", votes: 120 },
  { id: 2, title: "Beatbox Master", image: "/placeholder.svg", votes: 85 },
  { id: 3, title: "Graffiti Artist", image: "/placeholder.svg", votes: 150 },
  { id: 4, title: "DJ Extraordinaire", image: "/placeholder.svg", votes: 95 },
  { id: 5, title: "Breakdance King", image: "/placeholder.svg", votes: 110 },
  { id: 6, title: "Lyrical Genius", image: "/placeholder.svg", votes: 130 },
];

const VoteIllustrations = () => {
  const [remainingTime, setRemainingTime] = useState(3600); // 1 hour in seconds
  const [votedIllustrations, setVotedIllustrations] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVote = (id: number) => {
    if (!votedIllustrations.includes(id as never)) {
      setVotedIllustrations([...votedIllustrations, id as never]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
        Vote for Your Favorite Illustrations
      </h1>
      <div className="text-center mb-8">
        <p className="text-2xl font-semibold text-[#7fffd4]">
          Time Remaining: {formatTime(remainingTime)}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {illustrations.map((illustration) => (
          <div
            key={illustration.id}
            className="bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg"
          >
            <div className="p-4">
              <h2 className="text-xl font-bold text-[#7fffd4]">
                {illustration.title}
              </h2>
            </div>
            <div className="p-4">
              <img
                src={illustration.image}
                alt={illustration.title}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="p-4 flex justify-between items-center">
              <span className="text-lg font-semibold">
                {illustration.votes} votes
              </span>
              <button
                onClick={() => handleVote(illustration.id)}
                disabled={votedIllustrations.includes(illustration.id as never)}
                className={`bg-[#b19cd9] hover:bg-[#9370db] text-[#1a0b2e] font-bold py-2 px-4 rounded flex items-center ${
                  votedIllustrations.includes(illustration.id as never)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {votedIllustrations.includes(illustration.id as never)
                  ? "Voted"
                  : "Vote"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoteIllustrations;
