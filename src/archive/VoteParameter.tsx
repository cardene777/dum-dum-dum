import { useState, useEffect } from "react";

const CardParameterVoting = () => {
  const [remainingTime, setRemainingTime] = useState(3600); // 1 hour in seconds
  const [totalPoints, setTotalPoints] = useState(100);
  const [parameters, setParameters] = useState({
    フロウ: 0,
    ライム: 0,
    ファッション: 0,
    パッション: 0,
  });

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

  const handleSliderChange = (
    param: keyof typeof parameters,
    newValue: number
  ) => {
    const currentValue = parameters[param];
    const difference = newValue - currentValue;

    if (totalPoints - difference >= 0) {
      setParameters({ ...parameters, [param]: newValue });
      setTotalPoints(totalPoints - difference);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log("Submitted parameters:", parameters);
    // Here you would typically send the data to your backend
    alert("投票が完了しました！");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0b2e] to-[#2f1b4e] text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#b19cd9]">
        カードパラメーター投票
      </h1>
      <div className="text-center mb-8">
        <p className="text-2xl font-semibold text-[#7fffd4]">
          残り時間: {formatTime(remainingTime)}
        </p>
        <p className="text-xl font-semibold text-[#7fffd4] mt-2">
          残りポイント: {totalPoints}
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl text-[#7fffd4] mb-6">パラメーター投票</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.entries(parameters).map(([param, value]) => (
            <div key={param} className="space-y-2">
              <label className="text-[#b19cd9] flex justify-between">
                <span>{param}</span>
                <span>{value}</span>
              </label>
              <input
                type="range"
                value={value}
                max={100}
                step={1}
                className="w-full"
                onChange={(e) =>
                  handleSliderChange(
                    param as keyof typeof parameters,
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-[#7fffd4] hover:bg-[#5fdfb4] text-[#1a0b2e] font-bold py-2 px-4 rounded"
            disabled={totalPoints !== 0}
          >
            投票する
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardParameterVoting;
