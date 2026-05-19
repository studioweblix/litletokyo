import { unstable_noStore as noStore } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type {
  Category,
  Page,
  Product,
  ProductImage,
  Reservation,
  StoreSettings,
  Tenant,
  Testimonial,
} from "@/types";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? null;

function getTenantId(): string | null {
  return TENANT_ID;
}

export function normalizeDomain(value: string | null | undefined): string | null {
  if (!value) return null;

  const firstValue = value.split(",")[0]?.trim().toLowerCase();
  if (!firstValue) return null;

  const withoutProtocol = firstValue.replace(/^https?:\/\//, "");
  const host = withoutProtocol.split("/")[0]?.split(":")[0];

  return host || null;
}

function getDomainCandidates(domain: string): string[] {
  const normalized = normalizeDomain(domain);
  if (!normalized) return [];

  const withoutWww = normalized.startsWith("www.")
    ? normalized.slice(4)
    : normalized;

  return Array.from(new Set([normalized, withoutWww, `www.${withoutWww}`]));
}

async function getRequestDomain(): Promise<string | null> {
  const headersList = await headers();

  return normalizeDomain(
    headersList.get("x-forwarded-host") ?? headersList.get("host")
  );
}

function mapProduct(row: {
  product_images?: { id: string; url: string; alt_text: string | null; sort_order: number }[];
  [key: string]: unknown;
}): Product {
  const images: ProductImage[] = (row.product_images ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const rest = { ...row };
  delete rest.product_images;
  return { ...rest, images } as Product;
}

export async function getProducts(): Promise<Product[]> {
  noStore();
  const tenantId = getTenantId();
  if (!tenantId) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (id, url, alt_text, sort_order)
    `
    )
    .eq("tenant_id", tenantId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const tenantId = getTenantId();
  if (!tenantId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (id, url, alt_text, sort_order)
    `
    )
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data ? mapProduct(data) : null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const tenantId = getTenantId();
  if (!tenantId) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (id, url, alt_text, sort_order)
    `
    )
    .eq("tenant_id", tenantId)
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function getCategories(): Promise<Category[]> {
  noStore();
  const tenantId = getTenantId();
  if (!tenantId) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const tenantId = getTenantId();
  if (!tenantId) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_images (id, url, alt_text, sort_order)
    `
    )
    .eq("tenant_id", tenantId)
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function getPageContent(slug: string): Promise<Page | null> {
  const tenantId = getTenantId();
  if (!tenantId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Page | null;
}

export async function getSettings(): Promise<StoreSettings | null> {
  const tenantId = getTenantId();
  if (!tenantId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("tenant_id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as StoreSettings | null;
}

export async function getTenant(): Promise<Tenant | null> {
  const tenantId = getTenantId();
  if (!tenantId) return null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Tenant | null;
}

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  noStore();
  const candidates = getDomainCandidates(domain);
  if (candidates.length === 0) return null;

  const supabase = await createClient();

  for (const candidate of candidates) {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("domain", candidate)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as Tenant;
  }

  return null;
}

export async function getCurrentTenant(): Promise<Tenant | null> {
  const requestDomain = await getRequestDomain();

  if (requestDomain) {
    const tenant = await getTenantByDomain(requestDomain);
    if (tenant) return tenant;
  }

  return getTenant();
}

export async function createReservation(data: {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  table_size?: number;
  source?: string;
}): Promise<Reservation> {
  const tenantId = getTenantId();
  if (!tenantId) throw new Error("NEXT_PUBLIC_TENANT_ID is not set");
  const supabase = await createClient();

  const rowInsert: Record<string, unknown> = {
    tenant_id: tenantId,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    date: data.date,
    time: data.time,
    guests: data.guests,
    message: data.message || null,
    status: "pending",
  };
  if (data.table_size !== undefined) rowInsert.table_size = data.table_size;
  if (data.source !== undefined) rowInsert.source = data.source;

  const { data: row, error } = await supabase
    .from("reservations")
    .insert(rowInsert)
    .select()
    .single();

  if (error) throw error;
  return row as Reservation;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const tenantId = getTenantId();
  if (!tenantId) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Testimonial[];
}
