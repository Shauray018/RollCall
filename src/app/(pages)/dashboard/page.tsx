"use client"

import { useState } from "react"


export default function dashboard() { 

    const [thing, thisthing] = useState(false)

    return ( 
        <div> 
            <h1>Courses</h1>
            <button onClick={() => {thisthing(true)}}>click</button>
            <div>{thing ? "hrllo" :""}</div>
        
        </div>
    )
}
//isMember ? '$2.00' : '$10.00';