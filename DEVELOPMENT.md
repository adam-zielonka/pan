# Development

Use Node.js 24.22+ (24–26) and pnpm 12. The repository pins the verified package manager and runtime.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
pnpm audit --audit-level=high
pnpm test
pnpm check
```

Pull requests run validation without deploying. Pages deployment is restricted to
the default branch. Dependabot checks compatible updates weekly; major updates
are reviewed separately.

Components use Svelte 5 in legacy syntax mode, with the `mount` API at startup.
