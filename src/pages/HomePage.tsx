import React, { useEffect, useState } from 'react';
import vars from '../config/config';
import AddIcon from '@mui/icons-material/Add';
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridDeleteIcon,
  GridRowParams,
  GridRowsProp,
  MuiEvent,
} from '@mui/x-data-grid';
import moment from 'moment';
import { Button, Grid, IconButton, SelectChangeEvent } from '@mui/material';
import { get, post, postFile, put, remove } from '../hooks/fetch';
import useSWR, { mutate } from 'swr';
import {
  CreateTransactionValues,
  Transaction,
} from '../interfaces/Transactions';
import { toast } from 'react-toastify';
import DateFilter from '../components/DateFilterComponent';
import CustomChart from '../components/CustomChartComponent';
import CreateTransactionModal from '../components/CreateTransactionModalComponent';
import ValueCard from '../components/ValueCardComponent';
import ConfirmDeleteModalComponent from '../components/ConfirmDeleteModalComponent';

type ChartData = {
  tag: string;
  value: number;
};

const HomePage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [userId] = useState('string');

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
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [sumExpenses, setSumExpenses] = useState(0);
  const [sumIncome, setSumIncome] = useState(0);

  useEffect(() => {
    if (transactions) {
      const tagValues = transactions.reduce(
        (acc: { [tag: string]: number }, transaction) => {
          if (transaction.type === 1) {
            return acc;
          }

          if (!acc[transaction.tag]) {
            acc[transaction.tag] = 0;
          }

          const valueToAdd =
            Math.round((transaction.value + Number.EPSILON) * 100) / 100;
          acc[transaction.tag] += valueToAdd;
          return acc;
        },
        {},
      );

      const data = Object.entries(tagValues).map(([tag, value]) => ({
        tag,
        value,
      }));
      setChartData(data);
      sumTotal(transactions);
    }
  }, [transactions]);

  const sumTotal = (transactions: readonly Transaction[]) => {
    const { sumExpenses, sumIncome } = transactions.reduce(
      (sums, transaction) => {
        if (transaction.type === 0) {
          sums.sumExpenses += transaction.value;
        } else if (transaction.type === 1) {
          sums.sumIncome += transaction.value;
        }
        return sums;
      },
      { sumExpenses: 0, sumIncome: 0 },
    );

    setSumExpenses(sumExpenses);
    setSumIncome(sumIncome);
  };

  const handleCreateTransaction = async (
    formValues: CreateTransactionValues,
  ) => {
    try {
      await post('transaction', { ...formValues, userId: 'string' }, vars.uri);

      toast.success('Transaction created successfully');
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
    }
  }, [error]);

  const handleMonthFilterChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearFilterChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleEditCellChange = async (
    params: GridCellEditStopParams,
    event: MuiEvent,
  ) => {
    const { field, row } = params;

    row.start_date = moment(row.start_date).format('YYYY-MM-DD');

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

  const onClickCsvButton = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file, file.name);
        await postFile('transactions/csv', formData);

        toast.success('CSV file uploaded successfully');
      } catch (error) {
        toast.error(`Error uploading CSV file: ${error}`);
      }
    }
  };

  const getRowClassName = (params: GridRowParams) => {
    return params.row.type === 0 ? 'type0' : 'type1';
  };

  const columns: GridColDef[] = [
    {
      field: 'description',
      headerName: 'Descrição',
      editable: true,
      width: 200,
    },
    {
      field: 'startDate',
      headerName: 'Data',
      editable: true,
      type: 'date',
      valueFormatter: (params) => moment(params?.value).format('DD/MM/YYYY'),
    },
    {
      field: 'paymentMethod',
      headerName: 'Origem',
      editable: true,
    },
    { field: 'tag', headerName: 'Categoria', editable: true },
    {
      field: 'value',
      headerName: 'Valor',
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
      renderCell: (params) => (
        <IconButton
          style={{ color: '#bb3a32' }}
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

  return (
    <article
      style={{
        justifyContent: 'center',
        marginTop: '5vh',
        display: 'grid',
      }}
    >
      <section
        style={{ display: 'flex', justifyContent: 'flex-end', gap: '2vh' }}
      >
        <ValueCard
          value={sumExpenses}
          title="Despesas"
          backgroundColor="#bb3a32"
        />
        <ValueCard
          value={sumIncome}
          title="Receitas"
          backgroundColor="#437e33"
        />
        <ValueCard
          value={sumIncome - sumExpenses}
          title="Total Final"
          backgroundColor="#7f7f7f"
        />
      </section>
      <section
        style={{
          display: 'flex',
          marginTop: '3vh',
        }}
      >
        <section>
          <Grid display="flex" justifyContent="space-between">
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              color="success"
              onClick={() => setOpenCreateTransactionModal(true)}
              style={{ marginBottom: '1vh' }}
            >
              Nova Transação
            </Button>
            <Button
              component="label"
              variant="outlined"
              color="success"
              style={{ marginBottom: '1vh' }}
            >
              Importar CSV
              <input
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => onClickCsvButton(e)}
              />
            </Button>
            <DateFilter
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onChangeMonth={handleMonthFilterChange}
              onChangeYear={handleYearFilterChange}
            />
          </Grid>
          <DataGrid
            rows={filteredTransactions ?? []}
            columns={columns}
            sx={{
              marginBottom: '1vh',
              overflow: 'none',
            }}
            onCellEditStop={handleEditCellChange}
            getRowClassName={getRowClassName}
            className="transaction-grid"
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </section>
        <CustomChart data={chartData} />
      </section>
      <CreateTransactionModal
        open={openCreateTransactionModal}
        onClose={() => setOpenCreateTransactionModal(false)}
        handleCreateTransaction={handleCreateTransaction}
      />
      <ConfirmDeleteModalComponent
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onClick={confirmDeleteTransaction}
      />
    </article>
  );
};

export default HomePage;
