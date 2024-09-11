import * as React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QueriedAsset } from "@/types/query";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Stamp } from "@/components/stamp-like";
import { CommentDialog } from "@/components/comment";
import { Separator } from "@/components/ui/separator";

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `https://ar-io.dev/${src}?w=${width}&q=${quality || 75}`;
};

export function AssetCard(props: QueriedAsset) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={cn("text-md font-bold")}>{props.title}</CardTitle>
        <CardDescription>{props.creatorName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={props.id}
          alt={props.title}
          loader={imageLoader}
          className="aspect-[1/1] h-fit w-fit object-contain mx-auto"
          width={200}
          height={200}
        />
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-2 max-w-full">
          <div className="flex gap-4 max-w-full">
            <Stamp txId={props.id} />
            <CommentDialog txId={props.id} />
          </div>
          <p className="text-xs max-w-full">{props.description}</p>
          <div className="grid grid-cols-3 gap-2 max-w-full">
            {props.topics.map((topic, index) => (
              <Badge variant="outline" key={index} className="w-fit h-fit">
                {topic}
              </Badge>
            ))}
          </div>
          <Separator className="my-2" />
          <div className="grid gap-2 max-w-full">
            <Badge variant="outline" className="w-fit h-fit">
              License: {props.license[0]}
            </Badge>
            <Badge variant="outline" className="w-fit h-fit">
              Fee: {props.license[1]}
            </Badge>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
