import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { getAllProducts } from "../../../redux/actions/product";

const FeaturedProduct = () => {
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Featured Products</h1>
      </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
        {allProducts && allProducts.length > 0 ? (
          allProducts.map((product, index) => <ProductCard key={index} data={product} />)
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedProduct;
