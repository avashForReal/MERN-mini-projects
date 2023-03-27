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
  Skeleton
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
import { TodoTableRow } from '../../sections/@dashboard/todos/list';

const TABLE_HEAD = [
  { id: 'title', label: 'Title', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
  { id: '' },
];

export default function TodoListPage() {
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
  } = useTable({ defaultOrderBy: 'title' });

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [isNotFound, setIsNotFound] = useState(true);

  const [loading, setLoading] = useState(true);

  const [trigg, setTrigg] = useState(true)

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

  const fetchTodos = async () => {
    try {
      const d = await axios.get('/todos');
      setTableData(d.data.data);
      if (!d.data.data.length) {
        setIsNotFound(true)
      } else {
        setIsNotFound(false)
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
        <title> Todo: List </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Todos List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Todos', href: PATH_DASHBOARD.todos.root },
            { name: 'List' },
          ]}
          action={
            <Button
              to={PATH_DASHBOARD.todos.new}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              New Todo
            </Button>
          }
        />

        <Card>
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
                        <TodoTableRow
                          key={row.id}
                          row={row}
                          onEditRow={() => handleEditRow(row)}
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

          </TableContainer >

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card >
      </Container >
    </>
  );
}
