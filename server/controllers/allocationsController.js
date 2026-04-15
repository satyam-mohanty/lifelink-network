const pool = require('../db');

exports.getAllocations = async (req, res) => {
    try {
        const { status, request_type } = req.query;
        let query = `
            SELECT a.*,
                CASE WHEN a.request_type = 'blood' THEN a.blood_request_id ELSE a.organ_request_id END AS request_id
            FROM allocations a WHERE 1=1`;
        const params = [];
        if (status) { query += ' AND a.status = ?'; params.push(status); }
        if (request_type) { query += ' AND a.request_type = ?'; params.push(request_type); }
        query += ' ORDER BY a.approved_at DESC';
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllocation = async (req, res) => {
    try {
        const query = `
            SELECT a.*,
                CASE WHEN a.request_type = 'blood' THEN a.blood_request_id ELSE a.organ_request_id END AS request_id,
                bi.bag_uid,
                bi.blood_type AS bag_blood_type,
                o.organ_type,
                o.blood_type AS organ_blood_type,
                CASE
                    WHEN a.request_type = 'blood' THEN p_blood.full_name
                    WHEN a.request_type = 'organ' THEN p_organ.full_name
                END AS patient_name,
                CASE
                    WHEN a.request_type = 'blood' THEN h_blood.name
                    WHEN a.request_type = 'organ' THEN h_organ.name
                END AS hospital_name,
                CASE
                    WHEN a.request_type = 'blood' THEN p_blood.blood_type
                    WHEN a.request_type = 'organ' THEN p_organ.blood_type
                END AS blood_type
            FROM allocations a
            LEFT JOIN blood_inventory bi ON a.blood_bag_id = bi.bag_id
            LEFT JOIN organs o ON a.organ_id = o.organ_id
            LEFT JOIN blood_requests br ON a.blood_request_id = br.request_id
            LEFT JOIN organ_requests orq ON a.organ_request_id = orq.request_id
            LEFT JOIN patients p_blood ON br.patient_id = p_blood.patient_id
            LEFT JOIN patients p_organ ON orq.patient_id = p_organ.patient_id
            LEFT JOIN hospitals h_blood ON br.hospital_id = h_blood.hospital_id
            LEFT JOIN hospitals h_organ ON orq.hospital_id = h_organ.hospital_id
            WHERE a.allocation_id = ?
        `;
        const [rows] = await pool.query(query, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Allocation not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateDelivery = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['dispatched', 'delivered', 'failed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status. Must be dispatched, delivered, or failed.' });
        }

        if (status === 'dispatched') {
            await pool.query('UPDATE allocations SET status = ?, dispatch_time = NOW() WHERE allocation_id = ?', [status, req.params.id]);
        } else if (status === 'delivered') {
            await pool.query('UPDATE allocations SET status = ?, actual_delivery = NOW() WHERE allocation_id = ?', [status, req.params.id]);
        } else {
            await pool.query('UPDATE allocations SET status = ? WHERE allocation_id = ?', [status, req.params.id]);
        }

        res.json({ message: 'Delivery status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
