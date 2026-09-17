# Vibora

**Vibora** is a full-stack music streaming web application built with the **MERN stack**. It allows users to browse and search for songs, create a personalized listening experience, and play music through a global music player.

The application also includes an **artist role** that allows authorized artists to upload songs and manage albums.

----------------------------------------------------------------------------------   ---------------------

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Authentication using **HTTP-only cookies**
* Persistent login using a `/me` endpoint
* Secure password hashing using **bcrypt**
* Protected frontend routes
* Protected backend routes
* Role-based authorization
* Separate permissions for `user` and `artist` roles
* Secure logout functionality

### Validation

* Server-side request validation using **Express Validator**
* Username validation
* Email validation
* Password validation
* Music title validation
* Album title validation
* Validation of songs before adding them to an album
* Ownership validation for artist-specific operations

### Music Management

Artists can:

* Upload music
* Delete their own songs
* View uploaded songs
* Play songs through the global music player

Music files are handled using **Multer** and stored using **ImageKit**.

### Album Management

Artists can:

* Create albums
* Add songs to albums
* Edit albums
* Delete albums
* View album details
* Manage only their own songs and albums

### Song Search

* Search songs by title
* Case-insensitive search
* Backend-powered search API
* Search requests are optimized using **debouncing**
* Search results update dynamically without reloading the page

### Pagination

* Server-side pagination for songs and albums
* Fixed API page size
* `page` and `limit` based data fetching
* Infinite-scroll style loading on the frontend
* Separate loading states for initial loading and loading more data

### Music Player

Global music player with:

* Play / Pause
* Resume
* Next song
* Previous song
* Song queue
* Current song tracking
* Volume control
* Automatic song switching
* Player state managed through Redux Toolkit

### State Management

**Redux Toolkit** is used for application-wide state management.

Separate slices handle:

* Authentication
* Music
* Albums
* Search
* Music player

The project also uses:

* `createAsyncThunk` for asynchronous API operations
* Redux actions and reducers
* `action.payload`
* Loading and error states
* Centralized API state management

------------------------------------------------------------------------------------------------

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Redux Toolkit
* Axios
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Express Validator
* Multer
* Cookie Parser
* CORS

### Storage

* ImageKit

### Development & Testing

* Postman
* Git
* GitHub
* Jest
* Supertest

----------------------------------------------------------------------------------------------------------

## Project Architecture


Vibora

-Frontend ->
    Components
    Pages
    Layouts   
    Redux
    Slices
    Services
    App

-Backend ->
    Controllers
    Models
    Routes
    Middlewares
    Services
    Database
    App

----------------------------------------------------------------------------------------------------------

## Application Flow

User
 
React Frontend -> Redux Toolkit -> Axios API Request -> Express.js Server(Validation Middleware, Authentication Middleware, Authorization Middleware) -> Controller -> Mongoose -> MongoDB

For music uploads:

Artist -> React Form -> Axios -> Express -> Multer -> ImageKit -> Music URL -> MongoDB
----------------------------------------------------------------------------------------------------------

## Authentication Flow

Vibora uses JWT-based authentication with HTTP-only cookies.

Login
  ↓
Server validates credentials
  ↓
Password verification using bcrypt
  ↓
JWT generated
  ↓
JWT stored in HTTP-only cookie
  ↓
Authenticated requests include the cookie
  ↓
Auth middleware verifies JWT
  ↓
User receives protected resource

The frontend also checks the currently authenticated user when the application loads using the `/auth/me` endpoint.

----------------------------------------------------------------------------------------------------------

## User Roles

### User

Regular users can:

* Browse songs
* Browse albums
* Search songs
* Play music
* Use the music player

### Artist

Artists have all regular user capabilities plus:

* Upload songs
* Delete their songs
* Create albums
* Edit albums
* Delete albums
* Add their songs to albums

Backend authorization ensures that artists can modify **only resources they own**.

----------------------------------------------------------------------------------------------------------

## API Overview

### Authentication

POST   `/auth/register`  Register a user  
POST   `/auth/login`     Login            
POST   `/auth/logout`    Logout           
GET    `/auth/me`        Get current user 

### Music

POST    `/music/createMusic`     Upload a song      
DELETE  `/music/deleteMusic/:id` Delete a song      
GET     `/music/Songs`           Get paginated songs
GET     `/music/search`          Search songs       

### Albums

POST    `/music/createAlbum`     Create an album     
PATCH   `/music/editAlbum/:id`   Edit an album       
DELETE  `/music/deleteAlbum/:id` Delete an album     
GET     `/music/Albums`          Get paginated albums
GET     `/music/Album/:id`       Get album details   

----------------------------------------------------------------------------------------------------------

## Pagination

Songs and albums use server-side pagination.

Example request:

GET /music/Songs?page=1

The backend calculates:

skip = (page - 1) × limit

The API returns pagination information such as:

{
    "page": 1,
    "limit": 10,
    "totalSongs": 25,
    "totalPages": 3,
    "hasNextPage": true
}

The frontend uses this information to load additional data as the user scrolls.

----------------------------------------------------------------------------------------------------------

## Search & Debouncing

The search bar uses a **400ms debounce** to avoid sending an API request for every keystroke.

User types
    ↓
Wait 400ms
    ↓
If user types again → previous timer cleared
    ↓
No new input for 400ms
    ↓
Search API request

This reduces unnecessary API calls while providing a responsive search experience.

----------------------------------------------------------------------------------------------------------

## Database Models

### User

username
email
password
role

### Music

uri
title
artist → User

### Album

title
musics → Music[]
artist → User

MongoDB relationships are handled using **Mongoose references and population**.

----------------------------------------------------------------------------------------------------------

## Testing

API endpoints were tested during development using **Postman**.

The backend is also structured to support automated API testing using:

* Jest
* Supertest

Testing covers important areas such as:

* Authentication
* Validation
* Protected routes
* Authorization
* API responses
* CRUD operations

----------------------------------------------------------------------------------------------------------

## Environment Variables

Create a `.env` file in the backend:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

Create a `.env` file in the frontend:

VITE_API_URL=http://localhost:3000/winterlordmusic

**Never commit your `.env` files to GitHub.**

----------------------------------------------------------------------------------------------------------

## Installation & Setup

### 1. Clone the repository

git clone <your-repository-url>
cd Vibora

### 2. Install backend dependencies

cd Backend
npm install

### 3. Configure backend environment variables

Create the `.env` file and add your MongoDB, JWT, and ImageKit credentials.

### 4. Start the backend

npm run dev

### 5. Install frontend dependencies

cd ../Frontend
npm install

### 6. Configure frontend environment variables

Create the frontend `.env` file and add the API URL.

### 7. Start the frontend

npm run dev

The application will then be available through the Vite development server.

----------------------------------------------------------------------------------------------------------

## Concepts Practiced

This project was built to practice and understand full-stack development concepts including:

* React component architecture
* React Router
* Protected routes
* Redux Toolkit
* `createAsyncThunk`
* Async API handling
* Axios
* Debouncing
* REST APIs
* Express.js
* Middleware
* JWT authentication
* HTTP-only cookies
* Role-based authorization
* Password hashing
* Express Validator
* CRUD operations
* MongoDB
* Mongoose relationships
* Population
* Pagination
* File uploads
* Multer
* Cloud storage
* Error handling
* CORS
* API testing
* Git & GitHub

----------------------------------------------------------------------------------------------------------

## Project Purpose

Vibora was developed as a **full-stack learning project** to understand how a React frontend communicates with a Node.js/Express backend and how authentication, authorization, database operations, file uploads, state management, and API integration work together in a real-world application.

----------------------------------------------------------------------------------------------------------

## Author

**Shashank Kumar Tiwari**

B.Tech — Artificial Intelligence & Machine Learning

### Technical Skills

**Languages:** C, Java, JavaScript, Python

**Frontend Development:** HTML5, CSS3, JavaScript, React.js, Redux Toolkit, Tailwind CSS

**Backend Development:** Node.js, Express.js, REST APIs, JWT Authentication, Role-Based Authorization

**Database:** MongoDB, Mongoose, SQL

**Programming & CS Fundamentals:** Data Structures & Algorithms, Object-Oriented Programming, DBMS, Operating Systems, Computer Networks

**Tools & Technologies:** Git, GitHub, Axios, Postman, Vite, Multer, ImageKit

**Testing:** Jest, Supertest

----------------------------------------------------------------------------------------------------------

## Future Improvements

Possible future improvements include:

* Playlist creation
* Favorites
* User profiles
* Artist profiles
* Audio progress/seek controls
* Recently played songs
* Better mobile player experience
* Production deployment
* Automated test coverage
