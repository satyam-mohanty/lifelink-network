const pool = require('../db');

exports.getAlerts = async (req, res) => {
    try {
        const showAll = req.query.show_all === 'true';
        const query = showAll
            ? 'SELECT * FROM alerts ORDER BY is_resolved ASC, created_at DESC'
            : 'SELECT * FROM alerts WHERE is_resolved = FALSE ORDER BY created_at DESC';
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.resolveAlert = async (req, res) => {
    try {
        await pool.query('UPDATE alerts SET is_resolved = TRUE WHERE alert_id = ?', [req.params.id]);
        res.json({ message: 'Alert resolved' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
