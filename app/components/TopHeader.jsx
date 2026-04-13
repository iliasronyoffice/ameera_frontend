"use client";

export default function TopHeader({ topHeader }) {
  return (
    <div className="w-full bg-main text-white overflow-hidden">
      <div className="marquee h-8 text-sm md:text-base items-center flex whitespace-nowrap">
        <span className="marquee-text mx-8">{topHeader}</span>
      </div>
    </div>
  );
}
