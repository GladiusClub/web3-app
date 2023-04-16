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
} from "@mui/material";
import googleCalendarPlugin from "@fullcalendar/google-calendar";

function Calendar() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const calendarRef = useRef(null);

  console.log(selectedMembers);

  const handleDateClick = (event) => {
    // Open popover when a date is clicked
    setSelectedDate(event.dateStr);
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
        googleCalendarApiKey: "AIzaSyACoMWF8kuIMjujR2owZH26GFv1qg0rRBU",
        googleCalendarId: "dcromp88@googlemail.com",
      });
    }
  }, [calendarRef]);

  return (
    <Paper sx={{ maxWidth: "800px", margin: "0 auto", mt: 4, p: 2 }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin, googleCalendarPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Selected date: {selectedDate ? selectedDate : ""}
        </DialogTitle>
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
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default Calendar;
