export interface ICard {
  id: number;
  name: string;
  rarity: string;
  image: string;
}

export interface IWeapon {
  id: number;
  name: string;
  price?: number;
  description?: string;
  image: string;
}

export interface ISelectedPacks {
  [key: number]: { quantity: number };
}

export interface IGun extends ICard {
  rarity: string;
  attack: number;
  level: number;
}

export interface IGunInfo {
  [key: string]: any;
}

export interface IDeck {
  address: string;
  name?: string;
  rank?: number;
  level?: number;
  rarity?: string;
  attack?: number;
  image?: string;
  score?: number;
  avatar?: string;
  deck?: IGun[];
}

// Shop
export interface IPack {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}
