import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// @mui
import {
  Card,
  Table,
  Button,
  Container,
  IconButton,
  TableContainer,
  Skeleton,
  Grid,
  Stack
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import axios from '../../utils/axios';

// components
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
// sections
import { TransactionTableRow } from '../../sections/@dashboard/transactions/list';
import TransactionSummary from '../../sections/@dashboard/transactions/TransactionSummary';

const TABLE_HEAD = [
  { id: 'text', label: 'Title', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
  { id: '' },
];

export default function TransactionPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'text' });

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [tableData, setTableData] = useState([]);

  const [isNotFound, setIsNotFound] = useState(true);

  const [trigg, setTrigg] = useState(true)

  const [income, setIncome] = useState(null);

  const [expense, setExpense] = useState(null);

  const [summary, setSummary] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);

  const dataFiltered = tableData;

  const denseHeight = dense ? 52 : 72;

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.todos.edit((paramCase(row.id))));
  };

  const resetSummary = () => {
    setIncome(null);
    setExpense(null);
    setSummary(null);
  }

  const calculateSummary = (data) => {
    const incomeArr = []
    let income = 0;

    let expense = 0;
    const expenseArr = []

    let summary = 0;
    data.forEach((d) => {
      if (d.amount < 0) {
        expense += Math.abs(d.amount)
        expenseArr.push(Math.abs(d.amount))
      }
      if (d.amount > 0) {
        income += Math.abs(d.amount)
        incomeArr.push(Math.abs(d.amount))
      }
      summary += d.amount;
    })
    setIncome({
      total: income,
      series: incomeArr.reverse()
    })
    setExpense({
      total: expense,
      series: expenseArr.reverse()
    })
    setSummary(summary)
  };

  const fetchTodos = async () => {
    try {
      const d = await axios.get('/transactions');
      setTableData(d.data);
      if (!d.data.length) {
        setIsNotFound(true);
        resetSummary();
      } else {
        setIsNotFound(false)
        calculateSummary(d.data)
      }
      setLoading(false);
    } catch (err) {
      toast.error(err.message || "An error occured", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [trigg])

  return (
    <>
      <Helmet>
        <title> Transactions: List </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Transactions List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Transactions', href: PATH_DASHBOARD.transactions.root },
            { name: 'List' },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.transactions.new}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Transaction
            </Button>
          }
        />

        <Grid item xs={12} md={7}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            <TransactionSummary
              title="Total Family Income"
              icon="eva:diagonal-arrow-left-down-fill"
              total={income?.total}
              chart={{
                series: income?.series,
              }}
            />

            <TransactionSummary
              title="Total Family Expenses"
              color="warning"
              icon="eva:diagonal-arrow-right-up-fill"
              total={expense?.total}
              chart={{
                series: expense?.series,
              }}
            />

            <TransactionSummary
              title="Total Family Balance"
              color={(summary < 0) ? 'warning' : 'primary'}
              icon="material-symbols:equal-rounded"
              total={summary}
            />
          </Stack>
        </Grid>

        <Card sx={{ marginTop: '15px' }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            {
              loading ? (
                <Skeleton height={'100vh'} />
              ) : (
                <>
                  <Scrollbar>
                    <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                      <TableHeadCustom
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={tableData.length}
                        numSelected={selected.length}
                      />

                      {!isNotFound && dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TransactionTableRow
                          key={row.id}
                          row={row}
                          setTrigger={setTrigg}
                          trigger={trigg}
                        />
                      ))}

                      <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                      <TableNoData isNotFound={isNotFound} />
                    </Table>
                  </Scrollbar>

                </>
              )
            }
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}
