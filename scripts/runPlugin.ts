import {exec, ExecOptions} from "child_process";
import {join} from "path";

main().catch(err => console.error(err));

async function main() {
    const sketchApp = await execProm(`mdfind kMDItemCFBundleIdentifier == 'com.bohemiancoding.sketch3${process.argv.includes("--beta") ? ".beta" : ""}' | head -n 1`);
    const tool = join(sketchApp.trim().replace(" ", "\\ "), "/Contents/Resources/sketchtool/bin/sketchtool");
    await execProm(`${tool} --without-activating run ${join(process.cwd(), "Generate\\ Sketch.d.ts.sketchplugin")} ""`);
}

function execProm(command:string, options?:ExecOptions):Promise<string> {
    return new Promise((resolve, reject) => {
        options = options || {};
        options.cwd = process.cwd();
        exec(command, options, (err, stdout, stderr) => {
            if (err) {
                return reject(stderr || stdout);
            }
            resolve(stdout as string);
        });
    });
}