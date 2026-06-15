import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Admin pages
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

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/clients" element={<DisplayClients />} />
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/editclient/:id" element={<EditClient />} />

        <Route path="/therapists" element={<DisplayTherapists />} />
        <Route path="/addtherapist" element={<AddTherapists />} />
        <Route path="/edittherapist/:id" element={<EditTherapist />} />

        <Route path="/sessions" element={<DisplaySessions />} />
        <Route path="/addsession" element={<AddSession />} />
        <Route path="/editsession/:id" element={<EditSession />} />
      </Routes>
    </BrowserRouter>
  );
}