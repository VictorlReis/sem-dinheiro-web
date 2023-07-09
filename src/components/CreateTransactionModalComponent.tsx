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
import moment from 'moment';

interface CreateTransactionModalProps {
  open: boolean;
  onClose: () => void;
  handleCreateTransaction: () => Promise<void>;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = (
  props,
) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTransactionValues>({
    defaultValues: {
      amount: 0,
      type: TransactionType.Expense,
      startDate: moment().format('YYYY-MM-DD'),
    },
  });

  const onSubmit = async (data) => {
    await props.handleCreateTransaction(data);
    reset();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} display="flex">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create Transaction</DialogTitle>
        <DialogContent>
          <Box display="grid" gridgap="10vh">
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
            <Controller
              sx={{ marginTop: '2vh' }}
              name="amount"
              control={control}
              render={({ field }) => (
                <CurrencyTextField
                  id="amount"
                  placeholder="Enter amount"
                  onValueChange={(values) => field.onChange(values.value)}
                />
              )}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Type" sx={{ marginTop: '2vh' }}>
                  <MenuItem value={TransactionType.Expense}>Expense</MenuItem>
                  <MenuItem value={TransactionType.Income}>Income</MenuItem>
                </Select>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={props.onClose}>
            Cancel
          </Button>
          <Button color="success" type="submit" onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTransactionModal;
