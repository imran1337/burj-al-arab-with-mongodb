import React, { useState } from "react";
import { useEffect } from "react";
import { auth } from "./../../firebase";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:4007/bookings?email=${auth.currentUser.email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        if (data?.code === "auth/id-token-expired") {
          alert('Token Expired')
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      {Array.isArray(bookings) && (
        <h3>
          You have: <span>{bookings.length}</span> bookings
        </h3>
      )}
      <ul style={{ listStyleType: "none" }}>
        {(Array.isArray(bookings) &&
          bookings.map((booking) => {
            const { _id, name, email, bookingDate, bedType } = booking;
            const { checkIn, checkOut } = bookingDate;
            return (
              <li key={_id}>
                <p>
                  <strong>name:</strong> {name} <strong>email:</strong> {email}{" "}
                  <br />
                  <strong>from:</strong>{" "}
                  {new Date(checkIn).toDateString("dd/MM/yyyy")}{" "}
                  <strong>to:</strong>{" "}
                  {new Date(checkOut).toDateString("dd/MM/yyyy")} <br />
                  {bedType && (
                    <>
                      <strong>Bed Type:</strong> {bedType}
                    </>
                  )}
                </p>
              </li>
            );
          })) ||
          (bookings.success === false && <h1>{bookings.msg}</h1>)}
      </ul>
    </div>
  );
};

export default Bookings;
