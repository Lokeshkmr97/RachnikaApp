import Navbar from "../components/layout/Navbar";
import HeroSlider from "../components/home/HeroSlider";
import OfferBanners from "../components/home/OfferBanners";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedProducts from "../components/home/FeaturedProducts";

function Home() {
  return (
    <>
      <HeroSlider />
      <OfferBanners />
      <FeaturedProducts />
      <CategoryGrid />
      
    </>
  );
}

export default Home;
