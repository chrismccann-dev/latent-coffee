import { SspShead } from '@/components/Ssp'

// Authored "what this process is" prose card for the /processes variant pages
// (priority-stack recount Tweak 6, 2026-06-03). Shared by the Honey subprocess
// sub-page + the per-base modifier-combo mini-page — both render an identical
// card. The base hub uses its own "Process Summary" heading and the signature
// page splits paragraphs, so those keep their bespoke blocks. Falls back to a
// pending state when no description is authored yet.
export function ProcessDescriptionCard({ overview }: { overview: string | null }) {
  return (
    <div className="ssp-card">
      <SspShead>Process Description</SspShead>
      {overview ? (
        <div className="ssp-prose">{overview}</div>
      ) : (
        <p className="font-mono text-xs text-latent-mid italic">
          Process description pending authoring.
        </p>
      )}
    </div>
  )
}
