import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colorRed } from '../../../styles/colors';

export const SelectWrapper = styled.div``;

export const SelectStyled = styled.label`
  user-select: none;
  font-size: 1.4rem;
`;

export const InputErrors = styled(motion.div)`
  margin: 1rem 0;
  user-select: none;
  & p {
    color: ${colorRed};
  }
`;
