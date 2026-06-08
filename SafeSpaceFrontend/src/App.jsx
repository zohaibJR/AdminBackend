import Navbar from './components/Navbar/navbar'
import TherapyHeroSection from './components/Hero/TherapyHeroSection'
import ConcernsYouAreComingWithSection from './components/YourConcerns/Concerns'
import YourHelp from './components/Yourhelp/YourHelp'
import MeetTherapist from './components/OurTherapist/MeetTherapist'
import ClientReviews from './components/clientReviews/ClientReviews'
import BeforeStep from './components/BeforeSteps/BeforeStep'
import HealingBanner from './components/HealingBanner/HealingBanner'
import Footer from './components/Footer/Footer'
import './App.css'


function App() {
  return (
    <div className="app">
      <Navbar/>
      <main className="app__main">
        <TherapyHeroSection/>
        <ConcernsYouAreComingWithSection/>
        <YourHelp/>
        <MeetTherapist/>
        <ClientReviews/>
        <BeforeStep/>
        <HealingBanner/>
        <Footer/>
      </main>
    </div>
  )
}

export default App
