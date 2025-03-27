import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaTwitter, FaGithub } from 'react-icons/fa';
import pic from '../assets/pic.jpeg'

const About = () => {
  const [activeSection, setActiveSection] = useState('story');

  const teamMembers = [
    { name: 'Rohan Chauhan', role: 'Our Owner', avatar: pic },
    { name: 'John Smith', role: 'Editor', avatar: 'https://via.placeholder.com/150' },
    { name: 'Alex Johnson', role: 'Designer', avatar: 'https://via.placeholder.com/150' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-16 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Hero Section */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl mt-9 sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-8 md:mb-12 text-gray-900 font-['Inter',sans-serif]"
        >
          <span className="relative inline-block">
            About Our Journey
            <span className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-1 rounded-full" />
          </span>
        </motion.h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 md:mb-12">
          {['story', 'mission', 'team', 'contact', 'rules'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 sm:px-6 sm:py-2 cursor-pointer rounded-full text-xs sm:text-sm font-medium transition-all duration-300 font-['Inter',sans-serif] ${
                activeSection === section 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6 md:p-8 font-['Inter',sans-serif]"
        >
          {activeSection === 'story' && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-gray-800">Our Story</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Welcome to our cutting-edge blog platform! We're a team of passionate storytellers 
                dedicated to delivering fresh perspectives through innovative content. From 
                interactive articles to immersive multimedia, we're redefining digital storytelling 
                for the modern age.
              </p>
            </section>
          )}

          {activeSection === 'mission' && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-gray-800">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                We aim to revolutionize how knowledge is shared online by fostering a dynamic 
                community of creators and readers. Our goal is to spark curiosity, encourage 
                dialogue, and provide a platform where diverse voices can thrive.
              </p>
            </section>
          )}

          {activeSection === 'team' && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-gray-800">Meet Our Team</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.name}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-50 p-4 rounded-lg text-center"
                  >
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4" 
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'contact' && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-gray-800">Get in Touch</h2>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <p className="text-gray-600 flex-1 text-sm sm:text-base">
                  We'd love to hear your thoughts! Reach out to us anytime via:
                </p>
                <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                  <a href="mailto:hello@blog.com" className="p-2 sm:p-3 bg-blue-100 rounded-full hover:bg-blue-200">
                    <FaEnvelope className="text-blue-600 text-lg sm:text-xl" />
                  </a>
                  <a href="https://twitter.com" className="p-2 sm:p-3 bg-blue-100 rounded-full hover:bg-blue-200">
                    <FaTwitter className="text-blue-600 text-lg sm:text-xl" />
                  </a>
                  <a href="https://github.com" className="p-2 sm:p-3 bg-blue-100 rounded-full hover:bg-blue-200">
                    <FaGithub className="text-blue-600 text-lg sm:text-xl" />
                  </a>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'rules' && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 md:mb-6 text-gray-800">Community Guidelines</h2>
              <ul className="space-y-3 md:space-y-4 text-gray-600 text-sm sm:text-base">
                {[
                  'Respect Everyone: Foster a positive environment with kindness and understanding.',
                  'Quality Content: Share meaningful contributions that enhance discussions.',
                  'Stay Relevant: Keep posts aligned with the topic for focused conversations.',
                  'Credit Sources: Always attribute information to maintain credibility.',
                  'Protect Privacy: Keep personal details private and secure.',
                  'Constructive Feedback: Offer thoughtful insights with positive intent.',
                  'Report Violations: Help us maintain quality by flagging concerns.',
                ].map((rule, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 sm:mt-2 mr-2 sm:mr-3 flex-shrink-0" />
                    {rule}
                  </motion.li>
                ))}
              </ul>
            </section>
          )}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 md:mt-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-4 sm:p-6 md:p-8 text-white text-center font-['Inter',sans-serif]"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4">Join Our Community</h2>
          <p className="mb-4 md:mb-6 text-sm sm:text-base">Subscribe to our newsletter for the latest updates and exclusive content!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 sm:px-4 sm:py-2 border border-orange-400 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-gray-800 focus:outline-none font-['Inter',sans-serif] w-full sm:w-auto"
            />
            <button className="px-4 py-2 sm:px-6 sm:py-2 bg-white text-teal-600 rounded-lg sm:rounded-r-lg sm:rounded-l-none font-semibold hover:bg-gray-100">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;