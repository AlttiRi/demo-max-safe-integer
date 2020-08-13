import {rollup} from "rollup";
import vue from "rollup-plugin-vue";
import replace from "@rollup/plugin-replace";
import css from "rollup-plugin-css-only";
import resolve from "@rollup/plugin-node-resolve";
import {minify} from "terser";
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
    const {code, map} = await bundle();

    const {code: codeMin, map: mapMin} = await _minify(code, map);
    await write(codeMin, mapMin, filename + ".min.js");
}

/** @returns {Promise<{code: String, map: import("rollup").SourceMap}>} */
export async function bundle() {
    const bundle = await rollup(inputOptions);
    const result = await bundle.generate(outputOptions);
    await bundle.write(outputOptions);

    return {
        code: result.output[0].code,
        map:  result.output[0].map
    };
}

async function _minify(code, map) {
    /** @type {import("terser").MinifyOptions} */
    const options = {
        sourceMap: {
            content: map,
            url: filename + ".js.map",
            includeSources: true
        },
        compress: false,
        mangle: false
    };

    const result = await minify(code, options);
    return {
        code: result.code,
        map: result.map
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
    await write(styleBunch, null, `style.css`);
}

export async function write(code, map, name) {
    await fs.mkdir(dist, {recursive: true});
    await fs.writeFile(`${dist}${name}`, code);
    if (map) {
        await fs.writeFile(`${dist}${name}.map`, map);
    }
}

!async function main() {
    console.time("build");
    await build();
    console.timeEnd("build");
}();