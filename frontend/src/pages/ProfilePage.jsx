import React, { useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import styles from '../styles/styles'
import ProfileSidebar from '../components/Profile/ProfileSidebar.jsx'
import ProfileContent from '../components/Profile/ProfileContent.jsx'

function ProfilePage() {
  const [active, setActive] = useState(1)

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header />
      <div className={`${styles.section} flex flex-1 py-10 mt-10`}>
        <div className="w-[50px] 800px:w-[335px] sticky mt-[18%] 800px:mt-0">
          <ProfileSidebar active={active} setActive={setActive} />
        </div>
        <div className="flex-1  ">
          <ProfileContent active={active} />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
