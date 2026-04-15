CREATE DATABASE IF NOT EXISTS lifelink_db;
USE lifelink_db;

CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS donors (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    blood_type ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    donor_type ENUM('blood', 'organ', 'both') NOT NULL,
    weight_kg DECIMAL(5,2),
    last_donation_date DATE,
    is_eligible BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS donor_health_history (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    diagnosed_year INT,
    is_disqualifying BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blood_inventory (
    bag_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    blood_type ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    quantity_ml INT NOT NULL,
    collected_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('available','reserved','expired','transfused') DEFAULT 'available',
    storage_location VARCHAR(100),
    bag_uid VARCHAR(20) UNIQUE NOT NULL,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS organs (
    organ_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    organ_type ENUM('kidney','liver','heart','lungs','cornea','pancreas','intestine') NOT NULL,
    donor_type ENUM('living','cadaveric') NOT NULL,
    harvested_at DATETIME NOT NULL,
    viability_hours INT NOT NULL,
    expires_at DATETIME AS (harvested_at + INTERVAL viability_hours HOUR) STORED,
    status ENUM('available','matched','transplanted','expired') DEFAULT 'available',
    tissue_type VARCHAR(50),
    storage_hospital_id INT,
    FOREIGN KEY (donor_id) REFERENCES donors(donor_id) ON DELETE CASCADE,
    FOREIGN KEY (storage_hospital_id) REFERENCES hospitals(hospital_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    blood_type ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    tissue_type VARCHAR(50),
    organ_needed ENUM('kidney','liver','heart','lungs','cornea','pancreas','intestine','none') DEFAULT 'none',
    urgency_level ENUM('low','medium','high','critical') DEFAULT 'medium',
    waiting_since DATE,
    medical_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blood_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    patient_id INT,
    blood_type ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
    quantity_ml_needed INT NOT NULL,
    urgency_level ENUM('low','medium','high','critical') NOT NULL,
    status ENUM('requested','matched','dispatched','delivered','cancelled') DEFAULT 'requested',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at TIMESTAMP NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS organ_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    patient_id INT NOT NULL,
    organ_type ENUM('kidney','liver','heart','lungs','cornea','pancreas','intestine') NOT NULL,
    urgency_level ENUM('low','medium','high','critical') NOT NULL,
    status ENUM('requested','matched','dispatched','delivered','cancelled') DEFAULT 'requested',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at TIMESTAMP NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS allocations (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    request_type ENUM('blood','organ') NOT NULL,
    blood_request_id INT NULL,
    organ_request_id INT NULL,
    blood_bag_id INT NULL,
    organ_id INT NULL,
    approved_by VARCHAR(100),
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dispatch_time DATETIME,
    expected_delivery DATETIME,
    actual_delivery DATETIME,
    status ENUM('approved','dispatched','delivered','failed') NOT NULL DEFAULT 'approved',
    notes TEXT,
    FOREIGN KEY (blood_request_id) REFERENCES blood_requests(request_id) ON DELETE SET NULL,
    FOREIGN KEY (organ_request_id) REFERENCES organ_requests(request_id) ON DELETE SET NULL,
    FOREIGN KEY (blood_bag_id) REFERENCES blood_inventory(bag_id) ON DELETE SET NULL,
    FOREIGN KEY (organ_id) REFERENCES organs(organ_id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    alert_type ENUM('low_stock','expiry','organ_expiring','emergency') NOT NULL,
    message TEXT NOT NULL,
    related_id INT,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
