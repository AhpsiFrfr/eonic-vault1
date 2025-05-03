import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yantkvucqzgivgppuork.supabase.co';
const supabaseKey = 'sbp_c6cb87c2d8e709b3b28197bcbfaa05fd710013b2';

export const supabase = createClient(supabaseUrl, supabaseKey);
