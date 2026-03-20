import { supabase } from '@/integrations/supabase/client';

export async function logAuditAction(params: {
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action: params.action,
    module: params.module,
    entity_type: params.entityType,
    entity_id: params.entityId,
    details: params.details as any,
  });
}
