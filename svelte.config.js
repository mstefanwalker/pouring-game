import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter({
			// build into a sibling project so that this repo can remain clean for git commits
			// the sibling project may be committed seperately for GitHub Pages
			pages: '../pouring-game-build/docs',
			assets: '../pouring-game-build/docs',
			fallback: null,
		}),
		prerender: {
			default: true
		},
	},
};

export default config;
