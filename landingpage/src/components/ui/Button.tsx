import React from "react";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text" | "dark";
  size?: "sm" | "md" | "lg";
  type?: "submit" | "reset" | "button" | undefined;
  target?: string;
  href?: string;
  onClick?: () => void;
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  href,
  target,
  onClick,
  fullWidth = false,
  className = "",
}) => {
  const baseStyles = `inline-flex items-center justify-center font-medium transition-all duration-200 ${
    !className.includes("rounded") ? "rounded-xl" : ""
  }`;

  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow",
    secondary: "bg-indigo-100 hover:bg-indigo-200 text-indigo-700",
    dark: "bg-gray-900 text-white",
    outline:
      "border border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600",
    text: "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50",
  };

  const sizeStyles = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-6 py-3",
  };

  const fullWidthStyle = fullWidth ? "w-full" : "";

  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidthStyle} ${className}`;

  if (href) {
    return (
      <Link href={href} target={target || "_self"} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses} type={type}>
      {children}
    </button>
  );
};

export default Button;
