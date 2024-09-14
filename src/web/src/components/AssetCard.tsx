import React from "react";
import { QueriedAsset } from "../types/query";

// type ImageLoaderProps = {
//   src: string;
//   width: number;
//   quality?: number;
// };

// const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
//   return `https://ar-io.dev/${src}?w=${width}&q=${quality || 75}`;
// };

export const AssetCard = (props: QueriedAsset) => {
  return (
    <div className="w-full border rounded shadow-md bg-[#2A1B3D]">
      <div className="p-4">
        <h2 className="text-md font-bold">{props.title}</h2>
        <p>{props.creatorName}</p>
      </div>
      <div className="p-4">
        <img
          src={`https://ar-io.dev/${props.id}`}
          // https://vyxmolv7nahbzyxxmcbesgf5fe6jw6ulfib6eespgnp7u6it6t2a.arweave.net/ri7HLr9oDhzi92CCSRi9KTybeosqA-ISTzNf-nkT9PQ
          alt={props.title}
          // loader={imageLoader}
          className="aspect-[1/1] h-auto w-auto object-contain mx-auto"
          width={200}
          height={200}
        />
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2 max-w-full">
          {/* <div className="flex gap-4 max-w-full">
            <Stamp txId={props.id} />
            <CommentDialog txId={props.id} />
          </div> */}
          <p className="text-xs max-w-full">{props.description}</p>
          <div className="grid grid-cols-3 gap-2 max-w-full">
            {props.topics.map(
              (
                topic:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | null
                  | undefined,
                index: React.Key | null | undefined
              ) => (
                <span key={index} className="border rounded p-1 text-xs">
                  {topic}
                </span>
              )
            )}
          </div>
          <hr className="my-2 border-gray-300" />
          <div className="grid gap-2 max-w-full">
            <span className="border rounded p-1 text-xs">
              License: {props.license[0]}
            </span>
            <span className="border rounded p-1 text-xs">
              Fee: {props.license[1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
