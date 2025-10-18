import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  name?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id, name }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
    </label>
  );
};

export default ToggleSwitch;