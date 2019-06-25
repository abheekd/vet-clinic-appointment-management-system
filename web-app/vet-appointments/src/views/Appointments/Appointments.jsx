import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import BookAppointment from "views/Appointments/BookAppointment.jsx";
import {getData, postData} from "utility/API.jsx";
import {processAppointments} from "utility/AppointmentUtil.jsx";

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
      errorMessage: "",
      allAppointments: [],
      currentAppointments: []
    };

    this.loadComponent = () => {
      getData('http://localhost:8080/api/v1/appointment')
        .then(response => processAppointments(response))
        .then(allAppointments => {
          this.setState({
            allAppointments: allAppointments
          });
        });

      getData('http://localhost:8080/api/v1/appointment/current')
        .then(response => processAppointments(response))
        .then(currentAppointments => {
          this.setState({
            currentAppointments: currentAppointments
          });
        });
    };
  }

  componentDidMount() {
    this.loadComponent();
  }

  render() {
    return (
      <div>
        <BookAppointment/>
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
