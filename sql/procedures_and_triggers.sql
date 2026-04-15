USE lifelink_db;

DELIMITER $$




DROP TRIGGER IF EXISTS trg_auto_expire_blood$$
CREATE TRIGGER trg_auto_expire_blood
BEFORE UPDATE ON blood_inventory
FOR EACH ROW
BEGIN
    IF NEW.expiry_date < CURDATE() AND NEW.status = 'available' THEN
        SET NEW.status = 'expired';
    END IF;
END$$


DROP TRIGGER IF EXISTS trg_insert_expiry_alert$$
CREATE TRIGGER trg_insert_expiry_alert
AFTER UPDATE ON blood_inventory
FOR EACH ROW
BEGIN
    IF NEW.status = 'expired' AND OLD.status != 'expired' THEN
        INSERT INTO alerts (alert_type, message, related_id)
        VALUES ('expiry', CONCAT('Blood bag ', NEW.bag_uid, ' of type ', NEW.blood_type, ' has expired.'), NEW.bag_id);
    END IF;
END$$


DROP TRIGGER IF EXISTS trg_low_stock_alert$$
CREATE TRIGGER trg_low_stock_alert
AFTER UPDATE ON blood_inventory
FOR EACH ROW
BEGIN
    DECLARE available_count INT;
    IF NEW.status != OLD.status THEN
        SELECT COUNT(*) INTO available_count
        FROM blood_inventory
        WHERE blood_type = NEW.blood_type AND status = 'available';

        IF available_count < 3 THEN
            INSERT INTO alerts (alert_type, message, related_id)
            VALUES ('low_stock', CONCAT('Low stock alert: ', NEW.blood_type, ' has fewer than 3 available units (', available_count, ' remaining).'), NULL);
        END IF;
    END IF;
END$$


DROP TRIGGER IF EXISTS trg_organ_expiry_alert$$
CREATE TRIGGER trg_organ_expiry_alert
AFTER INSERT ON organs
FOR EACH ROW
BEGIN
    INSERT INTO alerts (alert_type, message, related_id)
    VALUES ('organ_expiring', CONCAT('Organ ', NEW.organ_type, ' from donor ', NEW.donor_id, ' expires at ', NEW.expires_at, '. Act fast.'), NEW.organ_id);
END$$


DROP TRIGGER IF EXISTS trg_donor_eligibility_insert$$
CREATE TRIGGER trg_donor_eligibility_insert
BEFORE INSERT ON donors
FOR EACH ROW
BEGIN
    IF NEW.last_donation_date IS NOT NULL AND DATEDIFF(CURDATE(), NEW.last_donation_date) < 90 THEN
        SET NEW.is_eligible = FALSE;
    END IF;
END$$

DROP TRIGGER IF EXISTS trg_donor_eligibility_update$$
CREATE TRIGGER trg_donor_eligibility_update
BEFORE UPDATE ON donors
FOR EACH ROW
BEGIN
    DECLARE disqualifying_count INT DEFAULT 0;

    IF NEW.last_donation_date IS NOT NULL AND DATEDIFF(CURDATE(), NEW.last_donation_date) < 90 THEN
        SET NEW.is_eligible = FALSE;
    END IF;

    SELECT COUNT(*) INTO disqualifying_count
    FROM donor_health_history
    WHERE donor_id = NEW.donor_id AND is_disqualifying = TRUE;

    IF disqualifying_count > 0 THEN
        SET NEW.is_eligible = FALSE;
    END IF;
END$$





DROP PROCEDURE IF EXISTS sp_match_blood$$
CREATE PROCEDURE sp_match_blood(IN p_patient_blood_type VARCHAR(5), IN p_needed_quantity INT)
BEGIN
    SELECT 
        bag_id, 
        donor_id, 
        blood_type, 
        quantity_ml, 
        collected_date, 
        expiry_date, 
        storage_location, 
        bag_uid
    FROM blood_inventory
    WHERE status = 'available' 
      AND quantity_ml >= p_needed_quantity
      AND (
          (p_patient_blood_type = 'O-' AND blood_type = 'O-') OR
          (p_patient_blood_type = 'O+' AND blood_type IN ('O-', 'O+')) OR
          (p_patient_blood_type = 'A-' AND blood_type IN ('O-', 'A-')) OR
          (p_patient_blood_type = 'A+' AND blood_type IN ('O-', 'O+', 'A-', 'A+')) OR
          (p_patient_blood_type = 'B-' AND blood_type IN ('O-', 'B-')) OR
          (p_patient_blood_type = 'B+' AND blood_type IN ('O-', 'O+', 'B-', 'B+')) OR
          (p_patient_blood_type = 'AB-' AND blood_type IN ('O-', 'A-', 'B-', 'AB-')) OR
          (p_patient_blood_type = 'AB+' AND blood_type IN ('O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'))
      )
    ORDER BY expiry_date ASC
    LIMIT 5;
END$$


DROP PROCEDURE IF EXISTS sp_match_organ$$
CREATE PROCEDURE sp_match_organ(IN p_organ_type_needed VARCHAR(50), IN p_patient_blood_type VARCHAR(5), IN p_patient_tissue_type VARCHAR(50))
BEGIN
    SELECT 
        o.organ_id,
        o.organ_type,
        o.donor_type,
        o.harvested_at,
        o.viability_hours,
        o.expires_at,
        o.tissue_type,
        o.storage_hospital_id,
        d.donor_id,
        d.full_name AS donor_name,
        d.blood_type AS donor_blood_type,
        CASE
            WHEN o.tissue_type = p_patient_tissue_type THEN 100
            ELSE 0
        END AS match_score
    FROM organs o
    JOIN donors d ON o.donor_id = d.donor_id
    WHERE o.status = 'available' 
      AND o.organ_type = p_organ_type_needed
      AND (
          (p_patient_blood_type = 'O-' AND d.blood_type = 'O-') OR
          (p_patient_blood_type = 'O+' AND d.blood_type IN ('O-', 'O+')) OR
          (p_patient_blood_type = 'A-' AND d.blood_type IN ('O-', 'A-')) OR
          (p_patient_blood_type = 'A+' AND d.blood_type IN ('O-', 'O+', 'A-', 'A+')) OR
          (p_patient_blood_type = 'B-' AND d.blood_type IN ('O-', 'B-')) OR
          (p_patient_blood_type = 'B+' AND d.blood_type IN ('O-', 'O+', 'B-', 'B+')) OR
          (p_patient_blood_type = 'AB-' AND d.blood_type IN ('O-', 'A-', 'B-', 'AB-')) OR
          (p_patient_blood_type = 'AB+' AND d.blood_type IN ('O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'))
      )
    ORDER BY match_score DESC, o.expires_at ASC
    LIMIT 3;
END$$


DROP PROCEDURE IF EXISTS sp_allocate_blood$$
CREATE PROCEDURE sp_allocate_blood(IN p_request_id INT, IN p_bag_id INT, IN p_approved_by VARCHAR(100))
BEGIN
    UPDATE blood_inventory SET status='reserved' WHERE bag_id = p_bag_id;
    UPDATE blood_requests SET status='matched' WHERE request_id = p_request_id;
    INSERT INTO allocations (request_type, blood_request_id, blood_bag_id, approved_by, approved_at, status)
    VALUES ('blood', p_request_id, p_bag_id, p_approved_by, NOW(), 'approved');
END$$


DROP PROCEDURE IF EXISTS sp_allocate_organ$$
CREATE PROCEDURE sp_allocate_organ(IN p_request_id INT, IN p_organ_id INT, IN p_approved_by VARCHAR(100), IN p_expected_delivery DATETIME)
BEGIN
    UPDATE organs SET status='matched' WHERE organ_id = p_organ_id;
    UPDATE organ_requests SET status='matched' WHERE request_id = p_request_id;
    INSERT INTO allocations (request_type, organ_request_id, organ_id, approved_by, approved_at, expected_delivery, status)
    VALUES ('organ', p_request_id, p_organ_id, p_approved_by, NOW(), p_expected_delivery, 'approved');
END$$


DROP PROCEDURE IF EXISTS sp_update_delivery$$
CREATE PROCEDURE sp_update_delivery(IN p_allocation_id INT, IN p_delivery_type ENUM('dispatched','delivered','failed'))
BEGIN
    DECLARE v_req_type ENUM('blood','organ');
    DECLARE v_blood_req_id INT;
    DECLARE v_organ_req_id INT;
    DECLARE v_blood_bag_id INT;
    DECLARE v_organ_id INT;

    SELECT request_type, blood_request_id, organ_request_id, blood_bag_id, organ_id
    INTO v_req_type, v_blood_req_id, v_organ_req_id, v_blood_bag_id, v_organ_id
    FROM allocations
    WHERE allocation_id = p_allocation_id;

    UPDATE allocations 
    SET status = p_delivery_type, 
        actual_delivery = NOW()
    WHERE allocation_id = p_allocation_id;

    IF p_delivery_type = 'delivered' THEN
        IF v_req_type = 'blood' THEN
            UPDATE blood_requests SET status = 'delivered' WHERE request_id = v_blood_req_id;
            UPDATE blood_inventory SET status = 'transfused' WHERE bag_id = v_blood_bag_id;
        ELSEIF v_req_type = 'organ' THEN
            UPDATE organ_requests SET status = 'delivered' WHERE request_id = v_organ_req_id;
            UPDATE organs SET status = 'transplanted' WHERE organ_id = v_organ_id;
        END IF;
    END IF;
END$$

DELIMITER ;
