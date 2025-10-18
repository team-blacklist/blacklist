import type { FastifyInstance } from "fastify"
import type {
  CheckStorageReq,
  CheckStorageResp,
} from "../schemas/checkStorageSchemas"
import { checkStorageSchema } from "../schemas/checkStorageSchemas"

export default async function checkStorageRoute(fastify: FastifyInstance) {
  fastify.post<{ Body: CheckStorageReq; Reply: CheckStorageResp }>(
    "/check_storage_public",
    { schema: checkStorageSchema },
    async (request, reply) => {
      const { supabase_url, anon_key, bucket } = request.body

      const base = supabase_url.replace(/\/+$/, "")
      const headers = {
        apikey: anon_key,
        Authorization: `Bearer ${anon_key}`,
      }

      // --- 1) check bucket metadata ---
      let is_public = false
      try {
        const url = `${base}/rest/v1/storage.buckets?select=*&name=eq.${encodeURIComponent(
          bucket
        )}`
        const res = await fetch(url, { headers })
        if (res.ok) {
          const json = await res.json()
          if (Array.isArray(json) && json.length > 0) {
            is_public = Boolean(json[0]?.public)
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        fastify.log.debug({ err: msg }, "Error fetching bucket metadata")
      }

      // --- 2) check anon listing access ---
      let list_ok = false
      try {
        const listUrl = `${base}/storage/v1/object/list/${encodeURIComponent(bucket)}`
        const lr = await fetch(listUrl, { headers })
        if (lr.ok) {
          const data = await lr.json()
          if (Array.isArray(data)) list_ok = true
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        fastify.log.debug({ err: msg }, "Error fetching bucket metadata")
      }

      // --- 3) attempt to read policies (optional best-effort) ---
      let policies: any[] = []
      try {
        const polUrl = `${base}/rest/v1/rpc/get_policies?schema=eq.storage&table=eq.objects`
        const polRes = await fetch(polUrl, { headers })
        if (polRes.ok) {
          const polJson = await polRes.json()
          if (Array.isArray(polJson)) policies = polJson
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        fastify.log.debug({ err: msg }, "Error fetching bucket metadata")
      }

      // --- 4) compose response ---
      const notes: string[] = []
      if (is_public)
        notes.push("Bucket public toggle is ON (objects are public).")
      if (list_ok)
        notes.push(
          "Anon/list via storage REST endpoint succeeded — public listing allowed."
        )
      if (!is_public && !list_ok)
        notes.push(
          "No public toggle found and anon list did not succeed (likely private)."
        )

      // detect anon upload if any matching policy found
      let can_upload_anon = false
      try {
        if (policies?.length) {
          can_upload_anon = policies.some((p: any) => {
            const roles = String(p.roles || "").toLowerCase()
            const cmd = String(p.cmd || "").toLowerCase()
            return roles.includes("anon") && cmd.includes("insert")
          })
          if (can_upload_anon)
            notes.push("Found policy granting INSERT to anon/authenticated.")
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        fastify.log.debug({ err: msg }, "Error fetching bucket metadata")
      }

      const resp: CheckStorageResp = {
        bucket,
        is_public_toggle: is_public,
        policies,
        can_list_anon: list_ok,
        can_upload_anon,
        notes: notes.join(" ; "),
      }

      return reply.code(200).send(resp)
    }
  )
}
