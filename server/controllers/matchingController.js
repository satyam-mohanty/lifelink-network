const pool = require('../db');

exports.matchBlood = async (req, res) => {
    try {
        const { patient_blood_type, quantity_ml } = req.body;
        const [rows] = await pool.query('CALL sp_match_blood(?, ?)', [patient_blood_type, quantity_ml]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.matchOrgan = async (req, res) => {
    try {
        const { organ_type, patient_blood_type, tissue_type } = req.body;
        const [rows] = await pool.query('CALL sp_match_organ(?, ?, ?)', [organ_type, patient_blood_type, tissue_type]);
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.allocateBlood = async (req, res) => {
    try {
        const { request_id, bag_id, approved_by } = req.body;
        await pool.query('CALL sp_allocate_blood(?, ?, ?)', [request_id, bag_id, approved_by]);
        res.json({ message: 'Blood allocated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.allocateOrgan = async (req, res) => {
    try {
        const { request_id, organ_id, approved_by, expected_delivery } = req.body;
        await pool.query('CALL sp_allocate_organ(?, ?, ?, ?)', [request_id, organ_id, approved_by, expected_delivery]);
        res.json({ message: 'Organ allocated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
