import { useEffect, useState } from "react";
import api from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoint";

function CategoryGrid() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get(ENDPOINTS.CATEGORIES)
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="text-center cursor-pointer">
            <img
              src={cat.image}
              alt={cat.name}
              className="h-24 mx-auto rounded-full object-cover"
            />
            <p className="mt-2 font-semibold">{cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryGrid;
