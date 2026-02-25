# Contributing to Act-Vite

Act-Vite is built by developers who wanted this tool to exist. If you've ever thought *"I wish this did X"* while using it — that's your cue. We'd genuinely love your help.

All contributions are welcome, no matter how small. A typo fix is explicitly just as valuable as a new feature.

## Development Setup

Getting the monorepo running locally takes less than a minute.

1. **Fork and clone** the repository:

```bash
git clone https://github.com/YOUR_USERNAME/actvite.git
cd actvite
```

2. **Install dependencies** (requires `pnpm` 8+):

```bash
pnpm install
```

3. **Build all packages**:

```bash
pnpm build
```

4. **Verify it works**:

```bash
pnpm test
```

## Project Structure

The monorepo is managed with pnpm workspaces. It's shockingly simple:

- `packages/actvite/` — The core runtime and framework bindings.
- `packages/actvite-server/` — The Node.js token exchange adapters.
- `packages/actvite-multiplayer/` — The WebSocket shared state layer.
- `packages/create-actvite/` — The CLI tool that scaffolds projects.
- `docs/` — The VitePress documentation site.
- `examples/` — Working example activities.

## Making Changes

1. **Create a branch** from `main` (e.g., `feat/add-magic`, `fix/broken-thing`, `docs/typo-fix`).
2. **Make your changes**. Keep commits focused and logically grouped.
3. If you add a new feature, add a quick test pattern for it.
4. Run `pnpm format` and `pnpm lint` to keep the code consistent.
5. Run `pnpm build` to ensure TypeScript compilation doesn't fail.

## Submitting a PR

When you open a Pull Request:
- Keep the description clear. What does it do? Why is it needed?
- If it changes the public API, please update `docs/api/reference.md`.
- We use [Changesets](https://github.com/changesets/changesets) for versioning. If your PR affects published packages, run `pnpm changeset`, follow the prompts, and commit the generated file.

## Bugs & Ideas

- Found a bug? 🐛 Please [open an issue](https://github.com/actvite/actvite/issues).
- Have a wild idea? 💡 Start a [discussion](https://github.com/actvite/actvite/discussions).

## A Small Request

And if you can't contribute code right now, a ⭐ on the repo is genuinely appreciated. It helps other developers find Act-Vite, which keeps the project alive. We mean that sincerely.

Thanks for helping build Act-Vite! 💜
