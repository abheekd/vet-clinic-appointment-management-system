import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Danger from "components/Typography/Danger.jsx";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";

import moment from "moment-timezone";
import MomentUtils from "@date-io/moment";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

// core components
import Button from "components/CustomButtons/Button.jsx";

import SaveIcon from "@material-ui/icons/Save";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { postData } from "utility/API.jsx";

class BookAppointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      petId: "",
      vetId: "",
      appointmentStart: new Date(),
      appointmentEnd: new Date(),
      bookAppointmentPanelExpanded: false
    };

    this.expandPanel = (event, expanded) => {
      if (expanded) {
        this.setState({
          bookAppointmentPanelExpanded: true
        });
      } else {
        this.setState({
          bookAppointmentPanelExpanded: false
        });
      }
    };

    this.handlePetId = event => {
      let userInput = event.target.value;
      this.setState({
        petId: userInput
      });
    };

    this.handleVetId = event => {
      let userInput = event.target.value;
      this.setState({
        vetId: userInput
      });
    };

    this.handleAppointmentStart = date => {
      let userInput = date;
      this.setState({
        appointmentStart: userInput
      });
    };

    this.handleAppointmentEnd = date => {
      let userInput = date;
      this.setState({
        appointmentEnd: userInput
      });
    };

    this.handleSubmit = () => {
      this.setState({ errorMessage: null });
      var tz = moment.tz.guess();
      let requestBody = {
        start: moment.tz(this.state.appointmentStart, tz).format(),
        end: moment.tz(this.state.appointmentEnd, tz).format(),
        petId: this.state.petId,
        vetId: this.state.vetId,
        timeZone: moment.tz.guess()
      };

      console.log(this.state);

      postData("http://localhost:8080/api/v1/appointment", requestBody)
        .then(response => {
          if (response.message != null) {
            this.setState({ errorMessage: response.message });
          } else if (typeof this.props.onSuccess === "function") {
            this.props.onSuccess();
          }
        })
        .catch(error => {
          console.log(error);
        });
    };
  }
  render() {
    return (
      <ExpansionPanel
        expanded={this.state.bookAppointmentPanelExpanded}
        onChange={this.expandPanel}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>Book Appointment</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={2}>
            {this.state.errorMessage ? (
              <Grid item xs={12}>
                <Danger>{this.state.errorMessage}</Danger>
              </Grid>
            ) : (
              ""
            )}
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
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  required
                  fullWidth
                  disablePast
                  showTodayButton
                  id="appointmentStart"
                  label="Appointment Start"
                  className="textField"
                  value={this.state.appointmentStart}
                  onChange={this.handleAppointmentStart}
                  margin="normal"
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={4}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  required
                  fullWidth
                  disablePast
                  showTodayButton
                  id="appointmentEnd"
                  label="Appointment End"
                  className="textField"
                  value={this.state.appointmentEnd}
                  onChange={this.handleAppointmentEnd}
                  margin="normal"
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={10}></Grid>
            <Grid item xs={2}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={this.handleSubmit}
              >
                <SaveIcon />
                Save
              </Button>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

BookAppointment.propTypes = {
  onSuccess: PropTypes.func
};

export default BookAppointment;
