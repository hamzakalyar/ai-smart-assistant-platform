/**
 * Card Component
 * 
 * Premium card with glassmorphism effect
 */

const Card = ({ children, className = '', hover = false }) => {
    return (
        <div
            className={`
        glass-card p-6 rounded-xl
        ${hover ? 'hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;
