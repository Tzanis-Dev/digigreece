-- Add homepage_url column
ALTER TABLE digital_tools_recommendations 
ADD COLUMN IF NOT EXISTS homepage_url text;

-- Update existing records with homepage URLs
UPDATE digital_tools_recommendations
SET homepage_url = CASE tool_option_name
  WHEN 'HubSpot CRM' THEN 'https://www.hubspot.com/products/crm'
  WHEN 'WooCommerce' THEN 'https://woocommerce.com'
  WHEN 'Wave Accounting' THEN 'https://www.waveapps.com'
  WHEN 'ActiveCampaign' THEN 'https://www.activecampaign.com'
  WHEN 'Google Workspace' THEN 'https://workspace.google.com'
  WHEN 'Google Analytics' THEN 'https://analytics.google.com'
  WHEN 'Hootsuite' THEN 'https://www.hootsuite.com'
  WHEN 'Flutter' THEN 'https://flutter.dev'
  WHEN 'Calendly' THEN 'https://calendly.com'
  WHEN 'QR Menu Creator' THEN 'https://www.qrcode-monkey.com'
  WHEN 'Trello' THEN 'https://trello.com'
  WHEN 'PriceEdge' THEN 'https://priceedge.eu'
  WHEN 'Google Classroom' THEN 'https://classroom.google.com'
  WHEN 'Slack' THEN 'https://slack.com'
  WHEN 'Samsara' THEN 'https://www.samsara.com'
  WHEN 'RouteXL' THEN 'https://www.routexl.com'
  WHEN 'Fitbit API' THEN 'https://dev.fitbit.com'
  WHEN 'OpenEMR' THEN 'https://www.open-emr.org'
  WHEN 'Zoho Inventory' THEN 'https://www.zoho.com/inventory'
  ELSE 'https://www.google.com/search?q=' || replace(tool_option_name, ' ', '+')
END;

-- Make homepage_url required for future entries
ALTER TABLE digital_tools_recommendations
ALTER COLUMN homepage_url SET NOT NULL;