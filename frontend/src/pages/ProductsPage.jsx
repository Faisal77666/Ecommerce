import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import styles from '../styles/styles'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/Route/ProductCard/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../redux/actions/product'

function ProductsPage() {
   const dispatch = useDispatch();
  const[searchParams]=useSearchParams()
  const categoryData=searchParams.get("category")
  const {allProducts}=useSelector((state)=>state.products)
  const[data,setData]=useState([])
  useEffect(() => {
    // fetch all products on page load
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(()=>{
      if(categoryData === null){
        const d = allProducts ? [...allProducts].sort((a,b)=>a.sold_out - b.sold_out) : []
        setData(d)
      }else{
       const d = allProducts ? allProducts.filter((i) => i.category === categoryData) : []

        setData(d)
      }
      // window.scrollTo(0,0)

  },[allProducts, categoryData])
  console.log(allProducts);
  
  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />

      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {
            data && data.map((i,index)=><ProductCard data={i} key={index}/>)
          }
          

        </div>
        {
            data && data.length ===0 ? (
              <h1 className='w-full text-center pb-[110px] text-[20px]'>No products Found!</h1>

            ):null
          }

      </div>



    </div>
  )
}

export default ProductsPage
