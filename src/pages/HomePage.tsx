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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  SelectChangeEvent,
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
import CustomChart from '../components/CustomChartComponent';
import CreateTransactionModal from '../components/CreateTransactionModalComponent';

const HomePage: React.FC = () => {
  const colorMap = {
    Nubank: '#8306b4',
    Xp: '#464444',
    PicPay: '#14B457',
  };

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

  const [openCreateTransactionModal, setOpenCreateTransactionModal] =
    useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState(0);
  const [filteredTransactions, setFilteredTransactions] = useState<
    GridRowsProp<Transaction> | undefined
  >(transactions);
  const [transactionCreateValues, setTransactionCreateValues] =
    useState<CreateTransactionValues>(initialTransactionCreateValues);
  const [chartData, setChartData] = useState([]);
  const [sumByPaymentMethod, setSumByPaymentMethod] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    if (transactions) {
      const tagValues = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.tag]) {
          acc[transaction.tag] = 0;
        }
        acc[transaction.tag] += transaction.value;
        return acc;
      }, {});

      const data = Object.entries(tagValues).map(([tag, value]) => ({
        tag,
        value,
      }));
      setChartData(data);

      const sumByPaymentMethod = transactions.reduce((acc, transaction) => {
        if (!acc[transaction.paymentMethod]) {
          acc[transaction.paymentMethod] = 0;
        }
        acc[transaction.paymentMethod] += transaction.value;
        return acc;
      }, {});

      setSumByPaymentMethod(sumByPaymentMethod);
      setTotalSum(
        Object.values(sumByPaymentMethod).reduce((a, b) => a + b, 0) as number,
      );
    }
  }, [transactions]);

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
      toast.success('Error creating transaction: ' + error);
    }

    setOpenCreateTransactionModal(false);
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
      toast.error(`Error fetching transactions: ${error}`);
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
    row[field] = (event as { target: { value: unknown } }).target.value;
    try {
      await put(`transaction`, row, vars.uri);
      toast.success('Transaction updated successfully');
      await mutate(
        `transactions/${userId}?year=${selectedYear}&month=${selectedMonth}`,
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Error updating transaction');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: 'Descrição',
      width: 200,
      editable: true,
    },
    {
      field: 'startDate',
      headerName: 'Data',
      width: 150,
      editable: true,
      type: 'date',
      valueFormatter: (params) => moment(params?.value).format('DD/MM/YYYY'),
    },
    {
      field: 'paymentMethod',
      headerName: 'Método de pagamento',
      width: 150,
      editable: true,
    },
    { field: 'tag', headerName: 'Tag', width: 150, editable: true },
    {
      field: 'value',
      headerName: 'Valor',
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
      headerName: '',
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
    <div
      style={{
        margin: '1vh',
        padding: '3vh 5vh 3vh 5vh',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'grid',
      }}
    >
      <div style={{ display: 'flex', marginLeft: '1.5vh' }}>
        <div id="expenses" style={{ width: '50%', display: 'flex' }}>
          <div>
            <div
              style={{
                border: '1px solid',
                background: 'gray',
                borderRadius: '10px',
                padding: '1.5vh',
                display: 'flex',
                flexDirection: 'column',
                marginRight: '1vh',
              }}
            >
              <span>Despesas</span>
              <span style={{ fontSize: '3vh' }}>
                {totalSum.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </div>
          <div
            style={{
              alignItems: 'center',
              display: 'grid',
              gap: '1vh',
            }}
          >
            {Object.entries(sumByPaymentMethod).map(([paymentMethod, sum]) => (
              <div
                key={paymentMethod}
                style={{
                  border: '1px solid',
                  background: colorMap[paymentMethod] || 'gray',
                  borderRadius: '10px',
                  padding: '1.5vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <span>{paymentMethod} </span>
                <span style={{ fontSize: '2vh' }}>
                  {sum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          padding: '2vh',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '50%' }}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            color="success"
            onClick={() => setOpenCreateTransactionModal(true)}
            style={{ marginBottom: '1vh' }}
          >
            Nova Transação
          </Button>
          <DataGrid
            rows={filteredTransactions ?? []}
            columns={columns}
            pageSize={10}
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
        <CustomChart data={chartData} />
      </div>
      <CreateTransactionModal
        open={openCreateTransactionModal}
        onClose={() => setOpenCreateTransactionModal(false)}
        transactionCreateValues={transactionCreateValues}
        onChange={(field) => (e) =>
          setTransactionCreateValues((prevValues) => ({
            ...prevValues,
            [field]: e.target.value,
          }))}
        onValueChange={(values) => {
          setTransactionCreateValues((prevValues) => ({
            ...prevValues,
            value: values.floatValue ?? prevValues.value,
          }));
        }}
        onClick={() => handleCreateTransaction(transactionCreateValues)}
      />
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
