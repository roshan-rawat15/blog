import { useState } from 'react'
import blog from '../assets/blog-post.jpg'

function Fhome () {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section with Background Image */}
      <header className="relative h-screen bg-cover bg-center" 
        style={{ 
          backgroundImage: `url{blog}`
        }}>
        <div className="absolute inset-0 bg-black bg-opacity-50">
          

          {/* Hero Content */}
          <div className="container mx-auto px-6 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h2 className="text-5xl font-bold mb-4">Welcome to BlogSite</h2>
              <p className="text-xl mb-6">Discover amazing stories, insights, and ideas from passionate writers around the world.</p>
              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300">
                Start Reading
              </button>
            </div>
          </div>
        </div>
      </header>

     

  
    </div>
  )
}

export default Fhome