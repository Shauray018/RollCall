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

interface Course {
  id: number;
  title: string;
  percentage: number | null;
  published: boolean;
  authorId: string | null;
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const fetchCourses = useCallback(async () => {
    try {
      const coursesData = await getCourses("1"); // Replace "1" with the actual author ID or obtain it dynamically
      setCourses(coursesData);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current) return;

    const formData = new FormData(formRef.current)
    const title = formData.get('title') as string
    const authorId = formData.get('authorId') as string

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, authorId }),
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
            <Link href={`/courses/${course.id}`} key={course.id} >
            
            <MagicCard
            
            className="cursor-pointer flex-col items-center justify-center shadow-2xl whitespace-nowrap text-xl text-zinc-800"
            
            gradientColor={"#D9D9D955"}
          >
            <BoxReveal boxColor={"#000000"} duration={0.5}>
            <div className="flex m-5 justify-stretch">
              <div className="mr-5 font-bold">{course.title}</div>
              {Number(course.percentage) }
              <span>%</span>
            </div>
            </BoxReveal>
          </MagicCard>
         
          </Link>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input name="title" type="text" placeholder="Course Title" required />
        <input name="authorId" type="text" placeholder="Author ID" required />
        <Button type="submit">Add Course</Button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Button onClick={() => setShowMessage(prev => !prev)} className="mt-4">
        {showMessage ? 'Hide Message' : 'Show Message'}
      </Button>
      {showMessage && <div className="mt-2">Data message</div>}
    </div>
  )
}