/*
  # Add retail-specific fields to survey responses

  1. Changes
    - Add supply_chain and inventory_management columns to survey_responses table
    - Make digital_strategy column nullable since it's now handled differently
    - Add check constraints to ensure valid values for new fields

  2. Notes
    - Both fields are optional and only used for retail industry responses
    - Values range from 1-3 representing efficiency levels
*/

-- Make digital_strategy nullable since it's handled differently now
ALTER TABLE survey_responses 
ALTER COLUMN digital_strategy DROP NOT NULL;

-- Add new columns for retail-specific metrics
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'survey_responses' AND column_name = 'supply_chain'
  ) THEN
    ALTER TABLE survey_responses 
    ADD COLUMN supply_chain integer,
    ADD CONSTRAINT supply_chain_range 
    CHECK (supply_chain IS NULL OR (supply_chain >= 1 AND supply_chain <= 3));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'survey_responses' AND column_name = 'inventory_management'
  ) THEN
    ALTER TABLE survey_responses 
    ADD COLUMN inventory_management integer,
    ADD CONSTRAINT inventory_management_range 
    CHECK (inventory_management IS NULL OR (inventory_management >= 1 AND inventory_management <= 3));
  END IF;
END $$;