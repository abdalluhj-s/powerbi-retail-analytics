-- =============================================================================
--                    SUPABASE / POSTGRESQL DATABASE SCHEMA
--               Project: Global Retail & E-Commerce Executive Analytics
-- =============================================================================

-- 1. Create Dim_Region Table
CREATE TABLE IF NOT EXISTS dim_region (
    region_id VARCHAR(10) PRIMARY KEY,
    region_name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    regional_manager VARCHAR(100) NOT NULL
);

-- 2. Create Dim_Product Table
CREATE TABLE IF NOT EXISTS dim_product (
    product_id VARCHAR(20) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    cost_price NUMERIC(10, 2) NOT NULL,
    retail_price NUMERIC(10, 2) NOT NULL
);

-- 3. Create Dim_Customer Table
CREATE TABLE IF NOT EXISTS dim_customer (
    customer_id VARCHAR(20) PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    gender VARCHAR(10),
    age INT,
    customer_segment VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20)
);

-- 4. Create Fact_Sales Table
CREATE TABLE IF NOT EXISTS fact_sales (
    order_id VARCHAR(30) NOT NULL,
    order_date DATE NOT NULL,
    ship_date DATE NOT NULL,
    customer_id VARCHAR(20) REFERENCES dim_customer(customer_id),
    product_id VARCHAR(20) REFERENCES dim_product(product_id),
    region_id VARCHAR(10) REFERENCES dim_region(region_id),
    sales_channel VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(4, 2) DEFAULT 0.00,
    total_sales NUMERIC(12, 2) NOT NULL,
    total_cost NUMERIC(12, 2) NOT NULL,
    total_profit NUMERIC(12, 2) NOT NULL
);

-- 5. Create Performance Indexes for Fast Analytics Queries
CREATE INDEX IF NOT EXISTS idx_fact_sales_order_date ON fact_sales(order_date);
CREATE INDEX IF NOT EXISTS idx_fact_sales_customer ON fact_sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_fact_sales_product ON fact_sales(product_id);
CREATE INDEX IF NOT EXISTS idx_fact_sales_region ON fact_sales(region_id);

-- 6. Create Analytical View for Executive KPI Summary
CREATE OR REPLACE VIEW v_executive_kpis AS
SELECT 
    DATE_TRUNC('month', order_date)::DATE AS sales_month,
    COUNT(DISTINCT order_id) AS total_orders,
    SUM(quantity) AS total_units_sold,
    SUM(total_sales) AS total_revenue,
    SUM(total_profit) AS total_profit,
    ROUND((SUM(total_profit) / NULLIF(SUM(total_sales), 0)) * 100, 2) AS profit_margin_pct,
    ROUND(SUM(total_sales) / NULLIF(COUNT(DISTINCT order_id), 0), 2) AS average_order_value
FROM fact_sales
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY sales_month DESC;

-- Enable Row Level Security (RLS) if public access via Supabase REST API is needed:
ALTER TABLE dim_region ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_product ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to dim_region" ON dim_region FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dim_product" ON dim_product FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dim_customer" ON dim_customer FOR SELECT USING (true);
CREATE POLICY "Allow public read access to fact_sales" ON fact_sales FOR SELECT USING (true);
