"use client";

import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from 'lucide-react';

async function updateAttendance(id: string, percentage: number) {
  const response = await fetch(`/api/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, percentage }),
  });
  return response.json();
}

async function fetchCourse(id: string) {
  const response = await fetch(`/api/course/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }
  return response.json();
}



export default function CoursePage({ params }: { params: { id: string } }) {
  const [attendance, setAttendance] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [visi,setVisi] = useState(false);
  function handleClick() { 
    setVisi(true)
  }

  useEffect(() => {
    fetchCourse(params.id)
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  function handleSubmit() {
    const newAttendance = Number(inputValue);
    setAttendance(newAttendance);
    updateAttendance(params.id, newAttendance).then((data) => {
      if (data.success) {
        console.log("Attendance is updated");
      } else {
        console.error("Error updating attendance");
      }
    });
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>No course found</div>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>Percentage: {course.percentage}%</p>
      <p>Author: {course.author?.name || 'Unknown'}</p>
      <p>Published: {course.published ? 'Yes' : 'No'}</p>
      <input
        placeholder="Enter percentage"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSubmit}>Change Percentage</button>
      <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      onDayClick={handleClick}
      defaultMonth={bookedDays[0]}
      modifiers={{
        booked: bookedDays 
      }}
       modifiersClassNames={{
        booked: "my-booked-class"
      }}
      />
      {visi? <div>
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem> 
      </DropdownMenuContent>
    </DropdownMenu>
      </div> :<div>nothing</div>}
    </div>
  );
}

const bookedDays = [
  new Date(2021, 5, 8),
  new Date(2021, 5, 9),
  new Date(2021, 5, 11)
];
// export function ModifiersWithClassnames() {
//   return (
//     <DayPicker
//       defaultMonth={bookedDays[0]}
      // modifiers={{
      //   booked: bookedDays
      // }}
      // modifiersClassNames={{
      //   booked: "my-booked-class"
      // }}
//     />
//   );
// }
// .my-booked-class {
//   background-color: tomato;
//   color: white;
//   border-radius: 50%;
// }