// .github/scripts/keep-alive.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const email = process.env.SUPABASE_DUMMY_EMAIL;
const password = process.env.SUPABASE_DUMMY_PASSWORD;

if (!supabaseUrl || !email || !password) {
  throw new Error('SUPABASE_URL, SUPABASE_DUMMY_EMAIL, and SUPABASE_DUMMY_PASSWORD environment variables are required.');
}

// We can use the anon key here for the initial client creation
const supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);

async function keepAlive() {
  console.log('Attempting to sign in...');
  const { data: authData, error: authError } = 
  await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (authError) {
    throw new Error(`Sign-in failed: ${authError.message}`);
  }

  if (!authData.session) {
    throw new Error('Sign-in did not return a session.');
  }

  console.log('Successfully signed in. Querying data...');

  // Now using the authenticated client, we perform a query.
  const { data, error } = await supabase
    .from('conferences')
    .select('id')
    .limit(1);

  if (error) {
    throw new Error(`Query failed: ${error.message}`);
  }

  console.log('Successfully queried Supabase to keep it active.', data);
}

keepAlive().catch(error => {
  console.error('Keep-alive script failed:', error.message);
  process.exit(1);
});