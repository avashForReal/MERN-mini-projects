import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui

import { Stack, Avatar, Button, Checkbox, TableRow, MenuItem, TableCell, IconButton, Typography } from '@mui/material';
// components
import { useAuthContext } from '../../../../auth/useAuthContext';
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import axios from '../../../../utils/axios';



TransactionTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function TransactionTableRow({ row, selected, onSelectRow, setTrigger, trigger }) {
  const { user } = useAuthContext();

  const { id, text, amount, createdBy, createdById } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const onDeleteRow = async (id) => {
    try {
      await axios.delete(`/transactions/${id}`)
      handleCloseConfirm();
      setTrigger(!trigger);
      toast.success("Transaction deleted successfully.", {
        position: toast.POSITION.TOP_RIGHT
      });
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      setTrigger(!trigger);
    }
  }

  const canDelete = ((createdById.toString()) === (user._id.toString()))

  return (
    <>
      <TableRow sx={{
        backgroundColor: (amount < 0) ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
        ":hover": (amount < 0) ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',

      }}>
        <TableCell align="left">{text}</TableCell>

        <TableCell align="left"> Rs. {amount}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {createdBy}
        </TableCell>
        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover open={openPopover} onClose={handleClosePopover} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          disabled={!canDelete}
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={() => { onDeleteRow(row.id) }}>
            Delete
          </Button>
        }
      />
    </>
  );
}
