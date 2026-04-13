// "use client";
// import Link from "next/link";
// import { useState } from "react";

// export default function VideoCard({ item }) {
//   const [play, setPlay] = useState(false);

//   return (
//     <div className="group cursor-pointer">
//       {/* Video/Image Container */}
//       <div className="relative w-full h-[230px] md:h-[330px] 2xl:h-[620px] bg-gray-100 overflow-hidden">
        
//         {/* If playing → show video */}
//         {play ? (
//           <video
//             src={item.custom_video}
//             autoPlay
//             controls
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <>
//             {/* Thumbnail */}
//             <img
//               src={item.thumbnail_image}
//               alt={item.name}
//               className="w-full h-full object-cover"
//             />

//             {/* Dark overlay */}
//             <div className="absolute inset-0 bg-main/20"></div>

//             {/* Play Button */}
//             <div
//               onClick={() => setPlay(true)}
//               className="absolute inset-0 flex items-center justify-center"
//             >
//               <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center">
//                 ▶
//               </div>
//             </div>
//           </>
//         )}

//         {/* View Count */}
//         <div className="absolute top-2 left-2 bg-white/80 text-xs px-2 py-1 rounded flex items-center gap-1">
//           👁 3.0k
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="mt-2 flex items-center gap-2 ">
//         <img
//           src={item.thumbnail_image}
//           className="w-10 h-15 object-cover"
//           alt=""
//         />

//         <div>
//           <p className="text-xs font-medium line-clamp-2">
//             {item.name}
//           </p>

//           <Link
//             href={`/product/${item.slug}`}
//             className="text-xs underline flex items-center gap-1"
//           >
//             View Product ↗
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }