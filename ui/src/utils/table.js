import React from "react";
import PropTypes from "prop-types";
import { getSortIcon } from "./sort";

const Table = ({ data, columns, sortConfig, onSort, customRenderers }) => {
  return (
    <div className="table-container">
      <div className="grid-header">
        {columns.map((column) => (
          <span
            key={column.key}
            onClick={() => column.sortable && onSort(column.key)}
            style={{ cursor: column.sortable ? "pointer" : "default" }}
          >
            {column.label}{" "}
            {column.sortable && getSortIcon(column.key, sortConfig)}
          </span>
        ))}
      </div>
      {Array.isArray(data) &&
        data.map((row, index) => (
          <div className="grid-row" key={index}>
            {columns.map((column) => (
              <div className="grid-cell" key={column.key}>
                {customRenderers && customRenderers[column.key]
                  ? customRenderers[column.key](row, index)
                  : row[column.key]}
              </div>
            ))}
          </div>
        ))}
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
