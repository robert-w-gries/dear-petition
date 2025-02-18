import { useController } from 'react-hook-form';
import { AnimatePresence } from 'framer-motion';
import { InputWrapper, InputStyled, ActualInputStyled, InputErrors, InputWarnings } from './Input.styled';

const FormDateInput = ({ className, label, errors, warnings, inputProps, ...restProps }) => {
  const { field, fieldState } = useController(inputProps);
  const { error: inputError } = fieldState;
  const error = inputError ? (
    <p>Invalid date</p>
  ) : (
    // eslint-disable-next-line react/no-array-index-key
    errors?.map((errMsg, i) => <p key={`${i}${errMsg}`}>{errMsg}</p>)
  );
  return (
    <InputWrapper className={className}>
      <InputStyled>{label}</InputStyled>
      <ActualInputStyled type="date" {...field} {...restProps} />
      <AnimatePresence>
        {error && (
          <InputErrors
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '50' }}
            positionTransition
          >
            {error}
          </InputErrors>
        )}
        {warnings && (
          <InputWarnings
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '50' }}
            positionTransition
          >
            {warnings.map((warningMsg) => (
              <p key={warningMsg}>{warningMsg}</p>
            ))}
          </InputWarnings>
        )}
      </AnimatePresence>
    </InputWrapper>
  );
};

export default FormDateInput;
