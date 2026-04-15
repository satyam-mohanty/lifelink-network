# LifeLink - Blood Bank and Organ Donation Network

LifeLink is a web application designed to manage blood bank operations, organ donations, patient matching, and logistics tracking for medical networks.

---

## Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | View statistics, blood inventory, expiring organs, and active alerts. |
| **Donors** | Register and manage blood and organ donors, along with their health history. |
| **Blood Inventory** | Track blood bags by type, manage expiration dates, and run checks. |
| **Organs** | Registry for organs with viability countdown timers. |
| **Hospitals** | Manage the hospital network and verification system. |
| **Patients** | Maintain patient records, organ waitlists, and urgency levels. |
| **Requests** | Manage the pipeline for blood and organ requests, from request to delivery. |
| **Matching Engine** | Match blood types and organ tissues based on compatibility. |
| **Allocations** | Track dispatches, delivery trails, and detect delays. |
| **Alerts** | Generate alerts for expiration, low stock, organ viability, and emergencies. |

---

## Technology Stack

- **Backend:** Node.js and Express.js
- **Database:** MySQL
- **Frontend:** HTML, CSS, and JavaScript

---

## Setup Instructions

### Prerequisites
- Node.js (version 18 or higher)
- MySQL (version 8.0 or higher)
- npm

### 1. Clone the repository
```bash
git clone <repository-url>
cd lifelink-network
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the environment
Create a `.env` file in the project directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lifelink_db
PORT=3000
```

### 4. Set up the database
Log into MySQL and run the following SQL scripts in order:
```bash
mysql -u root -p
```

```sql
SOURCE sql/schema.sql;
SOURCE sql/procedures_and_triggers.sql;
SOURCE sql/seed_data.sql;
```

### 5. Start the server
```bash
npm start
```

### 6. Open in browser
Go to [http://localhost:3000](http://localhost:3000)

---

## API Reference

### Donors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donors` | List all donors |
| GET | `/api/donors/:id` | Get donor profile and health history |
| POST | `/api/donors` | Register a new donor |
| PUT | `/api/donors/:id/eligibility` | Update eligibility status |
| POST | `/api/donors/:id/health` | Add a health record |
| GET | `/api/donors/:id/donations` | Get donation history |

### Blood Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blood` | List blood bags |
| GET | `/api/blood/summary` | Count available blood bags by type |
| POST | `/api/blood` | Add a new blood bag |
| POST | `/api/blood/expire-check` | Mark expired bags |

### Organs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organs` | List organs |
| POST | `/api/organs` | Register a harvested organ |

### Hospitals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospitals` | List all hospitals |
| GET | `/api/hospitals/:id` | Get hospital details |
| POST | `/api/hospitals` | Register a hospital |
| PUT | `/api/hospitals/:id/verify` | Verify or revoke a hospital |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patients` | List patients |
| GET | `/api/patients/:id` | Get patient and their requests |
| POST | `/api/patients` | Add a new patient |

### Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/requests` | List requests |
| POST | `/api/requests/blood` | Create a blood request |
| POST | `/api/requests/organ` | Create an organ request |

### Matching Engine
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/match/blood` | Find compatible blood bags |
| POST | `/api/match/organ` | Find compatible organs |

### Allocations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/allocations` | List allocations |
| GET | `/api/allocations/:id` | Get allocation details |
| POST | `/api/allocate/blood` | Allocate a blood bag |
| POST | `/api/allocate/organ` | Allocate an organ |
| PUT | `/api/allocations/:id/delivery` | Update delivery status |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | List unresolved alerts |
| PUT | `/api/alerts/:id/resolve` | Resolve an alert |

---

## Project Structure

```
lifelink-network/
├── server/
│   ├── index.js
│   ├── db.js
│   ├── routes/
│   └── controllers/
├── public/
│   ├── index.html
│   ├── css/
│   └── js/
├── sql/
│   ├── schema.sql
│   ├── procedures_and_triggers.sql
│   └── seed_data.sql
├── .env
└── package.json
```

---

## Database Features

- **Triggers:** Automatically detect expiration, lower stock, organ viability, and check donor eligibility.
- **Stored Procedures:** Perform blood matching, organ compatibility scoring, allocation workflow, and delivery tracking.
- **Relationships:** Tables linked through foreign keys (donors to blood/organs to hospitals to patients to requests to allocations).

---

## License

This project was built for educational purposes as part of a DBMS course project.
