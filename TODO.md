# TODO

## CI / delivery

- Current policy: GitHub Actions are intentionally disabled in this repo.
- Reason: avoid paying for GitHub Actions at the current project stage.
- Current workflow: validate locally with `npm run test`, `npm run lint`, `npm run build`, optional `npm run test:unit`, then deploy with `npm run deploy`.

## Future options to revisit

- Add a lightweight pre-push or release script that runs the full local validation bundle automatically.
- Use a self-hosted runner only if maintenance cost stays lower than GitHub Actions billing.
- Move CI to another platform if a free tier is enough and setup stays simple.
- Add deploy-only automation from Cloudflare or another external system instead of full GitHub-hosted CI.
- Re-enable GitHub Actions later only if the repo needs enforced remote checks badly enough to justify the cost.
