"use client";

import { AssetCard } from "@/components/asset-card";
import { useUser } from "@/hooks/useUser";
import { getAssetData } from "@/lib/query-assets";
import { QueriedAsset } from "@/types/query";
import * as React from "react";

export function Assets() {
  const [assets, setAssets] = React.useState<QueriedAsset[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const data = await getAssetData();
      setAssets(data);
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-6">
      {assets.map((asset) => (
        <AssetCard {...asset} key={asset.id} />
      ))}
    </div>
  );
}
