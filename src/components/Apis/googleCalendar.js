import axios from "axios";

const googleCalendarApiKey = `${process.env.REACT_APP_CALENDAR_APIKEY}`;
const googleCalendarId = "dcromp88@googlemail.com";

export async function getCalendarEvents(timeMin) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?key=${googleCalendarApiKey}&timeMin=${timeMin}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}
