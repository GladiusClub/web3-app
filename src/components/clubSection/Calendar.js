import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Paper,
  Box,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import AttendanceTable from "../Tables/AttendanceTable";
//import { useClub } from "../contexts/clubContext";

// This component represents the event dialog
function EventDialog({
  open,
  handleClose,
  selectedDate,
  events,
  selectedEvent,
  setSelectedEvent,
  calendarRef,
}) {
  //const { recordAttendance } = useClub();
  const [attendance, setAttendance] = useState({});
  const [win, setWin] = useState({});
  const [score, setScore] = useState({});
  //const [coefficient, setCoefficient] = useState({});

  // Inside your component
  useEffect(() => {
    console.log(attendance);
    console.log(win);
  }, [attendance, win]);

  const saveScores = () => {
    //recordAttendance("1",);

    handleClose();
  };

  const handleScoreChange = (memberId, value) => {
    setScore((prev) => ({ ...prev, [memberId]: value }));
    console.log(score);
  };

  const handleWinChange = (memberId, value) => {
    setWin((prev) => ({ ...prev, [memberId]: value }));
  };

  const handleAttendanceChange = (event, member) => {
    const isChecked = event.target.checked;

    setAttendance((prevAttendance) => {
      if (isChecked) {
        return { ...prevAttendance, [member.id]: member };
      } else {
        const newState = { ...prevAttendance };
        delete newState[member.id];
        return newState;
      }
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <Box sx={{ p: 5 }}>
        <DialogTitle>
          Select Event for {selectedDate ? selectedDate : ""}
        </DialogTitle>
        <FormControl fullWidth>
          <Select
            value={selectedEvent ? selectedEvent.id : ""}
            onChange={(e) => {
              const eventId = e.target.value;
              const event = calendarRef.current.getApi().getEventById(eventId);
              setSelectedEvent(event);
            }}
            sx={{ minWidth: 200, mb: 1 }}
          >
            {selectedDate &&
              events.map((event, index) => (
                <MenuItem key={`${event.id}-${index}`} value={event.id}>
                  {event.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <AttendanceTable
          eventId={selectedEvent ? selectedEvent.id.split("_")[0] : null}
          googleCalendarId={"dcromp88@googlemail.com"}
          handleAttendanceChange={handleAttendanceChange}
          handleScoreChange={handleScoreChange}
          handleWinChange={handleWinChange}
        ></AttendanceTable>
      </Box>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          sx={{
            backgroundColor: "darkmagenta",
            color: "white",
            "&:hover": {
              backgroundColor: "purple",
            },
          }}
          onClick={saveScores}
        >
          Send GLD
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Main calendar component
function Calendar() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleClick = (date, event) => {
    const dateStr = date.dateStr.slice(0, 10);
    const calendarApi = calendarRef.current.getApi();
    let filteredEvents = calendarApi
      .getEvents()
      .filter((e) => e.startStr.slice(0, 10) === dateStr);
    if (event) {
      // If event is provided, handle it as an event click
      event.jsEvent.preventDefault();
      setSelectedEvent(event.event);
    } else {
      // If no event is provided, handle it as a date click
      if (filteredEvents.length === 1) {
        setSelectedEvent(filteredEvents[0]);
      } else {
        setSelectedEvent(null);
      }
    }
    setSelectedDate(dateStr);
    setEvents(filteredEvents);
    // Only open the dialog if there are events on the selected date
    if (filteredEvents.length > 0) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.addEventSource({
        googleCalendarApiKey: `${process.env.REACT_APP_CALENDAR_APIKEY}`,
        googleCalendarId: "dcromp88@googlemail.com",
      });
    }
  }, [calendarRef]);

  return (
    <Paper sx={{ maxWidth: "800px", margin: "10 auto", mt: 4, p: 2 }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
        initialView="dayGridMonth"
        dateClick={handleClick}
        eventClick={(info) =>
          handleClick({ dateStr: info.event.startStr }, info)
        }
      />
      <EventDialog
        open={open}
        handleClose={handleClose}
        selectedDate={selectedDate}
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        calendarRef={calendarRef}
      />
    </Paper>
  );
}

export default Calendar;
