"use client"

import { useState } from 'react';
import { DayPicker, DayPickerProps } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// Define colors with Tailwind CSS classes
const colors: { [key: string]: string } = {
  red: 'bg-red-500 text-white',
  orange: 'bg-orange-500 text-white',
  green: 'bg-green-500 text-white',
};

// Define types for state
interface DateColors {
  [key: string]: string;
}

export default function trying() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [color, setColor] = useState<string>('red');
  const [colorPickerVisible, setColorPickerVisible] = useState<boolean>(false);
  const [dateColors, setDateColors] = useState<DateColors>({});

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setColorPickerVisible(true);
  };

  // Handle color selection
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColor = e.target.value;
    if (selectedDate) {
      setDateColors(prev => ({
        ...prev,
        [selectedDate.toDateString()]: colors[selectedColor],
      }));
    }
    setColor(selectedColor);
    setColorPickerVisible(false);
  };

  // Get the class name for a specific date
  const getClassNameForDate = (date: Date): string => {
    const colorClass = dateColors[date.toDateString()];
    return colorClass ? `${colorClass} rounded-full` : '';
  };

  return (
    <div className="relative">
      <DayPicker
        modifiers={{ colored: Object.keys(dateColors).map(dateStr => new Date(dateStr)) }}
        modifiersClassNames={{
          colored: (date: Date) => getClassNameForDate(date),
        } as unknown as Record<string, string>} // Type assertion to bypass type issue
        onDayClick={handleDateClick}
      />

      {/* Color Picker Dropdown */}
      {colorPickerVisible && selectedDate && (
        <div
          className="absolute z-10 bg-white border border-gray-300 shadow-lg rounded-lg p-2"
          style={{
            top: 'calc(100% + 0.5rem)', // Adjust positioning as needed
            left: '50%', // Centered horizontally relative to calendar
            transform: 'translateX(-50%)', // Center horizontally
          }}
        >
          <label htmlFor="color-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select a color:
          </label>
          <select
            id="color-select"
            value={color}
            onChange={handleColorChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="green">Green</option>
          </select>
        </div>
      )}
    </div>
  );
}

