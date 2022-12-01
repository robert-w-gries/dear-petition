import { SelectWrapper, SelectStyled, InputErrors } from './Select.styled';
import { AnimatePresence } from 'framer-motion';
import ActualSelect, { Props as ActualSelectProps } from 'react-select';

type SelectProps = {
  label: string;
  className?: string;
  disabled?: boolean;
  errors?: string[];
};

function Select<Option>({
  value,
  onChange,
  label,
  options,
  className = '',
  disabled = false,
  errors = [],
}: ActualSelectProps<Option, false> & SelectProps) {
  return (
    <SelectWrapper className={className}>
      <SelectStyled>
        {label}
        <div className="min-w-[150px] text-[1.5rem] [&>div]:border [&>div]:border-gray [&>div]:rounded-md [&>div>*]:border-0">
          <ActualSelect<Option>
            value={value}
            options={options}
            onChange={onChange}
            isDisabled={disabled}
          />
        </div>
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
