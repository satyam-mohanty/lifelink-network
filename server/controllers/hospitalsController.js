const pool = require('../db');

exports.registerHospital = async (req, res) => {
    try {
        const { name, address, city, state, pincode, phone, email, license_number } = req.body;
        const [result] = await pool.query(
            'INSERT INTO hospitals (name, address, city, state, pincode, phone, email, license_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, address, city, state, pincode, phone, email, license_number]
        );
        res.status(201).json({ message: 'Hospital registered', hospital_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHospitals = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hospitals');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHospital = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM hospitals WHERE hospital_id = ?', [req.params.id]);
        if(rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyHospital = async (req, res) => {
    try {
        const { is_verified } = req.body;
        await pool.query('UPDATE hospitals SET is_verified = ? WHERE hospital_id = ?', [is_verified, req.params.id]);
        res.json({ message: 'Verification status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
