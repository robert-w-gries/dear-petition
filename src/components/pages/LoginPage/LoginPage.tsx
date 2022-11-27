import { AnimatePresence } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

import { Button } from '~/src/components/elements/Button';
import { DEAR_LOGO_LOGIN_URL } from '~/src/constants/assetConstants';
import { useAuth } from '~/src/hooks/useAuth';
import { useLoginMutation } from '~/src/service/api';
import { loggedIn } from '~/src/slices/auth';
import { useAppDispatch } from '~/src/store';
import { isObject } from '~/src/types';

import { SplashLogo, FormErrors, InputStyled, PasswordInputStyled } from './LoginPage.styled';

const LoginButton = styled(Button)`
  padding: 1rem 3rem;
  font-size: 1.7rem;
  width: 100%;
`;

type FormValues = {
  username: string;
  password: string;
};

function Login() {
  const { user: authenticatedUser } = useAuth();
  const history = useHistory();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (authenticatedUser) {
      history.replace('/');
    }
  }, [authenticatedUser]);

  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async ({ username, password }: FormValues) => {
    setErrors({});
    try {
      const { user } = await login({ username, password }).unwrap();
      dispatch(loggedIn(user));
      history.replace('/');
    } catch (error) {
      if (isObject(error) && 'data' in error) {
        // for some reason, doing `...error.data` would lose type info from above narrowing
        const errorData = error.data as Record<string, string[]>;
        setErrors((prev) => ({
          ...prev,
          ...errorData,
        }));
      }
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-[10rem] items-center w-100 h-100 mt-20">
      <div className="max-w-[950px] p-2">
        <SplashLogo src={DEAR_LOGO_LOGIN_URL.toString()} alt="DEAR logo" />
      </div>
      <form
        className="flex flex-col items-center gap-4 w-[190px]"
        onSubmit={handleSubmit(handleLogin)}
      >
        <InputStyled
          className="m-0"
          label="username"
          inputProps={{ name: 'username', control }}
          errors={errors.username}
        />
        <div className="flex flex-col gap-2">
          <PasswordInputStyled
            label="password"
            type="password"
            inputProps={{ name: 'password', control }}
            errors={errors.password}
          />
          <a href="password_reset/">Forgot Password?</a>
        </div>
        <AnimatePresence>
          {errors.detail && (
            <FormErrors
              className="mb-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-50' }}
              positionTransition
            >
              <p>{errors.detail}</p>
            </FormErrors>
          )}
        </AnimatePresence>
        <LoginButton type="submit">Log In</LoginButton>
      </form>
    </main>
  );
}

export default Login;
