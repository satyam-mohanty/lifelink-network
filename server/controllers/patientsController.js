const pool = require('../db');

exports.addPatient = async (req, res) => {
    try {
        const { hospital_id, full_name, dob, gender, blood_type, tissue_type, organ_needed, urgency_level, medical_notes } = req.body;
        const [result] = await pool.query(
            "INSERT INTO patients (hospital_id, full_name, dob, gender, blood_type, tissue_type, organ_needed, urgency_level, medical_notes, waiting_since) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())",
            [hospital_id, full_name, dob, gender, blood_type, tissue_type, organ_needed, urgency_level, medical_notes]
        );
        res.status(201).json({ message: 'Patient added', patient_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPatients = async (req, res) => {
    try {
        const { hospital_id, organ_needed, urgency_level } = req.query;
        let query = 'SELECT * FROM patients WHERE 1=1';
        const params = [];
        if (hospital_id) { query += ' AND hospital_id = ?'; params.push(hospital_id); }
        if (organ_needed) { query += ' AND organ_needed = ?'; params.push(organ_needed); }
        if (urgency_level) { query += ' AND urgency_level = ?'; params.push(urgency_level); }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPatient = async (req, res) => {
    try {
        const [patients] = await pool.query('SELECT * FROM patients WHERE patient_id = ?', [req.params.id]);
        if(patients.length === 0) return res.status(404).json({ error: 'Not found' });
        
        const [blood_requests] = await pool.query('SELECT * FROM blood_requests WHERE patient_id = ?', [req.params.id]);
        const [organ_requests] = await pool.query('SELECT * FROM organ_requests WHERE patient_id = ?', [req.params.id]);
        
        res.json({ ...patients[0], blood_requests, organ_requests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
