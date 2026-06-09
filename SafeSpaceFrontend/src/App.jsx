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

import AddClient from "./pages/AddClient";
import DisplayClients from "./pages/DisplayClients";
import EditClient from "./pages/EditClient";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;