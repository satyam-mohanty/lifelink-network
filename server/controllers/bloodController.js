const pool = require('../db');

exports.addBloodBag = async (req, res) => {
    try {
        const { donor_id, blood_type, quantity_ml, collected_date, storage_location } = req.body;
        const uidPart = Math.floor(1000 + Math.random() * 9000);
        const colDate = new Date(collected_date);
        const dateStr = colDate.toISOString().slice(0,10).replace(/-/g,'');
        const bag_uid = `BLD-${dateStr}-${uidPart}`;
        const expiryDate = new Date(colDate);
        expiryDate.setDate(expiryDate.getDate() + 42);

        const [result] = await pool.query(
            'INSERT INTO blood_inventory (donor_id, blood_type, quantity_ml, collected_date, expiry_date, storage_location, bag_uid) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [donor_id, blood_type, quantity_ml, collected_date, expiryDate, storage_location, bag_uid]
        );
        res.status(201).json({ message: 'Blood bag added', bag_id: result.insertId, bag_uid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBloodBags = async (req, res) => {
    try {
        const { status, blood_type } = req.query;
        let query = 'SELECT * FROM blood_inventory WHERE 1=1';
        const params = [];
        if (status) { query += ' AND status = ?'; params.push(status); }
        if (blood_type) { query += ' AND blood_type = ?'; params.push(blood_type); }
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBloodSummary = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT blood_type, COUNT(*) as count FROM blood_inventory WHERE status = 'available' GROUP BY blood_type");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBloodBag = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM blood_inventory WHERE bag_id = ?', [req.params.id]);
        if(rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        await pool.query('UPDATE blood_inventory SET status = ? WHERE bag_id = ?', [req.body.status, req.params.id]);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.expireCheck = async (req, res) => {
    try {
        await pool.query("UPDATE blood_inventory SET status = 'expired' WHERE expiry_date < CURDATE() AND status = 'available'");
        res.json({ message: 'Expiry check triggered' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
