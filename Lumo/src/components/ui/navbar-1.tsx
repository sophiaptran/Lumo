import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"


const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsOpen(!isOpen)

  React.useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setHidden(!entry.isIntersecting)
      },
      { root: null, threshold: 0 }
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`fixed inset-x-0 top-0 z-50 flex justify-center w-full py-4 px-4 transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur rounded-full shadow-lg w-full max-w-3xl">
        <div className="flex items-center">
          <motion.div
            className="w-8 h-8 mr-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="url(#paint0_linear)" />
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF9966" />
                  <stop offset="1" stopColor="#FF5E62" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
        
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Pricing", "Docs", "Projects"].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <a href={`../${item}.tsx`} className="text-sm text-gray-900 hover:text-gray-600 transition-colors font-medium">
                  {item}
                </a>
              </motion.div>
            ))}
          </nav>

        {/* Desktop CTA Button */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <a
            href="../signup"
            className="inline-flex items-center justify-center px-5 py-2 text-sm text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
          >
            Get Started
          </Link>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button className="md:hidden flex items-center" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
          <Menu className="h-6 w-6 text-gray-900" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-gray-900" />
            </motion.button>
            <div className="flex flex-col space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link 
                  to="/" 
                  className={`text-base font-medium transition-colors ${
                    location.pathname === '/' 
                      ? 'text-blue-800' 
                      : 'text-gray-900'
                  }`} 
                  onClick={toggleMenu}
                >
                  Home
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link 
                  to="/streaks" 
                  className={`text-base font-medium transition-colors ${
                    location.pathname === '/streaks' 
                      ? 'text-blue-800' 
                      : 'text-gray-900'
                  }`} 
                  onClick={toggleMenu}
                >
                  Streaks
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Link 
                  to="/badges" 
                  className={`text-base font-medium transition-colors ${
                    location.pathname === '/badges' 
                      ? 'text-blue-800' 
                      : 'text-gray-900'
                  }`} 
                  onClick={toggleMenu}
                >
                  Badges
                </Link>
              </motion.div>
              
              

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6"
              >
                <Link
                  to="/streaks"
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-base text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
                  onClick={toggleMenu}
                >
                  Login
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export { Navbar1 }