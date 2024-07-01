// src/utils/Table.js
import React from "react";
import PropTypes from "prop-types";
import { getSortIcon } from "./sort"; // Adjust the import path if necessary

const Table = ({ data, columns, sortConfig, onSort, customRenderers }) => {
  return (
    <div className="table-container table-responsive">
      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && onSort(column.key)}
                style={{ cursor: column.sortable ? "pointer" : "default" }}
              >
                {column.label}{" "}
                {column.sortable && getSortIcon(column.key, sortConfig)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {customRenderers && customRenderers[column.key]
                      ? customRenderers[column.key](row, index)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool, // Add sortable prop type
      filterable: PropTypes.bool,
    })
  ).isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  onSort: PropTypes.func.isRequired,
  customRenderers: PropTypes.object,
};

export default Table;
