import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          user_id?: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          user_id?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          user_id?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          content: string;
          sender: "user" | "bot";
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          content: string;
          sender: "user" | "bot";
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          content?: string;
          sender?: "user" | "bot";
          created_at?: string;
        };
      };
    };
  };
};
