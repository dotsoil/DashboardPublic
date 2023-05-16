import React, { useEffect } from "react";
import { Button, Card, Table } from "react-bootstrap";
import CarouselsCard from "../components/CarouselsCard";
import {
  CancelOutlined,
  DeleteForeverOutlined,
  PendingActionsOutlined,
  SaveAltRounded,
  TranscribeSharp,
} from "@mui/icons-material";
import { TimeSelector } from "./TimeSelector";
import { useSwipeable } from "react-swipeable";
import "../scss/components/fertilizerTable.scss";
import DaysSelector from "./DaysSelector";

const FertilizerTable = () => {
  const [fertilizerSchedule, setFertilizerSchedule] = React.useState(
    [
      {
        time: "18:00",
        days: ["Mon","Sun"],
        duration: "2 hour",
      },
      {
        time: "14:00",
        days: ["Fri", "Wed"],
        duration: "1 hour",
      },
    ].sort((a, b) => {
      return a.time > b.time ? 1 : -1;
    })
  );
  const [editTimeout, setEditTimeout] = React.useState(null);
  const [tempFertilizerSchedule, setTempFertilizerSchedule] = React.useState(
    JSON.parse(JSON.stringify(fertilizerSchedule))
  );

  const handlers = useSwipeable({
    onSwipedLeft: (item) => {
      // get the tr of the td that was swiped and show the delete button
      let trElement = item.event.target.parentElement;
      // effect to show the delete button
      trElement.classList.add("swiped");
      // effect to hide the delete button
      setEditTimeout(
        setTimeout(() => {
          trElement.classList.remove("swiped");
        }, 3000)
      );
    },
    onTap: (item) => {
      // get the tr of the td that was tapped and hide the delete button
      let trElement = item.event.target.parentElement;
      trElement.classList.remove("swiped");
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <Card className="card-fertilizer-list">
      <Card.Header>
        <Card.Title>
          <h3>Fertilizer</h3>
        </Card.Title>
      </Card.Header>
      {/* show scroll list with all the fertilizer alarm set for the week 
                with heading Time, Days1-7, duration 
            */}
      <Card.Body>
        <Table hover responsive {...handlers}>
          <thead>
            <tr>
              <th>Time</th>
              <th>Days</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fertilizerSchedule &&
              // sort the array by time
              fertilizerSchedule.map((item, index) => (
                <tr key={index} className={item.editMode ? "edit-mode" : ""}>
                  <td>
                    <TimeSelector
                      // disable the time selector if the parebt tr class has edit-mode class
                      disabled={!item.editMode}
                      value={item.time}
                      onChange={(event) => {
                        // update the time of the item in the array
                        let newFertilizerSchedule = [...fertilizerSchedule];
                        newFertilizerSchedule[index].time = event.target.value;
                        setFertilizerSchedule(newFertilizerSchedule);
                      }}
                    />
                  </td>
                  <td>
                    <DaysSelector
                      disabled={!item.editMode}
                      key={index}
                      // clear white space and split the string into an array by ,
                      days={item.days}
                      onChange={(event) => {
                        // update the days of the item in the array
                        let newFertilizerSchedule = [...fertilizerSchedule];
                        newFertilizerSchedule[index].days.includes(event.target.value) ?
                        // remove the day from the array
                        newFertilizerSchedule[index].days.splice(newFertilizerSchedule[index].days.indexOf(event.target.value), 1) :
                        newFertilizerSchedule[index].days.push(event.target.value);
                        setFertilizerSchedule(newFertilizerSchedule);
                      }}
                    />{" "}
                  </td>
                  <td>{item.duration}</td>
                  <td>
                    <div className="edit-td">
                      <Button
                        variant="danger"
                        className="delete-button"
                        onClick={(event) => {
                          // delete the item from the array
                          let newFertilizerSchedule = [...fertilizerSchedule];
                          newFertilizerSchedule.splice(index, 1);
                          setFertilizerSchedule(newFertilizerSchedule);
                        }}
                      >
                        <DeleteForeverOutlined />
                      </Button>
                      <Button variant="warning" className="edit-button">
                        <PendingActionsOutlined
                          onClick={(event) => {
                            // delete the timeout to hide the delete button
                            clearTimeout(editTimeout);
                            setEditTimeout(null);
                            // switch to edit mode for the tr change the buttons to save and cancel
                            // update the edit mode of the item in the array
                            let newFertilizerSchedule = [...fertilizerSchedule];
                            newFertilizerSchedule[index].editMode = true;
                          }}
                        />
                      </Button>
                    </div>
                    <div className="edit">
                      <Button variant="success" className="save-button">
                        <SaveAltRounded
                          onClick={(event) => {
                            // switch to edit mode for the tr change the buttons to save and cancel

                            // update the edit mode of the item in the array
                            let newFertilizerSchedule = [...fertilizerSchedule];
                            newFertilizerSchedule[index].editMode = false;
                            newFertilizerSchedule.sort((a, b) => {
                              return a.time > b.time ? 1 : -1;
                            });
                            setFertilizerSchedule(newFertilizerSchedule);
                            setTempFertilizerSchedule(
                              JSON.parse(JSON.stringify(newFertilizerSchedule))
                            );
                          }}
                        />
                      </Button>
                      <Button variant="danger" className="cancel-button">
                        <CancelOutlined
                          onClick={(event) => {
                            // switch to edit mode for the tr change the buttons to save and cancel
                            //   search for the first parent id selector tr
                            // remove timeout to hide the delete button
                            clearTimeout(editTimeout);
                            setEditTimeout(null);
                            // update the fertilizer schedule with the temp fertilizer schedule
                            tempFertilizerSchedule[index].editMode = false;
                            setFertilizerSchedule(
                              JSON.parse(JSON.stringify(tempFertilizerSchedule))
                            );
                          }}
                        />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default FertilizerTable;
