import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/home/logo-1.png';

const Footer = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      // Showroom: 09:00 - 18:00
      setIsOpen(hour >= 9 && hour < 18);
    };

    checkStatus();
    const timer = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="bg-toyota-black text-white border-t border-zinc-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-20 opacity-[0.02] select-none pointer-events-none">
        <span className="text-[140px] font-black tracking-tighter leading-none whitespace-nowrap translate-y-10 translate-x-20 block uppercase">
          Top Motors
        </span>
      </div>

      <div className="container-custom pt-12 pb-24 md:pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* 1. Brand Section */}
          <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Toyota Logo" className="h-8 md:h-10 w-auto brightness-0 invert" />
            </Link>

            <div className="flex gap-6 md:gap-4">
              {[
                { Icon: Facebook, url: 'https://www.facebook.com/ToyotaTopMotors/' },
                { Icon: Instagram, url: 'https://www.instagram.com/toyota.topmotors/?hl=en' },
                { Icon: Youtube, url: 'https://www.youtube.com/@ToyotaTopMotorsOfficial' }
              ].map((item, i) => (
                <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-toyota-red transition-colors">
                  <item.Icon size={20} />
                </a>
              ))}
            </div>

            {/* Desktop Only Status */}
            <div className="hidden md:inline-flex items-center gap-2.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {isOpen ? t('footer.showroomOpen') : t('footer.showroomClosed')}
              </span>
            </div>
          </div>

          {/* 2. Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-0 md:contents">
            <div className="text-center md:text-left">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-toyota-red mb-4 md:mb-6">{t('footer.menuTitle')}</h4>
              <ul className="space-y-3 md:space-y-3.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400">
                <li><Link to="/vehicles" className="hover:text-white transition-colors">{t('nav.vehiclesShort')}</Link></li>
                <li><Link to="/service" className="hover:text-white transition-colors">{t('nav.serviceMaintenance')}</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
                <li className="hidden md:block"><a href="https://careers.mcs.mn/jobs/company:15/pg:2" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('nav.careers')}</a></li>
              </ul>
            </div>

            {/* 4. Contact & Hours (Mobile only moves up) */}
            <div className="text-center md:text-left md:hidden">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-toyota-red mb-4">{t('footer.contactTitle')}</h4>
              <a href="mailto:INFO@TOPMOTORS.MN" className="block text-[11px] font-black text-white hover:text-toyota-red transition-colors mb-2">
                INFO@TOPMOTORS.MN
              </a>
              <a href="tel:77778090" className="block text-[11px] font-black text-white hover:text-toyota-red transition-colors">7777 8090</a>
            </div>
          </div>

          {/* 3. Locations */}
          <div className="hidden md:block pt-8 md:pt-0 border-t border-zinc-900 md:border-0 text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-toyota-red mb-6">{t('footer.branchesTitle')}</h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-black uppercase text-white tracking-tight">{t('footer.branch1Name')}</p>
                <div className="flex items-start justify-center md:justify-start gap-2 text-zinc-400">
                  <MapPin size={14} className="shrink-0 mt-0.5 text-toyota-red hidden md:block" />
                  <p className="text-[11px] font-medium leading-relaxed">{t('footer.branch1Address')}</p>
                </div>
                <a href="tel:77778090" className="inline-flex items-center gap-2 text-xs font-black text-white hover:text-toyota-red transition-colors">
                  <Phone size={12} className="text-toyota-red hidden md:block" /> 7777 8090
                </a>
              </div>

              <div className="hidden md:block space-y-2 pt-4 border-t border-zinc-900">
                <p className="text-xs font-black uppercase text-white tracking-tight">{t('footer.branch2Name')}</p>
                <div className="flex items-start gap-2 text-zinc-400">
                  <MapPin size={14} className="shrink-0 mt-0.5 text-toyota-red" />
                  <p className="text-[11px] font-medium leading-relaxed">{t('footer.branch2Address')}</p>
                </div>
                <a href="tel:77778090" className="inline-flex items-center gap-2 text-xs font-black text-white hover:text-toyota-red transition-colors">
                  <Phone size={12} className="text-toyota-red" /> 7777 8090
                </a>
              </div>
            </div>
          </div>

          {/* 4. Contact & Hours (Desktop Version) */}
          <div className="hidden md:block">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-toyota-red mb-6">{t('footer.contactDesktopTitle')}</h4>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Mail size={14} className="text-toyota-red" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('footer.emailLabel')}</p>
                </div>
                <a href="mailto:INFO@TOPMOTORS.MN" className="block text-sm font-black text-white hover:text-toyota-red transition-colors">
                  INFO@TOPMOTORS.MN
                </a>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-900">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t('footer.hoursTitle')}</p>
                <div className="space-y-2 text-[11px] font-bold">
                  <div className="flex justify-between border-b border-zinc-900/50 pb-1.5 text-zinc-300">
                    <span className="uppercase tracking-tighter">{t('footer.everyday')}</span>
                    <span>09:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex justify-center items-center">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
            © 2026 TOP MOTORS LLC
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
