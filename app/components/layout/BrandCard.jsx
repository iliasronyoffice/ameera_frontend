import Image from "next/image";
import Link from "next/link";

export default function BrandCard({ item }) {
  return (
    // <div className="bg-white border border-[#F1F1FE] shadow-sm rounded-xl hover:shadow-2xl duration-300 relative group cursor-pointer flex flex-col h-full">
      
    //   {/* Image Section */}
    //   <div className="w-full flex justify-center items-center h-[120px] p-3">
    //     {item.logo ? (
    //       <div className="relative ">
    //         <Image
    //           src={item.logo}
    //           alt={item.name}
    //           fill
    //           className="object-cover "
    //         />
    //       </div>
    //     ) : (
    //       <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
    //         <span className="text-gray-400 text-sm">No Logo</span>
    //       </div>
    //     )}
    //   </div>

    //   {/* Text Section */}
    //   <div className="flex-1 flex flex-col justify-between px-4 pb-4">
    //     <h4 className="text-lg md:text-xl font-semibold text-center mt-1 truncate">
    //       {item.name || "No Name"}
    //     </h4>

    //     <Link href={item.links?.products || "#"} className="mt-2">
    //       <div className="visit-btn bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
    //         <div className="visit-section flex justify-center items-center p-2">
    //           <div className="text-sm font-medium uppercase text-center w-full">
    //             View Products
    //           </div>
    //         </div>
    //       </div>
    //     </Link>
    //   </div>
    // </div>

   <Link  href={`/shop_page?brands=${item.id}`} className="block">
  <div className="border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl duration-300 overflow-hidden cursor-pointer group">
    {/* Image Section */}
    <div className="relative w-full aspect-square">
      <Image
        src={item?.logo}
        alt={item?.name}
        fill
        className="object-cover rounded-2xl group-hover:scale-105 duration-300"
      />

      {/* Title */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[80%] rounded-xl overflow-hidden shadow-sm text-center duration-300">
        <h3 className="text-sm font-semibold text-gray-800 uppercase truncate bg-white px-3 py-2 duration-300 group-hover:bg-main group-hover:text-white">
          {item?.name}
        </h3>
      </div>
    </div>
  </div>
</Link>

  );
}






   

