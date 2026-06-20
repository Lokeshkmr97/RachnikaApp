import { useEffect, useState } from "react";

const slides = [
  "https://images.pexels.com/photos/159644/art-supplies-brushes-rulers-scissors-159644.jpeg?cs=srgb&dl=pexels-pixabay-159644.jpg&fm=jpg",
  "https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?cs=srgb&dl=pexels-steve-1047540.jpg&fm=jpg",
  "https://images.pexels.com/photos/301703/pexels-photo-301703.jpeg",
];

function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[250px] md:h-[400px] overflow-hidden">
      <img
        src={slides[index]}
        className="w-full h-full object-cover transition-all duration-700"
      />
    </div>
  );
}

export default HeroSlider;
