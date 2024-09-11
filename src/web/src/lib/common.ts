import { IGun } from "../types/type";

export const getRandomGuns = (guns: IGun[], count: number) => {
  const shuffled = guns.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// レア度に応じたスタイル
export const rarityStyles = {
  Common: "border-gray-400",
  Rare: "border-blue-400 shadow-blue-400/50",
  Epic: "border-purple-400 shadow-purple-400/50",
  Legendary: "border-yellow-400 shadow-yellow-400/50 animate-pulse",
};
