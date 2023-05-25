import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FakeMembers } from "../../fakeData";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Checkbox,
  Button,
  Paper,
  Box,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

// This component represents a single row in the member table
function MemberRow({ member, handleCheckboxChange }) {
  const [intVal, setIntVal] = useState("");
  const [isIntError, setIsIntError] = useState(false);

  const handleIntChange = (event) => {
    const val = event.target.value;

    if (val === "" || Number.isInteger(Number(val))) {
      setIsIntError(false);
    } else {
      setIsIntError(true);
    }

    setIntVal(val);
  };

  return (
    <TableRow key={member.name}>
      <TableCell>{member.name}</TableCell>
      <TableCell>
        <Checkbox
          checked={member.attendance}
          onChange={(event) => handleCheckboxChange(event, member)}
        />
      </TableCell>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          inputProps={{
            step: 1,
            min: 0,
          }}
          placeholder="Enter an integer"
          error={isIntError}
          value={intVal}
          onChange={handleIntChange}
          helperText={isIntError ? "Not an Integer." : ""}
        />
      </TableCell>
      <TableCell>
        <TextField
          type="number"
          inputProps={{
            step: 0.01,
            min: 0,
          }}
          placeholder="Enter a float"
        />
      </TableCell>
    </TableRow>
  );
}

// This component represents the member table
function MemberTable({ handleCheckboxChange }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Attendance</TableCell>
          <TableCell>Win</TableCell>
          <TableCell>Scores</TableCell>
          <TableCell>Coefficent</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {FakeMembers.map((member) => (
          <MemberRow
            key={member.name}
            member={member}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}
      </TableBody>
    </Table>
  );
}

// This component represents the event dialog
function EventDialog({
  open,
  handleClose,
  selectedDate,
  events,
  selectedEvent,
  setSelectedEvent,
  calendarRef,
  handleCheckboxChange,
}) {
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
        <MemberTable handleCheckboxChange={handleCheckboxChange} />
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
          onClick={handleClose}
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
  const [selectedMembers, setSelectedMembers] = useState([]);
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

  const handleCheckboxChange = (event, member) => {
    const isChecked = event.target.checked;

    setSelectedMembers((prevSelectedMembers) => {
      if (isChecked) {
        return [...prevSelectedMembers, member];
      } else {
        return prevSelectedMembers.filter((m) => m !== member);
      }
    });
    console.log(selectedMembers);
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
        handleCheckboxChange={handleCheckboxChange}
      />
    </Paper>
  );
}

export default Calendar;
