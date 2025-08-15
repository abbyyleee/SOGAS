//Import Hero Section
import Hero from './homepage/Hero'
//Imoort Mission Section
import Mission from './homepage/Mission'
//Import Services Section
import Services from './homepage/Services'
//Import Crew Section
import Crew from './homepage/Crew'
//Import About Section
import About from './homepage/About'
//Import Contact Section
import Contact from './homepage/Contact'

//Complete Home Page
export default function Home() {
    return (
        <>
            
            <Hero />
            <Mission />
            <Services />
            <Crew />
            <About />
            <Contact />
               
        </>

    );
}