import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FiArrowLeft } from 'react-icons/fi';
import { auth } from '../firebase';
import AuthLayout from '../components/widgets/AuthLayout';
import TextField from '../components/elements/TextField';
import Button from '../components/elements/Button';
import Alert from '../components/elements/Alert';
import { getAuthErrorMessage } from '../utils/errors';
import { collectErrors, validateEmail } from '../utils/validation';

const validate = (values) => collectErrors({ email: validateEmail(values.email) });

const ForgotPassword = () => {
  const onSubmit = async (values, { setStatus }) => {
    setStatus(undefined);
    try {
      await sendPasswordResetEmail(auth, values.email.trim());
      setStatus({ sent: true });
    } catch (error) {
      // Don't reveal whether an account exists for this address.
      if (error?.code === 'auth/user-not-found') {
        setStatus({ sent: true });
        return;
      }
      console.error('Password reset failed:', error);
      setStatus({ error: getAuthErrorMessage(error) });
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send you a reset link."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-brand-strong hover:underline">
          <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to sign in
        </Link>
      }
    >
      <Formik initialValues={{ email: '' }} validate={validate} onSubmit={onSubmit}>
        {({ isSubmitting, status, setStatus }) =>
          status?.sent ? (
            <Alert tone="success">
              If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.
            </Alert>
          ) : (
            <Form noValidate className="space-y-5">
              <Alert onDismiss={() => setStatus(undefined)}>{status?.error}</Alert>
              <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" autoFocus />
              <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Send reset link'}
              </Button>
            </Form>
          )
        }
      </Formik>
    </AuthLayout>
  );
};

export default ForgotPassword;
