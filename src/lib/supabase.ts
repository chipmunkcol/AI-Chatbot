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
      custom_bots: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description?: string;
          instructions?: string;
          user_id?: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          description?: string;
          instructions?: string;
          user_id?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string;
          instructions?: string;
          user_id?: string;
          is_active?: boolean;
        };
      };
      knowledge_base: {
        Row: {
          id: string;
          custom_bot_id: string;
          content: string;
          metadata?: any;
          embedding?: number[];
          created_at: string;
        };
        Insert: {
          id?: string;
          custom_bot_id: string;
          content: string;
          metadata?: any;
          embedding?: number[];
          created_at?: string;
        };
        Update: {
          id?: string;
          custom_bot_id?: string;
          content?: string;
          metadata?: any;
          embedding?: number[];
          created_at?: string;
        };
      };
      uploaded_files: {
        Row: {
          id: string;
          custom_bot_id: string;
          filename: string;
          file_type: string;
          file_size?: number;
          processed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          custom_bot_id: string;
          filename: string;
          file_type: string;
          file_size?: number;
          processed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          custom_bot_id?: string;
          filename?: string;
          file_type?: string;
          file_size?: number;
          processed?: boolean;
          created_at?: string;
        };
      };
    };
    Functions: {
      match_knowledge_base: {
        Args: {
          query_embedding: number[];
          bot_id: string;
          match_threshold?: number;
          match_count?: number;
        };
        Returns: {
          id: string;
          content: string;
          metadata: any;
          similarity: number;
        }[];
      };
    };
  };
};
