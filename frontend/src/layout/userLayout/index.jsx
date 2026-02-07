import React from 'react'
import NavBarComponent from '@/component/Navbar'
import Footer from '@/component/Footer'

export default function UserLayout({ children }) {
  return (
    <div className='flex flex-col justify-between min-h-screen'>
      <NavBarComponent/>
      { children }
      <Footer/>
    </div>
  )
}
