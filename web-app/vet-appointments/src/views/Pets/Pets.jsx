import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
// core components
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import { getData } from "utility/API.jsx";

import SaveIcon from "@material-ui/icons/Save";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
    width: 200
  }
};

class Pets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registerPetPanelExpanded: false,
      petName: "",
      petType: "",
      ownerFirstName: "",
      ownerLastName: "",
      ownerPhoneNo: "",
      ownerEmailId: "",
      registeredPets: []
    };

    this.expandPanel = (event, expanded) => {
      if (expanded) {
        this.setState({ registerPetPanelExpanded: true });
      } else {
        this.setState({ registerPetPanelExpanded: false });
      }
    };

    this.handlePetName = event => {
      const userInput = event.target.value;
      this.setState({
        petName: userInput
      });
    };

    this.handleOwnerFirstName = event => {
      const userInput = event.target.value;
      this.setState({
        ownerFirstName: userInput
      });
    };

    this.handleOwnerLastName = event => {
      const userInput = event.target.value;
      this.setState({
        ownerLastName: userInput
      });
    };

    this.handleOwnerPhoneNo = event => {
      const userInput = event.target.value;
      this.setState({
        ownerPhoneNo: userInput
      });
    };

    this.handleOwnerEmailId = event => {
      const userInput = event.target.value;
      this.setState({
        ownerEmailId: userInput
      });
    };

    this.handleSubmit = event => {
      event.preventDefault();

      let requestBody = JSON.stringify({
        name: this.state.petName,
        ownerFirstName: this.state.ownerFirstName,
        ownerLastName: this.state.ownerLastName,
        ownerPhoneNo: this.state.ownerPhoneNo,
        ownerEmailId: this.state.ownerEmailId
      });

      (async () => {
        const rawResponse = await fetch("http://localhost:8080/api/v1/pet", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: requestBody
        });
        const pet = await rawResponse.json();
        let petData = [
          pet.id,
          pet.name,
          pet.ownerFirstName + " " + pet.ownerLastName,
          pet.ownerPhoneNo.toString(),
          pet.ownerEmailId
        ];
        let allPets = [petData];

        this.state.registeredPets.forEach(pet => allPets.push(pet));
        this.setState({
          registeredPets: allPets
        });
      })();
    };
  }

  componentDidMount() {
    getData("http://localhost:8080/api/v1/pet")
      .then(response => {
        let allPets = [];
        response.forEach(pet =>
          allPets.push([
            pet.id.toString(),
            pet.name,
            pet.ownerFirstName + " " + pet.ownerLastName,
            pet.ownerPhoneNo.toString(),
            pet.ownerEmailId
          ])
        );
        return allPets;
      })
      .then(allPets => {
        this.setState({
          registeredPets: allPets
        });
      });
  }

  render() {
    return (
      <div>
        <ExpansionPanel
          expanded={this.state.registerPetPanelExpanded}
          onChange={this.expandPanel}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography>Register Pet</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <form
              noValidate
              autoComplete="off"
              onSubmit={this.handleSubmit}
              style={{ width: "100%", align: "center" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="petName"
                    label="Pet Name"
                    className="textField"
                    value={this.state.petName}
                    onChange={this.handlePetName}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="ownerFirstName"
                    label="Owner First Name"
                    className="textField"
                    value={this.state.ownerFirstName}
                    onChange={this.handleOwnerFirstName}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="ownerLastName"
                    label="Owner Last Name"
                    className="textField"
                    value={this.state.ownerLastName}
                    onChange={this.handleOwnerLastName}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="ownerPhoneNo"
                    label="Phone Number"
                    className="textField"
                    value={this.state.ownerPhoneNo}
                    onChange={this.handleOwnerPhoneNo}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    required
                    fullWidth
                    id="ownerEmailId"
                    label="Email ID"
                    className="textField"
                    value={this.state.ownerEmailId}
                    onChange={this.handleOwnerEmailId}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={9}></Grid>
                <Grid item xs={3}>
                  <Button type={"submit"} variant="contained" size="medium">
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
                <h4 className={this.props.cardTitleWhite}>
                  All Registered Pets
                </h4>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["#", "Name", "Owner", "Phone#", "Email ID"]}
                  tableData={this.state.registeredPets}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Pets.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(Pets);
