import React, { useEffect, useState } from 'react';
import vars from '../config/config';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import moment from 'moment';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Input,
  Select,
  MenuItem,
  createTheme,
} from '@mui/material';
import { get, post } from '../hooks/fetch';
import useSWR, { mutate } from 'swr';
import {
  CreateTransactionValues,
  Transaction,
  TransactionType,
} from '../interfaces/Transactions';
import { toast } from 'react-toastify';

const HomePage: React.FC = () => {
  const initialTransactionCreateValues: CreateTransactionValues = {
    description: '',
    type: TransactionType.Expense,
    startDate: moment().format('YYYY-MM-DD'),
    paymentMethod: '',
    tag: '',
    value: 0,
    userId: '',
  };

  const [openModal, setOpenModal] = useState(false);

  const [transactionCreateValues, setTransactionCreateValues] =
    useState<CreateTransactionValues>(initialTransactionCreateValues);

  const { data: transactions, error } = useSWR<GridRowsProp<Transaction>>(
    'transactions/string',
    async (url) => {
      return await get(url, vars.uri);
    },
  );

  const handleCreateTransaction = async (
    formValues: CreateTransactionValues,
  ) => {
    try {
      await post('transaction', { ...formValues, userId: 'string' }, vars.uri);

      toast.success('Transaction created successfully');
      setTransactionCreateValues(initialTransactionCreateValues);
      await mutate('transactions/string');
    } catch (error) {
      console.error('Error creating transaction:', error);
    }

    setOpenModal(false);
  };

  useEffect(() => {
    if (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [error]);

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      editable: true,
    },
    { field: 'type', headerName: 'Type', width: 150, editable: true },
    {
      field: 'startDate',
      headerName: 'Date',
      width: 150,
      editable: true,
      type: 'date',
      valueFormatter: (params) => moment(params?.value).format('DD/MM/YYYY'),
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment Method',
      width: 150,
      editable: true,
    },
    { field: 'tag', headerName: 'Tag', width: 150, editable: true },
    { field: 'value', headerName: 'Value', width: 150, editable: true },
  ];

  // noinspection TypeScriptValidateTypes
  return (
    <div>
      <div style={{ height: '100vh', width: '103vh' }}>
        <Button onClick={() => setOpenModal(true)}>Add Transaction</Button>
        <DataGrid
          rows={transactions ?? []}
          columns={columns}
          pageSize={10}
          autoHeight
          autoWidth
          columnBuffer={1}
          // onEditCellChange={(params) => {
          //   const { id, field } = params;
          //   if (!params.isEdit) {
          //     if (editedRows.has(id)) {
          //       // Handle the data update here, for example, make an API call to update the transaction
          //       console.log(`Cell edited: Row ${id}, Field ${field}`);
          //     }
          //     setEditedRows((prevEditedRows) => {
          //       const updatedEditedRows = new Set(prevEditedRows);
          //       updatedEditedRows.delete(id);
          //       return updatedEditedRows;
          //     });
          //   }
          // }}
        />
      </div>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Create Transaction</DialogTitle>
        <DialogContent>
          <Input
            type="text"
            value={transactionCreateValues.description}
            onChange={(e) =>
              setTransactionCreateValues((prevValues) => ({
                ...prevValues,
                description: e.target.value,
              }))
            }
            placeholder="Description"
          />
          <Select
            onChange={(e) =>
              setTransactionCreateValues((prevValues) => ({
                ...prevValues,
                type: parseInt(e.target.value),
              }))
            }
            value={transactionCreateValues.type}
            placeholder="Type"
          >
            <MenuItem value={TransactionType.Expense}>Expense</MenuItem>
            <MenuItem value={TransactionType.Income}>Income</MenuItem>
          </Select>
          <Input
            type="date"
            value={transactionCreateValues.startDate}
            onChange={(e) =>
              setTransactionCreateValues((prevValues) => ({
                ...prevValues,
                startDate: e.target.value,
              }))
            }
            placeholder="Start Date"
          />
          <Input
            type="text"
            value={transactionCreateValues.paymentMethod}
            onChange={(e) =>
              setTransactionCreateValues((prevValues) => ({
                ...prevValues,
                paymentMethod: e.target.value,
              }))
            }
            placeholder="Payment Method"
          />
          <Input
            type="text"
            value={transactionCreateValues.tag}
            onChange={(e) =>
              setTransactionCreateValues((prevValues) => ({
                ...prevValues,
                tag: e.target.value,
              }))
            }
            placeholder="Tag"
          />
          <Input
            type="number"
            value={transactionCreateValues.value}
            onChange={(e) =>
              setTransactionCreateValues((prevValues) => ({
                ...prevValues,
                value: parseFloat(e.target.value),
              }))
            }
            placeholder="Value"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            onClick={() => handleCreateTransaction(transactionCreateValues)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
