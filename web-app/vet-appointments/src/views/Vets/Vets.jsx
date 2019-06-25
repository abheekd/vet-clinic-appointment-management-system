import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
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

class Vets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerVetPanelExpanded: false,
      firstName: "",
      lastName: "",
      phoneNo: "",
      emailId: "",
      registeredVets: []
    };

    this.expandPanel = (event, expanded) => {
      if(expanded) {
          this.setState({registerVetPanelExpanded : true});
      } else {
        this.setState({registerVetPanelExpanded : false});
      }
    };

    this.handleFirstName = (event) => {
      const userInput = event.target.value;
      this.setState({
        firstName : userInput
      });
    }

    this.handleLastName = (event) => {
      const userInput = event.target.value;
      this.setState({
        lastName : userInput
      });
    }

    this.handlePhoneNo = (event) => {
      const userInput = event.target.value;
      this.setState({
        phoneNo : userInput
      });
    }

    this.handleEmailId = (event) => {
      const userInput = event.target.value;
      this.setState({
        emailId : userInput
      });
    }

    this.handleSubmit = (event) => {
      event.preventDefault();

      console.log(this.state);
      let requestBody = JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phoneNo: this.state.phoneNo,
          emailId: this.state.emailId,
      });

      (async () => {
        const rawResponse = await fetch('http://localhost:8080/api/v1/vet', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: requestBody
        });
        const vet = await rawResponse.json();
        let vetData = [vet.id.toString(),
                       vet.firstName + " " + vet.lastName,
                       vet.phoneNo.toString(),
                       vet.emailId];
        let allVets = [ vetData ];

        this.state.registeredVets.forEach(vet => allVets.push(vet));
        this.setState({
          registeredVets: allVets
        });
      })();
    }
  }

  componentDidMount() {
    (async () => {
      let allVets = await fetch('http://localhost:8080/api/v1/vet')
        .then(response => response.json())
        .then(response => {
          let allVets = [];
          response.map(vet => allVets.push([
            vet.id.toString(),
            vet.firstName + " " + vet.lastName,
            vet.phoneNo.toString(),
            vet.emailId
          ]));
          return allVets;
        });

        this.setState({
          registeredVets: allVets
        });
    })();
  }

  render() {
    return (
      <div>
        <ExpansionPanel expanded={this.state.registerVetPanelExpanded} onChange={this.expandPanel}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography>Register Doctor</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <form
              noValidate
              autoComplete="off"
              onSubmit={this.handleSubmit}
              style={{width: '100%', align: 'center'}}
              >
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    className="textField"
                    value={this.state.firstName}
                    onChange={this.handleFirstName}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    className="textField"
                    value={this.state.lastName}
                    onChange={this.handleLastName}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="phoneNo"
                    label="Phone Number"
                    className="textField"
                    value={this.state.phoneNo}
                    onChange={this.handlePhoneNo}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="emailId"
                    label="Email ID"
                    className="textField"
                    value={this.state.emailId}
                    onChange={this.handleEmailId}
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
                <h4 className={this.props.cardTitleWhite}>Doctors</h4>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={['#', 'Name', 'Phone#', 'Email ID']}
                  tableData={this.state.registeredVets}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Vets.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(Vets);
