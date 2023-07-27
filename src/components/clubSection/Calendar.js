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
import { useClub } from "../contexts/clubContext";

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
  const { recordAttendance } = useClub();
  const [memberChanges, setmemberChanges] = useState([]);
  const resetStateVariables = () => {
    setmemberChanges([]);
  };

  // Inside your component
  useEffect(() => {
    console.log("Values to save: ", memberChanges);
  }, [memberChanges]);

  const recordAttendanceForAllMembers = async () => {
    const eventParentId = selectedEvent ? selectedEvent.id.split("_")[0] : null;
    const eventId = selectedEvent ? selectedEvent.id : null;

    for (let index in memberChanges) {
      const member = memberChanges[index];
      const memberId = member.id;
      const attended = member.attended;
      const memberWin = member.win;
      const memberScore = member.score;
      const memberCoefficient = member.coefficient;

      await recordAttendance(
        "1",
        memberId,
        "dcromp88@googlemail.com",
        selectedDate,
        eventParentId,
        eventId,
        attended,
        memberWin,
        memberScore,
        memberCoefficient
      );
    }
    resetStateVariables();
    handleClose();
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
          eventId={selectedEvent ? selectedEvent.id : null}
          googleCalendarId={"dcromp88@googlemail.com"}
          handleMemberChanged={setmemberChanges}
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
          onClick={recordAttendanceForAllMembers}
        >
          Save
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
