import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// core components
import Button from "components/CustomButtons/Button.jsx";
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle.jsx";

import CloseIcon from "@material-ui/icons/Close";

function CustomTable({ ...props }) {
  const { classes, onCancel, tableHead, tableData, tableHeaderColor } = props;
  return (
    <div className={classes.tableResponsive}>
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {tableData.map((row, key) => {
            return (
              <TableRow key={key} className={classes.tableBodyRow}>
                {row.map((column, key) => {
                  return (
                    <TableCell className={classes.tableCell} key={key}>
                      {key === 4 && column === false ? (
                        <Button
                          color="primary"
                          variant="transparent"
                          onClick={onCancel(row[0])}
                        >
                          <CloseIcon />
                        </Button>
                      ) : key === 4 && column === true ? (
                        "Cancelled"
                      ) : key === 1 && typeof column === "string" ? (
                        <a href="#">{column}</a>
                      ) : (
                        column
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray"
};

CustomTable.propTypes = {
  onCancel: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray"
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.any))
};

export default withStyles(tableStyle)(CustomTable);
