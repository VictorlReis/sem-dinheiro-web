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

interface Props {
  open: boolean;
  onClose: () => void;
  transactionCreateValues: CreateTransactionValues;
  onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange: (values: any) => void;
  onClick: () => Promise<void>;
}

const CreateTransactionModal: React.FC<Props> = (props) => {
  return (
    <Dialog open={props.open} onClose={props.onClose} display="flex">
      <DialogTitle>Create Transaction</DialogTitle>
      <DialogContent>
        <Box display="grid" gridgap="10vh">
          <Input
            type="text"
            value={props.transactionCreateValues.description}
            onChange={props.onChange('description')}
            placeholder="Description"
          />
          <Input
            type="date"
            value={props.transactionCreateValues.startDate}
            onChange={props.onChange('startDate')}
            sx={{ marginTop: '2vh' }}
            placeholder="Start Date"
          />
          <Input
            label="Payment Method"
            type="text"
            value={props.transactionCreateValues.paymentMethod}
            onChange={props.onChange('paymentMethod')}
            sx={{ marginTop: '2vh' }}
            placeholder="Payment Method"
          />
          <Input
            type="text"
            value={props.transactionCreateValues.tag}
            onChange={props.onChange('tag')}
            sx={{ marginTop: '2vh' }}
            placeholder="Tag"
          />
          <CurrencyTextField
            id="value"
            placeholder="Value"
            variant="outlined"
            value={props.transactionCreateValues.value}
            onValueChange={props.onValueChange}
          />
          <Select
            sx={{ marginTop: '2vh', height: '4vh' }}
            onChange={props.onChange('type')}
            value={props.transactionCreateValues.type}
            placeholder="Type"
          >
            <MenuItem value={TransactionType.Expense}>Expense</MenuItem>
            <MenuItem value={TransactionType.Income}>Income</MenuItem>
          </Select>
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
