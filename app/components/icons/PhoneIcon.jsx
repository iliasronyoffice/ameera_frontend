import React from "react";

export default function PhoneIcon({ width = 24, height = 24 }) {
  return (
    <div>
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="#DADAFF"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24a11.72 11.72 0 003.68.59c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.85 21 3 13.15 3 3c0-.55.45-1 1-1h3.47c.55 0 1 .45 1 1 0 1.28.2 2.52.59 3.68.12.35.04.74-.24 1.02l-2.2 2.2z" />
      </svg>
    </div>
  );
}
