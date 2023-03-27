import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { toast } from 'react-toastify';

import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Button, Container, DialogTitle, Dialog } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
import { fTimestamp } from '../../utils/formatTime';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { useDateRangePicker } from '../../components/date-range-picker';
// sections
import {
  CalendarForm,
  StyledCalendar,
  CalendarToolbar,
  CalendarFilterDrawer,
} from '../../sections/@dashboard/calendar';
import axios from '../../utils/axios'


export default function CalendarPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettingsContext();

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef(null);

  const picker = useDateRangePicker(null, null);

  const [date, setDate] = useState(new Date());

  const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

  const [userEvents, setUserEvents] = useState([])

  const [selEvent, setSelEvent] = useState(null)

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const filterEvent = (eventid) => {
    const calendarApi = calendarRef.current.getApi()
    const events = calendarApi.getEvents()
    const eventData = events.map((e) => ({
      start: e.start,
      end: e.end,
      title: e.title,
      id: e.id,
      createdBy: e.extendedProps.createdBy
    }))
    const event = eventData?.filter((e) => e.id === eventid)
    return event[0];
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelEvent(null);
  };

  const handleSelectEvent = (args) => {
    const eid = args.event.id;
    const ev = filterEvent(eid);
    setSelEvent(ev);
    handleOpenModal();
  }

  const addCalenderEvent = (event) => {
    const calendarApi = calendarRef.current.getApi()
    calendarApi.addEvent(event);
  }

  const removeCalenderEvent = (eventId) => {
    const calendarApi = calendarRef.current.getApi()
    const event = calendarApi.getEventById(eventId);
    event.remove();
  }

  const updateCalenderEvent = (eventId, data) => {
    const calendarApi = calendarRef.current.getApi()
    const event = calendarApi.getEventById(eventId);
    event.setDates(data.start,data.end)
    event.setProp('title',data.title);
  }

  const handleDeleteEvent = async () => {
    try {
      const d = await axios.delete(`/events/${selEvent.id}`);
      removeCalenderEvent(selEvent.id);
      handleCloseModal();
      enqueueSnackbar('Event deleted.', { variant: 'success' });
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  const fetchEvents = async () => {
    try {
      const d = await axios.get(`/events`);
      setUserEvents(d.data)
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }

  const handleCreateUpdateEvent = async (newEvent) => {
    try {
      if (selEvent) {
        const d = await axios.put(`/events/${selEvent.id}`, newEvent);
        updateCalenderEvent(selEvent.id, d.data);
        handleCloseModal()
        enqueueSnackbar('Event updated.', { variant: 'success' });
      } else {
        const d = await axios.post(`/events`, newEvent);
        addCalenderEvent(d.data);
        enqueueSnackbar('Event added.', { variant: 'success' });
        handleCloseModal();
      }
    } catch (error) {
      toast.error(error.message || "An error occured", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <>
      <Helmet>
        <title> Events </title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Calendar"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Events',
            },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
              New Event
            </Button>
          }
        />

        <Card>
          <StyledCalendar>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              allDayMaintainDuration
              eventResizableFromStart
              events={userEvents}
              ref={calendarRef}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              eventClick={handleSelectEvent}
              height={isDesktop ? 720 : 'auto'}
              plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
            />
          </StyledCalendar>
        </Card>
      </Container>

      <Dialog fullWidth maxWidth="xs" open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{selEvent ? 'Event Details' : 'Add Event'}</DialogTitle>
        <CalendarForm
          event={selEvent}
          onCancel={handleCloseModal}
          onCreateUpdateEvent={handleCreateUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </Dialog>
    </>
  );
}
