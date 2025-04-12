import { AnimatePresence } from 'framer-motion';
import { Props as ReactSelectProps } from 'react-select';

import { SelectWrapper, SelectStyled, ActualSelectStyled, InputErrors } from './Select.styled';

type SelectProps = {
  label: string;
  errors?: string[];
  disabled?: boolean;
} & ReactSelectProps;

function Select({ value, onChange, label, errors, options, disabled, className }: SelectProps) {
  return (
    <SelectWrapper className={className}>
      <SelectStyled>
        {label}
        <ActualSelectStyled value={value} options={options} onChange={onChange} isDisabled={disabled} />
      </SelectStyled>
      <AnimatePresence>
        <InputErrors
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-50' }}
          positionTransition
        >
          {errors && errors.map((errMsg) => <p key={errMsg}>{errMsg}</p>)}
        </InputErrors>
      </AnimatePresence>
    </SelectWrapper>
  );
}

export default Select;
