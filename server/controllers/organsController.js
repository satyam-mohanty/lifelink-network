const pool = require('../db');

exports.registerOrgan = async (req, res) => {
    try {
        const { donor_id, organ_type, donor_type, harvested_at, tissue_type, storage_hospital_id } = req.body;
        const viabilityMap = { heart: 6, lungs: 8, liver: 24, kidney: 36, cornea: 72, pancreas: 24, intestine: 12 };
        const viability_hours = viabilityMap[organ_type] || 24;
        
        const [result] = await pool.query(
            'INSERT INTO organs (donor_id, organ_type, donor_type, harvested_at, viability_hours, tissue_type, storage_hospital_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [donor_id, organ_type, donor_type, harvested_at, viability_hours, tissue_type, storage_hospital_id]
        );
        res.status(201).json({ message: 'Organ registered', organ_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrgans = async (req, res) => {
    try {
        const { status, organ_type } = req.query;
        let query = 'SELECT * FROM organs WHERE 1=1';
        const params = [];
        if(status) { query += ' AND status = ?'; params.push(status); }
        if(organ_type) { query += ' AND organ_type = ?'; params.push(organ_type); }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrgan = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM organs WHERE organ_id = ?', [req.params.id]);
        if(rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        await pool.query('UPDATE organs SET status = ? WHERE organ_id = ?', [req.body.status, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
