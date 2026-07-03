import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import LandingPage from './pages/LandingPage'
import ThemePreview from './pages/ThemePreview'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/auth'
import api from './lib/api'
import { initAnalytics } from './lib/analytics'
import { initSentry } from './lib/sentry'

// Dashboard imports
import DashboardLayout from './pages/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Onboarding from './pages/dashboard/Onboarding'
import WeddingData from './pages/dashboard/WeddingData'
import Themes from './pages/dashboard/Themes'
import Gallery from './pages/dashboard/Gallery'
import Guests from './pages/dashboard/Guests'
import Rsvps from './pages/dashboard/Rsvps'
import Checkin from './pages/dashboard/Checkin'
import Billing from './pages/dashboard/Billing'
import Settings from './pages/dashboard/Settings'
import Checkout from './pages/dashboard/Checkout'
import { PaymentSuccess, PaymentPending, PaymentFailed } from './pages/payment/PaymentStatus'

// Public views
import InvitationPublic from './pages/public/InvitationPublic'
import { PrivacyPolicy } from './pages/static/PrivacyPolicy'
import { TermsConditions } from './pages/static/TermsConditions'
import { AboutUs } from './pages/static/AboutUs'
import { Contact } from './pages/static/Contact'

// Admin Portal imports
import AdminLogin from './pages/admin/Login'
import AdminDashboardLayout from './pages/admin/DashboardLayout'
import AdminOverview from './pages/admin/Overview'
import AdminUsers from './pages/admin/Users'
import AdminOrders from './pages/admin/Orders'
import AdminThemes from './pages/admin/Themes'
import AdminPackages from './pages/admin/Packages'
import AdminMusic from './pages/admin/Music'
import AdminFinance from './pages/admin/Finance'
import AdminSettings from './pages/admin/Settings'

function App() {
  const { setAuth, clearAuth, setInitializing } = useAuthStore()

  useEffect(() => {
    initAnalytics()
    initSentry()

    const initializeAuth = async () => {
      try {
        const response = await api.post('/auth/refresh')
        const { user, accessToken } = response.data
        setAuth(user, accessToken)
      } catch (error) {
        clearAuth()
      } finally {
        setInitializing(false)
      }
    }
    initializeAuth()
  }, [setAuth, clearAuth, setInitializing])

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/theme-preview/:themeId" element={<ThemePreview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Legal & Static Routes */}
        <Route path="/kebijakan-privasi" element={<PrivacyPolicy />} />
        <Route path="/syarat-ketentuan" element={<TermsConditions />} />
        <Route path="/tentang-kami" element={<AboutUs />} />
        <Route path="/kontak" element={<Contact />} />

        {/* Public Invitation Link */}
        <Route path="/u/:slug" element={<InvitationPublic />} />

        {/* Onboarding Wizard - No Layout */}
        <Route
          path="/dashboard/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Dashboard Layout and Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="wedding-data" element={<WeddingData />} />
          <Route path="themes" element={<Themes />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="guests" element={<Guests />} />
          <Route path="rsvp" element={<Rsvps />} />
          <Route path="checkin" element={<Checkin />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="checkout/:orderId" element={<Checkout />} />
        </Route>

        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/pending"
          element={
            <ProtectedRoute>
              <PaymentPending />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/failed"
          element={
            <ProtectedRoute>
              <PaymentFailed />
            </ProtectedRoute>
          }
        />

        {/* Admin Portal Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="themes" element={<AdminThemes />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="music" element={<AdminMusic />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Dynamic Fallback slug route */}
        <Route path="/:slug" element={<InvitationPublic />} />
      </Routes>
      <Toaster richColors position="top-center" closeButton />
    </>
  )
}

export default App
