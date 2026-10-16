# Photo handoff: Kurama and Classic Kunai originals

A temporary transfer branch from QA to the storefront builder. It holds only the two owner-approved
originals that the builder's Drive connector could not carry at full size. Import them with
`scripts/prepare-images.py` on `codex/storefront-mvp`, check the hashes first, and then this branch
can be deleted.

| File | Product | Drive file (owner's HoneyComb folder copy) | Bytes | SHA-256 |
|---|---|---|---|---|
| `kurama-1.png` | Kurama Figure (HC-KURAMA) | `1wkBiKm7ZUMRYRpHJojCI9YPhv3ePKIXn` "1.png" | 2,348,045 | `d33853df877263dab5a27300b0f92bd545a12b2111f9828bb411e7d3e9f5a494` |
| `classic-kunai-RAV_4322.jpg` | Classic Kunai (HC-KUNAI) | `1PaOuVcZ82ij2vV2hq08fiFC42_w9iKua` "Copy of RAV_4322.jpg" | 4,887,510 | `f41368debf7c8dad784374727a8c374e64bd33fc89461a0d907f16d5ce3c8722` |

- **Source:** QA downloaded both files from the owner's Drive on 2026-10-13. Their SHA-256 hashes
  equal the originals the owner approved on 2026-10-11 (`docs/ASSET-AUDIT.md` and
  `qa/asset-recommendations.json` on `claude/recovery-qa`).
- **Checks:** neither file has an AI-generation marker. Kurama is a Canva export on a white
  background; Classic Kunai is a camera photo.
- **Optional crops** (from `qa/asset-recommendations.json`):
  - Kurama: [487, 1228, 2937, 3876] on 3415×5120.
  - Classic Kunai: 3:4 crop [627, 1370, 4205, 6142] on 4912×7360.
