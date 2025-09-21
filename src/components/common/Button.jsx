import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  className = '',
  ...props 
}) => {
  const getButtonStyles = () => {
    const baseStyles = {
      padding: size === 'large' ? '1rem 2rem' : size === 'small' ? '0.5rem 1rem' : '0.75rem 1.5rem',
      fontSize: size === 'large' ? '1.1rem' : size === 'small' ? '0.9rem' : '1rem',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
      minWidth: size === 'large' ? '200px' : 'auto',
      opacity: disabled ? 0.6 : 1,
      transform: disabled ? 'none' : 'scale(1)',
    };

    const variantStyles = {
      primary: {
        background: 'linear-gradient(45deg, #4CAF50, #45a049)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.9)',
        color: '#333',
        boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
      },
      emergency: {
        background: 'linear-gradient(45deg, #f44336, #d32f2f)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)',
      },
      outline: {
        background: 'transparent',
        color: 'white',
        border: '2px solid white',
        boxShadow: 'none',
      }
    };

    const hoverStyles = !disabled ? {
      ':hover': {
        transform: 'translateY(-2px)',
        boxShadow: variant === 'primary' 
          ? '0 6px 20px rgba(76, 175, 80, 0.4)'
          : variant === 'emergency'
          ? '0 6px 20px rgba(244, 67, 54, 0.4)'
          : '0 6px 20px rgba(255, 255, 255, 0.4)'
      }
    } : {};

    return { ...baseStyles, ...variantStyles[variant] };
  };

  const buttonStyles = getButtonStyles();

  return (
    <button
      className={`custom-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyles}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          if (variant === 'primary') {
            e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
          } else if (variant === 'emergency') {
            e.target.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.4)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          if (variant === 'primary') {
            e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
          } else if (variant === 'emergency') {
            e.target.style.boxShadow = '0 4px 15px rgba(244, 67, 54, 0.3)';
          }
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;