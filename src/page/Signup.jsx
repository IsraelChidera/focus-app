import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { setCurrentUser, toSerializableUser } from '../store/features/userSlice';
import AuthLayout from '../components/widgets/AuthLayout';
import TextField from '../components/elements/TextField';
import Button from '../components/elements/Button';
import Alert from '../components/elements/Alert';
import { getAuthErrorMessage } from '../utils/errors';
import { PASSWORD_MIN, collectErrors, validateEmail, validateName, validateNewPassword } from '../utils/validation';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validate = (values) =>
  collectErrors({
    firstName: validateName(values.firstName, 'first name'),
    lastName: validateName(values.lastName, 'last name'),
    email: validateEmail(values.email),
    password: validateNewPassword(values.password),
    confirmPassword: !values.confirmPassword
      ? 'Confirm your password.'
      : values.confirmPassword !== values.password
        ? "Passwords don't match."
        : undefined,
  });

const Signup = () => {
  const dispatch = useDispatch();

  const onSubmit = async (values, { setStatus }) => {
    setStatus(undefined);

    let credential;
    try {
      credential = await createUserWithEmailAndPassword(auth, values.email.trim(), values.password);
    } catch (error) {
      console.error('Sign up failed:', error);
      setStatus(getAuthErrorMessage(error));
      return;
    }

    // The account exists at this point; a failed name update shouldn't block the user.
    try {
      await updateProfile(credential.user, {
        displayName: `${values.firstName.trim()} ${values.lastName.trim()}`,
      });
      // The auth listener fired before the name was set, so push the updated profile.
      dispatch(setCurrentUser(toSerializableUser(credential.user)));
    } catch (error) {
      console.error('Saving display name failed:', error);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning your budgets in under a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-strong hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
        {({ isSubmitting, status, setStatus }) => (
          <Form noValidate className="space-y-5">
            <Alert onDismiss={() => setStatus(undefined)}>{status}</Alert>

            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="First name" name="firstName" autoComplete="given-name" autoFocus />
              <TextField label="Last name" name="lastName" autoComplete="family-name" />
            </div>

            <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />

            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              hint={`At least ${PASSWORD_MIN} characters, with a letter and a number.`}
            />

            <TextField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" />

            <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default Signup;
