const pool = require('../db');

exports.registerDonor = async (req, res) => {
    try {
        const { full_name, dob, gender, blood_type, phone, email, address, city, state, donor_type } = req.body;
        if (!full_name || !dob || !blood_type || !donor_type) {
            return res.status(400).json({ error: 'name, dob, blood_type, and donor_type are required' });
        }
        
        const weight_kg = req.body.weight_kg !== '' && req.body.weight_kg != null ? req.body.weight_kg : null;
        const last_donation_date = req.body.last_donation_date !== '' && req.body.last_donation_date != null ? req.body.last_donation_date : null;
        const [result] = await pool.query(
            'INSERT INTO donors (full_name, dob, gender, blood_type, phone, email, address, city, state, donor_type, weight_kg, last_donation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [full_name, dob, gender || 'male', blood_type, phone || null, email || null, address || null, city || null, state || null, donor_type, weight_kg, last_donation_date]
        );
        res.status(201).json({ message: 'Donor registered', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDonors = async (req, res) => {
    try {
        const { blood_type, donor_type, is_eligible } = req.query;
        let query = 'SELECT * FROM donors WHERE 1=1';
        const params = [];
        if (blood_type) { query += ' AND blood_type = ?'; params.push(blood_type); }
        if (donor_type) { query += ' AND donor_type = ?'; params.push(donor_type); }
        if (is_eligible) { query += ' AND is_eligible = ?'; params.push(is_eligible === 'true' || is_eligible === '1'); }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDonor = async (req, res) => {
    try {
        const [donors] = await pool.query('SELECT * FROM donors WHERE donor_id = ?', [req.params.id]);
        if (donors.length === 0) return res.status(404).json({ error: 'Not found' });
        const [history] = await pool.query('SELECT * FROM donor_health_history WHERE donor_id = ?', [req.params.id]);
        res.json({ ...donors[0], health_history: history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEligibility = async (req, res) => {
    try {
        await pool.query('UPDATE donors SET is_eligible = ? WHERE donor_id = ?', [req.body.is_eligible, req.params.id]);
        res.json({ message: 'Eligibility updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addHealthRecord = async (req, res) => {
    try {
        const { condition_name, diagnosed_year, is_disqualifying } = req.body;
        await pool.query(
            'INSERT INTO donor_health_history (donor_id, condition_name, diagnosed_year, is_disqualifying) VALUES (?, ?, ?, ?)',
            [req.params.id, condition_name, diagnosed_year, is_disqualifying]
        );
        res.status(201).json({ message: 'Health record added' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDonations = async (req, res) => {
    try {
        const [blood] = await pool.query('SELECT * FROM blood_inventory WHERE donor_id = ?', [req.params.id]);
        const [organs] = await pool.query('SELECT * FROM organs WHERE donor_id = ?', [req.params.id]);
        res.json({ blood_donations: blood, organ_donations: organs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
