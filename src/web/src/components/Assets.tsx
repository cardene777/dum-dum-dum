import { AssetCard } from "./AssetCard";
import { getAssetData } from "../lib/query-assets";
import { QueriedAsset } from "../types/query";
import { useEffect, useState } from "react";

export function Assets({ isLoading }: { isLoading: boolean }) {
  const [assets, setAssets] = useState<QueriedAsset[]>([]);

  const fetchData = async () => {
    const data = await getAssetData();
    setAssets(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchData();
    }
  }, [isLoading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-6">
      {assets.map((asset) => (
        <AssetCard {...asset} key={asset.id} />
      ))}
    </div>
  );
}
