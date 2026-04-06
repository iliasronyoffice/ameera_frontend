import React from "react";

export default function WishlistIcon({ width = 21, height = 19 }) {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 21 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 sm:w-4 sm:h-4 lg:w-6 lg:h-6"
      >
        <path
          d="M9.81758 17.8006L2.26312 9.93389C0.135253 7.71812 0.269249 4.0849 2.55405 2.04556C4.82073 0.0223831 8.25762 0.415254 10.0488 2.90229L10.35 3.3204L10.6511 2.90229C12.4424 0.415254 15.8792 0.0223831 18.146 2.04556C20.4308 4.0849 20.5648 7.71812 18.4368 9.93389L10.8824 17.8006C10.5884 18.1068 10.1116 18.1068 9.81758 17.8006Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
