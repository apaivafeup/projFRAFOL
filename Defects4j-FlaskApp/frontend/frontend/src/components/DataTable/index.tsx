import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "./DataTableStyle.css";
import { useCurrentProject } from "../../context/currentProject";

interface DataTableComponentProps {}

const DataTableComponent = ({}: DataTableComponentProps) => {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const dataTableInstance = useRef<any>(null);
  const {
    currentProject,
    setJumpToLineNumberOnClassUnderMutation,
    excludeKilledMutants,
    setExcludeKilledMutants,
  } = useCurrentProject();

  useEffect(() => {
    if (!tableRef.current) return;

    if (dataTableInstance.current) {
      dataTableInstance.current.destroy();
      $(tableRef.current).empty();
    }

    dataTableInstance.current = $(tableRef.current).DataTable({
      paging: true,
      searching: true,
      responsive: true,
      outerHeight: 400,
      lengthMenu: [
        [8, 25, 50, -1],
        [8, 25, 50, "All"],
      ],
      order: [[1, "asc"]],
      autoWidth: true,
      lengthChange: true,
      stateSave: true,
      pageLength: 8,
      scrollCollapse: true,
      scroller: true,
      scrollY: "100%",
      scrollX: "100%",
    });

    return () => {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
        dataTableInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      !dataTableInstance.current ||
      !currentProject ||
      !currentProject.mutantSheetData
    )
      return;

    const filteredData = excludeKilledMutants
      ? currentProject.mutantSheetData.filter(
          (row) => !currentProject.killedMutants.includes(row[0]),
        )
      : currentProject.mutantSheetData;

    if (!filteredData.length) {
      return;
    }

    dataTableInstance.current.clear();

    filteredData.forEach((row) => {
      const rowElement = document.createElement("tr");
      const isKilled = currentProject.killedMutants.includes(row[0]);

      if (isKilled) {
        rowElement.classList.add("killed-mutant");
      }

      rowElement.style.cursor = "pointer";
      rowElement.addEventListener("click", () => {
        const lineNumber = parseInt(row[1], 10);
        if (!isNaN(lineNumber)) {
          setJumpToLineNumberOnClassUnderMutation(lineNumber);
        }
      });

      row.forEach((cell) => {
        const cellElement = document.createElement("td");
        cellElement.textContent = cell.toString();
        rowElement.appendChild(cellElement);
      });

      dataTableInstance.current.row.add(rowElement);
    });

    dataTableInstance.current.draw();
  }, [
    currentProject,
    excludeKilledMutants,
    setJumpToLineNumberOnClassUnderMutation,
  ]);

  if (!currentProject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="flex items-center  ">
        <input
          id="default-checkbox"
          type="checkbox"
          checked={excludeKilledMutants}
          onChange={(e) => setExcludeKilledMutants(e.target.checked)}
          className="w-4 h-4 text-gray-100 bg-gray-100 border-gray-300 rounded-sm"
        />
        <label
          htmlFor="default-checkbox"
          className="ms-2 text-sm font-medium text-gray-900 "
        >
          Exclude killed mutants.
        </label>
      </div>
      <table ref={tableRef} className="">
        <thead>
          <tr>
            {currentProject.mutantTableHeaders.map((header, index) => (
              <th key={index} style={{ padding: 6 }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody /> {/* ✅ No unnecessary whitespace issues */}
      </table>
    </div>
  );
};

export default DataTableComponent;
