import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: number;
  className?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 24, className = "", text }) => {
  return (
    <div className={cn("flex items-center justify-center gap-2 flex-col", className)}>
      <Loader2 className="animate-spin text-muted-foreground" size={size} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

export default Loader;
