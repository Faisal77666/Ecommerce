import React from 'react'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import AllRefundOrders from '../../components/Shop/AllRefundOrders.jsx'

const ShopAllRefunds = () => {
  return (
    <div>
          <DashboardHeader />
                <div className='w-full flex  justify-between'>
                  <div className='w-[80px] 800px:w-[330px]'>
                    <DashboardSidebar active={10} />
                  </div>
                  <div className="w-full flex justify-center">
                      <AllRefundOrders />
                    </div>
          
                </div>
        </div>
  )
}

export default ShopAllRefunds
