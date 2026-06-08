import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import AllCoupons from '../../components/Shop/AllCoupons.jsx'

const  ShopAllCoupons= () => {
  return (
    <div>
      <DashboardHeader />
            <div className='w-full flex  justify-between'>
              <div className='w-[80px] 800px:w-[330px]'>
                <DashboardSidebar active={9} />
              </div>
              <div className="w-full flex justify-center">
                  <AllCoupons />
                </div>
      
            </div>
    </div>
  )
}

export default ShopAllCoupons;
