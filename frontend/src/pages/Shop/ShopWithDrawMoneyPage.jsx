import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSidebar from '../../components/Shop/Layout/DashboardSidebar'
import WithDrawMoney from '../../components/Shop/WithDrawMoney/WithDrawMoney.jsx'


const ShopWithDrawMoneyPage = () => {
  return (
    <div>
      <DashboardHeader/>
      <div className="flex items-start justify-between w-full">
          <div className="w-[100px] 800px:w-[330px]">
            <DashboardSidebar active={7} />
          </div>
          <WithDrawMoney/>
      </div>
    </div>
  )
}

export default ShopWithDrawMoneyPage
