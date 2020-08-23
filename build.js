import {rollup} from "rollup";
import vue from "rollup-plugin-vue";
import replace from "@rollup/plugin-replace";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import {minify as terser} from "terser";
import MagicString from "magic-string";
import fs from "fs/promises";

const dist = "./dist/";
const filename = "index";


const inputOptions = {
    input: `${filename}.js`,
    plugins: [
        css({
            // output: `${dist}style.css`
            output: writeVueStyles
        }),
        vue({
            css: false,
        }),
        replace({
            "process.env.NODE_ENV": "\"production\""
        }),
        resolve({
            browser: true
        }),
        appendFinally(sourceMappingURL(filename))
    ],
    external: ["vue"], // In order to use "vue.runtime.min.js", (the app code is NOT compressed and mangled)
};

const outputOptions = {
    format: "iife",
    file: `${dist}${filename}.js`,
    globals: {
        "vue": "Vue"
    },
    sourcemap: true,
};

async function build() {
    const {code, map} = await bundle(inputOptions, outputOptions);
    await write(code, map, filename + ".js", dist);

    const {code: codeMin, map: mapMin} = await minify(code, map, filename);
    await write(codeMin, mapMin, filename + ".min.js", dist);
}

/** @returns {Promise<{code: String, map: import("rollup").SourceMap}>} */
async function bundle(inputOptions, outputOptions) {
    const bundle = await rollup(inputOptions);
    const result = await bundle.generate(outputOptions);
    return {
        code: result.output[0].code,
        map:  result.output[0].map
    };
}

/** @returns {Promise<{code: String, map: import("terser").RawSourceMap}>} */
async function minify(code, map, filename) {
    /** @type {import("terser").MinifyOptions} */
    const options = {
        sourceMap: {
            content: map,
            url: filename + ".min.js.map",
            includeSources: true
        },
        compress: false,
        mangle: false
    };
    /** @type {{code: string, map: string}} */
    const result = await terser(code, options);
    return {
        code: result.code,
        map: JSON.parse(result.map)
    };
}

async function writeVueStyles(styles, styleNodes, meta) {
    const styleBunch = Object.values(styleNodes)
        .filter(text => text.trim())
        .map(text => {
            if (text.includes("sourceMappingURL")) {
                const style = text.match(/[\s\S]+(?=\/\*# sourceMappingURL)/)[0];
                const filename = text.match(/(?<=\/\*# sourceMappingURL=).+(?=\.map \*\/)/)[0];
                return "/* " + filename + " */\n" + style;
            }
            return text;
        })
        .reduce((pre, acc) => pre + acc, "");
    await write(styleBunch, null, `style.css`, dist);
}

const pathsMapping = [
    ["../node_modules/", "node-modules:///"],
    ["../", "source-maps:///"],
];

async function write(code, map, name, dist) {
    await fs.mkdir(dist, {recursive: true});
    await fs.writeFile(`${dist}${name}`, code);
    if (map) {
        let _map = changeSourceMapPaths(map);
        _map = JSON.stringify(_map);
        await fs.writeFile(`${dist}${name}.map`, _map);
    }
}

function changeSourceMapPaths(map) {
    function _beautify(str) {
        return pathsMapping.reduce((pre, [value, replacer]) => {
            return pre.replace(value, replacer)
        }, str);
    }
    for (let i = 0; i < map.sources.length; i++) {
        map.sources[i] = _beautify(map.sources[i]);
    }
    return map;
}


// It's used to append `//# sourceMappingURL=name.js.map`
function appendFinally(text) {
    return {
        name: "append-text-before-end",
        renderChunk(code, chunkInfo, outputOptions) {
            if (!code) {
                return null;
            }

            const magicString = new MagicString(code);
            magicString.append(text);
            code = magicString.toString();
            const map = magicString.generateMap({
                hires: true,
                includeContent: true,
            });
            return {code, map};
        }
    };
}
function sourceMappingURL(name, ext = "js") {
    return `\n//# sourceMappingURL=${name}.${ext}.map`
}

!async function main() {
    console.time("build");
    await build();
    console.timeEnd("build");
}();