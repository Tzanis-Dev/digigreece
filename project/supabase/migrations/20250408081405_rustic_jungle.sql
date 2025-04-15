/*
  # Create survey responses table

  1. New Tables
    - `survey_responses`
      - `id` (uuid, primary key)
      - `industry` (text)
      - `years` (integer)
      - `employees` (integer)
      - `revenue_trend` (integer)
      - `likability` (integer)
      - `market_share` (integer)
      - `customer_base` (text)
      - `usp` (integer)
      - `digital_skills` (integer)
      - `data_management` (integer)
      - `profit_margins` (integer)
      - `debt` (integer)
      - `cash_flow` (integer)
      - `digital_strategy` (text[])
      - `email` (text)
      - `phone` (text)
      - `score` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `survey_responses` table
    - Add policy for inserting new responses
    - Add policy for reading own responses
*/

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
  digital_strategy text[] NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  score numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert survey responses"
  ON survey_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read their own responses"
  ON survey_responses
  FOR SELECT
  TO public
  USING (email = current_user);