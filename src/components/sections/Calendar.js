import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FakeMembers } from "../../fakeData";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  Paper,
  Box,
} from "@mui/material";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { MenuItem, Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";

function Calendar() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  console.log(selectedMembers);

  const handleDateClick = (info) => {
    // Open popover when a date is clicked
    setSelectedDate(info.dateStr);

    const calendarApi = calendarRef.current.getApi();
    const filteredEvents = calendarApi
      .getEvents()
      .filter((e) => e.startStr.slice(0, 10) === info.dateStr);
    setEvents(filteredEvents);

    // Reset the selected event when a new date is clicked
    setSelectedEvent(null);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (event, member) => {
    const isChecked = event.target.checked;

    // update selectedMembers based on the checkbox selection
    setSelectedMembers((prevSelectedMembers) => {
      if (isChecked) {
        return [...prevSelectedMembers, member];
      } else {
        return prevSelectedMembers.filter((m) => m !== member);
      }
    });
  };

  useEffect(() => {
    // Load events from Google Calendar
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
        dateClick={handleDateClick}
        eventClick={(info) => {
          info.jsEvent.preventDefault(); // prevent the default click action
        }}
      />
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
                const event = calendarRef.current
                  .getApi()
                  .getEventById(eventId);
                setSelectedEvent(event);
              }}
              sx={{ minWidth: 200, mb: 1 }}
            >
              {selectedDate &&
                events.map((event, index) => (
                  <MenuItem key={`${event.id}-${index}`} value={event.id}>
                    {event.title}
                  </MenuItem> //
                ))}
            </Select>
          </FormControl>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {FakeMembers.map((member) => (
                <TableRow key={member.name}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={member.attendance}
                      onChange={(event) => handleCheckboxChange(event, member)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Calendar;
