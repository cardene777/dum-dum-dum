import { Upload, X } from "lucide-react";
import { Header } from "../components/Header";
import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import Modal from "react-modal";
import { Plus } from "lucide-react";
import mockGuns from "../../public/json/gun.json"

const illustrations = [
  { id: 1, title: mockGuns[0].name, image: mockGuns[0].image, votes: 120 },
  { id: 2, title: mockGuns[1].name, image: mockGuns[1].image, votes: 85 },
  { id: 3, title: mockGuns[2].name, image: mockGuns[2].image, votes: 150 },
  { id: 4, title: mockGuns[3].name, image: mockGuns[3].image, votes: 95 },
  { id: 5, title: mockGuns[4].name, image: mockGuns[4].image, votes: 110 },
  { id: 6, title: mockGuns[5].name, image: mockGuns[5].image, votes: 130 },
];

const CardSubmission = () => {
  const [cardName, setCardName] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardImage, setCardImage] = useState("");

  const [remainingTime, setRemainingTime] = useState(3600); // 1 hour in seconds
  const [votedIllustrations, setVotedIllustrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの状態を管理

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

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Submitting card:", { cardName, cardDescription, cardImage });
    setCardName("");
    setCardDescription("");
    setCardImage("");
    setIsModalOpen(false); // モーダルを閉じる
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
        {/* モーダルを開くボタン */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-8 right-8 bg-[#7fffd4] hover:bg-[#5fdfb4] text-[#1a0b2e] font-bold py-2 px-4 rounded flex justify-center items-center"
        >
          <Plus className="mr-2 h-5 w-5" />
          Submit Illust
        </button>

        {/* モーダルの実装 */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="max-w-2xl mx-auto bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-6"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="text-3xl font-bold text-center text-[#7fffd4]">
            Submit Your Hip-Hop Card
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="cardName" className="text-[#b19cd9]">
                  Card Name
                </label>
                <input
                  id="cardName"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full p-2 bg-[#1a0b2e] border border-[#b19cd9] text-white rounded"
                  placeholder="Enter card name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cardDescription" className="text-[#b19cd9]">
                  Card Description
                </label>
                <textarea
                  id="cardDescription"
                  value={cardDescription}
                  onChange={(e) => setCardDescription(e.target.value)}
                  className="w-full p-2 bg-[#1a0b2e] border border-[#b19cd9] text-white rounded"
                  placeholder="Describe your card"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cardImage" className="text-[#b19cd9]">
                  Card Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    id="cardImage"
                    type="file"
                    onChange={() => {}}
                    className="hidden"
                    accept="image/*"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {}}
                    className="bg-[#b19cd9] hover:bg-[#9370db] text-[#1a0b2e] font-bold py-2 px-4 rounded flex items-center"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </button>
                  {cardImage && (
                    <img
                      src={cardImage}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#7fffd4] hover:bg-[#5fdfb4] text-[#1a0b2e] font-bold py-2 px-4 rounded"
              >
                Submit Card
              </button>
            </form>
          </div>
        </Modal>

        {/* その他のコンテンツ */}
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
                  disabled={votedIllustrations.includes(
                    illustration.id as never
                  )}
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
    </>
  );
};

export default CardSubmission;
