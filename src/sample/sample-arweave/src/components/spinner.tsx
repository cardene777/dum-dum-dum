import { Loader2 } from "lucide-react";

type SpinnerProps = {
  size?: number;
};

export function Spinner(props: SpinnerProps) {
  const size = props.size || 28;
  return <Loader2 height={size} width={size} className={`animate-spin`} />;
}
