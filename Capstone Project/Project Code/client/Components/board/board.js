import React, { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { SettingsContext } from "../../SettingsContext";
import Column from "./column";
import "./board.css";

export default function Board() {
  const [settings, setSettings] = useContext(SettingsContext);
  const [columnsArray, setColumnsArray] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(
      "http://" + settings.url + ":" + settings.port
    );

    socketRef.current.emit("column_pull");

    socketRef.current.on("column_record", (record) => {
      setColumnsArray((columnsArray) => [...columnsArray, record]);
    });

    // close connection
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const addColumn = (e) => {
    e.preventDefault();
    console.log("inside addColumn");
    const newCol = {
      column_id: columnsArray.length + 1,
      column_name: "New Column",
    };
    setColumnsArray((columnsArray) => [...columnsArray, newCol]);
    socketRef.current.emit("column_insert", newCol);
  };

  const updateColumnName = (e) => {
    console.log("We made it!");
    let colParent = document.querySelector(".column").closest(".near.ancestor");
    console.log(colParent);
    colParent = colParent.id.slice(3, 4);
    console.log(colParent);
    colRecord = {
      column_id: colParent,
      column_name: e.target.value,
    };
    console.log(colRecord);
    socketRef.current.emit("column_update", colRecord);
    console.log(socketRef.current);
  };

  return (
    <>
      <div class="column-container">
        {columnsArray
          ? columnsArray.map((column) => (
              <Column
                key={column.column_id}
                column={column}
                updateColumn={updateColumnName}
              />
            ))
          : "Loading..."}
      </div>
      <button id="addcol" onClick={addColumn}>
        <span>&#43;</span>
      </button>
    </>
  );
}
