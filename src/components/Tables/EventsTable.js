import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from "@mui/material";
import { getFormattedCalendarEvents } from "../Apis/googleCalendar";
import { useClub } from "../contexts/clubContext";

function EventRow({ event, handleEventsChange }) {
  return (
    <TableRow key={event.summary}>
      <TableCell>{event.summary}</TableCell>
      <TableCell>{event.start}</TableCell>
      <TableCell>{event.recurring ? event.recurringText : "No"}</TableCell>
      <TableCell>
        <Checkbox
          checked={event.selected || false}
          onChange={(e) => handleEventsChange(e, event)}
        />
      </TableCell>
    </TableRow>
  );
}

// This component represents the events table
function EventsTable({ setSelectedEvents }) {
  const [events, setEvents] = useState([]);
  const [clubCalendar, setClubCalendar] = useState();
  const { clubs } = useClub();

  useEffect(() => {
    if (clubs[0]) {
      setClubCalendar(clubs[0].calendars[0]);
    }
  }, [clubs]);

  const handleEventsChange = (e, changedEvent) => {
    const isChecked = e.target.checked;

    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) =>
        event.summary === changedEvent.summary
          ? { ...event, selected: isChecked }
          : event
      );
      // Update selected events with only calendarId and eventId
      setSelectedEvents(
        updatedEvents
          .filter((event) => event.selected)
          .map(({ calendarId, eventId }) => ({ calendarId, eventId }))
      );
      return updatedEvents;
    });
  };

  useEffect(() => {
    if (!clubCalendar) return; // This will exit the effect if clubCalendar is not populated

    const now = moment().toISOString();
    getFormattedCalendarEvents(now, clubCalendar)
      .then((formattedEvents) => {
        console.log(formattedEvents);
        setEvents(formattedEvents);
      })
      .catch((error) => console.log(error));
  }, [clubCalendar]);
  

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Event</TableCell>
          <TableCell>Start Time</TableCell>
          <TableCell>Recurrence</TableCell>
          <TableCell>Select</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((event) => (
          <EventRow
            key={event.eventId}
            event={event}
            handleEventsChange={handleEventsChange}
          />
        ))}
      </TableBody>
    </Table>
  );
}

export default EventsTable;
