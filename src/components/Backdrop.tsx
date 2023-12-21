"use client";

import { useEffect } from "react";

interface Props {
  onClick: () => void;
}

const BackDrop = ({ onClick }: Props) => {
  useEffect(() => {
    console.log("dropdown open");
  }, []);

  return (
    <div
      onClick={() => {
        onClick();
        console.log("backdrop");
      }}
      className="bg-slate-500 opacity-20 w-screen h-screen fixed top-0 left-0 border-[10px] border-white"
    ></div>
  );
};

export default BackDrop;
