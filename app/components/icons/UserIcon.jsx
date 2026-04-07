import React from "react";

export default function UserIcon({
  width = 24,
  height = 24,
  color = "#ffffff",
}) {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.125 8.75C15.941 11.228 14.062 13.25 12 13.25C9.93798 13.25 8.05598 11.229 7.87498 8.75C7.68798 6.172 9.51498 4.25 12 4.25C14.484 4.25 16.313 6.219 16.125 8.75Z"
          stroke={color}
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.01697 20.747C3.78297 16.5 7.92197 14.25 12 14.25C16.078 14.25 20.217 16.5 20.984 20.747"
          stroke={color}
          strokeWidth="1.1"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
}
