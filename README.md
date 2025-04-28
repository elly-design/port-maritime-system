# Maritime Vessel Management System (MVMS)

A comprehensive solution for managing vessels, crew, voyages and maintenance in the maritime industry. This application helps shipping companies track vessels, crew, maintenance schedules, and voyage data.

## Features

- **Vessel Management**: Register and track vessels with detailed information including specifications, current location, and status
- **Crew Management**: Manage crew members, their certifications, assignments, and contract details
- **Voyage Tracking**: Plan and monitor voyages with route tracking, cargo information, and status updates
- **Maintenance Scheduling**: Schedule and track vessel maintenance activities, assign technicians, and manage parts inventory

## Technology Stack

- **Frontend**: React.js with TypeScript, TailwindCSS, React Router, Leaflet for maps
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API architecture

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables by creating a `.env` file in the root directory:

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maritime-management
NODE_ENV=development
```

### Running the Application

1. Start the backend server:

```bash
npm run server:dev
```

1. Start the frontend development server:

```bash
npm run dev
```

1. Or run both concurrently:

```bash
npm start
```

1. Access the application at `http://localhost:5173`

## API Endpoints

### Vessels

- `GET /api/vessels` - Get all vessels
- `GET /api/vessels/:id` - Get vessel by ID
- `POST /api/vessels` - Create a new vessel
- `PUT /api/vessels/:id` - Update vessel
- `DELETE /api/vessels/:id` - Delete vessel
- `PATCH /api/vessels/:id/location` - Update vessel location
- `GET /api/vessels/status/:status` - Get vessels by status

### Crew

- `GET /api/crew` - Get all crew members
- `GET /api/crew/:id` - Get crew member by ID
- `POST /api/crew` - Create a new crew member
- `PUT /api/crew/:id` - Update crew member
- `DELETE /api/crew/:id` - Delete crew member
- `PATCH /api/crew/:id/assign` - Assign crew to vessel
- `GET /api/crew/vessel/:vesselId` - Get crew by vessel
- `GET /api/crew/expiring-certifications` - Get crew with expiring certifications

### Voyages

- `GET /api/voyages` - Get all voyages
- `GET /api/voyages/:id` - Get voyage by ID
- `POST /api/voyages` - Create a new voyage
- `PUT /api/voyages/:id` - Update voyage
- `DELETE /api/voyages/:id` - Delete voyage
- `PATCH /api/voyages/:id/status` - Update voyage status
- `POST /api/voyages/:id/route` - Add route point to voyage
- `GET /api/voyages/vessel/:vesselId` - Get voyages by vessel

### Maintenance

- `GET /api/maintenance` - Get all maintenance records
- `GET /api/maintenance/:id` - Get maintenance by ID
- `POST /api/maintenance` - Create a new maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `DELETE /api/maintenance/:id` - Delete maintenance record
- `PATCH /api/maintenance/:id/status` - Update maintenance status
- `GET /api/maintenance/vessel/:vesselId` - Get maintenance by vessel
- `GET /api/maintenance/upcoming/scheduled` - Get upcoming maintenance

## Project Structure

```markdown
maritime-vessel-management-system/
├── server/                  # Backend server code
│   ├── config/              # Configuration files
│   ├── controllers/         # API controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   └── server.ts            # Server entry point
├── src/                     # Frontend React code
│   ├── components/          # React components
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point
├── .env                     # Environment variables
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Future Enhancements

- User authentication and role-based access control
- Real-time vessel tracking with WebSockets
- Advanced reporting and analytics dashboard
- Mobile application for on-the-go management
- Integration with weather APIs for voyage planning
