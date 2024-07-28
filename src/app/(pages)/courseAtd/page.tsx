"use client"
import prisma from "../../../../lib/prisma";
import { useState } from "react"

export default async function CourseAtd() { 
    const [presentCount, setPresentCount] = useState(0); 
    const [absentCount, setAbsentCount] = useState(0); 
    // const totalClasses = presentCount + absentCount;
    const updateUser = await prisma.course.update({
        where: {
          id: "clz450tc80001se59ablsvxdp",
        },
        data: {
          percentage: 90,
        },
      })
    return ( 
        <div> 
            <div className="flex">
                <button onClick={() => { 
                    setPresentCount(presentCount+1) 
                }}>Present</button>
                <button onClick={() => { 
                    setAbsentCount(absentCount + 1 )
                }}>Absent</button>
            </div>
            <div>
                {presentCount/(presentCount + absentCount)}
            </div>
            <button onClick={() => {updateUser}}>checkingSomethings</button>
            

        </div>
    )
}