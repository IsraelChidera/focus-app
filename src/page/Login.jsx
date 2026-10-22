import React from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import AuthLayout from '../components/widgets/AuthLayout';
import TextField from '../components/elements/TextField';
import Button from '../components/elements/Button';
import Alert from '../components/elements/Alert';
import { getAuthErrorMessage } from '../utils/errors';
import { collectErrors, validateEmail } from '../utils/validation';

const initialValues = { email: '', password: '' };

const validate = (values) =>
  collectErrors({
    email: validateEmail(values.email),
    password: values.password ? undefined : 'Enter your password.',
  });

const Login = () => {
  // On success the auth listener updates the store and PublicRoute redirects.
  const onSubmit = async (values, { setStatus }) => {
    setStatus(undefined);
    try {
      await signInWithEmailAndPassword(auth, values.email.trim(), values.password);
    } catch (error) {
      console.error('Sign in failed:', error);
      setStatus(getAuthErrorMessage(error));
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          New to Envelo?{' '}
          <Link to="/signup" className="font-semibold text-brand-strong hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
        {({ isSubmitting, status, setStatus }) => (
          <Form noValidate className="space-y-5">
            <Alert onDismiss={() => setStatus(undefined)}>{status}</Alert>

            <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" autoFocus />

            <div>
              <TextField label="Password" name="password" type="password" autoComplete="current-password" placeholder="Your password" />
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-strong hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Login;
