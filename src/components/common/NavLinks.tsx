import React from 'react';

interface NavLinksProps {
  mobile?: boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({ mobile = false }) => {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/collections', label: 'Collections' },
    { href: '/artists', label: 'Artists' },
    { href: '/stats', label: 'Stats' },
  ];

  return (
    <div className={mobile ? 'flex flex-col space-y-4' : 'hidden md:flex items-center space-x-8'}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-white/70 hover:text-white font-medium transition-colors relative group"
        >
          {link.label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
        </a>
      ))}
    </div>
  );
};
