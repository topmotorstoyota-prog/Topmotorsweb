import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-toyota-red text-white hover:bg-zinc-900 shadow-md active:scale-95",
    secondary: "bg-toyota-black text-white hover:bg-toyota-red shadow-md active:scale-95",
    white: "bg-white text-toyota-black hover:bg-toyota-red hover:text-white active:scale-95",
    outline: "border-2 border-white text-white hover:bg-toyota-red hover:border-toyota-red active:scale-95",
    outlineBlack: "border-2 border-toyota-black text-toyota-black hover:bg-toyota-red hover:border-toyota-red hover:text-white active:scale-95",
    ghost: "text-toyota-black hover:bg-toyota-gray-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
