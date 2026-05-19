-- Plausible Analytics pro Tenant aktivieren/deaktivieren.
-- NULL oder false bedeutet: Tracking-Script wird nicht gerendert.
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS plausible_enabled boolean DEFAULT false;
