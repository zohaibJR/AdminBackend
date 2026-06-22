import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public site
import Navbar from "./components/Navbar/navbar";
import TherapyHeroSection from "./components/Hero/TherapyHeroSection";
import ConcernsYouAreComingWithSection from "./components/YourConcerns/Concerns";
import YourHelp from "./components/Yourhelp/YourHelp";
import MeetTherapist from "./components/OurTherapist/MeetTherapist";
import ClientReviews from "./components/clientReviews/ClientReviews";
import BeforeStep from "./components/BeforeSteps/BeforeStep";
import HealingBanner from "./components/HealingBanner/HealingBanner";
import Footer from "./components/Footer/Footer";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import AddClient from "./pages/AddClient";
import DisplayClients from "./pages/DisplayClients";
import EditClient from "./pages/EditClient";
import DisplayTherapists from "./pages/DisplayTherapists";
import AddTherapists from "./pages/AddTherapists";
import EditTherapist from "./pages/EditTherapist";
import AddSession from "./pages/AddSession";
import DisplaySessions from "./pages/DisplaySessions";
import EditSession from "./pages/EditSession";
import Login from "./pages/Login";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <DisplayClients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addclient"
          element={
            <ProtectedRoute>
              <AddClient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editclient/:id"
          element={
            <ProtectedRoute>
              <EditClient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/therapists"
          element={
            <ProtectedRoute>
              <DisplayTherapists />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addtherapist"
          element={
            <ProtectedRoute>
              <AddTherapists />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edittherapist/:id"
          element={
            <ProtectedRoute>
              <EditTherapist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <DisplaySessions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addsession"
          element={
            <ProtectedRoute>
              <AddSession />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editsession/:id"
          element={
            <ProtectedRoute>
              <EditSession />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}