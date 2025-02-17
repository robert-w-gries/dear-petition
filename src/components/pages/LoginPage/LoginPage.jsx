import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { SplashLogo, FormErrors, InputStyled, PasswordInputStyled } from './LoginPage.styled';
import { Button } from '../../elements/Button';

// Assets
import ezExpungeLogoWithLancText from '../../../assets/img/ez_expunge_logo_with_lanc.png';

// Routing
import { useHistory } from 'react-router-dom';

import useAuth from '../../../hooks/useAuth';
import { loggedIn } from '../../../slices/auth';
import { useLoginMutation } from '../../../service/api';
import styled from 'styled-components';

const LoginButton = styled(Button)`
  padding: 1rem 3rem;
  font-size: 1.7rem;
  width: 100%;
`;

function Login() {
  const { user: authenticatedUser } = useAuth();
  const history = useHistory();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  // State
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (authenticatedUser) {
      history.replace('/');
    }
  }, [authenticatedUser, history]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleLogin = async ({ username, password }) => {
    // e.preventDefault();
    setErrors({});
    try {
      const { user } = await login({ username, password }).unwrap();
      dispatch(loggedIn(user));
      history.replace('/');
    } catch (error) {
      if (error?.data) {
        setErrors((prev) => ({
          ...prev,
          ...error.data,
        }));
      }
    }
  };

  return (
    <main className="flex-1 flex flex-col gap-12 items-center w-100 h-100 mt-20">
      <div className="w-[600px] px-2 py-12 flex flex-col items-center">
        <SplashLogo src={ezExpungeLogoWithLancText} alt="EZ Expunge logo" />
      </div>
      <form className="flex flex-col items-center gap-4 w-[190px]" onSubmit={handleSubmit(handleLogin)}>
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
        {errors.detail && (
          <FormErrors className="mb-0">
            <p>{errors.detail}</p>
          </FormErrors>
        )}
        <LoginButton type="submit">Log In</LoginButton>
      </form>
    </main>
  );
}

export default Login;
