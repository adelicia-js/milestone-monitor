import React from "react";

interface LoaderProps {
  customHeight?: string;  
}

export default function Loader(props: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${props.customHeight ?? "h-full"}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-r-2 border-b-2 border-teal-500">
        🚀
      </div>
    </div>
  );
}
