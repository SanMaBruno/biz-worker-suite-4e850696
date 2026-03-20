
-- Fix overly permissive INSERT policies

-- Profiles: only allow inserting own profile
DROP POLICY "System inserts profiles" ON public.profiles;
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Audit logs: restrict to authenticated users inserting their own logs
DROP POLICY "System inserts audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated insert own audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
