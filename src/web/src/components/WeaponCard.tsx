import { IGun } from "../types/type";

export const WeaponCard = ({ card }: { card: IGun }) => {
  return (
    <div
      key={card.id}
      className="relative bg-[#2a1b3d] border-[#b19cd9] border-2 rounded-lg shadow-lg p-4"
    >
      {/* 画像 */}
      <img
        src={card.image}
        alt={card.name}
        className="w-full object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold mb-2 text-[#7fffd4]">{card.name}</h3>

      {/* 左上のパラメーター（例：レア度を丸で囲んで表示） */}
      <div className="absolute top-2 left-2 flex items-center justify-center w-12 h-12 bg-[#1a0b2e] border-2 border-[#b19cd9] rounded-full text-center">
        <span className="text-sm text-white font-bold">{card.rarity}</span>
      </div>

      {/* 右上のレベル表示 */}
      <div className="absolute top-2 right-2 flex items-center justify-center w-12 h-12 bg-[#b19cd9] rounded-full text-center">
        <span className="text-sm text-[#1a0b2e] font-bold">
          Lv.{card.level}
        </span>
      </div>

      {/* 攻撃力と防御力を六芒星で囲んで表示 */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2">
        {/* 攻撃力 */}
        <div className="flex items-center justify-center w-16 h-16 bg-transparent border-2 border-[#b19cd9] rounded-full relative">
          <div className="absolute inset-0 flex justify-center items-center text-white">
            <span className="text-lg font-bold">{card.attack}</span>
          </div>
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <polygon
              points="50,0 93,25 93,75 50,100 7,75 7,25"
              className="stroke-[#b19cd9] fill-none"
              strokeWidth="4"
            />
          </svg>
        </div>

        {/* 防御力 */}
        <div className="flex items-center justify-center w-16 h-16 bg-transparent border-2 border-[#b19cd9] rounded-full relative">
          <div className="absolute inset-0 flex justify-center items-center text-white">
            <span className="text-lg font-bold">0</span>
          </div>
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <polygon
              points="50,0 93,25 93,75 50,100 7,75 7,25"
              className="stroke-[#b19cd9] fill-none"
              strokeWidth="4"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
