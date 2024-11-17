CREATE TABLE IF NOT EXISTS public.stock_price
(
    id SERIAL PRIMARY KEY,
    stock_information JSONB,
    exchange_type VARCHAR,
    open VARCHAR,
    high VARCHAR,
    previous VARCHAR,
    low VARCHAR,
    previous_day_close VARCHAR,
    total_traded_shares VARCHAR,
    total_number_of_trades VARCHAR,
    net_turnover VARCHAR,
    current_price VARCHAR,
    current_price_movement VARCHAR,
    current_price_movement_percentage VARCHAR,
    ipo_details_id INTEGER,
    CONSTRAINT stock_price_ipo_details_id_fkey FOREIGN KEY (ipo_details_id)
        REFERENCES public.ipo_details(id) 
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
