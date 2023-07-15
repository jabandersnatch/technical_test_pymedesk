/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/no-unstable-nested-components */

'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';

function HeaderNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(pathname);

  useEffect(() => {
    if (pathname === '/') {
      setActiveLink('home');
    } else {
      setActiveLink(pathname.replace('/', ''));
    }
  }, [pathname]);

  function MobileNav() {
    return (
      <div className="block lg:hidden">
        <button
          className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-white hover:border-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
        >
          <FaBars />
        </button>
        {isMenuOpen && (
        <div className="mt-2">
          <div className="bg-gray-800 rounded-lg py-2">
            <Link
              href="/"
              className={`block text-gray-300 ${
                activeLink === 'home' && 'font-bold'
              } hover:text-blue-600 mb-2`}
              onClick={() => setActiveLink('home')}
            >
              Home
            </Link>
            <Link
              href="/pedidos"
              className={`block text-gray-300 ${
                activeLink === 'pedidos' && 'font-bold'
              } hover:text-blue-600 mb-2`}
              onClick={() => setActiveLink('pedidos')}
            >
              Pedidos
            </Link>
            <Link
              href="/productos"
              className={`block text-gray-300 ${
                activeLink === 'productos' && 'font-bold'
              } hover:text-blue-600 mb-2`}
              onClick={() => setActiveLink('productos')}
            >
              Productos
            </Link>
            <Link
              href="/usuarios"
              className={`block text-gray-300 ${
                activeLink === 'usuarios' && 'font-bold'
              } hover:text-blue-600 mb-2`}
              onClick={() => setActiveLink('usuarios')}
            >
              Usuarios
            </Link>
          </div>
        </div>
        )}
      </div>
    );
  }

  function DesktopNav() {
    return (
      <div className="text-sm lg:flex-grow lg:text-right hidden lg:block">
        <Link
          href="/"
          className={`text-gray-300 ${activeLink === 'home' && 'font-bold'} hover:text-blue-600 mr-4`}
          onClick={() => setActiveLink('home')}
        >
          Home
        </Link>
        <Link
          href="/pedidos"
          className={`text-gray-300 ${activeLink === 'pedidos' && 'font-bold'} hover:text-blue-600 mr-4`}
          onClick={() => setActiveLink('pedidos')}
        >
          Pedidos
        </Link>
        <Link
          href="/productos"
          className={`text-gray-300 ${activeLink === 'productos' && 'font-bold'} hover:text-blue-600 mr-4`}
          onClick={() => setActiveLink('productos')}
        >
          Productos
        </Link>
        <Link
          href="/usuarios"
          className={`text-gray-300 ${activeLink === 'usuarios' && 'font-bold'} hover:text-blue-600 mr-4`}
          onClick={() => setActiveLink('usuarios')}
        >
          Usuarios
        </Link>
      </div>
    );
  }

  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link
          href="/"
          className={`font-semibold text-xl tracking-tight ${activeLink === 'home' && 'font-bold'} hover:text-blue-600 mr-4`}
          onClick={() => setActiveLink('home')}
        >
          <span className="font-bold">
            Pyme
            <b className="text-blue-600">Desk</b>
          </span>
        </Link>
      </div>
      <MobileNav />
      <DesktopNav />
    </nav>
  );
}

export default HeaderNav;
