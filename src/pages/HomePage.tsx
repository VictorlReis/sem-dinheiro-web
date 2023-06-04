import React, { useEffect, useState } from 'react';
import vars from '../config/config';
import AddIcon from '@mui/icons-material/Add';
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridDeleteIcon,
  GridRowsProp,
} from '@mui/x-data-grid';
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
  IconButton,
  DialogContentText,
  SelectChangeEvent,
  Box,
} from '@mui/material';
import { get, post, put, remove } from '../hooks/fetch';
import useSWR, { mutate } from 'swr';
import {
  CreateTransactionValues,
  Transaction,
  TransactionType,
} from '../interfaces/Transactions';
import { toast } from 'react-toastify';
import DateFilter from '../components/DateFilterComponent';
import CurrencyTextField from '../components/CurrencyTextField';

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

  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [userId, setUserId] = useState('string');

  const { data: transactions, error } = useSWR<GridRowsProp<Transaction>>(
    `transactions/${userId}?year=${selectedYear}&month=${selectedMonth}`,
    async (url) => {
      return await get(url, vars.uri);
    },
  );

  const [openModal, setOpenModal] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState(0);

  const [filteredTransactions, setFilteredTransactions] = useState<
    GridRowsProp<Transaction> | undefined
  >(transactions);

  const [transactionCreateValues, setTransactionCreateValues] =
    useState<CreateTransactionValues>(initialTransactionCreateValues);

  const handleCreateTransaction = async (
    formValues: CreateTransactionValues,
  ) => {
    try {
      await post('transaction', { ...formValues, userId: 'string' }, vars.uri);

      toast.success('Transaction created successfully');
      setTransactionCreateValues(initialTransactionCreateValues);
      await mutate(
        `transactions/${userId}?year=${selectedYear}&month=${selectedMonth}`,
      );
    } catch (error) {
      console.error('Error creating transaction:', error);
    }

    setOpenModal(false);
  };

  const confirmDeleteTransaction = async () => {
    try {
      await remove(`transaction/${transactionIdToDelete}`, vars.uri);
      toast.success('Transaction deleted successfully');
      await mutate(
        `transactions/${userId}?year=${selectedYear}&month=${selectedMonth}`,
      );
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Error deleting transaction');
    } finally {
      setConfirmDialogOpen(false);
      setTransactionIdToDelete(0);
    }
  };

  useEffect(() => {
    if (transactions) {
      if (selectedMonth === 0) {
        setFilteredTransactions(transactions);
      } else {
        const filteredData = transactions.filter(
          (transaction) =>
            moment(transaction.startDate).month() + 1 === selectedMonth,
        );
        setFilteredTransactions(filteredData);
      }
    }
  }, [transactions, selectedMonth]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [error]);

  const handleMonthFilterChange = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    setSelectedMonth(event.target.value as number);
  };

  const handleYearFilterChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleEditCellChange = async (
    params: GridCellEditStopParams,
    event: any,
  ) => {
    const { field, row } = params;
    const value = (event as { target: { value: unknown } }).target.value;
    console.log(params);
    row[field] = value;

    console.log(row, 'row');

    try {
      await put(`transaction`, row, vars.uri);
      toast.success('Transaction updated successfully');
      await mutate('transactions/string');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Error updating transaction');
    }
  };

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
    {
      field: 'value',
      headerName: 'Value',
      width: 150,
      editable: true,
      valueFormatter: (params) =>
        parseFloat(params.value).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <IconButton
          style={{ color: '#945858' }}
          onClick={() => {
            setConfirmDialogOpen(true);
            setTransactionIdToDelete(params.row.id);
          }}
        >
          <GridDeleteIcon />
        </IconButton>
      ),
    },
  ];

  // noinspection TypeScriptValidateTypes
  return (
    <div style={{ margin: '1vh' }}>
      <div style={{}}>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          color="success"
          onClick={() => setOpenModal(true)}
          style={{ marginBottom: '1vh', marginTop: '1vh' }}
        >
          New Transaction
        </Button>
        <DataGrid
          rows={filteredTransactions ?? []}
          columns={columns}
          pageSize={10}
          columnBuffer={1}
          sx={{
            marginBottom: '1vh',
            width: '100%',
            height: 'auto',
            maxWidth: '130vh',
          }}
          onCellEditStop={handleEditCellChange}
        />
        <DateFilter
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onChangeMonth={handleMonthFilterChange}
          onChangeYear={handleYearFilterChange}
        />
      </div>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        display="flex"
      >
        <DialogTitle>Create Transaction</DialogTitle>
        <DialogContent>
          <Box display="grid" gridgap="10vh">
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
            <Input
              type="date"
              value={transactionCreateValues.startDate}
              onChange={(e) =>
                setTransactionCreateValues((prevValues) => ({
                  ...prevValues,
                  startDate: e.target.value,
                }))
              }
              sx={{ marginTop: '2vh' }}
              placeholder="Start Date"
            />
            <Input
              label="Payment Method"
              type="text"
              value={transactionCreateValues.paymentMethod}
              onChange={(e) =>
                setTransactionCreateValues((prevValues) => ({
                  ...prevValues,
                  paymentMethod: e.target.value,
                }))
              }
              sx={{ marginTop: '2vh' }}
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
              sx={{ marginTop: '2vh' }}
              placeholder="Tag"
            />
            <CurrencyTextField
              id="value"
              placeholder="Value"
              variant="outlined"
              value={transactionCreateValues.value}
              onValueChange={(values) => {
                console.log(values, 'teste values');
                setTransactionCreateValues((prevValues) => ({
                  ...prevValues,
                  value: values.floatValue ?? prevValues.value,
                }));
              }}
            />
            {/*<Input*/}
            {/*  type="text"*/}
            {/*  value={transactionCreateValues.value}*/}
            {/*  onChange={(e) =>*/}
            {/*    setTransactionCreateValues((prevValues) => ({*/}
            {/*      ...prevValues,*/}
            {/*      value: parseFloat(e.target.value),*/}
            {/*    }))*/}
            {/*  }*/}
            {/*  placeholder="Value"*/}
            {/*/>*/}
            <Select
              sx={{ marginTop: '2vh', height: '4vh' }}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            color="success"
            onClick={() => handleCreateTransaction(transactionCreateValues)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteTransaction} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomePage;
