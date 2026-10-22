import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { listenToAuthChanges } from './store/features/userSlice';
import ProtectedRoute from './components/widgets/ProtectedRoute';
import PublicRoute from './components/widgets/PublicRoute';
import ErrorBoundary from './components/widgets/ErrorBoundary';
import FullPageLoader from './components/widgets/FullPageLoader';
import { ToastProvider } from './components/widgets/Toast';
import Landing from './page/Landing';
import Home from './page/Home';
import Login from './page/Login';
import Signup from './page/Signup';
import ForgotPassword from './page/ForgotPassword';
import NotFound from './page/NotFound';

// These pages pull in the rich-text editor, so they load on demand.
const Notes = lazy(() => import('./page/Notes'));
const NoteDetail = lazy(() => import('./page/NoteDetail'));

function App() {
  const dispatch = useDispatch();

  useEffect(() => dispatch(listenToAuthChanges()), [dispatch]);

  return (
    <Router>
      <ToastProvider>
        <ErrorBoundary>
          <Suspense fallback={<FullPageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/:id" element={<NoteDetail />} />
              </Route>

              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </ToastProvider>
    </Router>
  );
}

export default App;
