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
import { getCalendarEvents } from "../Apis/googleCalendar";
import { rrulestr } from "rrule";

function EventRow({ event, handleEventsChange }) {
  return (
    <TableRow key={event.summary}>
      <TableCell>{event.summary}</TableCell>
      <TableCell>{event.start}</TableCell>
      <TableCell>{event.recurring ? event.recuring_text : "No"}</TableCell>
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
    const now = moment().toISOString();
    getCalendarEvents(now)
      .then((data) => {
        const items = data.items;
        const formattedEvents = items.map((event) => {
          let recurring = event.recurrence ? true : false;
          let recuring_text = "";
          let start = moment(event.start.dateTime || event.start.date).format(
            "LT"
          );
          if (recurring) {
            const rrule = rrulestr(event.recurrence[0]);
            recuring_text = rrule.toText();
            if (rrule.origOptions.dtstart) {
              start = moment(rrule.origOptions.dtstart).format("LT");
            }
          }
          return {
            start: start,
            summary: event.summary,
            selected: false,
            recurring: recurring,
            recuring_text: recuring_text,
          };
        });
        setEvents(formattedEvents);
      })
      .catch((error) => console.log(error));
  }, []);

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
