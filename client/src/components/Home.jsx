//Import Hero Section
import Hero from './homepage/Hero'
//Imoort Mission Section
import Mission from './homepage/Mission'
//Import Pipeline Section
import Pipe from './homepage/Pipe'
//Import Services Section
import Services from './homepage/Services'
//Import Crew Section
import Crew from './homepage/Crew'
//Import About Section
import About from './homepage/About'
//Import Contact Section
import Contact from './homepage/Contact'

import { useEffect } from 'react'


//Complete Home Page
export default function Home() {

    // Track Site Visit
    useEffect(() => {
    fetch("http://localhost:3000/api/site_visits", { method: "POST" });
    }, []);

    return (
        <>
            
            <Hero />
            <Mission />
            <Pipe />
            <Services />
            <Crew />
            <About />
            <Contact />
               
        </>

    );
}