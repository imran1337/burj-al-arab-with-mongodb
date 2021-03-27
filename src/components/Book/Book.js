import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { auth } from "./../../firebase";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Button } from "@material-ui/core";

const Book = () => {
  const { bedType } = useParams();
  const { displayName } = auth.currentUser;

  const [selectedDate, setSelectedDate] = useState({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 3600 * 1000 * 48),
  });

  const [btnDisable, setBtnDisable] = useState(false);

  const handleDate = (date, statePropName) => {
    const newDates = { ...selectedDate };
    console.log(newDates);
    newDates[statePropName] = date;
    setSelectedDate(newDates);
    console.log("working", { selectedDate });
  };

  const handleBooking = () => {
    setBtnDisable(true);
    const { displayName, email } = auth.currentUser;
    const namePresent = displayName || "User"
    const newBooking = { name: namePresent, email, bedType ,bookingDate: selectedDate };
    fetch("http://localhost:4007/addBooking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTimeout(() => {
          setBtnDisable(false);
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>
          Hello, {displayName}! Let's book a {bedType} Room.
        </h1>
        <p>
          Want a <Link to="/home">different room?</Link>{" "}
        </p>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Check In Date"
              format="dd/MM/yyyy"
              value={selectedDate.checkIn}
              onChange={(date) => handleDate(date, "checkIn")}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Check Out Date"
              format="dd/MM/yyyy"
              value={selectedDate.checkOut}
              onChange={(date) => handleDate(date, "checkOut")}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
          <Button
            variant="contained"
            color="secondary"
            className="center"
            onClick={handleBooking}
            disabled={btnDisable}
          >
            Book Now
          </Button>
        </MuiPickersUtilsProvider>
      </div>
    </>
  );
};

export default Book;
