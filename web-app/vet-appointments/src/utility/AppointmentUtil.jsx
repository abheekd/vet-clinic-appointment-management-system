export const processAppointments = data => {
  let appointments = [];
  data.forEach(appointment => {
    let start = new Date(appointment.start);
    let end = new Date(appointment.end);

    appointments.push([
      appointment.id.toString(),
      appointment.pet.name,
      appointment.vet.firstName + " " + appointment.vet.lastName,
      start.toLocaleString() + " to " + end.toLocaleTimeString(),
      appointment.cancelled
    ]);
  });
  return appointments;
};
