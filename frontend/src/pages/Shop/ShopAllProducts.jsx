import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import AllProducts from '../../components/Shop/AllProducts.jsx'

const  ShopAllProducts= () => {
  return (
    <div>
      <DashboardHeader />
            <div className='w-full flex  justify-between'>
              <div className='w-[80px] 800px:w-[330px]'>
                <DashboardSidebar active={3} />
              </div>
              <div className="w-full flex justify-center">
                  <AllProducts />
                </div>
      
            </div>
    </div>
  )
}

export default ShopAllProducts
