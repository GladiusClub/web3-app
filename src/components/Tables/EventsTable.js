import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, TableBody, TableRow, TableCell, Checkbox } from "@mui/material";

const googleCalendarApiKey = `${process.env.REACT_APP_CALENDAR_APIKEY}`;
const googleCalendarId = "dcromp88@googlemail.com";

function EventRow({ event, handleEventsChange }) {
  return (
    <TableRow key={event.summary}>
      <TableCell>{event.summary}</TableCell>
      <TableCell>{event.start}</TableCell>
      <TableCell>
        <Checkbox
          checked={event.selected || false}
          onChange={(e) => handleEventsChange(e, event)}
        />
      </TableCell>
    </TableRow>
  );
}

// This component represents the member table
function EventsTable({ setSelectedEvents }) {
  const [events, setEvents] = useState([]);

  const handleEventsChange = (e, changedEvent) => {
    const isChecked = e.target.checked;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) =>
        event.summary === changedEvent.summary
          ? { ...event, selected: isChecked }
          : event
      );
      setSelectedEvents(updatedEvents.filter((event) => event.selected));
      return updatedEvents;
    });
  };

  useEffect(() => {
    const now = moment().toISOString(); // get current date and time
    axios
      .get(
        `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?timeMin=${now}&key=${googleCalendarApiKey}`
      )
      .then((response) => {
        const items = response.data.items;
        const formattedEvents = items.map((event) => ({
          start: moment(event.start.dateTime || event.start.date).format(
            "LLLL"
          ),
          summary: event.summary,
          selected: false, // add a selected property to each event
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Table>
      <TableBody>
        {events.map((event) => (
          <EventRow
            key={event.summary}
            event={event}
            handleEventsChange={handleEventsChange}
          />
        ))}
      </TableBody>
    </Table>
  );
}

export default EventsTable;
