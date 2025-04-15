/*
  # Add company name to survey responses

  1. Changes
    - Add company_name column to survey_responses table
    - Make it nullable since it's optional
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'survey_responses' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE survey_responses 
    ADD COLUMN company_name text;
  END IF;
END $$;