import Image from "next/image";
import Link from "next/link";

export default function TopSellersCardBox({ item }) {
  return (
    <div className="bg-white border border-[#F1F1FE] shadow-sm rounded-xl hover:shadow-2xl duration-300 relative group cursor-pointer flex flex-col h-full">
      
      {/* Image Section */}
      <div className="flex justify-center items-center h-[120px] p-3">
        <div className="relative w-[80px] h-[80px] relative">
          <Image
            src={item.img}
            alt={item.title}
            fill
            className="object-cover rounded-full shadow-sm"
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="flex-1 flex flex-col justify-between px-4 pb-4">
        <div>
          <h4 className="text-lg md:text-xl font-semibold text-center mt-1 truncate">
            {item.title}
          </h4>

          {/* Rating */}
          <div className="flex items-center justify-center text-yellow-400 text-xs md:text-sm py-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx}>★</span>
            ))}
            {/* <span className="text-gray-400 ml-1 text-xs md:text-sm">
              {item.rating ? item.rating.toFixed(1) : "0.0"} avg.rating
            </span> */}
            <span className="text-gray-400 ml-1 text-xs md:text-sm">
              {item.rating && !isNaN(item.rating)
                ? Number(item.rating).toFixed(1)
                : "0.0"}{" "}
              avg.rating
            </span>
          </div>
        </div>

        {/* Visit Store Button */}
        <Link href={`/shop/${item.slug}`} className="mt-2">
          <div className="visit-btn bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <div className="visit-section flex justify-between items-center p-2">
              <div className="text-sm font-medium uppercase text-center w-full">
                Visit Store
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
