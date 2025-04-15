/*
  # Add digital tools recommendations

  1. New Tables
    - `digital_tools_recommendations`
      - `id` (uuid, primary key)
      - `industry_id` (integer, references industry)
      - `tool_name` (text)
      - `priority` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `digital_tools_recommendations` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS digital_tools_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id integer NOT NULL,
  tool_name text NOT NULL,
  priority integer NOT NULL CHECK (priority >= 0 AND priority <= 10),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE digital_tools_recommendations ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON digital_tools_recommendations
  FOR SELECT
  TO public
  USING (true);

-- Insert tool recommendations for each industry
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