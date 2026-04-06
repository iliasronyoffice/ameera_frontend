import Image from "next/image";
import Slider from "./(home)/Slider";
import FeaturedProducts from "./(home)/FeaturedProducts";
import BestDeals from "./(home)/BestDeals";
import SecondBanner from "./(home)/SecondBanner";
import JustForYou from "./(home)/JustForYou";
import TopSellers from "./(home)/TopSellers";
import OurBrands from "./(home)/OurBrands";
import CategoryWiseProducts from "./(home)/CategoryWiseProducts";
import ThirdBanner from "./(home)/ThirdBanner";


export default async function Home() {
  return (
    <div className="min-h-screen font-sans">
      <Slider />
      <FeaturedProducts />
      <BestDeals></BestDeals>
      <SecondBanner />
      <JustForYou />
      <ThirdBanner />
      <CategoryWiseProducts/>
      {/* <TopSellers /> */}
      <OurBrands />
    </div>
  );
}
