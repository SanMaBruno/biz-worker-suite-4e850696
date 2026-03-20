export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          module: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          module: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          module?: string
          user_id?: string | null
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string | null
          company_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
          rut: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          rut: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          rut?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_amendments: {
        Row: {
          amendment_date: string
          contract_id: string
          created_at: string
          description: string
          file_url: string | null
          id: string
          new_salary: number | null
        }
        Insert: {
          amendment_date: string
          contract_id: string
          created_at?: string
          description: string
          file_url?: string | null
          id?: string
          new_salary?: number | null
        }
        Update: {
          amendment_date?: string
          contract_id?: string
          created_at?: string
          description?: string
          file_url?: string | null
          id?: string
          new_salary?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_amendments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          contract_type: string
          created_at: string
          description: string | null
          employee_id: string
          end_date: string | null
          file_url: string | null
          id: string
          salary: number
          start_date: string
          status: Database["public"]["Enums"]["contract_status"]
          updated_at: string
        }
        Insert: {
          contract_type: string
          created_at?: string
          description?: string | null
          employee_id: string
          end_date?: string | null
          file_url?: string | null
          id?: string
          salary: number
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
        }
        Update: {
          contract_type?: string
          created_at?: string
          description?: string | null
          employee_id?: string
          end_date?: string | null
          file_url?: string | null
          id?: string
          salary?: number
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["document_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          type?: Database["public"]["Enums"]["document_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["document_type"]
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          base_salary: number
          birth_date: string | null
          branch_id: string | null
          company_id: string
          created_at: string
          department_id: string | null
          email: string
          first_name: string
          hire_date: string
          id: string
          is_active: boolean
          last_name: string
          phone: string | null
          position_id: string | null
          rut: string
          termination_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          base_salary?: number
          birth_date?: string | null
          branch_id?: string | null
          company_id: string
          created_at?: string
          department_id?: string | null
          email: string
          first_name: string
          hire_date: string
          id?: string
          is_active?: boolean
          last_name: string
          phone?: string | null
          position_id?: string | null
          rut: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          base_salary?: number
          birth_date?: string | null
          branch_id?: string | null
          company_id?: string
          created_at?: string
          department_id?: string | null
          email?: string
          first_name?: string
          hire_date?: string
          id?: string
          is_active?: boolean
          last_name?: string
          phone?: string | null
          position_id?: string | null
          rut?: string
          termination_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_documents: {
        Row: {
          amount: number | null
          category_id: string | null
          company_id: string
          created_at: string
          description: string | null
          document_date: string
          file_name: string | null
          file_url: string | null
          id: string
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          amount?: number | null
          category_id?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          document_date: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          amount?: number | null
          category_id?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          document_date?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      labor_documents: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          employee_id: string
          file_name: string | null
          file_url: string | null
          id: string
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          employee_id: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          employee_id?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labor_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labor_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          employee_id: string
          id: string
          notes: string | null
          payment_date: string
          payment_method: string
          payroll_id: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          employee_id: string
          id?: string
          notes?: string | null
          payment_date: string
          payment_method?: string
          payroll_id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          employee_id?: string
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string
          payroll_id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payrolls"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_items: {
        Row: {
          amount: number
          concept: string
          created_at: string
          id: string
          is_taxable: boolean
          payroll_id: string
          sort_order: number
          type: string
        }
        Insert: {
          amount?: number
          concept: string
          created_at?: string
          id?: string
          is_taxable?: boolean
          payroll_id: string
          sort_order?: number
          type: string
        }
        Update: {
          amount?: number
          concept?: string
          created_at?: string
          id?: string
          is_taxable?: boolean
          payroll_id?: string
          sort_order?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_items_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payrolls"
            referencedColumns: ["id"]
          },
        ]
      }
      payrolls: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          employee_id: string
          file_url: string | null
          gross_salary: number
          id: string
          net_salary: number
          notes: string | null
          period_month: number
          period_year: number
          status: Database["public"]["Enums"]["payroll_status"]
          total_deductions: number
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_id: string
          file_url?: string | null
          gross_salary?: number
          id?: string
          net_salary?: number
          notes?: string | null
          period_month: number
          period_year: number
          status?: Database["public"]["Enums"]["payroll_status"]
          total_deductions?: number
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          employee_id?: string
          file_url?: string | null
          gross_salary?: number
          id?: string
          net_salary?: number
          notes?: string | null
          period_month?: number
          period_year?: number
          status?: Database["public"]["Enums"]["payroll_status"]
          total_deductions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payrolls_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          module: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          module: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          module?: string
          name?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean
          last_name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean
          last_name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_employee_id_for_user: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_finanzas: { Args: { _user_id: string }; Returns: boolean }
      is_admin_or_rrhh: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "superadmin" | "rrhh" | "finanzas" | "trabajador"
      contract_status: "active" | "terminated" | "suspended"
      document_type: "labor" | "financial" | "contract" | "payroll" | "other"
      payment_status: "pending" | "completed" | "failed" | "reversed"
      payroll_status: "draft" | "approved" | "paid" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["superadmin", "rrhh", "finanzas", "trabajador"],
      contract_status: ["active", "terminated", "suspended"],
      document_type: ["labor", "financial", "contract", "payroll", "other"],
      payment_status: ["pending", "completed", "failed", "reversed"],
      payroll_status: ["draft", "approved", "paid", "cancelled"],
    },
  },
} as const
