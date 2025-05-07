// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ufejrqckpcdszshvwjds.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZWpycWNrcGNkc3pzaHZ3amRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjQzMzgsImV4cCI6MjA2MjEwMDMzOH0.Xmzt9cF41qGqyx7c1tsSHSl5zEDf76SMJmpWS-0P-1Q'; // 여기에 너의 Supabase 프로젝트에서 발급받은 public anon key를 넣어야 해!

export const supabase = createClient(supabaseUrl, supabaseKey);
