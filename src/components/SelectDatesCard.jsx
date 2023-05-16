import {
  ArrowCircleLeftOutlined,
  ArrowCircleRightOutlined,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Container, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import "../scss/components/SelectDatesCard.scss";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function SelectDatesCard({ onDateSelect }) {
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const scrollRef = useRef(null);
  const { t } = useTranslation();

  const getDaysInCurrentMonth = () => {
    var today = new Date();
    var month = selectedMonth
      ? months.indexOf(selectedMonth)
      : today.getMonth();
    var year = selectedYear;

    // Get the number of days in the month
    var numDays = new Date(year, month + 1, 0).getDate();

    // Create an array to hold the days
    var days = [];

    // Add each day to the array
    for (var i = 1; i <= numDays; i++) {
      days.push(i);
    }
    setDays(days);
  };

  useEffect(() => {
    return () => {};
  }, [days]);

  useEffect(() => {
    //check if selected date is in the days array change month next or previous
    onDateSelect(selectedDate, months.indexOf(selectedMonth), selectedYear);
    scrollRef.current.scrollLeft =
      (scrollRef.current.scrollWidth / days.length) * (selectedDate - 4);
    return () => {};
  }, [selectedDate]);

  useEffect(() => {
    getDaysInCurrentMonth();
    return () => {};
  }, [selectedMonth]);

  useEffect(() => {
    return () => {};
  }, [selectedYear]);

  useEffect(() => {
    let today = new Date();
    let month = today.getMonth();

    setSelectedDate(today.getDate());
    setSelectedMonth(months[month]);

    return () => {};
  }, []);

  return (
    <Container className="selectedDateCard">
      {/* show days as bubble button */}
            <Button variant="outlined">
              <ArrowCircleLeftOutlined
                onClick={() => {
                  // if current month is january set the month to december and set the year to previous year
                  if (selectedMonth === months[0]) {
                    setSelectedMonth(months[11]);
                    setSelectedYear(selectedYear - 1);
                    return;
                  }
                  setSelectedMonth(months[months.indexOf(selectedMonth) - 1]);
                }}
              />
            </Button>
            <b>{t((selectedMonth && selectedMonth.substring(0, 3))) || null}</b>{" "}
            <b>{selectedYear || null}</b>
            <Button
              variant="outlined"
              disabled={
                (months.indexOf(selectedMonth) === new Date().getMonth() &&
                  selectedYear === new Date().getFullYear()) ||
                (selectedYear === new Date().getFullYear() &&
                  selectedMonth === months[11])
              }
            >
              <ArrowCircleRightOutlined
                onClick={() => {
                  // if current month is december set the month to january and set the year to next year
                  if (
                    (months.indexOf(selectedMonth) === new Date().getMonth() &&
                      selectedYear === new Date().getFullYear()) ||
                    (selectedYear === new Date().getFullYear() &&
                      selectedMonth === months[11])
                  ) {
                    toast.error("You can't select future dates", {
                      position: "top-center",
                      autoClose: 300,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    });
                    return;
                  }

                  if (selectedMonth === months[11]) {
                    setSelectedMonth(months[0]);
                    setSelectedYear(selectedYear + 1);
                    return;
                  }
                  setSelectedMonth(months[months.indexOf(selectedMonth) + 1]);
                }}
              />
            </Button>
      <Col
        className="rowOverFlow"
        ref={scrollRef}
      >
        {days.map((day, index) => {
          return (
            <div  style={styles.ColDays} key={index}>
              {/* get days name */}
              <p>
                {t(new Date(selectedYear, months.indexOf(selectedMonth), day)
                  .toDateString()
                  .substring(0, 3))}
              </p>
              <Button
                variant="outline-light"
                // if disabled is true then background color is grey
                style={{
                  backgroundColor:
                    selectedYear === new Date().getFullYear() &&
                    selectedMonth === months[new Date().getMonth()] &&
                    day > new Date().getDate()
                      ? "grey"
                      : "",
                  ...styles.Buttons,
                }}
                onClick={() => {
                  setSelectedDate(day);
                }}
                className={selectedDate === day ? "active" : ""}
                disabled={
                  selectedYear === new Date().getFullYear() &&
                  selectedMonth === months[new Date().getMonth()] &&
                  day > new Date().getDate()
                }
              >
                {day}
              </Button>
            </div>
          );
        })}
      </Col>
      {/* </Container> */}
    </Container>
  );
}

const styles = {
  ColDays: {
    margin: "0rem .1rem ",
  },

  Buttons: {
    borderRadius: 50,
    width: "3rem",
    height: "3rem",
  },
};

export default SelectDatesCard;
