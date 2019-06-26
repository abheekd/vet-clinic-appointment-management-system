package craft.app.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.ZonedDateTime;

public class ValidatorUtils {


    public static boolean validateAppointmentHourOfDay(ZonedDateTime appointmentStart, ZonedDateTime appointmentEnd) {
        int startHourOfDay  = appointmentStart.getHour();
        int endHourOfDay    = appointmentEnd.getHour();
        int endMinuteOfHour = appointmentEnd.getMinute();

        boolean validStart = (startHourOfDay >= 8 && startHourOfDay < 17);
        boolean validEnd   = (endHourOfDay < 17 || (endHourOfDay == 17 && endMinuteOfHour == 0));

        if (!validStart && !validEnd) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Bookings are allowed only between 8am and 5pm.");
        } else {
            return true;
        }
    }

    public static boolean validateAppointmentDayOfWeek(ZonedDateTime appointmentStart) {
        DayOfWeek dayOfWeek = appointmentStart.getDayOfWeek();
        if (dayOfWeek.equals(DayOfWeek.SATURDAY) || dayOfWeek.equals(DayOfWeek.SUNDAY)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Bookings on SATURDAY oor SUNDAY is not allowed.");
        } else {
            return true;
        }
    }

    public static boolean validateAppointmentDuration(Duration requestedAppointmentDuration) {
        Duration appointmentDuration = Duration.ofMinutes(60L);
        if (!requestedAppointmentDuration.equals(appointmentDuration)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Requested duration does not match the allowed duration of 60 minutes.");
        } else {
            return true;
        }
    }
}
