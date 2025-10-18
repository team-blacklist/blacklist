// src/schemas/checkStorageSchemas.ts

export interface CheckStorageReq {
  supabase_url: string
  anon_key: string
  bucket: string
}

export interface CheckStorageResp {
  bucket: string
  is_public_toggle: boolean
  policies: any[] // array of policy info (if retrievable)
  can_list_anon: boolean
  can_upload_anon: boolean
  notes: string
}

/**
 * JSON schema used by Fastify for validation.
 * These are pure JSON Schema objects, not TypeScript types.
 */
export const checkStorageSchema = {
  body: {
    type: "object",
    required: ["supabase_url", "anon_key", "bucket"],
    properties: {
      supabase_url: { type: "string" },
      anon_key: { type: "string" },
      bucket: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        bucket: { type: "string" },
        is_public_toggle: { type: "boolean" },
        policies: { type: "array" },
        can_list_anon: { type: "boolean" },
        can_upload_anon: { type: "boolean" },
        notes: { type: "string" },
      },
    },
  },
}
