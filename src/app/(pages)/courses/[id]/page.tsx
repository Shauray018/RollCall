"use client"

import { useState, useEffect, useCallback } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import AnimatedCircularProgressBar from "@/components/magicui/animated-circular-progress-bar";
import DotPattern from "@/components/magicui/dot-pattern";
import classNames from 'classnames';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useParams } from 'next/navigation';
import BlurIn from '@/components/magicui/blur-in';
import Link from 'next/link';
import { UpdatePercentage } from '@/app/helpers/UpdatePercentage';
import Meteors from '@/components/magicui/meteors';

interface DateEntry {
  id: number;
  date: number;
  month: number;
  year: number;
  color: string;
  courseId: number;
}

interface Course {
  id: number;
  title: string;
  author: string;
  percentage: number;
  authorId: string;
}

async function fetchDates(courseId: string): Promise<DateEntry[]> {
  const response = await fetch(`/api/dates?courseId=${courseId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch dates');
  }
  const data = await response.json();
  return data.success ? data.dates : [];
}

async function getCourseName(id: string): Promise<Course> {
  const response = await fetch(`/api/course/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }
  return response.json();
}

async function updateDateColor(dateEntry: DateEntry): Promise<{ success: boolean }> {
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
  const [course, setCourse] = useState<Course | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const courseId = params.id as string;

  const fetchCourseData = useCallback(async () => {
    try {
      const [courseData, datesData] = await Promise.all([
        getCourseName(courseId),
        fetchDates(courseId)
      ]);
      console.log('Fetched course data:', courseData);
      console.log('Fetched dates data:', datesData);

      if (courseData && Array.isArray(datesData)) {
        setCourse(courseData);
        setDates(datesData);
      } else {
        throw new Error('Invalid data received');
      }
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setIsInitialLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const calculatePercentage = useCallback(() => {
    const presentCount = dates.filter(d => d.color === 'green').length;
    const absentCount = dates.filter(d => d.color === 'red').length;
    const total = presentCount + absentCount;
    return total === 0 ? 0 : (presentCount / total) * 100;
  }, [dates]);

  useEffect(() => {
    if (course && !isInitialLoading) {
      const newPercentage = calculatePercentage();
      console.log('Calculated new percentage:', newPercentage);
      console.log('Current course percentage:', course.percentage);

      if (Math.abs(course.percentage - newPercentage) > 0.1) {
        setIsUpdating(true);
        UpdatePercentage(courseId, newPercentage)
          .then(() => {
            setCourse(prevCourse => ({
              ...prevCourse!,
              percentage: newPercentage
            }));
            console.log('Updated course percentage:', newPercentage);
          })
          .catch(error => {
            console.error('Error updating percentage:', error);
            setError('Failed to update course percentage');
          })
          .finally(() => {
            setIsUpdating(false);
          });
      }
    }
  }, [course, dates, courseId, isInitialLoading, calculatePercentage]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDropdownVisible(true);
  };

  const handleColorSelection = async (color: string) => {
    if (selectedDate) {
      const dateEntry: DateEntry = {
        id: 0, // The id is auto-generated or will be updated by the backend
        date: selectedDate.getDate(),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
        courseId: Number(courseId),
        color,
      };

      try {
        setIsUpdating(true);
        const result = await updateDateColor(dateEntry);
        if (result.success) {
          setDates(prevDates => {
            const updatedDates = [
              ...prevDates.filter(d => 
                d.date !== dateEntry.date || 
                d.month !== dateEntry.month || 
                d.year !== dateEntry.year
              ),
              dateEntry
            ];
            console.log('Updated dates:', updatedDates);
            return updatedDates;
          });
        } else {
          throw new Error("Failed to update date color");
        }
      } catch (error) {
        console.error("Error updating date color:", error);
        setError("Failed to update date status");
      } finally {
        setDropdownVisible(false);
        setIsUpdating(false);
      }
    }
  };

  if (isInitialLoading) return <div> <Meteors number={30} /></div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>No course data available</div>;

  return (
    <div className='flex justify-center items-center flex-col gap-8 mt-7  '>
      <BlurIn word={course.title} className=" font-bold text-zinc-900 dark:text-white" />
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={classNames("[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]")}
      />
      <div className='flex justify-center flex-row gap-10 items-center sm:flex-row-1'>
        <div className='flex justify-center flex-col items-center sm:flex-col-1'>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
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
        <AnimatedCircularProgressBar
          max={100}
          min={0}
          value={Math.round(course.percentage)}
          gaugePrimaryColor="rgb(24 24 27)"
          gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
        />
      </div>
      <Link href="/dashboard">
        <Button>Go Back</Button>
      </Link>
    </div>
  );
}
