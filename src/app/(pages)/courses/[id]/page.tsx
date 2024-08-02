"use client"

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import exp from 'constants';

interface DateEntry {
  id: number;
  date: number;
  month: number;
  year: number;
  color: string;
}

async function fetchDates(): Promise<DateEntry[]> {
  const response = await fetch(`/api/dates`);
  if (!response.ok) {
    throw new Error('Failed to fetch dates');
  }
  const data = await response.json();
  console.log("Fetched dates:", data); // Log fetched data
  return data;
}

async function fetchCounts() {
  try {
    // Fetch the data from the API
    const response = await fetch('/api/dateCounts');

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Failed to fetch counts');
    }

    // Parse the JSON data from the response
    const data = await response.json();

    // Check if the response indicates success
    if (data.success) {
      const { greenCount, redCount } = data;
      return { greenCount, redCount };
    } else {
      throw new Error(data.error || 'Unknown error occurred');
    }
  } catch (error) {
    console.error('Error fetching counts:', error);
    return { greenCount: 0, redCount: 0 }; // Return default values in case of an error
  }
}


async function updateDateColor(dateEntry: DateEntry) {
  const response = await fetch(`/api/updateDateColor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dateEntry),
  });
  return response.json();
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dates, setDates] = useState<DateEntry[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [presentCount, setPresentCount] = useState(0); 
  const [absentCount, setAbsentCount] = useState(0); 

  useEffect(() => {
    fetchDates()
      .then(data => {
        if (Array.isArray(data)) {
          setDates(data);
        } else {
          console.error("Expected array, received:", data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetchCounts().then(({ greenCount, redCount }) => {
      console.log(`Green Count: ${greenCount}`);
      console.log(`Red Count: ${redCount}`);
      setPresentCount(greenCount); 
      setAbsentCount(redCount); 
    });
  }, []);
  

  function handleDayClick(date: Date) {
    setSelectedDate(date);
    setDropdownVisible(true);
  }
  const handleSelect = (newSelected : any) => {
    // Update the selected dates
    setSelectedDate(newSelected);
  };
  function getPercentage() { 
    const percentagething = (presentCount/(presentCount+absentCount))*100; 
    return  percentagething; 
  }

  function handleColorSelection(color: string) {
    if (selectedDate) {
      const dateEntry: DateEntry = {
        id: 0, // Assume this is auto-incremented in the database
        date: selectedDate.getDate(),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
        color,
      };
      setDates(prev => [...prev, dateEntry]);
      setDropdownVisible(false);
      updateDateColor(dateEntry).then((data) => {
        if (data.success) {
          console.log("Date color is updated");
        } else {
          console.error("this is messed up", data);
        }
      });
    }
  }
  


  

  console.log("Dates state:", dates); // Log the dates state

  return (
    <div>
      <h1>Attendance Calendar</h1>
      <div> {getPercentage()}%</div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        onDayClick={handleDayClick}
        modifiers={{
          present: dates.filter(d => d.color === 'green').map(d => new Date(d.year, d.month, d.date)),
          absent: dates.filter(d => d.color === 'red').map(d => new Date(d.year, d.month, d.date)),
        }}
        modifiersClassNames={{
          present: "bg-green-500",
          absent: "bg-red-500",
        }}
      />
      {dropdownVisible && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Select Status</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem onClick={() => handleColorSelection('green')} value="present">
                Present
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem onClick={() => handleColorSelection('red')} value="absent">
                Absent
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

