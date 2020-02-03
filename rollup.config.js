import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import importer from 'node-sass-alias-importer';
import { terser } from 'rollup-plugin-terser';
import { scss } from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

function globalSassFile(filepath) {
  return {
    style({ content, attributes }) {
      const { lang } = attributes;

      if (lang === 'scss') return { code: `@import '${filepath}';\n${content}` };
      return null;
    },
  };
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      preprocess: [
        globalSassFile('./src/styles/variables.scss'),
        scss({
          importer: [
            importer({
              '@': './src/styles/',
            }),
          ],
        }),
      ],

      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: (css) => {
        css.write('public/build/bundle.css');
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        });
      }
    },
  };
}
