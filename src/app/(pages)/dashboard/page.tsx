"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import getCourses from "@/components/getCourses"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MagicCard } from "@/components/magicui/magic-card";
// import NumberTicker from "@/components/magicui/number-ticker";   
import BoxReveal from "@/components/magicui/box-reveal";
import SparklesText from "@/components/magicui/sparkles-text"
import Meteors from "@/components/magicui/meteors"
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import Router from "next/router"
interface Course {
  id: number;
  title: string;
  percentage: number | null;
  published: boolean;
  authorId: string | null;
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const formRef = useRef<HTMLFormElement>(null)
  const { user, isLoaded } = useUser();

  const fetchCourses = useCallback(async () => {
    if (!isLoaded || !user) return;
    
    try {
      const coursesData = await getCourses(user.id);
      setCourses(coursesData);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, isLoaded])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const deletionOnClickHandler = async () => {
    if (!selectedCourseId) return;
  
    try {
      const response = await fetch(`/api/course/${selectedCourseId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to delete course');
      
      // Update the courses state to remove the deleted course
      setCourses(prevCourses => prevCourses.filter(course => course.id !== selectedCourseId));
      
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    } catch (error) {
      console.error('Failed to delete course:', error);
      setError('Failed to delete course');
    } finally {
      setIsConfirmingDelete(false);
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current) return;

    const formData = new FormData(formRef.current)
    const title = formData.get('title') as string
    // const authorId = formData.get('authorId') as string

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }), 
      })

      if (!response.ok) {
        throw new Error('Failed to create course')
      }

      const newCourse = await response.json()
      setCourses(prevCourses => [...prevCourses, newCourse])
      formRef.current.reset() // Clear the form
      setError('') // Clear any previous errors
    } catch (err) {
      console.error('Failed to create course:', err)
      setError('Failed to create course')
    }
  }
  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your dashboard.</div>;
  }
  if (isLoading) return (<div>
    <Meteors number={30} /> 
                    
                    </div>
    )
  if (error) return <div>Error: {error}</div>

  return (
    
    <div className="container mx-auto p-4">
      <SparklesText text="Courses" className="mb-10 text-zinc-800 "/>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {courses.map(course => (
          <ContextMenu key={course.id}>
            <ContextMenuTrigger asChild>
              <Link href={`/courses/${course.id}`} passHref>
                <MagicCard
                  className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-xl text-zinc-800"
                  gradientColor={"#D9D9D955"}
                >
                  <BoxReveal boxColor={"#000000"} duration={0.5}>
                    <div className="flex m-5 justify-stretch">
                      <div className="mr-5 font-bold">{course.title}</div>
                      {Number(course.percentage)}
                      <span>%</span>
                    </div>
                  </BoxReveal>
                </MagicCard>
              </Link>
            </ContextMenuTrigger>
            <ContextMenuContent>
            <ContextMenuItem onClick={() => {
            setSelectedCourseId(course.id);
            setIsConfirmingDelete(true);
            }}>Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
      
      <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new Course</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" >
        <DialogHeader>
          <DialogTitle>Add new course</DialogTitle>
          <DialogDescription>
            you can add new courses here for your need 
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="flex mb-5">
            <div className="font-bold pr-9 pt-2" >
              Course
            </div>
            <Input name="title" type="text" placeholder="Course Title" required />
          </div>
          <div className="flex justify-center pt-5">
            <Button type="submit" className="">Create</Button>
          </div>
        </form>
        </div>
        <DialogFooter>
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this course? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>Cancel</Button>
      <Button variant="destructive" onClick={deletionOnClickHandler}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{showMessage && (
  <div className="fixed bottom-5 right-5 bg-green-500 text-white p-2 rounded">
    Course deleted successfully!
  </div>
)}
    </div>
  )
}