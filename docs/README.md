# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## 3D → Sprite Quick Start

1. Render frames from Blender to `renders/marine/` named like `idle_e_01.png`, `walk_ne_05.png`.
2. Install packer dep: `pip install pillow`.
3. Pack into atlas:
   - `python scripts/packer.py --src renders/marine --out public/assets --cols 12 --tile 256 --downscale 2`
4. Run the game and you should see animated marine sprites:
   - `npm run dev` (project root)
   - Title → New/Continue → Main scene shows idle/walk animation switching.

See `docs/src/routes/pipeline/+page.svelte` for full details.
