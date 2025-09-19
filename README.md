# 🚑 Smart Ambulance Dispatch and Emergency Response System

## 📌 Overview
The **Smart Ambulance Dispatch and Emergency Response System** is a web-based platform designed to improve emergency medical response in Kenya.  
It provides **real-time ambulance dispatch, geolocation tracking, and centralized coordination** between patients, hospitals, ambulance drivers, and administrators.  

This project is my **Final Year Project** for  
**Bachelor of Science in Computer Science, Laikipia University**.  

---

## 🎯 Problem Statement
Emergency response in Kenya is often **delayed** due to:
- Lack of a **centralized ambulance dispatch system**  
- **Prank/joker calls** wasting limited resources  
- Ambulances being **misrouted** to hospitals without availability  

This project solves these challenges by providing a **secure, verified, and real-time dispatch platform**.

---

## 🚀 Features
- 👤 **Patient Dashboard**
  - Send emergency requests
  - Select urgency level (Critical, Urgent, Non-Urgent)
  - Track ambulance in real time  

- 🏥 **Hospital Dashboard**
  - Receive and manage requests
  - Dispatch available ambulances
  - Manage hospital ambulance records  

- 🚑 **Ambulance Driver Dashboard**
  - View assigned requests  
  - Navigate with **GPS + Maps integration**  
  - Update trip status (En Route, Picked Up, Arrived)  

- 🛡 **Admin Dashboard**
  - Oversee hospitals and users  
  - Enforce penalty system for prank calls  
  - Generate reports & analytics  

---

## 🛡️ Emergency Verification
To prevent misuse:
1. **Emergency Level Classification** (Critical, Urgent, Non-Urgent)  
2. **Penalty System** for prank/joker requests (verified ID & phone required).  

---

## 🏗️ Tech Stack
- **Frontend:** React (TypeScript)  
- **Backend:** Node.js (Express)  
- **Database:** PostgreSQL + Drizzle ORM  
- **Maps/Geolocation:** Google Maps API / OpenStreetMap  
- **Notifications:** Firebase (push), Twilio (SMS)  

---

## 📅 Project Timeline (4 Months)
- **Month 1:** Requirement Gathering & System Design  
- **Month 2:** Frontend & Backend Development  
- **Month 3:** Integration (Maps, Notifications, Driver Dashboard) + Testing  
- **Month 4:** Refinement, Documentation & Final Report  

---

## 📊 System Architecture
```mermaid
flowchart TB
    Patient[👤 Patient Dashboard] --> Backend
    Hospital[🏥 Hospital Dashboard] --> Backend
    Driver[🚑 Ambulance Driver Dashboard] --> Backend
    Admin[🛡 Admin Dashboard] --> Backend
    Backend[(⚙️ Backend Server)]
