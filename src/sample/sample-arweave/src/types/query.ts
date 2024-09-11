export interface QueriedAsset {
  id: string;
  title: string;
  description: string;
  license: string[];
  topics: string[];
  creatorId: string;
  creatorName: string;
}

export type Tag = {
  name: string;
  value: string;
};

export interface QueriedComment {
  id: string;
  comment: any;
  creatorId: string;
}
