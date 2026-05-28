// src/app/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EventsProvider } from "./context/EventsContext";
import { AuthProvider } from "./context/AuthContext";

// ✅ Components
import ProtectedRoute from "./Components/ProtectedRoutes";
import { DashboardLayout } from "./Components/DashboardLayout";

// ✅ Pages
import { Dashboard } from "./pages/Dashboard";
import { MyEvents } from "./pages/MyEvents";
import { AllEvents } from "./pages/AllEvents";
import { CreateEvent } from "./pages/CreateEvent";
import { Registrations } from "./pages/Registrations";
import { Venues } from "./pages/Venues";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { PastEvents } from "./pages/PastEvents";
import { ForgotPassword } from "./pages/ForgotPassword";
import PaymentSuccess from "./pages/PaymentSuccess";

export default function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Legacy redirects (old paths → new dashboard paths) */}
            <Route path="/my-events" element={<Navigate to="/dashboard/my-events" replace />} />
            <Route path="/all-events" element={<Navigate to="/dashboard/all-events" replace />} />
            <Route path="/create-event" element={<Navigate to="/dashboard/create-event" replace />} />
            <Route path="/registrations" element={<Navigate to="/dashboard/registrations" replace />} />
            <Route path="/venues" element={<Navigate to="/dashboard/venues" replace />} />
            <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
            <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
            <Route path="/past-events" element={<Navigate to="/dashboard/past-events" replace />} />

            {/* Protected Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="my-events" element={<MyEvents />} />
              <Route path="all-events" element={<AllEvents />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="registrations" element={<Registrations />} />
              <Route path="venues" element={<Venues />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="past-events" element={<PastEvents />} />
              <Route path="settings" element={<Settings />} />
              
              {/* ✅ NEW SECURE GATEWAY CHECKOUT ROUTE */}
              <Route path="payment-success" element={<PaymentSuccess />} />
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </EventsProvider>
    </AuthProvider>
  );
}