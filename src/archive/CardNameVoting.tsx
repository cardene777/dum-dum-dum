import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";

const CardNameVoting = () => {
  const [cardNames, setCardNames] = useState([
    { id: 1, name: "Rhythm Master", votes: 15 },
    { id: 2, name: "Flow King", votes: 12 },
    { id: 3, name: "Beat Wizard", votes: 18 },
  ]);
  const [newCardName, setNewCardName] = useState("");
  const [remainingTime, setRemainingTime] = useState(3600); // 1 hour in seconds
  const [votedNames, setVotedNames] = useState([]);

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

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (newCardName.trim()) {
      setCardNames([
        ...cardNames,
        { id: Date.now(), name: newCardName, votes: 0 },
      ]);
      setNewCardName("");
    }
  };

  const handleVote = (id: number) => {
    if (!votedNames.includes(id as never)) {
      setCardNames(
        cardNames.map((card) =>
          card.id === id ? { ...card, votes: card.votes + 1 } : card
        )
      );
      setVotedNames([...votedNames, id as never]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
        Card Name Voting
      </h1>
      <div className="text-center mb-8">
        <p className="text-2xl font-semibold text-[#7fffd4]">
          Time Remaining: {formatTime(remainingTime)}
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8 bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl text-[#7fffd4] mb-4">Suggest a Card Name</h2>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            value={newCardName}
            onChange={(e) => setNewCardName(e.target.value)}
            placeholder="Enter card name"
            className="flex-grow bg-[#1a0b2e] border border-[#b19cd9] text-white p-2 rounded"
          />
          <button
            type="submit"
            className="bg-[#b19cd9] hover:bg-[#9370db] text-[#1a0b2e] font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardNames.map((card) => (
          <div
            key={card.id}
            className="bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-2 text-[#7fffd4]">
              {card.name}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-lg">{card.votes} votes</span>
              <button
                onClick={() => handleVote(card.id)}
                disabled={votedNames.includes(card.id as never)}
                className={`bg-[#b19cd9] hover:bg-[#9370db] text-[#1a0b2e] font-bold py-2 px-4 rounded flex items-center ${
                  votedNames.includes(card.id as never)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <ThumbsUp className="mr-2 h-4 w-4" />
                {votedNames.includes(card.id as never) ? "Voted" : "Vote"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardNameVoting;
