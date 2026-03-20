import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // 1. Create users
    const userDefs = [
      { email: "admin@empresa.cl", pw: "admin123", fn: "Carlos", ln: "Mendoza", role: "superadmin" },
      { email: "rrhh@empresa.cl", pw: "rrhh123", fn: "María", ln: "González", role: "rrhh" },
      { email: "finanzas@empresa.cl", pw: "finanzas123", fn: "Roberto", ln: "Fuentes", role: "finanzas" },
      { email: "juan.perez@empresa.cl", pw: "trabajador123", fn: "Juan", ln: "Pérez", role: "trabajador" },
      { email: "maria.lopez@empresa.cl", pw: "trabajador123", fn: "María", ln: "López", role: "trabajador" },
      { email: "pedro.sanchez@empresa.cl", pw: "trabajador123", fn: "Pedro", ln: "Sánchez", role: "trabajador" },
      { email: "ana.martinez@empresa.cl", pw: "trabajador123", fn: "Ana", ln: "Martínez", role: "trabajador" },
      { email: "diego.rojas@empresa.cl", pw: "trabajador123", fn: "Diego", ln: "Rojas", role: "trabajador" },
    ];

    const userIds: Record<string, string> = {};
    for (const u of userDefs) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email, password: u.pw, email_confirm: true,
        user_metadata: { first_name: u.fn, last_name: u.ln }
      });
      if (error) { console.log("User exists or error:", u.email, error.message); continue; }
      if (data.user) {
        userIds[u.email] = data.user.id;
        await supabase.from("user_roles").insert({ user_id: data.user.id, role: u.role });
      }
    }

    // 2. Company
    const { data: company, error: compErr } = await supabase.from("companies").insert({
      name: "Constructora Pacífico SpA", rut: "76.123.456-7",
      address: "Av. Providencia 1234, Santiago", phone: "+56 2 2345 6789", email: "contacto@pacifico.cl"
    }).select().single();
    if (compErr) return new Response(JSON.stringify({ error: "Company: " + compErr.message }), { status: 500 });

    // 3. Branches, Depts, Positions
    const { data: branches } = await supabase.from("branches").insert([
      { company_id: company.id, name: "Casa Matriz Santiago", address: "Av. Providencia 1234" },
      { company_id: company.id, name: "Sucursal Valparaíso", address: "Calle Blanco 567" },
    ]).select();

    const { data: depts } = await supabase.from("departments").insert([
      { company_id: company.id, name: "Operaciones" },
      { company_id: company.id, name: "Administración" },
      { company_id: company.id, name: "Ingeniería" },
    ]).select();

    const { data: positions } = await supabase.from("positions").insert([
      { company_id: company.id, name: "Ingeniero Civil" },
      { company_id: company.id, name: "Jefe de Obra" },
      { company_id: company.id, name: "Analista Contable" },
      { company_id: company.id, name: "Asistente Administrativo" },
      { company_id: company.id, name: "Supervisor de Terreno" },
    ]).select();

    // 4. Doc categories
    const { data: docCats } = await supabase.from("document_categories").insert([
      { name: "Certificado Antigüedad", type: "labor" },
      { name: "Certificado AFP", type: "labor" },
      { name: "Contrato de Trabajo", type: "contract" },
      { name: "Factura", type: "financial" },
    ]).select();

    // 5. Workers as employees
    const workers = [
      { email: "juan.perez@empresa.cl", rut: "12.345.678-9", fn: "Juan", ln: "Pérez", salary: 1200000 },
      { email: "maria.lopez@empresa.cl", rut: "13.456.789-0", fn: "María", ln: "López", salary: 950000 },
      { email: "pedro.sanchez@empresa.cl", rut: "14.567.890-1", fn: "Pedro", ln: "Sánchez", salary: 1500000 },
      { email: "ana.martinez@empresa.cl", rut: "15.678.901-2", fn: "Ana", ln: "Martínez", salary: 850000 },
      { email: "diego.rojas@empresa.cl", rut: "16.789.012-3", fn: "Diego", ln: "Rojas", salary: 1100000 },
    ];

    const empInserts = workers.map((w, i) => ({
      user_id: userIds[w.email] || null,
      company_id: company.id,
      branch_id: branches![i % 2].id,
      department_id: depts![i % 3].id,
      position_id: positions![i % 5].id,
      rut: w.rut, first_name: w.fn, last_name: w.ln, email: w.email,
      hire_date: `2023-0${i + 1}-15`, base_salary: w.salary,
      birth_date: `199${i}-0${i + 1}-10`,
    }));

    const { data: employees, error: empErr } = await supabase.from("employees").insert(empInserts).select();
    if (empErr) return new Response(JSON.stringify({ error: "Employees: " + empErr.message }), { status: 500 });

    // 6. Contracts
    for (const emp of employees!) {
      await supabase.from("contracts").insert({
        employee_id: emp.id, contract_type: "Indefinido",
        start_date: emp.hire_date, status: "active", salary: emp.base_salary,
      });
    }

    // 7. Payrolls (6 months each)
    for (const emp of employees!) {
      for (let m = 7; m <= 12; m++) {
        const gross = emp.base_salary;
        const ded = Math.round(gross * 0.1785);
        const net = gross - ded;
        const { data: payroll } = await supabase.from("payrolls").insert({
          employee_id: emp.id, period_year: 2025, period_month: m,
          gross_salary: gross, total_deductions: ded, net_salary: net,
          status: m <= 11 ? "paid" : "approved",
        }).select().single();

        if (payroll) {
          await supabase.from("payroll_items").insert([
            { payroll_id: payroll.id, concept: "Sueldo Base", type: "earning", amount: gross, sort_order: 1 },
            { payroll_id: payroll.id, concept: "AFP (10.25%)", type: "deduction", amount: Math.round(gross * 0.1025), sort_order: 2 },
            { payroll_id: payroll.id, concept: "Salud (7%)", type: "deduction", amount: Math.round(gross * 0.07), sort_order: 3 },
            { payroll_id: payroll.id, concept: "Seg. Cesantía (0.6%)", type: "deduction", amount: Math.round(gross * 0.006), sort_order: 4 },
          ]);

          if (m <= 11) {
            await supabase.from("payments").insert({
              payroll_id: payroll.id, employee_id: emp.id, amount: net,
              payment_date: `2025-${String(m).padStart(2, "0")}-28`,
              payment_method: "transfer", reference_number: `TRF-2025${m}-${emp.rut.slice(0,4)}`,
              status: "completed",
            });
          }
        }
      }
    }

    // 8. Labor documents
    if (docCats && docCats.length > 0) {
      for (const emp of employees!.slice(0, 3)) {
        await supabase.from("labor_documents").insert([
          { employee_id: emp.id, category_id: docCats[0].id, title: `Certificado Antigüedad - ${emp.first_name} ${emp.last_name}` },
          { employee_id: emp.id, category_id: docCats[1].id, title: `Certificado AFP - ${emp.first_name} ${emp.last_name}` },
        ]);
      }
    }

    return new Response(JSON.stringify({ success: true, users: Object.keys(userIds).length, employees: employees!.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
