import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/navbar";
import TherapyHeroSection from "./components/Hero/TherapyHeroSection";
import ConcernsYouAreComingWithSection from "./components/YourConcerns/Concerns";
import YourHelp from "./components/Yourhelp/YourHelp";
import MeetTherapist from "./components/OurTherapist/MeetTherapist";
import ClientReviews from "./components/clientReviews/ClientReviews";
import BeforeStep from "./components/BeforeSteps/BeforeStep";
import HealingBanner from "./components/HealingBanner/HealingBanner";
import Footer from "./components/Footer/Footer";

// pages
import AddClient from "./pages/AddClient";
import DisplayClients from "./pages/DisplayClients";
import EditClient from "./pages/EditClient";
import DisplayTherapists from "./pages/DisplayTherapists";
import AddTherapists from "./pages/AddTherapists";
import EditTherapist from "./pages/EditTherapist";

import AddSession from "./pages/AddSession";
import DisplaySessions from "./pages/DisplaySessions";
import EditSession from "./pages/EditSession";


import "./App.css";

function HomePage() {
  return (
    <>
      <Navbar />
      <main className="app__main">
        <TherapyHeroSection />
        <ConcernsYouAreComingWithSection />
        <YourHelp />
        <MeetTherapist />
        <ClientReviews />
        <BeforeStep />
        <HealingBanner />
        <Footer />
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/clients" element={<DisplayClients />} />
        <Route path="/editclient/:id" element={<EditClient />} />

        <Route path="/therapists" element={<DisplayTherapists />} />
        <Route path="/addtherapist" element={<AddTherapists />} />
        <Route path="/edittherapist/:id" element={<EditTherapist />} />

        <Route path="/sessions" element={<DisplaySessions />} />
         <Route path="/addsession" element={<AddSession />} />

         <Route
  path="/editsession/:id"
  element={<EditSession />}
/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;