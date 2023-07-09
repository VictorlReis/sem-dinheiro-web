import React, { ComponentProps, forwardRef } from 'react';
import { TextField } from '@mui/material';
import { NumberFormatValues, NumericFormat } from 'react-number-format';

interface IProps extends ComponentProps<typeof NumericFormat> {
  id: string;
  placeholder: string;
  onValueChange?: (values: NumberFormatValues) => void;
}

const NumberFormatCustom = forwardRef<HTMLInputElement, IProps>(
  (props, ref) => {
    const { inputRef, onValueChange: onValueChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={onValueChange}
        prefix="R$"
        decimalScale={2}
        fixedDecimalScale
        thousandSeparator="."
        decimalSeparator=","
      />
    );
  },
);

const CurrencyTextField: React.FC<IProps> = ({
  id,
  placeholder,
  onValueChange,
}: IProps) => {
  return (
    <TextField
      placeholder={placeholder}
      id={id}
      variant="standard"
      InputProps={{
        inputComponent: NumberFormatCustom as any,
        inputProps: {
          onValueChange,
        },
      }}
      sx={{ marginTop: '2vh' }}
    />
  );
};

export default CurrencyTextField;
