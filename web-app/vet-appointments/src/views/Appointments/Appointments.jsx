import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// core components
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import SaveIcon from '@material-ui/icons/Save';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  textField: {
    width: 200,
  }
}

class Appointments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookAppointmentPanelExpanded: false,
      petId: "",
      vetId: "",
      appointmentStart: "",
      appointmentEnd: "",
      allAppointments: [],
      currentAppointments: []
    };

    this.expandPanel = (event, expanded) => {
      if(expanded) {
          this.setState({bookAppointmentPanelExpanded : true});
      } else {
        this.setState({bookAppointmentPanelExpanded : false});
      }
    };

    this.handlePetId = (event) => {
      const userInput = event.target.value;
      this.setState({
        petId : userInput
      });
    };

    this.handleVetId = (event) => {
      const userInput = event.target.value;
      this.setState({
        vetId : userInput
      });
    };

    this.handleAppointmentStart = (event) => {
      const userInput = event.target.value;
      this.setState({
        appointmentStart : userInput
      });
    };

    this.handleAppointmentEnd = (event) => {
      const userInput = event.target.value;
      this.setState({
        appointmentEnd : userInput
      });
    };

    this.loadComponent = () => {
      (async () => {
        let allAppointments = await fetch('http://localhost:8080/api/v1/appointment')
          .then(response => response.json())
          .then(response => {
            let allAppointments = [];
            response.map(appointment => {
              let start = new Date(appointment.start);
              let end = new Date(appointment.end);

              allAppointments.push([
                appointment.id.toString(),
                appointment.pet.name,
                appointment.vet.firstName + " " + appointment.vet.lastName,
                start.toLocaleString() + " to " + end.toLocaleTimeString()
              ]);
            });
            return allAppointments;
          });
        let currentAppointments = await fetch('http://localhost:8080/api/v1/appointment/current')
          .then(response => response.json())
          .then(response => {
            let currentAppointments = [];
            response.map(appointment => {
              let start = new Date(appointment.start);
              let end = new Date(appointment.end);

              currentAppointments.push([
                appointment.id.toString(),
                appointment.pet.name,
                appointment.vet.firstName + " " + appointment.vet.lastName,
                start.toLocaleString() + " to " + end.toLocaleTimeString()
              ]);
            });
            return currentAppointments;
          });

        this.setState({
          allAppointments: allAppointments,
          currentAppointments: currentAppointments
        });
      })();
    };

    this.handleSubmit = (event) => {
      event.preventDefault();

      console.log(this.state);
      let requestBody = JSON.stringify({
          start: new Date(this.state.appointmentStart).toJSON(),
          end: new Date(this.state.appointmentEnd).toJSON(),
          petId: this.state.petId,
          vetId: this.state.vetId,
      });

      (async () => {
        const rawResponse = await fetch('http://localhost:8080/api/v1/appointment', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: requestBody
        });
        const appointment = await rawResponse.json();
      })();

      this.loadComponent();
    };
  }

  componentDidMount() {
    this.loadComponent();
  }

  render() {
    return (
      <div>
        <ExpansionPanel expanded={this.state.bookAppointmentPanelExpanded} onChange={this.expandPanel}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography>Book Appointment</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <form
              noValidate
              autoComplete="off"
              onSubmit={this.handleSubmit}
              style={{width: '100%', align: 'center'}}
              >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="petId"
                    label="Pet"
                    value={this.state.petId}
                    className="textField"
                    onChange={this.handlePetId}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    required
                    fullWidth
                    id="vetId"
                    label="Vet"
                    value={this.state.vetId}
                    className="textField"
                    onChange={this.handleVetId}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    required
                    fullWidth
                    id="appointmentStart"
                    label="Appointment Start"
                    helperText="e.g. 2019-06-27'T'20:00:00+05:30"
                    className="textField"
                    value={this.state.appointmentStart}
                    onChange={this.handleAppointmentStart}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    required
                    fullWidth
                    id="appointmentEnd"
                    label="Appointment End"
                    helperText="e.g. 2019-06-27'T'20:00:00+05:30"
                    className="textField"
                    value={this.state.appointmentEnd}
                    onChange={this.handleAppointmentEnd}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={9}>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    type={'submit'}
                    variant="contained"
                    size="medium">
                    <SaveIcon />
                    Save
                  </Button>
                </Grid>
              </Grid>
            </form>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={this.props.cardTitleWhite}>Today's Appointments</h4>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={['#', 'Pet', 'Vet', 'Appointment Slot']}
                  tableData={this.state.currentAppointments}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={this.props.cardTitleWhite}>All Appointments</h4>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={['#', 'Pet', 'Vet', 'Appointment Slot']}
                  tableData={this.state.allAppointments}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Appointments.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(Appointments);
