import React, { useEffect, useState } from 'react'
import { productData } from '../../../static/data'
import styles from '../../../styles/styles'
import ProductCard from "../ProductCard/ProductCard.jsx"
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../../../redux/actions/product.js'

function BestDeals() {
  const [data,setData]=useState([])
  const {allProducts}=useSelector((state)=>state.products)
  const dispatch=useDispatch()
  useEffect(() => {
  dispatch(getAllProducts());
}, [dispatch]);

useEffect(() => {
  
  if (allProducts && allProducts.length > 0) {
    const d = [...allProducts].sort((a, b) => b.sold_out - a.sold_out);
    setData(d.slice(0, 5));
    
  }
}, [allProducts]);

 
  

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>
          Best Deals
        </h1>
      </div>
         <div className="grid grid-cols-1 gap-[20px] md:grid-cols-5 md:gap-[25px] lg-grid-cols-4 lg-gap-[25px] xl-grid-cols-5 xl-gap-[30px] mb-12 border-0">
          { data && data.map((i,index)=>(
            <ProductCard data={i} key={index} />

          )

          )}
        </div>
      
    </div>
  )
}

export default BestDeals
