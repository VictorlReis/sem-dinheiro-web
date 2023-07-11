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
  SelectChangeEvent,
} from '@mui/material';
import CurrencyTextField from './CurrencyTextField';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment';

interface CreateTransactionModalProps {
  open: boolean;
  onClose: () => void;
  handleCreateTransaction: (
    formValues: CreateTransactionValues,
  ) => Promise<void>;
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = (
  props,
) => {
  const { control, register, handleSubmit, reset } =
    useForm<CreateTransactionValues>({
      defaultValues: {
        value: 0,
        type: TransactionType.Expense,
        startDate: moment().format('YYYY-MM-DD'),
      },
    });

  const onSubmit = async (data: CreateTransactionValues) => {
    await props.handleCreateTransaction(data);
    reset();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div style={{ display: 'flex' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogContent>
            <Box style={{ display: 'grid', gap: '1vh' }}>
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
                name="value"
                control={control}
                render={({ field }) => (
                  <CurrencyTextField
                    style={{ marginTop: '2vh' }}
                    id="value"
                    placeholder="Enter amount"
                    onValueChange={(values) =>
                      field.onChange(Number(values.value))
                    }
                  />
                )}
              />
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Type"
                    sx={{ marginTop: '2vh' }}
                    onChange={(event: SelectChangeEvent<TransactionType>) =>
                      field.onChange(event.target.value as TransactionType)
                    }
                  >
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
            <Button
              color="success"
              type="submit"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  );
};

export default CreateTransactionModal;
