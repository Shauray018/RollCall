// src/app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import getCourses from "@/components/getCourses"
import postCourse from "@/components/postCourse"
import Link from "next/link"
export default function Dashboard() { 
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [showMessage, setShowMessage] = useState(false)

    async function fetchCourses() {
        try {
            const coursesData = await getCourses()
            //@ts-ignore
            setCourses(coursesData)
        } catch (err) {
            setError('Failed to fetch courses')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])
//@ts-ignore
    async function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        try {
            await postCourse(formData)
            fetchCourses() // Refresh the course list
            event.target.reset() // Clear the form
        } catch (err) {
            console.error('Failed to post course:', err)
            //@ts-ignore
            setError(err.message || 'Failed to create course')
        }
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return ( 
        <div> 
            <h1>Courses</h1>
            <div>
                {courses.map(course => (
                    //@ts-ignore
                    <div key={course.id}>
                        {/* @ts-ignore */}
                        <Link href={`/courses/${course.id}`}>{course.title}</Link>
                         {/* @ts-ignore */}
                        <p>Author: {course.author?.name || 'Unknown'}</p>
                         {/* @ts-ignore */}
                        <p>Percentage: {course.percentage || 'N/A'}</p>
                    </div>
                ))}
            </div>
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit}>
                <input name="title" type="text" placeholder="Course Title" required />
                <input name="percentage" type="number" placeholder="Percentage" required />
                <input name="authorId" type="text" placeholder="Author ID" required />
                <button type="submit">Add Course</button>
            </form>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <button onClick={() => setShowMessage(true)}>Click</button>
            <div>{showMessage ? "Data message" : ""}</div>
        </div>
    )
}