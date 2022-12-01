import { AnimatePresence } from 'framer-motion';
import { useController, UseControllerProps } from 'react-hook-form';
import { Props as ActualSelectProps } from 'react-select';
import { SelectWrapper, SelectStyled, InputErrors } from './Select.styled';
import Select from './Select';

type FormSelectProps = {
  className?: string;
  disabled?: boolean;
  errors?: string[];
  label: string;
  inputProps: UseControllerProps;
};

const FormSelect = <Option,>({
  label,
  options,
  inputProps,
  className,
  disabled,
  errors = [],
}: ActualSelectProps<Option, false> & FormSelectProps) => {
  const { field, fieldState } = useController(inputProps);
  const { error: inputError } = fieldState;
  const combinedErrors = inputError?.message ? [inputError.message, ...errors] : errors;
  return (
    <Select
      {...field}
      className={className}
      label={label}
      isDisabled={disabled}
      options={options}
      errors={combinedErrors}
    />
  );
};

export default FormSelect;
