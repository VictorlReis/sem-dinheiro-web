// noinspection TypeScriptValidateTypes

import React from 'react';
import {
  CreateTransactionValues,
  TransactionType,
} from '../interfaces/Transactions';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  MenuItem,
  Select,
} from '@mui/material';
import CurrencyTextField from './CurrencyTextField';
import { Controller, useForm } from 'react-hook-form';

interface Props {
  open: boolean;
  onClose: () => void;
  onValueChange: (values: any) => void;
  onClick: () => Promise<void>;
  handleCreateTransaction: () => Promise<void>;
}

const CreateTransactionModal: React.FC<Props> = (props) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTransactionValues>();

  const onSubmit = async (data) => {
    console.log(data);
    await props.handleCreateTransaction(data);
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} display="flex">
      <DialogTitle>Create Transaction</DialogTitle>
      <DialogContent>
        <Box display="grid" gridgap="10vh">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="text"
              {...register('description')}
              placeholder="Description"
            />
            <Input
              type="date"
              {...register('startDate')}
              sx={{ marginTop: '2vh' }}
              placeholder="Start Date"
            />
            <Input
              label="Payment Method"
              type="text"
              {...register('paymentMethod')}
              sx={{ marginTop: '2vh' }}
              placeholder="Payment Method"
            />
            <Input
              type="text"
              {...register('tag')}
              sx={{ marginTop: '2vh' }}
              placeholder="Tag"
            />
            <CurrencyTextField
              id="value"
              placeholder="Value"
              {...register('value')}
              variant="outlined"
              onValueChange={props.onValueChange}
            />
            <Controller
              name="type"
              control={control}
              defaultValue={TransactionType.Expense}
              render={({ field }) => (
                <Select {...field} placeholder="Type">
                  <MenuItem value={TransactionType.Expense}>Expense</MenuItem>
                  <MenuItem value={TransactionType.Income}>Income</MenuItem>
                </Select>
              )}
            />
            <MenuItem value={TransactionType.Expense}>Expense</MenuItem>
            <MenuItem value={TransactionType.Income}>Income</MenuItem>
          </form>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={props.onClose}>
          Cancel
        </Button>
        <Button color="success" onClick={props.onClick}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTransactionModal;
