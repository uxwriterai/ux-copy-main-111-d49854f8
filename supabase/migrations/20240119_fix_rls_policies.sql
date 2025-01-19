-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Anonymous users can read their credits" ON user_credits;
DROP POLICY IF EXISTS "Anonymous users can update their credits" ON user_credits;

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can read their own credits"
ON user_credits FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON user_credits FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own credits"
ON user_credits FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policies for anonymous users
CREATE POLICY "Anonymous users can read their credits"
ON user_credits FOR SELECT
TO anon
USING (user_id IS NULL AND ip_address = current_setting('request.headers')::json->>'cf-connecting-ip');

CREATE POLICY "Anonymous users can insert their credits"
ON user_credits FOR INSERT
TO anon
WITH CHECK (user_id IS NULL AND ip_address = current_setting('request.headers')::json->>'cf-connecting-ip');

CREATE POLICY "Anonymous users can update their credits"
ON user_credits FOR UPDATE
TO anon
USING (user_id IS NULL AND ip_address = current_setting('request.headers')::json->>'cf-connecting-ip')
WITH CHECK (user_id IS NULL AND ip_address = current_setting('request.headers')::json->>'cf-connecting-ip');