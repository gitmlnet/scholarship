import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { AppProviders } from './providers';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { RouterErrorBoundary } from '@/components/common/RouterErrorBoundary';

// Route-level code splitting: every page loads on demand.
const HomePage = lazy(() => import('@/pages/HomePage'));
const ScholarshipPage = lazy(() => import('@/pages/ScholarshipPage'));
const EligibilityPage = lazy(() => import('@/pages/EligibilityPage'));
const SyllabusPage = lazy(() => import('@/pages/SyllabusPage'));
const NoticesPage = lazy(() => import('@/pages/NoticesPage'));
const NoticeDetailPage = lazy(() => import('@/pages/NoticeDetailPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const TrackPage = lazy(() => import('@/pages/TrackPage'));
const ResultsPage = lazy(() => import('@/pages/ResultsPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const StyleGuidePage = lazy(() => import('@/pages/style-guide/StyleGuidePage'));
const AdminHomePage = lazy(() => import('@/pages/admin/AdminHomePage'));

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route errorElement={<RouterErrorBoundary />}>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="scholarship" element={<ScholarshipPage />} />
              <Route path="eligibility" element={<EligibilityPage />} />
              <Route path="syllabus" element={<SyllabusPage />} />
              <Route path="notices" element={<NoticesPage />} />
              <Route path="notices/:noticeId" element={<NoticeDetailPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="track" element={<TrackPage />} />
              <Route path="results" element={<ResultsPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="style-guide" element={<StyleGuidePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
