/*
  # Create and update tables for digital readiness assessment

  1. Tables
    - Create survey_responses if not exists
    - Create digital_tools_recommendations if not exists
    - Add constraints for new fields

  2. Security
    - Enable RLS on both tables
    - Create policies if they don't exist
    - Add tool recommendations data
*/

-- Create survey_responses table if it doesn't exist
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
  supply_chain integer,
  inventory_management integer,
  email text NOT NULL,
  phone text NOT NULL,
  score numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT supply_chain_range CHECK (supply_chain IS NULL OR (supply_chain >= 1 AND supply_chain <= 3)),
  CONSTRAINT inventory_management_range CHECK (inventory_management IS NULL OR (inventory_management >= 1 AND inventory_management <= 3))
);

-- Create digital_tools_recommendations table if it doesn't exist
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

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'survey_responses' 
    AND policyname = 'Anyone can insert survey responses'
  ) THEN
    CREATE POLICY "Anyone can insert survey responses"
      ON survey_responses
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'survey_responses' 
    AND policyname = 'Users can read their own responses'
  ) THEN
    CREATE POLICY "Users can read their own responses"
      ON survey_responses
      FOR SELECT
      TO public
      USING (email = current_user);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'digital_tools_recommendations' 
    AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access"
      ON digital_tools_recommendations
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Insert tool recommendations if table is empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM digital_tools_recommendations LIMIT 1) THEN
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
    (2, 'Project Management Tools', 4);
  END IF;
END $$;