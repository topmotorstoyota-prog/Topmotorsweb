import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, User, ChevronDown, Home as HomeIcon, Car, Info, MapPin, Calculator } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { WheelIcon } from './FloatingCalculator';
import logo from '../assets/home/logo-1.png';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDarkPage = ['/products', '/wheels', '/merch'].includes(location.pathname) ||
                   location.pathname.startsWith('/products/') ||
                   location.pathname.startsWith('/wheels/') ||
                   location.pathname.startsWith('/tires/') ||
                   location.pathname.startsWith('/merch/');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      name: t('nav.about'),
      dropdown: [
        { name: t('nav.aboutIntro'), path: '/about' },
        { name: t('nav.salesStaff'), path: '/sales' },
        { name: t('nav.careers'), path: 'https://careers.mcs.mn/jobs/company:15/pg:2', isExternal: true },
        { name: t('nav.contact'), path: '/contact' },
             { name: t('nav.news'), path: '/news' },
      ]
    },
    { name: t('nav.newVehicles'), path: '/vehicles' },
    { name: t('nav.toyotaQ'), path: '/toyota-q' },
    { name: t('nav.faq'), path: '/faq' },
    {
      name: t('nav.services'),
      dropdown: [
        { name: t('nav.serviceMaintenance'), path: '/service' },
        { name: t('nav.parts'), path: '/parts' },
        { name: t('nav.products'), path: '/products' },
        { name: t('nav.orderTracking'), path: '/order-tracking' },
      ]
    },

  ];

  // Background and text color logic
  const isWhiteNav = isScrolled ? !isDarkPage : (!isHomePage && !isDarkPage);
  const isBlackNav = isDarkPage;

  return (
    <>
      <nav className={clsx(
      "fixed w-full transition-all duration-300 border-b",
      isOpen ? "z-[100]" : "z-50",
      isBlackNav ? (isScrolled ? "bg-black/90 backdrop-blur-md border-zinc-800 shadow-lg" : "bg-black border-zinc-900") : (
        isScrolled ? "bg-white border-zinc-200 shadow-sm" : (
          isHomePage ? "bg-transparent border-transparent" : "bg-white border-zinc-200 shadow-sm"
        )
      ),
      isScrolled ? "py-3 md:py-3" : "py-3 md:py-5"
    )}>
      <div className="container-custom relative flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Toyota Top Motors"
                className={clsx(
                  "transition-all duration-300 w-auto",
                  isScrolled ? "h-10 md:h-14" : "h-10 md:h-20",
                  (!isWhiteNav || isBlackNav) ? "brightness-0 invert" : ""
                )}
              />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {link.path ? (
                <Link
                  to={link.path}
                  className={clsx(
                    "font-medium text-sm uppercase tracking-widest hover:text-toyota-red transition-colors flex items-center gap-1",
                    isWhiteNav ? "text-toyota-black" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  className={clsx(
                    "font-medium text-sm uppercase tracking-widest hover:text-toyota-red transition-colors flex items-center gap-1",
                    isWhiteNav ? "text-toyota-black" : "text-white"
                  )}
                >
                  {link.name}
                  <ChevronDown size={14} className={clsx("transition-transform", activeDropdown === link.name && "rotate-180")} />
                </button>
              )}

              {/* Dropdown Menu */}
              <AnimatePresence>
                {link.dropdown && activeDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={clsx(
                      "absolute top-full left-0 w-56 shadow-2xl border mt-2 py-4",
                      isBlackNav ? "bg-black border-zinc-800" : "bg-white border-zinc-100"
                    )}
                  >
                    {link.dropdown.map((item) => (
                      item.isExternal ? (
                        <a
                          key={item.name}
                          href={item.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={clsx(
                            "block px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                            isBlackNav ? "text-white hover:bg-zinc-900 hover:text-toyota-red" : "text-toyota-black hover:bg-zinc-50 hover:text-toyota-red"
                          )}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={clsx(
                            "block px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all",
                            isBlackNav ? "text-white hover:bg-zinc-900 hover:text-toyota-red" : "text-toyota-black hover:bg-zinc-50 hover:text-toyota-red"
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Action Icons */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link to="/booking" className={clsx(
            "flex items-center space-x-2 px-6 py-2.5 rounded-none font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-toyota-red/10",
            isWhiteNav
              ? "bg-toyota-red text-white hover:bg-toyota-black"
              : "bg-toyota-red text-white hover:bg-white hover:text-toyota-black"
          )}>
            <Phone size={14} strokeWidth={3} />
            <span>{t('nav.orderButton')}</span>
          </Link>
        </div>

        {/* Mobile Action Icons */}
        <div className="lg:hidden flex items-center space-x-2">
          {/* Mobile Visualizer Link */}
          <a
            href="https://topmotors.kt.mn/try"
            target="_blank"
            rel="noopener noreferrer"
            className={clsx("p-2 flex flex-col items-center gap-0.5", isWhiteNav ? "text-toyota-black" : "text-white")}
          >
            <WheelIcon className="w-6 h-6 animate-spin-slow" />
            <span className="text-[7px] font-black uppercase tracking-tight">Build</span>
          </a>

          {/* Mobile Calculator Link */}
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-calculator'));
            }}
            className={clsx("p-2 flex flex-col items-center gap-0.5", isWhiteNav ? "text-toyota-black" : "text-white")}
          >
            <Calculator size={24} />
            <span className="text-[7px] font-black uppercase tracking-tight">Calculator</span>
          </button>
        </div>
      </div>

      </nav>

      {/* Mobile Menu Overlay - Moved outside <nav> */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[200] lg:hidden overflow-y-auto"
          >
            {/* Close Button Inside Overlay */}
            <button
              onClick={() => setIsOpen(false)}
              className="fixed top-7 right-6 text-toyota-black p-2 z-[210] bg-white/90 backdrop-blur-sm rounded-full hover:text-toyota-red transition-colors"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col h-full pt-28 pb-10 px-6">
              <div className="flex flex-col space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/"
                    className="flex items-center gap-3 text-3xl font-black uppercase tracking-tighter text-toyota-black"
                    onClick={() => setIsOpen(false)}
                  >
                    <HomeIcon size={28} className="text-toyota-red" />
                    <span>{t('nav.home')}</span>
                  </Link>
                </motion.div>

                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    className="flex flex-col space-y-3"
                  >
                    {link.path ? (
                      <Link
                        to={link.path}
                        className="text-3xl font-black uppercase tracking-tighter text-toyota-black"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <>
                        <span className="text-3xl font-black uppercase tracking-tighter text-toyota-black">{link.name}</span>
                        <div className="flex flex-col space-y-3 pl-4 border-l-2 border-toyota-red/20">
                          {link.dropdown.map((item) => (
                            item.isExternal ? (
                              <a
                                key={item.name}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-toyota-black hover:bg-zinc-50 hover:text-toyota-red transition-all"
                                onClick={() => setIsOpen(false)}
                              >
                                {item.name}
                              </a>
                            ) : (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-toyota-black hover:bg-zinc-50 hover:text-toyota-red transition-all"
                                onClick={() => setIsOpen(false)}
                              >
                                {item.name}
                              </Link>
                            )
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 space-y-4"
              >
                <Link
                  to="/booking"
                  className="flex items-center justify-center gap-3 w-full bg-toyota-red text-white py-5 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-red-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  <Phone size={16} />
                  <span>{t('nav.orderButton')}</span>
                </Link>

              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar - Moved outside the main <nav> for better positioning */}
      {!isOpen && (
        <div className={clsx(
        "lg:hidden fixed bottom-0 left-0 right-0 z-[60] px-6 py-3 flex justify-between items-center transition-all duration-300",
        isBlackNav
          ? "bg-black/90 backdrop-blur-md border-t border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
          : "bg-white border-t border-zinc-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      )}>
        <Link to="/" className={clsx(
          "flex flex-col items-center gap-1",
          location.pathname === '/' ? "text-toyota-red" : (isBlackNav ? "text-zinc-500" : "text-zinc-400")
        )}>
          <HomeIcon size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest">{t('nav.homeShort')}</span>
        </Link>
        <Link to="/vehicles" className={clsx(
          "flex flex-col items-center gap-1",
          location.pathname === '/vehicles' ? "text-toyota-red" : (isBlackNav ? "text-zinc-500" : "text-zinc-400")
        )}>
          <Car size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest">{t('nav.vehiclesShort')}</span>
        </Link>
        <Link to="/contact" className={clsx(
          "flex flex-col items-center gap-1",
          location.pathname === '/contact' ? "text-toyota-red" : (isBlackNav ? "text-zinc-500" : "text-zinc-400")
        )}>
          <MapPin size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest">{t('nav.locationShort')}</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className={clsx(
            "flex flex-col items-center gap-1",
            isOpen ? "text-toyota-red" : (isBlackNav ? "text-zinc-500" : "text-zinc-400")
          )}
        >
          <Menu size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest">{t('nav.menu')}</span>
        </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
