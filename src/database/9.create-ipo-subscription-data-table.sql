CREATE TABLE IF NOT EXISTS public.stock_price (
    id SERIAL PRIMARY KEY,
    stock_information JSONB,
    exchange_type VARCHAR(100),
    open NUMERIC(12, 2),
    high NUMERIC(12, 2),
    low NUMERIC(12, 2),
    previous NUMERIC(12, 2),
    previous_day_close NUMERIC(12, 2),
    total_traded_shares BIGINT,
    total_number_of_trades BIGINT,
    net_turnover NUMERIC(15, 2),
    current_price NUMERIC(12, 2),
    current_price_movement NUMERIC(12, 2),
    current_price_movement_percentage NUMERIC(6, 2),
    ipo_details_id INTEGER NOT NULL,

    CONSTRAINT stock_price_ipo_details_id_fkey FOREIGN KEY (ipo_details_id)
        REFERENCES public.ipo_details (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
