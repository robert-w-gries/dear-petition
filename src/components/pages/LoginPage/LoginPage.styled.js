import styled from 'styled-components';
import { Button } from '../../elements/Button';
import Input from '../../elements/Input/Input';
import { colorRed } from '../../../styles/colors';
import { motion } from 'framer-motion';

export const LoginPageStyled = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
`;

export const LoginSplash = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1000px;
  padding: 1rem;
`;

export const SplashLogo = styled.img`
  width: 100%;
  height: auto;
`;

export const LoginForm = styled.form`
  flex: 1;
  width: 90%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
`;

export const FormErrors = styled(motion.div)`
  margin-bottom: 1rem;
  p {
    color: ${colorRed};
  }
`;

export const InputStyled = styled(Input)`
  margin-bottom: 1rem;
`;

export const PasswordInputStyled = styled(InputStyled)`
  margin: 0;
`;

export const ForgotPassword = styled.a`
  margin: 0;
`;

export const PasswordWrapper = styled.div`
  margin-bottom: 1rem;
`;

export const LoginButton = styled(Button)`
  margin-top: 1rem;
`;
