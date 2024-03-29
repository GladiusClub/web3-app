import axios from "axios";
import moment from "moment";
import { rrulestr } from "rrule";

const googleCalendarApiKey = `${process.env.REACT_APP_CALENDAR_APIKEY}`;

export async function getFormattedCalendarEvents(timeMin, googleCalendarId) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?key=${googleCalendarApiKey}&timeMin=${timeMin}`
    );
    const items = response.data.items;
    const formattedEvents = items.map((event) => {
      let recurring = event.recurrence ? true : false;
      let recurringText = "";
      let start = moment(event.start.dateTime || event.start.date).format("LT");
      if (recurring) {
        const rrule = rrulestr(event.recurrence[0]);
        recurringText = rrule.toText();
        if (rrule.origOptions.dtstart) {
          start = moment(rrule.origOptions.dtstart).format("LT");
        }
      }
      return {
        start: start,
        summary: event.summary,
        selected: false,
        recurring: recurring,
        recurringText: recurringText,
        eventId: event.id, // parent event id
        calendarId: googleCalendarId, // calendar id
      };
    });
    return formattedEvents;
  } catch (error) {
    console.log(error);
    return [];
  }
}


export async function getNextEvent(className, timeMin) {
  return "Backend offline";
}