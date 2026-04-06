"use client";
import Breadcrumb from "@/app/components/layout/Breadcrumb";
import BrandCard from "@/app/components/layout/BrandCard";
import useCachedFetch from "@/app/utils/useCachedFetch"; 


export default function AllBrands() {
  const { data: brands, loading, error } = useCachedFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/brands`,
    "brands_cache",
    5 * 60 * 1000 
  );

 if (loading) {
    return (
       <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main"></div>
        </div>
    );
  }
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="overflow-hidden container mx-auto px-4 py-8">
       {/* Breadcrumb */}
            <Breadcrumb />
      
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-4 py-3 md:py-5">
              Brands
            </h1>
            <p className="mb-4 md:mb-6 text-sm md:text-base">
              Discover top brands all in one place
            </p>

      <div className="container mx-auto px-4 md:px-0 mb-10 relative grid grid-cols-6 gap-4">
      
          {brands.map((item) => (
          
              <BrandCard key={item.id} item={item} />
           
          ))}
       
      </div>
    </div>
  );
}
