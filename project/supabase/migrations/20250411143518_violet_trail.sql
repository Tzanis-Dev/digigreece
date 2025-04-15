/*
  # Update digital tools recommendations with detailed options

  1. Changes
    - Add new columns to digital_tools_recommendations table:
      - tool_option_name (text): Name of the specific tool option
      - price_tier (integer): Price tier (1-3)
      - price_amount (text): Actual price amount
      - description (text): Tool description
    - Update existing records with detailed options
    - Maintain existing RLS policies

  2. Security
    - Maintain existing RLS settings
    - Keep public read access
*/

-- First, add new columns if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'digital_tools_recommendations' AND column_name = 'tool_option_name'
  ) THEN
    ALTER TABLE digital_tools_recommendations 
    ADD COLUMN tool_option_name text,
    ADD COLUMN price_tier integer,
    ADD COLUMN price_amount text,
    ADD COLUMN description text;
  END IF;
END $$;

-- Clear existing data
TRUNCATE TABLE digital_tools_recommendations;

-- Insert updated data with detailed options
INSERT INTO digital_tools_recommendations (
  industry_id, 
  tool_name, 
  priority, 
  tool_option_name, 
  price_tier, 
  price_amount, 
  description
) VALUES
-- Retail (1)
(1, 'CRM', 8, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(1, 'E-commerce Platforms', 10, 'WooCommerce', 1, 'Free', 'Plugin for WordPress, ideal for small online stores'),
(1, 'Accounting and Invoicing', 9, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(1, 'Marketing Automation Tools', 7, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(1, 'Cloud Storage and Collaboration', 6, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(1, 'Analytics and Reporting Tools', 8, 'Google Analytics', 1, 'Free', 'Basic analytics platform for websites'),
(1, 'Social Media tool', 9, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(1, 'Mobile App (Loyalty/Purchases)', 7, 'Flutter', 1, 'Free', 'Open-source framework by Google for cross-platform apps'),
(1, 'Online Appointment Tools', 4, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),

-- Food and Beverages (2)
(2, 'CRM', 7, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(2, 'Mobile Ordering App / Site', 8, 'Flutter', 1, 'Free', 'Open-source framework by Google for cross-platform apps'),
(2, 'QR Code Menus', 9, 'QR Menu Creator', 1, 'Free', 'Simple QR code menu generation'),
(2, 'E-commerce Platforms', 9, 'WooCommerce', 1, 'Free', 'Plugin for WordPress, ideal for small online stores'),
(2, 'Accounting and Invoicing', 8, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(2, 'Marketing Automation Tools', 6, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(2, 'Cloud Storage and Collaboration', 5, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(2, 'Social Media tool', 9, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(2, 'Online Appointment Tools', 7, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),
(2, 'Project Management Tools', 4, 'Trello', 1, 'Free', 'Basic task management tool'),

-- Services (3)
(3, 'Mobile App for Bookings', 8, 'Flutter', 1, 'Free', 'Open-source framework by Google for cross-platform apps'),
(3, 'CRM', 8, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(3, 'Accounting and Invoicing', 7, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(3, 'Marketing Automation Tools', 6, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(3, 'Cloud Storage and Collaboration', 5, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(3, 'Social Media tool', 8, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(3, 'Online Appointment Tools', 10, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),
(3, 'Project Management Tools', 3, 'Trello', 1, 'Free', 'Basic task management tool'),

-- Tourism and Leisure (4)
(4, 'CRM', 9, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(4, 'E-commerce Platforms', 9, 'WooCommerce', 1, 'Free', 'Plugin for WordPress, ideal for small online stores'),
(4, 'Accounting and Invoicing', 7, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(4, 'Project Management Tools', 6, 'Trello', 1, 'Free', 'Basic task management tool'),
(4, 'Marketing Automation Tools', 7, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(4, 'Cloud Storage and Collaboration', 6, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(4, 'Dynamic Pricing Tools', 7, 'PriceEdge', 2, 'Contact for pricing', 'Dynamic pricing optimization platform'),
(4, 'Social Media tool', 10, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(4, 'Online Appointment Tools', 8, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),

-- Education and Arts (5)
(5, 'CRM', 7, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(5, 'Virtual Classrooms', 8, 'Google Classroom', 1, 'Free', 'Free virtual classroom platform'),
(5, 'E-commerce Platforms', 8, 'WooCommerce', 1, 'Free', 'Plugin for WordPress, ideal for small online stores'),
(5, 'Accounting and Invoicing', 7, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(5, 'Marketing Automation Tools', 6, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(5, 'Cloud Storage and Collaboration', 7, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(5, 'Social Media tool', 8, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(5, 'Online Appointment Tools', 6, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),
(5, 'Project Management Tools', 5, 'Trello', 1, 'Free', 'Basic task management tool'),

-- Technology (6)
(6, 'CRM', 8, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(6, 'E-commerce Platforms', 6, 'WooCommerce', 1, 'Free', 'Plugin for WordPress, ideal for small online stores'),
(6, 'Accounting and Invoicing', 9, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(6, 'Project Management Tools', 10, 'Trello', 1, 'Free', 'Basic task management tool'),
(6, 'Marketing Automation Tools', 7, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(6, 'Cloud Storage and Collaboration', 9, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(6, 'Communication Tools', 10, 'Slack', 2, '€7.25/user/month', 'Affordable team communication platform'),
(6, 'Analytics and Reporting Tools', 9, 'Google Analytics', 1, 'Free', 'Basic analytics platform for websites'),
(6, 'Social Media tool', 8, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),

-- Construction and Maintenance (7)
(7, 'CRM', 7, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(7, 'Accounting and Invoicing', 8, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(7, 'Marketing Automation Tools', 4, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(7, 'Cloud Storage and Collaboration', 6, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(7, 'Social Media tool', 7, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(7, 'Online Appointment Tools', 8, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),
(7, 'Project Management Tools', 7, 'Trello', 1, 'Free', 'Basic task management tool'),

-- Transportation (8)
(8, 'CRM', 6, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(8, 'Ride-Hailing App Integration', 9, 'Flutter', 1, 'Free', 'Open-source framework by Google for cross-platform apps'),
(8, 'GPS Fleet Tracking', 8, 'Samsara', 2, 'Contact for pricing', 'Fleet management and GPS tracking solution'),
(8, 'Dynamic Route Optimization', 7, 'RouteXL', 1, '€35/month', 'Route optimization for small fleets'),
(8, 'E-commerce Platforms', 9, 'WooCommerce', 1, 'Free', 'Plugin for WordPress, ideal for small online stores'),
(8, 'Accounting and Invoicing', 7, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(8, 'Project Management Tools', 6, 'Trello', 1, 'Free', 'Basic task management tool'),
(8, 'Marketing Automation Tools', 5, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(8, 'Cloud Storage and Collaboration', 5, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(8, 'Social Media tool', 7, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(8, 'Online Appointment Tools', 8, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),

-- Health and Wellness (9)
(9, 'CRM', 8, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(9, 'Accounting and Invoicing', 7, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(9, 'Marketing Automation Tools', 6, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(9, 'Cloud Storage and Collaboration', 6, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(9, 'Social Media tool', 8, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(9, 'Online Appointment Tools', 10, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),
(9, 'Wearable Device Integration', 7, 'Fitbit API', 1, 'Free', 'Integration with Fitbit devices'),
(9, 'Electronic Health Records (integrations)', 8, 'OpenEMR', 1, 'Free', 'Open-source electronic health records system'),
(9, 'Project Management Tools', 4, 'Trello', 1, 'Free', 'Basic task management tool'),

-- Manufacturing & Craftsmanship (10)
(10, 'CRM', 6, 'HubSpot CRM', 1, 'Free', 'Basic CRM for small businesses'),
(10, 'E-commerce Platforms', 9, 'WooCommerce', 1, 'Free', 'Plugin for WordPress, ideal for small online stores'),
(10, 'Accounting and Invoicing', 7, 'Wave Accounting', 1, 'Free', 'Simple accounting for small businesses'),
(10, 'Project Management Tools', 5, 'Trello', 1, 'Free', 'Basic task management tool'),
(10, 'Marketing Automation Tools', 5, 'ActiveCampaign', 2, '€15/user/month', 'Affordable automation with CRM integration'),
(10, 'Cloud Storage and Collaboration', 6, 'Google Workspace', 1, '€5.20/user/month', 'Basic collaboration tools like Drive, Docs, Sheets'),
(10, 'Social Media tool', 8, 'Hootsuite', 2, '€49/month', 'Social media management with scheduling & analytics'),
(10, 'Online Appointment Tools', 3, 'Calendly', 1, 'Free', 'Basic scheduling and appointment management'),
(10, 'Supply Chain Automation', 7, 'Zoho Inventory', 2, '€79/month', 'Inventory and supply chain management');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_digital_tools_recommendations_industry_priority 
ON digital_tools_recommendations(industry_id, priority DESC);

CREATE INDEX IF NOT EXISTS idx_digital_tools_recommendations_tool_name 
ON digital_tools_recommendations(tool_name);