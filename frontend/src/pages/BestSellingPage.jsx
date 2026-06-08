import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import styles from '../styles/styles'
import ProductCard from '../components/Route/ProductCard/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../redux/actions/product'

function BestSellingPage() {
  const dispatch = useDispatch()
  const { allProducts } = useSelector((state) => state.products)
  const [data, setData] = useState([])

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  useEffect(() => {
    const getSellCount = (item) => item.total_sell ?? item.sold_out ?? 0
    const d = allProducts
      ? [...allProducts].sort((a, b) => getSellCount(b) - getSellCount(a))
      : []
    setData(d)
  }, [allProducts])

  return (
    <div>
      <Header activeHeading={2} />
      <br />
      <br />

      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {
            data && data.map((i,index)=><ProductCard data={i} key={index}/>)
          }
          

        </div>

      </div>



    </div>
  )
}

export default BestSellingPage
