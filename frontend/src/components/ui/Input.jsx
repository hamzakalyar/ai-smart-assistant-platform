/**
 * Reusable Input Component
 */

const Input = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full px-4 py-2.5 
          border-2 border-gray-200 rounded-lg
          focus:border-primary-500 focus:ring-2 focus:ring-primary-200
          transition-all duration-200
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input;
