import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppingHeader from './header'
import Footer from './footer'

function ShoppingLayout() {
  return (
    <div className='flex flex-col min-h-screen bg-white'>
      {/* Fixed Header - adjust height as needed */}
      <header className='fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-sm'>
        <div className='container mx-auto px-4 h-full'>
          <ShoppingHeader/>
        </div>
      </header>

      {/* Main Content - padding top matches header height */}
      <main className='flex-1 pt-8 overflow-auto'>
        <div className='container mx-auto px-4'>
          <Outlet/>
        </div>
      </main>

      {/* Footer at bottom */}
      <footer className='bg-gray-900  text-white rounded-lg'>
        <div className='container mx-auto px-4'>
          <Footer/>
        </div>
      </footer>
    </div>
  )
}

export default ShoppingLayout