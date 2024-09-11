import * as React from "react";
import Stamps, { StampJS } from "@permaweb/stampjs";
// @ts-ignore
import { InjectedArweaveSigner } from "warp-contracts-plugin-signature";
import Arweave from "arweave";
import { Heart } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";

let stampInstance: StampJS;

async function getStamps() {
  if (stampInstance) return stampInstance;
  // @ts-ignore
  const { WarpFactory } = await import("warp-contracts");
  stampInstance = Stamps.init({
    warp: WarpFactory.forMainnet(),
    arweave: Arweave.init({}),
    wallet: new InjectedArweaveSigner(window.arweaveWallet), // Ensure you have injected the Arweave wallet globally
  });
  return stampInstance;
}

interface StampProps {
  txId: string; // This is the transaction ID for the asset you want to stamp
}

export function Stamp(props: StampProps) {
  const { connected, address } = useUser();
  const [stampCount, setStampCount] = React.useState<number>(0);
  const [hasStamped, setHasStamped] = React.useState<boolean>(false);

  const handleStampClick = async () => {
    if (!hasStamped) {
      const stamps = await getStamps();
      await stamps.stamp(props.txId, 0, []);
      const newCount = stampCount + 1;
      setStampCount(newCount);
      setHasStamped(true);
    }
  };

  React.useEffect(() => {
    async function fetchStampData() {
      const stamps = await getStamps();
      const { total } = await stamps.count(props.txId);
      setStampCount(total);

      if (address) {
        const stampedStatus = await stamps.hasStamped(props.txId);
        setHasStamped(stampedStatus);
      }
    }

    fetchStampData();
  }, [props.txId, address]);

  return (
    <HoverCard>
      <HoverCardTrigger className={cn("flex gap-2 items-center")}>
        <span>{stampCount}</span>
        <button
          onClick={handleStampClick}
          disabled={!connected || hasStamped}
          className={`
            transition 
            ${hasStamped && connected ? "text-red-500" : ""}
            ${!hasStamped && connected ? "hover:text-red-500" : ""}
          `}
        >
          <Heart size={16} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {!connected ? (
          <div className="text-center">
            Please connect to app before liking.
          </div>
        ) : (
          <div className="text-center">
            {hasStamped
              ? "You have already liked this post."
              : "You haven't liked this post yet!"}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
