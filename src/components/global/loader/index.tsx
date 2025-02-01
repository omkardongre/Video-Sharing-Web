import { cn } from "@/lib/utils";
import React from "react";
import { Spinner } from "./spinner";

type Props = {
  state: boolean;
  className?: string;
  color?: string;
  children?: React.ReactNode;
};

const Loader = ({ state, className, color="currentColor", children }: Props) => {
  return state ? (
    <div className={cn("flex items-center justify-center", className)}>
      <Spinner color={color} />
    </div>
  ) : (
    children
  );
};

export default Loader;
