export default function CartIcon({ width = 24, height = 24 }) {
  return (
    <div>
      <svg
       width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 sm:w-4 sm:h-4 lg:w-6 lg:h-6"
      >
        <path
          d="M18.1717 22.4796H3.82729C2.73661 22.4796 1.88922 21.5263 2.01181 20.4386L3.79886 9.34618C3.87216 8.6963 4.41939 8.20508 5.07089 8.20508H16.9293C17.5808 8.20508 18.1281 8.6963 18.2014 9.34618L19.9884 20.4386C20.1098 21.527 19.2624 22.4796 18.1717 22.4796Z"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.36719 10.873V5.65177C7.36719 3.63485 8.99499 2 11.0032 2C13.0114 2 14.6392 3.63485 14.6392 5.65177V10.873"
          stroke="white"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.21875 10.873H8.51196"
          stroke="black"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.4844 10.873H15.7769"
          stroke="black"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
