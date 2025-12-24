import React from 'react';

interface MultiSelectProps {
  label: string;
  value: string[];
  onChange: (selected: string[]) => void;
  options: string[];
  error?: string;
  required?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
}) => {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="border-2 border-yellow-400 rounded-2xl p-3 max-h-40 overflow-y-auto">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleToggle(option)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                value.includes(option)
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      {value.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {value.join(', ')}
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelect;