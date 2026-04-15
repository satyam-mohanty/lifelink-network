const pool = require('../db');

exports.createBloodRequest = async (req, res) => {
    try {
        const { hospital_id, patient_id, blood_type, quantity_ml_needed, urgency_level } = req.body;
        const [result] = await pool.query(
            'INSERT INTO blood_requests (hospital_id, patient_id, blood_type, quantity_ml_needed, urgency_level) VALUES (?, ?, ?, ?, ?)',
            [hospital_id, patient_id, blood_type, quantity_ml_needed, urgency_level]
        );
        res.status(201).json({ message: 'Blood request created', request_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrganRequest = async (req, res) => {
    try {
        const { hospital_id, patient_id, organ_type, urgency_level } = req.body;
        const [result] = await pool.query(
            'INSERT INTO organ_requests (hospital_id, patient_id, organ_type, urgency_level) VALUES (?, ?, ?, ?)',
            [hospital_id, patient_id, organ_type, urgency_level]
        );
        res.status(201).json({ message: 'Organ request created', request_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRequests = async (req, res) => {
    try {
        const { type, status, hospital_id } = req.query;
        let bloodQuery = 'SELECT *, "blood" as type FROM blood_requests WHERE 1=1';
        let organQuery = 'SELECT *, "organ" as type FROM organ_requests WHERE 1=1';
        const params = [];
        const paramsOrgan = [];
        
        if (status) { bloodQuery += ' AND status = ?'; params.push(status); organQuery += ' AND status = ?'; paramsOrgan.push(status); }
        if (hospital_id) { bloodQuery += ' AND hospital_id = ?'; params.push(hospital_id); organQuery += ' AND hospital_id = ?'; paramsOrgan.push(hospital_id); }
        
        let results = [];
        if (!type || type === 'blood') {
            const [blood] = await pool.query(bloodQuery, params);
            results = results.concat(blood);
        }
        if (!type || type === 'organ') {
            const [organ] = await pool.query(organQuery, paramsOrgan);
            results = results.concat(organ);
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRequest = async (req, res) => {
    try {
        const { type, id } = req.params;
        let query = '';
        if (type === 'blood') query = 'SELECT * FROM blood_requests WHERE request_id = ?';
        else if (type === 'organ') query = 'SELECT * FROM organ_requests WHERE request_id = ?';
        else return res.status(400).json({ error: 'Invalid type' });
        
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
