/*
  # Initial Schema Setup for Digital Readiness Assessment

  1. New Tables
    - `survey_responses`
      - Stores user survey submissions
      - Includes all survey questions and responses
      - Has RLS policies for data privacy
    
    - `digital_tools_recommendations`
      - Stores recommended digital tools per industry
      - Includes priority scores for recommendations
      - Public read access

  2. Security
    - RLS enabled on both tables
    - Public can insert survey responses
    - Users can only read their own responses
    - Public can read tool recommendations
*/

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry text NOT NULL,
  years integer NOT NULL,
  employees integer NOT NULL,
  revenue_trend integer NOT NULL,
  likability integer NOT NULL,
  market_share integer NOT NULL,
  customer_base text NOT NULL,
  usp integer NOT NULL,
  digital_skills integer NOT NULL,
  data_management integer NOT NULL,
  profit_margins integer NOT NULL,
  debt integer NOT NULL,
  cash_flow integer NOT NULL,
  digital_strategy text[],
  supply_chain integer,
  inventory_management integer,
  email text NOT NULL,
  phone text NOT NULL,
  score numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT supply_chain_range CHECK (supply_chain IS NULL OR (supply_chain >= 1 AND supply_chain <= 3)),
  CONSTRAINT inventory_management_range CHECK (inventory_management IS NULL OR (inventory_management >= 1 AND inventory_management <= 3))
);

-- Create digital_tools_recommendations table
CREATE TABLE IF NOT EXISTS digital_tools_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id integer NOT NULL,
  tool_name text NOT NULL,
  priority integer NOT NULL CHECK (priority >= 0 AND priority <= 10),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_tools_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'survey_responses' AND policyname = 'Anyone can insert survey responses'
  ) THEN
    CREATE POLICY "Anyone can insert survey responses"
      ON survey_responses
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'survey_responses' AND policyname = 'Users can read their own responses'
  ) THEN
    CREATE POLICY "Users can read their own responses"
      ON survey_responses
      FOR SELECT
      TO public
      USING (email = current_user);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'digital_tools_recommendations' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access"
      ON digital_tools_recommendations
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Insert initial tool recommendations
INSERT INTO digital_tools_recommendations (industry_id, tool_name, priority) VALUES
-- Retail
(1, 'CRM', 8),
(1, 'E-commerce Platforms', 10),
(1, 'Accounting and Invoicing', 9),
(1, 'Marketing Automation Tools', 7),
(1, 'Cloud Storage and Collaboration', 6),
(1, 'Analytics and Reporting Tools', 8),
(1, 'Social Media Presence and SEO', 9),
(1, 'Mobile App (Loyalty/Purchases)', 7),
(1, 'Online Appointment Tools', 4),

-- Food and Beverages
(2, 'CRM', 7),
(2, 'Mobile Ordering App / Site', 8),
(2, 'QR Code Menus', 9),
(2, 'E-commerce Platforms', 9),
(2, 'Accounting and Invoicing', 8),
(2, 'Marketing Automation Tools', 6),
(2, 'Cloud Storage and Collaboration', 5),
(2, 'Social Media Presence and SEO', 9),
(2, 'Online Appointment Tools', 7),
(2, 'Project Management Tools', 4),

-- Services
(3, 'Mobile App for Bookings', 8),
(3, 'CRM', 8),
(3, 'Accounting and Invoicing', 7),
(3, 'Marketing Automation Tools', 6),
(3, 'Cloud Storage and Collaboration', 5),
(3, 'Social Media Presence and SEO', 8),
(3, 'Online Appointment Tools', 10),
(3, 'Project Management Tools', 3),

-- Tourism and Leisure
(4, 'CRM', 9),
(4, 'E-commerce Platforms', 9),
(4, 'Accounting and Invoicing', 7),
(4, 'Project Management Tools', 6),
(4, 'Marketing Automation Tools', 7),
(4, 'Cloud Storage and Collaboration', 6),
(4, 'Dynamic Pricing Tools', 7),
(4, 'Social Media Presence and SEO', 10),
(4, 'Online Appointment Tools', 8),

-- Education and Arts
(5, 'CRM', 7),
(5, 'Virtual Classrooms', 8),
(5, 'E-commerce Platforms', 8),
(5, 'Accounting and Invoicing', 7),
(5, 'Marketing Automation Tools', 6),
(5, 'Cloud Storage and Collaboration', 7),
(5, 'Social Media Presence and SEO', 8),
(5, 'Online Appointment Tools', 6),
(5, 'Project Management Tools', 5),

-- Technology
(6, 'CRM', 8),
(6, 'E-commerce Platforms', 6),
(6, 'Accounting and Invoicing', 9),
(6, 'Project Management Tools', 10),
(6, 'Marketing Automation Tools', 7),
(6, 'Cloud Storage and Collaboration', 9),
(6, 'Cybersecurity Solutions', 10),
(6, 'Communication Tools', 9),
(6, 'Analytics and Reporting Tools', 8),
(6, 'Social Media Presence and SEO', 7),

-- Construction and Maintenance
(7, 'CRM', 7),
(7, 'Accounting and Invoicing', 8),
(7, 'Marketing Automation Tools', 4),
(7, 'Cloud Storage and Collaboration', 6),
(7, 'Social Media Presence and SEO', 7),
(7, 'Online Appointment Tools', 8),
(7, 'Project Management Tools', 7),

-- Transportation
(8, 'CRM', 6),
(8, 'Ride-Hailing App Integration', 9),
(8, 'GPS Fleet Tracking', 8),
(8, 'Dynamic Route Optimization', 7),
(8, 'E-commerce Platforms', 9),
(8, 'Accounting and Invoicing', 7),
(8, 'Project Management Tools', 6),
(8, 'Marketing Automation Tools', 5),
(8, 'Cloud Storage and Collaboration', 5),
(8, 'Social Media Presence and SEO', 7),
(8, 'Online Appointment Tools', 8),

-- Health and Wellness
(9, 'CRM', 8),
(9, 'Accounting and Invoicing', 7),
(9, 'Marketing Automation Tools', 6),
(9, 'Cloud Storage and Collaboration', 6),
(9, 'Social Media Presence and SEO', 8),
(9, 'Online Appointment Tools', 10),
(9, 'Wearable Device Integration', 7),
(9, 'Electronic Health Records (integrations)', 8),
(9, 'Project Management Tools', 4),

-- Manufacturing & Craftsmanship
(10, 'CRM', 6),
(10, 'E-commerce Platforms', 9),
(10, 'Accounting and Invoicing', 7),
(10, 'Project Management Tools', 5),
(10, 'Marketing Automation Tools', 5),
(10, 'Cloud Storage and Collaboration', 6),
(10, 'Social Media Presence and SEO', 8),
(10, 'Online Appointment Tools', 3),
(10, 'Supply Chain Automation', 7);