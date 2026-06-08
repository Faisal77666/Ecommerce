import React from 'react'
import Lottie from 'react-lottie'
import animationData from '../../Assests/animations/Onlineshopping.json'

function Loader() {
  const defaultOptions={
    loop:false,
    autoplay:true,
    animationData:animationData,
    rendererSettings:{
      preserveAspectRatio:'xMidyMid slice',
    },
  }
  return (
    <div className='w-full h-screen flex items-center justify-between'>
      <Lottie options={defaultOptions} width={300} height={300} />
      
    </div>
  )
}

export default Loader
