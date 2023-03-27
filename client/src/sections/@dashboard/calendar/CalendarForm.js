import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { toast } from 'react-toastify';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../components/iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import { useAuthContext } from '../../../auth/useAuthContext'


const getInitialValues = (event) => {
  const initialEvent = {
    title: '',
    start: new Date().toISOString(),
    end: new Date().toISOString(),
  };

  if (event) {
    return event;
  }

  return initialEvent;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  onCancel: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
};

export default function CalendarForm({ event, onCreateUpdateEvent, onDeleteEvent, onCancel }) {
  const { user } = useAuthContext();

  const hasEventData = !!event;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        start: data.start,
        end: data.end,
      };

      onCreateUpdateEvent(newEvent);

      onCancel();

      reset();
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const isDateError =
    values.start && values.end ? isBefore(new Date(values.end), new Date(values.start)) : false;

   console.log(event) 

  const viewOnly = event && ((event?.createdBy.toString()) !== (user._id.toString()))

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="title" label="Title" disabled={viewOnly} />

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              onChange={(newValue) => field.onChange(newValue)}
              disabled={viewOnly}
              label="Start date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              onChange={(newValue) => field.onChange(newValue)}
              disabled={viewOnly}
              label="End date"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!isDateError}
                  helperText={isDateError && 'End date must be later than start date.'}
                />
              )}
            />
          )}
        />
      </Stack>

      <DialogActions>
        {hasEventData && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDeleteEvent} disabled={viewOnly}>
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          {event ? 'Close' : 'Cancel'}
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={viewOnly}>
          {hasEventData ? 'Update' : 'Add'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
