# 🎫 College Event Booking System · `v1.0.0`

A full-stack MERN web application that enables college students to **register, view, and book events online** in real time.  
Built with a secure and scalable architecture using **MongoDB Atlas**, **React**, **Node.js**, and **Express** — designed for modern college event management.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## Key Features

### For Students
-  **User Registration & Login** with input validations
-  **View All Available Events** on homepage
-  **Event Time Slots & Date Selection**
-  **Live Booking with Seat Limits** *(coming soon)*
-  Confirmation messages *(planned)*

### For Admin (Upcoming in v1.2+)
-  View all bookings and user details
-  Add, edit, or delete event data
-  View seat availability in real-time

---

## Tech Stack

| Layer     | Technologies                         |
|-----------|--------------------------------------|
| Frontend  | React.js, Tailwind CSS, Axios        |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB Atlas, Mongoose              |
| Auth      | JWT (JSON Web Tokens) *(coming soon)* |
| Tools     | Vite, Toastify, React Router DOM     |

---

## Live Demo

>  Coming Soon — Deployed on **Vercel** (Frontend) + **Railway** (Backend)

---

## Project Structure

```bash
college-event-booking-system/
│
├── client/              # React frontend
│   ├── pages/
│   ├── components/
│   ├── services/
│   └── App.jsx
│
├── server/              # Node.js + Express backend (WIP)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
│
├── README.md
├── LICENSE
└── .env.example
