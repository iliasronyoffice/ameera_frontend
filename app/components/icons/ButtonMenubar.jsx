import React from "react";
export default function ButtonMenubar({
  width = 21,
  height = 19,
  color = "#ffffff",
  className = "",
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      className={className}
      fill="none"
    >
      <path
        d="M25.3 9H6.7c-.4 0-.7-.3-.7-.8s.3-.8.8-.8h18.5c.4 0 .8.3.8.8s-.4.8-.8.8zM25.3 16H6.7c-.4 0-.7-.3-.7-.8s.3-.8.8-.8h18.5c.4 0 .8.3.8.8s-.4.8-.8.8zM25.3 23H6.7c-.4 0-.7-.3-.7-.8s.3-.8.8-.8h18.5c.4 0 .8.3.8.8s-.4.8-.8.8z"
        fill={color}
      />
    </svg>
  );
}