// Home.jsx

import Hero from './homepage/Hero';
import Mission from './homepage/Mission';
import Pipe from './homepage/Pipe';
import Services from './homepage/Services';
import Crew from './homepage/Crew';
import About from './homepage/About';
import Contact from './homepage/Contact';
import { useEffect } from 'react';


//Complete Home Page
export default function Home() {

    // Track Site Visit
    useEffect(() => {
    fetch("https://sogas-backend.onrender.com/api/site_visits", { method: "POST" });
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