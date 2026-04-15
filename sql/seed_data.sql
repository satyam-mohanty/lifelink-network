




USE lifelink_db;




SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE alerts;
TRUNCATE TABLE allocations;
TRUNCATE TABLE organ_requests;
TRUNCATE TABLE blood_requests;
TRUNCATE TABLE patients;
TRUNCATE TABLE organs;
TRUNCATE TABLE blood_inventory;
TRUNCATE TABLE donor_health_history;
TRUNCATE TABLE donors;
TRUNCATE TABLE hospitals;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO hospitals (name, address, city, state, pincode, phone, email, license_number, is_verified) VALUES
('Apollo Hospital Bengaluru',   '154/11 Bannerghatta Road',   'Bengaluru', 'Karnataka',    '560076', '+91 80 26304050',  'apollo.blr@hospital.in',  'KA-HOSP-2024-001', TRUE),
('Fortis Memorial Delhi',       '242 Sikanderpur, Gurgaon',   'Delhi',     'Delhi',        '122001', '+91 124 4621444',  'fortis.del@hospital.in',  'DL-HOSP-2024-002', TRUE),
('City General Hospital Pune',  '78 JM Road, Shivajinagar',   'Pune',      'Maharashtra',  '411005', '+91 20 25530750',  'citygen.pune@hospital.in','MH-HOSP-2024-003', FALSE),
('Manipal Hospital',            '98 HAL Airport Road',        'Bengaluru', 'Karnataka',    '560017', '+91 80 25024444',  'info@manipalhospitals.com', 'KA-HOSP-2024-004', TRUE),
('AIIMS New Delhi',             'Ansari Nagar',               'Delhi',     'Delhi',        '110029', '+91 11 26588500',  'director@aiims.edu',      'DL-HOSP-2024-005', TRUE),
('Nanavati Max Hospital',       'S.V. Road, Vile Parle West', 'Mumbai',    'Maharashtra',  '400056', '+91 22 26267500',  'contact@nanavati.com',    'MH-HOSP-2024-006', TRUE),
('CMC Vellore',                 'Ida Scudder Road',           'Vellore',   'Tamil Nadu',   '632004', '+91 416 2281000',  'directorate@cmcvellore.ac.in', 'TN-HOSP-2024-007', TRUE),
('Tata Memorial Hospital',      'Parel',                      'Mumbai',    'Maharashtra',  '400012', '+91 22 24177000',  'msoffice@tmc.gov.in',    'MH-HOSP-2024-008', TRUE);




INSERT INTO donors (full_name, dob, gender, blood_type, phone, email, address, city, state, donor_type, weight_kg, is_eligible) VALUES
('Arjun Patel',       '1990-03-15', 'male',   'O+',  '+91 9876543210', 'arjun.patel@email.com',    '12 MG Road',           'Bengaluru', 'Karnataka',    'blood',  72.5, TRUE),
('Priya Sharma',      '1985-07-22', 'female', 'A+',  '+91 9876543211', 'priya.sharma@email.com',   '45 Link Road',         'Mumbai',    'Maharashtra',  'both',   58.0, TRUE),
('Rahul Verma',       '1992-11-08', 'male',   'B+',  '+91 9876543212', 'rahul.v@email.com',        '78 Park Street',       'Kolkata',   'West Bengal',  'organ',  80.0, TRUE),
('Anjali Reddy',      '1988-05-30', 'female', 'AB+', '+91 9876543213', 'anjali.r@email.com',       '23 Jubilee Hills',     'Hyderabad', 'Telangana',    'blood',  55.0, TRUE),
('Vikram Singh',      '1995-01-12', 'male',   'O-',  '+91 9876543214', 'vikram.s@email.com',       '90 Civil Lines',       'Delhi',     'Delhi',        'both',   76.0, TRUE),
('Meera Nair',        '1993-09-18', 'female', 'A-',  '+91 9876543215', 'meera.n@email.com',        '56 MG Road',           'Kochi',     'Kerala',       'blood',  52.0, TRUE),
('Suresh Kumar',      '1980-04-05', 'male',   'B-',  '+91 9876543216', 'suresh.k@email.com',       '34 Anna Nagar',        'Chennai',   'Tamil Nadu',   'organ',  85.0, FALSE),
('Kavita Deshmukh',   '1991-12-25', 'female', 'AB-', '+91 9876543217', 'kavita.d@email.com',       '67 FC Road',           'Pune',      'Maharashtra',  'blood',  60.0, TRUE),
('Rajesh Gupta',      '1987-06-14', 'male',   'O+',  '+91 9876543218', 'rajesh.g@email.com',       '12 Hazratganj',        'Lucknow',   'Uttar Pradesh','both',   70.0, TRUE),
('Deepa Iyer',        '1994-02-28', 'female', 'A+',  '+91 9876543219', 'deepa.i@email.com',        '89 Indiranagar',       'Bengaluru', 'Karnataka',    'blood',  54.0, TRUE),
('Amitabh Bachchan',  '1942-10-11', 'male',   'B+',  '+91 9876543220', 'amitabh.b@email.com',      'Jalsa, Juhu',          'Mumbai',    'Maharashtra',  'blood',  75.0, TRUE),
('Shah Rukh Khan',    '1965-11-02', 'male',   'O+',  '+91 9876543221', 'srk@email.com',            'Mannat, Bandra',       'Mumbai',    'Maharashtra',  'both',   70.0, TRUE),
('Nandini Rao',       '1998-04-15', 'female', 'A-',  '+91 9876543222', 'nandini.r@email.com',      '102 Whitefield',       'Bengaluru', 'Karnataka',    'blood',  52.0, TRUE),
('Zoya Akhtar',       '1972-10-14', 'female', 'O-',  '+91 9876543223', 'zoya.a@email.com',         'Bandra Flat',          'Mumbai',    'Maharashtra',  'organ',  56.0, TRUE),
('Karan Johar',       '1972-05-25', 'male',   'AB+', '+91 9876543224', 'karan.j@email.com',        'Malabar Hill',         'Mumbai',    'Maharashtra',  'both',   72.0, TRUE),
('Alia Bhatt',        '1993-03-15', 'female', 'O+',  '+91 9876543225', 'alia.b@email.com',         'Silver Beach',         'Mumbai',    'Maharashtra',  'blood',  50.0, TRUE),
('Ranbir Kapoor',     '1982-09-28', 'male',   'A+',  '+91 9876543226', 'ranbir.k@email.com',       'Chembur Villa',        'Mumbai',    'Maharashtra',  'both',   78.0, TRUE),
('Priyanka Chopra',   '1982-07-18', 'female', 'B-',  '+91 9876543227', 'priyanka.c@email.com',     'LA Heights',           'Mumbai',    'Maharashtra',  'organ',  55.0, TRUE),
('Deepika Padukone',  '1986-01-05', 'female', 'O+',  '+91 9876543228', 'deepika.p@email.com',      'Prabhadevi',          'Mumbai',    'Maharashtra',  'both',   58.0, TRUE),
('Ranveer Singh',     '1985-07-06', 'male',   'B+',  '+91 9876543229', 'ranveer.s@email.com',      'Andheri West',         'Mumbai',    'Maharashtra',  'blood',  74.0, TRUE),
('Virat Kohli',       '1988-11-05', 'male',   'B+',  '+91 9876543230', 'virat.k@email.com',        'Worli Skies',          'Mumbai',    'Maharashtra',  'both',   76.0, TRUE),
('Anushka Sharma',    '1988-05-01', 'female', 'A+',  '+91 9876543231', 'anushka.s@email.com',      'Worli Skies',          'Mumbai',    'Maharashtra',  'blood',  54.0, TRUE),
('MS Dhoni',          '1981-07-07', 'male',   'O+',  '+91 9876543232', 'msd@email.com',            'Ranchi Farm',          'Ranchi',    'Jharkhand',    'both',   80.0, TRUE),
('Sachin Tendulkar',  '1973-04-24', 'male',   'B+',  '+91 9876543233', 'sachin.t@email.com',       'Bandra East',          'Mumbai',    'Maharashtra',  'blood',  72.0, TRUE),
('Sunil Chhetri',     '1984-08-03', 'male',   'O+',  '+91 9876543234', 'sunil.c@email.com',        'Secunderabad',         'Hyderabad', 'Telangana',    'both',   68.0, TRUE);




INSERT INTO donor_health_history (donor_id, condition_name, diagnosed_year, is_disqualifying) VALUES
(3,  'Type 2 Diabetes', 2020, FALSE),
(7,  'Hepatitis B',     2018, TRUE),
(5,  'Mild Asthma',     2015, FALSE),
(2,  'Iron Deficiency',  2022, FALSE),
(11, 'Hypertension',     2010, FALSE),
(18, 'Past Thyroid',     2015, FALSE),
(21, 'None',             NULL, FALSE),
(23, 'Knee Surgery',    2021, FALSE);




INSERT INTO blood_inventory (bag_uid, donor_id, blood_type, quantity_ml, collected_date, expiry_date, status, storage_location) VALUES
('BLD-20260301-0001', 1,  'O+',  450, '2026-03-01', '2026-04-12', 'available', 'Apollo Fridge A'),
('BLD-20260302-0002', 1,  'O+',  450, '2026-03-02', '2026-04-13', 'available', 'Apollo Fridge A'),
('BLD-20260228-0003', 2,  'A+',  350, '2026-02-28', '2026-04-11', 'available', 'Apollo Fridge B'),
('BLD-20260305-0004', 2,  'A+',  450, '2026-03-05', '2026-04-16', 'available', 'Fortis Fridge 1'),
('BLD-20260310-0005', 4,  'AB+', 450, '2026-03-10', '2026-04-21', 'available', 'Apollo Fridge C'),
('BLD-20260312-0006', 6,  'A-',  400, '2026-03-12', '2026-04-23', 'available', 'Fortis Fridge 2'),
('BLD-20260315-0007', 5,  'O-',  450, '2026-03-15', '2026-04-26', 'available', 'Apollo Fridge A'),
('BLD-20260320-0008', 8,  'AB-', 350, '2026-03-20', '2026-05-01', 'available', 'City Gen Fridge 1'),
('BLD-20260101-0009', 9,  'O+',  450, '2026-01-01', '2026-02-12', 'expired',   'Apollo Fridge A'),
('BLD-20260110-0010', 10, 'A+',  450, '2026-01-10', '2026-02-21', 'expired',   'Fortis Fridge 1'),
('BLD-20260325-0011', 1,  'O+',  450, '2026-03-25', '2026-05-06', 'available', 'Apollo Fridge B'),
('BLD-20260328-0012', 9,  'O+',  350, '2026-03-28', '2026-05-09', 'available', 'City Gen Fridge 1'),
('BLD-20260330-0013', 10, 'A+',  450, '2026-03-30', '2026-05-11', 'available', 'Apollo Fridge B'),
('BLD-20260401-0014', 5,  'O-',  450, '2026-04-01', '2026-05-13', 'available', 'Fortis Fridge 2'),
('BLD-20260402-0015', 6,  'A-',  350, '2026-04-02', '2026-05-14', 'available', 'Fortis Fridge 2'),
('BLD-20260201-0016', 4,  'AB+', 450, '2026-02-01', '2026-03-15', 'expired',   'Apollo Fridge C'),
('BLD-20260403-0017', 2,  'A+',  450, '2026-04-03', '2026-05-15', 'reserved',  'Apollo Fridge B'),
('BLD-20260403-0018', 1,  'O+',  350, '2026-04-03', '2026-05-15', 'reserved',  'Fortis Fridge 1'),
('BLD-20260215-0019', 9,  'O+',  450, '2026-02-15', '2026-03-29', 'transfused','Apollo Fridge A'),
('BLD-20260220-0020', 10, 'A+',  450, '2026-02-20', '2026-04-03', 'transfused','Fortis Fridge 1'),

('BLD-20260404-0021', 11, 'B+',  450, '2026-04-04', '2026-05-16', 'available', 'Nanavati Fridge X'),
('BLD-20260404-0022', 12, 'O+',  450, '2026-04-04', '2026-05-16', 'available', 'Apollo Fridge A'),
('BLD-20260404-0023', 13, 'A-',  350, '2026-04-04', '2026-05-16', 'available', 'Manipal Fridge 1'),
('BLD-20260404-0024', 14, 'O-',  450, '2026-04-04', '2026-05-16', 'available', 'AIIMS Fridge 2'),
('BLD-20260404-0025', 15, 'AB+', 450, '2026-04-04', '2026-05-16', 'available', 'Nanavati Fridge Y'),
('BLD-20260405-0026', 16, 'O+',  450, '2026-04-05', '2026-05-17', 'available', 'Tata Memorial F1'),
('BLD-20260405-0027', 17, 'A+',  350, '2026-04-05', '2026-05-17', 'available', 'Nanavati Fridge Z'),
('BLD-20260405-0028', 19, 'O+',  450, '2026-04-05', '2026-05-17', 'available', 'Apollo Fridge B'),
('BLD-20260405-0029', 20, 'B+',  450, '2026-04-05', '2026-05-17', 'available', 'CMC Vellore F1'),
('BLD-20260405-0030', 21, 'B+',  350, '2026-04-05', '2026-05-17', 'available', 'CMC Vellore F1'),
('BLD-20260406-0031', 22, 'A+',  450, '2026-04-06', '2026-05-18', 'available', 'Nanavati Fridge X'),
('BLD-20260406-0032', 23, 'O+',  450, '2026-04-06', '2026-05-18', 'available', 'Tata Memorial F2'),
('BLD-20260406-0033', 24, 'B+',  450, '2026-04-06', '2026-05-18', 'available', 'Nanavati Fridge Y'),
('BLD-20260406-0034', 25, 'O+',  450, '2026-04-06', '2026-05-18', 'available', 'Fortis Fridge 1'),
('BLD-20260401-0035', 12, 'O+',  450, '2026-04-01', '2026-05-13', 'available', 'Apollo Fridge C'),
('BLD-20260401-0036', 15, 'AB+', 350, '2026-04-01', '2026-05-13', 'available', 'AIIMS Fridge 1'),
('BLD-20260401-0037', 17, 'A+',  450, '2026-04-01', '2026-05-13', 'available', 'CMC Vellore F2'),
('BLD-20260402-0038', 19, 'O+',  450, '2026-04-02', '2026-05-14', 'available', 'Nanavati Fridge Z'),
('BLD-20260402-0039', 21, 'B+',  350, '2026-04-02', '2026-05-14', 'available', 'Tata Memorial F1'),
('BLD-20260402-0040', 22, 'A+',  450, '2026-04-02', '2026-05-14', 'available', 'Manipal Fridge 2'),
('BLD-20260320-0041', 11, 'B+',  450, '2026-03-20', '2026-05-01', 'available', 'Apollo Fridge B'),
('BLD-20260320-0042', 13, 'A-',  350, '2026-03-20', '2026-05-01', 'available', 'Manipal Fridge 1'),
('BLD-20260320-0043', 14, 'O-',  450, '2026-03-20', '2026-05-01', 'available', 'AIIMS Fridge 2'),
('BLD-20260320-0044', 16, 'O+',  450, '2026-03-20', '2026-05-01', 'available', 'Tata Memorial F2'),
('BLD-20260320-0045', 20, 'B+',  350, '2026-03-20', '2026-05-01', 'available', 'CMC Vellore F1'),
('BLD-20260325-0046', 23, 'O+',  450, '2026-03-25', '2026-05-06', 'available', 'Nanavati Fridge X'),
('BLD-20260325-0047', 24, 'B+',  450, '2026-03-25', '2026-05-06', 'available', 'Apollo Fridge A'),
('BLD-20260325-0048', 25, 'O+',  350, '2026-03-25', '2026-05-06', 'available', 'AIIMS Fridge 1'),
('BLD-20260325-0049', 11, 'B+',  450, '2026-03-25', '2026-05-06', 'available', 'Manipal Fridge 1'),
('BLD-20260325-0050', 14, 'O-',  450, '2026-03-25', '2026-05-06', 'available', 'Nanavati Fridge Y');




INSERT INTO organs (donor_id, organ_type, donor_type, harvested_at, viability_hours, status, tissue_type, storage_hospital_id) VALUES
(3, 'kidney',  'living',     '2026-04-06 06:00:00', 36, 'available', 'HLA-A2,HLA-B7',  1),
(5, 'heart',   'cadaveric',  '2026-04-06 08:00:00', 6,  'available', 'HLA-A1,HLA-DR4',  2),
(3, 'liver',   'cadaveric',  '2026-04-05 20:00:00', 24, 'available', 'HLA-A2,HLA-B7',   1),
(5, 'cornea',  'cadaveric',  '2026-04-04 10:00:00', 72, 'available', 'HLA-A1',           2),
(9, 'kidney',  'living',     '2026-04-03 12:00:00', 36, 'expired',   'HLA-A3,HLA-B35',  1),

(12, 'liver',   'cadaveric',  '2026-04-06 10:00:00', 24, 'available', 'HLA-A2,HLA-DR4',  4),
(14, 'kidney',  'cadaveric',  '2026-04-06 11:00:00', 36, 'available', 'HLA-A1,HLA-B8',   5),
(14, 'kidney',  'cadaveric',  '2026-04-06 11:00:00', 36, 'available', 'HLA-A1,HLA-B8',   5),
(15, 'lungs',   'cadaveric',  '2026-04-06 11:30:00', 8,  'available', 'HLA-A3,HLA-DR1',  6),
(17, 'pancreas','cadaveric',  '2026-04-06 12:00:00', 12, 'available', 'HLA-A2,HLA-B44',  7),
(19, 'heart',   'cadaveric',  '2026-04-06 12:30:00', 6,  'available', 'HLA-A24,HLA-B5',  8),
(21, 'liver',   'cadaveric',  '2026-04-06 13:00:00', 24, 'available', 'HLA-B27,HLA-DR2', 4),
(23, 'cornea',  'cadaveric',  '2026-04-06 13:30:00', 72, 'available', 'HLA-A1,HLA-A2',   1),
(25, 'kidney',  'living',     '2026-04-06 14:00:00', 36, 'available', 'HLA-B7,HLA-DR4',  2),
(18, 'kidney',  'living',     '2026-04-05 15:00:00', 36, 'available', 'HLA-A2,HLA-B7',   6);




INSERT INTO patients (full_name, dob, gender, blood_type, tissue_type, hospital_id, organ_needed, urgency_level, medical_notes) VALUES
('Amit Joshi',       '1975-08-20', 'male',   'B+',  'HLA-A2,HLA-B7',   1, 'kidney',  'critical', 'End-stage renal disease. On dialysis for 2 years.'),
('Sunita Rao',       '1982-03-10', 'female', 'O-',  'HLA-A1,HLA-DR4',  2, 'heart',   'critical', 'Severe cardiomyopathy. Awaiting transplant urgently.'),
('Manoj Tiwari',     '1990-06-05', 'male',   'A+',  NULL,               1, 'none',    'medium',   'Anemia patient. Requires regular blood transfusions.'),
('Lakshmi Menon',    '1968-11-30', 'female', 'AB+', NULL,               1, 'none',    'high',     'Post-surgical patient. Blood needed for recovery.'),
('Farhan Ali',       '2000-01-15', 'male',   'O+',  'HLA-A3,HLA-B35',  2, 'kidney',  'high',     'Chronic kidney disease, stage 4.'),
('Rekha Bhat',       '1995-04-22', 'female', 'B+',  'HLA-A2',          3, 'liver',   'medium',   'Liver cirrhosis. Stable but worsening.'),
('Govind Menon',     '1988-09-12', 'male',   'A-',  NULL,               2, 'none',    'low',      'Routine surgery scheduled. Pre-operative blood processing.'),
('Anitha Krishnan',  '1972-07-08', 'female', 'O-',  'HLA-A1',          1, 'cornea',  'medium',   'Bilateral corneal opacity. Waiting for transplant.'),

('Rajesh Khanna',    '1950-12-29', 'male',   'B+',  'HLA-A2',          4, 'liver',   'high',     'Advanced liver failure.'),
('Sridevi B',        '1963-08-13', 'female', 'A+',  'HLA-A1,HLA-B8',   5, 'kidney',  'critical', 'Urgently needs kidney transplant.'),
('Irrfan Khan',      '1967-01-07', 'male',   'O+',  'HLA-A3,HLA-DR1',  6, 'pancreas','medium',    'Metastatic neuroendocrine tumor patient.'),
('Sushant Singh',    '1986-01-21', 'male',   'O+',  NULL,               7, 'none',    'low',      'Post-traumatic blood loss.'),
('Rishi Kapoor',     '1952-09-04', 'male',   'A-',  NULL,               8, 'none',    'high',     'Leukemia treatment support.'),
('Amrish Puri',      '1932-06-22', 'male',   'B-',  'HLA-B27',         4, 'kidney',  'medium',   'Chronic renal failure.'),
('Smita Patil',      '1955-10-17', 'female', 'AB-', 'HLA-A1,HLA-A2',   1, 'cornea',  'low',      'Corneal dystrophy.'),
('Guru Dutt',        '1925-07-09', 'male',   'O-',  'HLA-A24,HLA-B5',  2, 'heart',   'critical', 'Congestive heart failure.'),
('Madhubala T',      '1933-02-14', 'female', 'A+',  'HLA-A2,HLA-DR4',  4, 'liver',   'high',     'Ventricular septal defect.'),
('Meena Kumari',     '1933-08-01', 'female', 'O+',  NULL,               5, 'none',    'medium',   'Sickle cell anemia.'),
('Dilip Kumar',      '1922-12-11', 'male',   'O-',  'HLA-A3,HLA-B8',   6, 'lungs',   'critical', 'Pulmonary fibrosis.'),
('Dev Anand',        '1923-09-26', 'male',   'AB+', NULL,               7, 'none',    'medium',   'Age-related complications.');




INSERT INTO blood_requests (hospital_id, patient_id, blood_type, quantity_ml_needed, urgency_level, status) VALUES
(1, 3, 'A+',  450, 'medium',   'requested'),
(1, 4, 'AB+', 900, 'high',     'matched'),
(2, 7, 'A-',  450, 'low',      'delivered'),
(2, 5, 'O+',  450, 'high',     'dispatched'),
(1, 3, 'A+',  350, 'medium',   'requested'),
(4, 9, 'B+',  900, 'high',     'requested'),
(5, 10,'A+',  450, 'critical', 'matched'),
(6, 11,'O+',  450, 'medium',   'requested'),
(7, 12,'O+',  1350,'high',     'requested'),
(8, 13,'A-',  900, 'high',     'dispatched'),
(4, 14,'B-',  450, 'medium',   'requested'),
(1, 15,'AB-', 450, 'low',      'requested'),
(2, 16,'O-',  900, 'critical', 'matched'),
(4, 17,'A+',  450, 'high',     'requested'),
(5, 18,'O+',  450, 'medium',   'requested');




INSERT INTO organ_requests (hospital_id, patient_id, organ_type, urgency_level, status) VALUES
(1, 1, 'kidney', 'critical',  'matched'),
(2, 2, 'heart',  'critical',  'requested'),
(3, 6, 'liver',  'medium',    'requested'),
(4, 9, 'liver',  'high',      'requested'),
(5, 10,'kidney', 'critical',  'matched'),
(6, 11,'pancreas','medium',    'requested'),
(1, 15,'cornea', 'low',       'requested'),
(2, 16,'heart',  'critical',  'matched'),
(4, 17,'liver',  'high',      'requested'),
(6, 19,'lungs',  'critical',  'requested');




INSERT INTO allocations (request_type, blood_request_id, organ_request_id, blood_bag_id, organ_id, approved_by, status, expected_delivery, dispatch_time, actual_delivery) VALUES
('blood', 2,    NULL, 5,    NULL, 'Dr. Ravi Kumar',   'dispatched', '2026-04-04 14:00:00', '2026-04-04 11:30:00', NULL),
('blood', 3,    NULL, 6,    NULL, 'Dr. Anjali Gupta',  'delivered',  '2026-04-03 12:00:00', '2026-04-03 09:00:00', '2026-04-03 11:45:00'),
('blood', 4,    NULL, 18,   NULL, 'Dr. Suresh Menon',  'dispatched', '2026-04-05 18:00:00', '2026-04-05 15:30:00', NULL),
('organ', NULL, 1,    NULL, 1,    'Dr. Priya Nair',    'approved',   '2026-04-06 12:00:00', NULL,                   NULL),
('blood', 7,    NULL, 31,   NULL, 'Dr. Vijay Mallya',  'approved',   '2026-04-06 15:00:00', NULL,                   NULL),
('organ', NULL, 5,    NULL, 7,    'Dr. Aditi Pant',    'approved',   '2026-04-06 16:00:00', NULL,                   NULL),
('blood', 10,   NULL, 23,   NULL, 'Dr. Ramesh S',      'dispatched', '2026-04-06 18:00:00', '2026-04-06 14:00:00', NULL),
('organ', NULL, 8,    NULL, 11,   'Dr. Sameer K',      'approved',   '2026-04-06 12:00:00', NULL,                   NULL),
('blood', 13,   NULL, 43,   NULL, 'Dr. Vikram V',      'approved',   '2026-04-06 14:00:00', NULL,                   NULL),
('blood', 1,    NULL, 3,    NULL, 'Dr. Sneha L',       'approved',   '2026-04-06 10:00:00', NULL,                   NULL),
('organ', NULL, 2,    NULL, 2,    'Dr. Preeti J',      'dispatched', '2026-04-06 10:00:00', '2026-04-06 08:30:00', NULL),
('blood', 9,    NULL, 26,   NULL, 'Dr. Mahesh B',      'approved',   '2026-04-06 16:00:00', NULL,                   NULL);




INSERT INTO alerts (alert_type, message, related_id, is_resolved) VALUES
('low_stock',       'Blood type B- has fewer than 3 available units. Current stock: 0.',                   NULL, FALSE),
('low_stock',       'Blood type AB- has fewer than 3 available units. Current stock: 1.',                  NULL, FALSE),
('expiry',          'Blood bag BLD-20260101-0009 of type O+ has expired.',                                 9,    TRUE),
('organ_expiring',  'Organ kidney (ID #5) from donor #9 has expired past viability window.',               5,    TRUE),
('organ_expiring',  'Organ heart from donor #5 viability window closing in < 6 hours. Urgent matching required.', 2, FALSE),
('emergency',       'CRITICAL: Patient Sunita Rao (ID #2) requires immediate heart transplant. No matched donors found.', 2, FALSE),
('emergency',       'MASS CASUALTY ALERT: Multiple trauma patients inbound to Apollo Bengaluru. O- and B+ stock required immediately.', NULL, FALSE),
('low_stock',       'Rare Blood Alert: O- stock is critically low across the network.',                   NULL, FALSE),
('organ_expiring',  'Lungs viability window (ID #9) closing in 2 hours. Hospital Nanavati awaiting dispatch.', 9,   FALSE),
('emergency',       'Record Information: New protocol for Cross-State Organ Transport established by MoHFW.', NULL, TRUE),
('emergency',       'Record Information: Project LifeLink reached 50 successful blood transplants this month.', NULL, TRUE),
('emergency',       'Critical: Extreme weather alert in Delhi may affect organ transport flights.', NULL, FALSE);




SELECT 'Seed data loaded successfully!' AS status;
SELECT CONCAT(COUNT(*), ' donors') AS loaded FROM donors
UNION ALL SELECT CONCAT(COUNT(*), ' blood bags') FROM blood_inventory
UNION ALL SELECT CONCAT(COUNT(*), ' organs') FROM organs
UNION ALL SELECT CONCAT(COUNT(*), ' hospitals') FROM hospitals
UNION ALL SELECT CONCAT(COUNT(*), ' patients') FROM patients
UNION ALL SELECT CONCAT(COUNT(*), ' blood requests') FROM blood_requests
UNION ALL SELECT CONCAT(COUNT(*), ' organ requests') FROM organ_requests
UNION ALL SELECT CONCAT(COUNT(*), ' allocations') FROM allocations
UNION ALL SELECT CONCAT(COUNT(*), ' alerts') FROM alerts;
