import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  // 1. Create test users
  const users = [
    { email: "admin@empresa.cl", password: "admin123", first_name: "Carlos", last_name: "Mendoza", role: "superadmin" },
    { email: "rrhh@empresa.cl", password: "rrhh123", first_name: "María", last_name: "González", role: "rrhh" },
    { email: "rrhh2@empresa.cl", password: "rrhh123", first_name: "Andrea", last_name: "Silva", role: "rrhh" },
    { email: "finanzas@empresa.cl", password: "finanzas123", first_name: "Roberto", last_name: "Fuentes", role: "finanzas" },
    { email: "finanzas2@empresa.cl", password: "finanzas123", first_name: "Patricia", last_name: "Vargas", role: "finanzas" },
  ];

  const workerData = [
    { email: "juan.perez@empresa.cl", first_name: "Juan", last_name: "Pérez", rut: "12.345.678-9" },
    { email: "maria.lopez@empresa.cl", first_name: "María", last_name: "López", rut: "13.456.789-0" },
    { email: "pedro.sanchez@empresa.cl", first_name: "Pedro", last_name: "Sánchez", rut: "14.567.890-1" },
    { email: "ana.martinez@empresa.cl", first_name: "Ana", last_name: "Martínez", rut: "15.678.901-2" },
    { email: "diego.rojas@empresa.cl", first_name: "Diego", last_name: "Rojas", rut: "16.789.012-3" },
    { email: "camila.torres@empresa.cl", first_name: "Camila", last_name: "Torres", rut: "17.890.123-4" },
    { email: "felipe.castro@empresa.cl", first_name: "Felipe", last_name: "Castro", rut: "18.901.234-5" },
    { email: "valentina.diaz@empresa.cl", first_name: "Valentina", last_name: "Díaz", rut: "19.012.345-6" },
    { email: "matias.hernandez@empresa.cl", first_name: "Matías", last_name: "Hernández", rut: "20.123.456-7" },
    { email: "sofia.morales@empresa.cl", first_name: "Sofía", last_name: "Morales", rut: "21.234.567-8" },
    { email: "nicolas.reyes@empresa.cl", first_name: "Nicolás", last_name: "Reyes", rut: "11.345.678-9" },
    { email: "javiera.munoz@empresa.cl", first_name: "Javiera", last_name: "Muñoz", rut: "10.456.789-0" },
    { email: "tomas.espinoza@empresa.cl", first_name: "Tomás", last_name: "Espinoza", rut: "9.567.890-1" },
    { email: "isidora.bravo@empresa.cl", first_name: "Isidora", last_name: "Bravo", rut: "22.678.901-2" },
    { email: "benjamin.soto@empresa.cl", first_name: "Benjamín", last_name: "Soto", rut: "23.789.012-3" },
  ];

  const createdUserIds: Record<string, string> = {};

  // Create admin/staff users
  for (const u of users) {
    const { data } = await supabase.auth.admin.createUser({
      email: u.email, password: u.password, email_confirm: true,
      user_metadata: { first_name: u.first_name, last_name: u.last_name }
    });
    if (data.user) {
      createdUserIds[u.email] = data.user.id;
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: u.role });
    }
  }

  // Create worker users
  for (const w of workerData) {
    const { data } = await supabase.auth.admin.createUser({
      email: w.email, password: "trabajador123", email_confirm: true,
      user_metadata: { first_name: w.first_name, last_name: w.last_name }
    });
    if (data.user) {
      createdUserIds[w.email] = data.user.id;
      await supabase.from("user_roles").insert({ user_id: data.user.id, role: "trabajador" });
    }
  }

  // 2. Company
  const { data: company } = await supabase.from("companies").insert({
    name: "Constructora Pacífico SpA", rut: "76.123.456-7",
    address: "Av. Providencia 1234, Santiago", phone: "+56 2 2345 6789", email: "contacto@pacifico.cl"
  }).select().single();

  // 3. Branches
  const { data: branches } = await supabase.from("branches").insert([
    { company_id: company!.id, name: "Casa Matriz Santiago", address: "Av. Providencia 1234" },
    { company_id: company!.id, name: "Sucursal Valparaíso", address: "Calle Blanco 567" },
  ]).select();

  // 4. Departments
  const { data: departments } = await supabase.from("departments").insert([
    { company_id: company!.id, name: "Operaciones", description: "Gestión de obras" },
    { company_id: company!.id, name: "Administración", description: "Gestión administrativa" },
    { company_id: company!.id, name: "Ingeniería", description: "Diseño y cálculo" },
    { company_id: company!.id, name: "Comercial", description: "Ventas y licitaciones" },
  ]).select();

  // 5. Positions
  const { data: positions } = await supabase.from("positions").insert([
    { company_id: company!.id, name: "Ingeniero Civil" },
    { company_id: company!.id, name: "Jefe de Obra" },
    { company_id: company!.id, name: "Analista Contable" },
    { company_id: company!.id, name: "Asistente Administrativo" },
    { company_id: company!.id, name: "Dibujante Técnico" },
    { company_id: company!.id, name: "Supervisor de Terreno" },
    { company_id: company!.id, name: "Ejecutivo Comercial" },
  ]).select();

  // 6. Document categories
  const { data: docCats } = await supabase.from("document_categories").insert([
    { name: "Certificado Antigüedad", type: "labor" },
    { name: "Carta de Recomendación", type: "labor" },
    { name: "Certificado AFP", type: "labor" },
    { name: "Contrato de Trabajo", type: "contract" },
    { name: "Liquidación de Sueldo", type: "payroll" },
    { name: "Factura", type: "financial" },
    { name: "Boleta", type: "financial" },
  ]).select();

  // 7. Employees
  const salaries = [1200000, 950000, 1500000, 850000, 1100000, 780000, 1350000, 920000, 1050000, 870000, 1400000, 800000, 1250000, 980000, 1150000];
  const employeeInserts = workerData.map((w, i) => ({
    user_id: createdUserIds[w.email],
    company_id: company!.id,
    branch_id: branches![i % 2].id,
    department_id: departments![i % 4].id,
    position_id: positions![i % 7].id,
    rut: w.rut,
    first_name: w.first_name,
    last_name: w.last_name,
    email: w.email,
    phone: `+56 9 ${(1000 + i * 111).toString().padStart(4, "0")} ${(5000 + i * 222).toString().padStart(4, "0")}`,
    hire_date: `202${Math.floor(i / 5)}-0${(i % 9) + 1}-15`,
    base_salary: salaries[i],
    birth_date: `19${85 + (i % 10)}-0${(i % 9) + 1}-${10 + (i % 18)}`,
  }));

  const { data: employees } = await supabase.from("employees").insert(employeeInserts).select();

  // 8. Contracts
  const contractInserts = employees!.map((emp, i) => ({
    employee_id: emp.id,
    contract_type: i % 3 === 0 ? "Indefinido" : i % 3 === 1 ? "Plazo Fijo" : "Por Obra",
    start_date: emp.hire_date,
    end_date: i % 3 === 1 ? "2026-12-31" : null,
    status: "active" as const,
    salary: emp.base_salary,
    description: `Contrato de trabajo ${i % 3 === 0 ? "indefinido" : "a plazo"}`,
  }));
  const { data: contracts } = await supabase.from("contracts").insert(contractInserts).select();

  // 9. Payrolls (6 months for each employee)
  const months = [
    { year: 2025, month: 7 }, { year: 2025, month: 8 }, { year: 2025, month: 9 },
    { year: 2025, month: 10 }, { year: 2025, month: 11 }, { year: 2025, month: 12 },
  ];

  for (const emp of employees!) {
    for (const m of months) {
      const gross = emp.base_salary;
      const afp = Math.round(gross * 0.1025);
      const salud = Math.round(gross * 0.07);
      const cesantia = Math.round(gross * 0.006);
      const totalDed = afp + salud + cesantia;
      const net = gross - totalDed;

      const { data: payroll } = await supabase.from("payrolls").insert({
        employee_id: emp.id,
        period_year: m.year,
        period_month: m.month,
        gross_salary: gross,
        total_deductions: totalDed,
        net_salary: net,
        status: m.month <= 11 ? "paid" : "approved",
      }).select().single();

      if (payroll) {
        await supabase.from("payroll_items").insert([
          { payroll_id: payroll.id, concept: "Sueldo Base", type: "earning", amount: gross, sort_order: 1 },
          { payroll_id: payroll.id, concept: "AFP (10.25%)", type: "deduction", amount: afp, sort_order: 2 },
          { payroll_id: payroll.id, concept: "Salud (7%)", type: "deduction", amount: salud, sort_order: 3 },
          { payroll_id: payroll.id, concept: "Seguro Cesantía (0.6%)", type: "deduction", amount: cesantia, sort_order: 4 },
        ]);

        // Payment for paid payrolls
        if (m.month <= 11) {
          await supabase.from("payments").insert({
            payroll_id: payroll.id, employee_id: emp.id, amount: net,
            payment_date: `${m.year}-${String(m.month).padStart(2, "0")}-28`,
            payment_method: "transfer",
            reference_number: `TRF-${m.year}${String(m.month).padStart(2, "0")}-${emp.rut.slice(0, 4)}`,
            status: "completed",
          });
        }
      }
    }
  }

  // 10. Labor documents
  for (const emp of employees!.slice(0, 10)) {
    await supabase.from("labor_documents").insert([
      { employee_id: emp.id, category_id: docCats![0].id, title: `Certificado Antigüedad - ${emp.first_name} ${emp.last_name}`, description: "Certificado emitido automáticamente" },
      { employee_id: emp.id, category_id: docCats![2].id, title: `Certificado AFP - ${emp.first_name} ${emp.last_name}`, description: "Certificado de cotizaciones previsionales" },
    ]);
  }

  // 11. Financial documents
  await supabase.from("financial_documents").insert([
    { company_id: company!.id, category_id: docCats![5].id, title: "Factura Proveedores Materiales", amount: 15000000, document_date: "2025-10-15" },
    { company_id: company!.id, category_id: docCats![5].id, title: "Factura Arriendo Maquinaria", amount: 8500000, document_date: "2025-11-01" },
    { company_id: company!.id, category_id: docCats![6].id, title: "Boleta Servicio Consultoría", amount: 3200000, document_date: "2025-11-20" },
  ]);

  return new Response(JSON.stringify({ success: true, message: "Seed completado exitosamente" }), {
    headers: { "Content-Type": "application/json" },
  });
});
