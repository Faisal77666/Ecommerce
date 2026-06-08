import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../../redux/actions/order';
import styles from '../../../styles/styles';

const WithDrawMoney = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const [deliveredOrder, setDeliverdOrder] = useState(null);
  useEffect(() => {
      dispatch(getAllOrdersOfShop(seller._id));
      const orderData =
        orders && orders.filter((item) => item.status === "Delivered");
      setDeliverdOrder(orderData);
    }, [dispatch]);
  
    const totalEarningWithoutText =
      deliveredOrder &&
      deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0);
    const serviceCharge = totalEarningWithoutText * 0.1;
    const availableBalance = totalEarningWithoutText - serviceCharge.toFixed(2);
   
    
  
  return (
    <div className='w-full h-[90vh] p-8'>
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className='text-[20px] pb-4'>Available Balance: ${availableBalance.toFixed(2)}</h5>
        <div className={`${styles.button} text-white !h-[42px] !rounded`}>Withdraw Money</div>


      </div>
    </div>
  )
}

export default WithDrawMoney
