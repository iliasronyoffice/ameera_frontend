import Image from "next/image";
import Slider from "./(home)/Slider";
import OurBrands from "./(home)/OurBrands";
import ThirdBanner from "./(home)/ThirdBanner";
import FeaturedCategory from "./(home)/FeaturedCategory";
import BestSelling from "./(home)/BestSelling";
import ShopByCategory from "./(home)/ShopByCategory";
import WatchAndBuy from "./(home)/WatchAndBuy";
import ServicePolicies from "./(home)/ServicePolicies";


export default async function Home() {
  return (
    <div className="min-h-screen font-milliard">
      <Slider />
      <FeaturedCategory />
      <BestSelling />
      {/* <FeaturedProducts /> */}
      {/* <BestDeals></BestDeals> */}
      {/* <SecondBanner /> */}
      {/* <JustForYou /> */}
      <ShopByCategory />
      <WatchAndBuy />
      {/* <CategoryWiseProducts/> */}
      {/* <TopSellers /> */}
      <OurBrands />
      <ServicePolicies />
      <ThirdBanner />
    </div>
  );
}
