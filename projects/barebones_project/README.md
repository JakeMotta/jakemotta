# Jake Motta

# Required Files

- .env.dev
- .env.prod

# Getting Started

1. Make sure to get the `git-crypt-xxx-web-key`, and place this in the project root
2. Run `bash scripts/decrypt-envs.sh`
3. Run `yarn`
4. Run `yarn start`

## Themeing

Theming's setup is a bit complicated, but the good news is that updating it isn't. To update / modify the themes, simply follow these steps:

1. Open the `.scss` theme file you want to modify (ex: `/src/assets/themes/dark-theme/index.scss`)
2. Modify the theme variables between the `START OF CUSTOM THEME` and `END OF CUSTOM THEME` comment lines.

- You can add/remove variables here, but if you do, be sure to also include those in `/scripts/theme_parser.js` in the `colorIncludeList` variable.

3. Run `yarn:lint`. This will handle all the underlying work.

You're done! Wow! Now, your modified theme should be available via VsCode's intellisense, css variables, and the exported `/utils/theme.ts` function.

### Visual UI Method:

[Prime React Visual Designer](https://designer.primereact.org/#/) to build a theme. Once done, export the file and overrite `public/themes/<theme.css>`

## Running

### To run locally (and have hot-reloading)

`yarn start`

### To test dockerizing the app

`yarn docker`

## Deploying

`yarn docker:upload`
