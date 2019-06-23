// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Dog from 'mdi-material-ui/Dog'
import Doctor from 'mdi-material-ui/Doctor'

// core components/views for Admin layout
import Vets from "views/Vets/Vets.jsx";
import Pets from "views/Pets/Pets.jsx";
import Appointments from "views/Appointments/Appointments.jsx";

const dashboardRoutes = [
  {
    path: "/appointments",
    name: "Appointments",
    icon: Dashboard,
    component: Appointments,
    layout: "/admin"
  },
  {
    path: "/pets",
    name: "Patients",
    icon: Dog,
    component: Pets,
    layout: "/admin"
  },
  {
    path: "/vets",
    name: "Doctors",
    icon: Doctor,
    component: Vets,
    layout: "/admin"
  }
];

export default dashboardRoutes;
