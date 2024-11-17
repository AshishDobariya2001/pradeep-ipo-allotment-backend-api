CREATE TABLE IF NOT EXISTS public.allotment_status (
    id SERIAL PRIMARY KEY,
    company_id VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_id INTEGER,
    allotment_status VARCHAR(20) NOT NULL,
    data JSONB,
    whatsapp_is_sent BOOLEAN DEFAULT FALSE,
    notification_is_sent BOOLEAN DEFAULT FALSE,
    pancard VARCHAR(255),
    applied_stock TEXT,
    alloted_stock VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT allotment_status_contact_id_fkey FOREIGN KEY (contact_id)
        REFERENCES public.contacts (id) ON UPDATE NO ACTION ON DELETE NO ACTION
);
