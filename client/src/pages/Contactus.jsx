import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaEnvelope } from "react-icons/fa";

const Contactus = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.firstName && formData.email && formData.message) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000); // Hide after 3s
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    }
  };

  // Animation Variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateX: -20 },
    visible: { opacity: 1, scale: 1, rotateX: 0, transition: { duration: 0.6 } },
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0px 0px 15px rgba(59, 130, 246, 0.5)" },
  };

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="container px-6 py-12 mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
    

<h1 className="mt-8 text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
  Chat with Our Friendly Team
  <div className="w-32 h-1 bg-sky-500 mb-6 hidden sm:block"></div>
  
</h1>

<p className="mt-2 text-gray-500 dark:text-gray-400">
  We’d love to hear from you. Fill out the form or reach out directly!
</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 mt-10 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            className="grid grid-cols-1 gap-12 md:grid-cols-2"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <FaEnvelope />,
                title: "Email",
                desc: "Our team is here to assist.",
                value: "contactus@bridgegroupsolutions.com",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                title: "Live Chat",
                desc: "Start a conversation now.",
                value: "Chat Now",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                title: "Office",
                desc: "Visit us at our HQ.",
                value: "Gurugram, India",
              },
              {
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                ),
                title: "Phone",
                desc: "Mon-Sat, 10 AM - 7 PM.",
                value: "+91-8860060616",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateX: 5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-block p-3 text-blue-500 rounded-full bg-blue-100/80 dark:bg-gray-700">
                  {item.icon}
                </span>
                <h2 className="mt-4 text-base font-medium text-gray-800 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                <p className="mt-2 text-sm text-blue-500 dark:text-blue-400">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Form Section */}
          <motion.div
            className="p-6 rounded-xl bg-white/80 backdrop-blur-md dark:bg-gray-800/80 shadow-xl"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {isSubmitted ? (
              <motion.div
                className="text-center text-green-500 dark:text-green-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold">Thank You!</h2>
                <p>Your message has been sent successfully.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
              
                <div className="-mx-2 md:flex">
                
                  <motion.div className="flex-1 px-2" variants={itemVariants}>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">First Name</label>
                    <motion.input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter First Name"
                      className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      whileFocus="focus"
                      variants={inputVariants}
                      required
                    />
                  </motion.div>
                  <motion.div className="flex-1 px-2 mt-4 md:mt-0" variants={itemVariants}>
                    <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Last Name</label>
                    <motion.input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                      className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      whileFocus="focus"
                      variants={inputVariants}
                    />
                  </motion.div>
                </div>
                <motion.div className="mt-4" variants={itemVariants}>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="@gmail.com"
                    className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    whileFocus="focus"
                    variants={inputVariants}
                    required
                  />
                </motion.div>
                <motion.div className="mt-4" variants={itemVariants}>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Message</label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full h-32 px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg md:h-56 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Your Message"
                    whileFocus="focus"
                    variants={inputVariants}
                    required
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  className="w-full px-6 py-3 mt-6 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.8)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Social Media Links */}
        <motion.div
          className="mt-12 flex justify-center space-x-6"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            { Icon: FaFacebookF, href: "#", color: "hover:text-blue-500" },
            { Icon: FaTwitter, href: "#", color: "hover:text-blue-400" },
            { Icon: FaLinkedinIn, href: "#", color: "hover:text-blue-600" },
          ].map(({ Icon, href, color }, index) => (
            <motion.a
              key={index}
              href={href}
              className={`text-gray-500 dark:text-gray-400 ${color} transition-all duration-300`}
              whileHover={{ scale: 1.3, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon className="text-2xl" />
            </motion.a>
          ))}
        </motion.div>

        {/* Animated Map */}
        <motion.div
          className="mt-12 rounded-xl overflow-hidden shadow-2xl"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.02, rotateX: 5 }}
          transition={{ duration: 0.4 }}
        >
         <iframe
           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093745!2d144.9556512158647!3d-37.81724897975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0x5045675218ce6e0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1633321712345!5m2!1sen!2sus"
           width="100%"
           height="250"
           style={{ border: 0 }}
           allowFullScreen=""
           loading="lazy"
           title="location"
           className="rounded-lg"
        ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default Contactus;