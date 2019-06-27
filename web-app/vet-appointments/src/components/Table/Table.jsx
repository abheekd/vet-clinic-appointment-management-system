import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import {
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@material-ui/core";
import tableStyle from "assets/jss/material-dashboard-react/components/tableStyle.jsx";

import DeleteIcon from "@material-ui/icons/Delete";

function CustomTable({ ...props }) {
  const {
    classes,
    onRowButtonClick,
    tableHead,
    tableData,
    tableHeaderColor
  } = props;

  const onClick = key => {
    if (typeof onRowButtonClick === "function") {
      onRowButtonClick(key);
    }
  };

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
                        <IconButton onClick={() => onClick(row[0])}>
                          <DeleteIcon />
                        </IconButton>
                      ) : key === 4 && column === true ? (
                        <IconButton disabled={true}>
                          <DeleteIcon color="disabled" />
                        </IconButton>
                      ) : key === 1 && typeof column === "string" ? (
                        <a href="appointments">{column}</a>
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
  onRowButtonClick: PropTypes.func.isRequired,
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
