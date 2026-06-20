function OfferBanners() {
  const offers = [
    "Flat 40% OFF",
    "Buy 1 Get 1 Free",
    "Free Shipping",
  ];

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {offers.map((offer, index) => (
        <div
          key={index}
          className="bg-pink-100 text-center py-6 rounded font-bold"
        >
          {offer}
        </div>
      ))}
    </div>
  );
}

export default OfferBanners;
