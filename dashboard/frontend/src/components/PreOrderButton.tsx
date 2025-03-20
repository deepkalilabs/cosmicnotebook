import { Button } from "@/components/ui/button";

interface PreOrderButtonProps {
  className?: string;
  variant?: 'default' | 'highlight' | 'outline';
  size?: 'default' | 'lg';
}

export default function PreOrderButton({ 
  className = "", 
  variant = "default",
  size = "default"
}: PreOrderButtonProps) {
  const baseStyles = "bg-indigo-600 hover:bg-indigo-700 text-white";
  
  const variantStyles = {
    default: baseStyles,
    highlight: "bg-indigo-600 hover:bg-indigo-700 text-white",
    outline: "bg-gray-100 hover:bg-gray-200 text-gray-800"
  };

  const sizeStyles = {
    default: "px-6 py-3",
    lg: "px-8 py-6"
  };

  return (
    <Button 
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      asChild
    >
      <a href="https://buy.stripe.com/8wM9BifBC5PGbqUaEE">Pre-order</a>
    </Button>
  );
} 