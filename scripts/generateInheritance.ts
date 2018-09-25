import { createInterface } from "readline";
import { createReadStream, readFile, writeFile } from "fs-extra";
import { resolve } from "path";

main();

interface ClassDescription {
    name: string;
    childs: ClassDescription[];
}

interface ClassDescriptionsArray {
    [name: string]: ClassDescription;
}

async function main() {
    const classes: ClassDescriptionsArray = {};
    
    const regex = /declare class (\S+) extends (\S+)/;
    
    const lineReader = createInterface({
        input: createReadStream(resolve(__dirname, "../types/sketch.d.ts")),
    });
    
    lineReader.on("line", function(line: string) {
        const match = line.match(regex);
        
        if (!match || !match[1] || !match[2]) {
            return;
        }
        
        const currentName = match[1];
        const current = getClassDescription(currentName, classes);
        
        const parentName = match[2];
        const parent = getClassDescription(parentName, classes);
        
        parent.childs.push(current);
    });
    
    lineReader.on("close", function() {
        generateOutput(classes).catch(err => console.error(err));
    });
}

async function generateOutput(classes: ClassDescriptionsArray) {
    const supers = ["NSResponder", "NSObject"]; // getSuperClasses(classes);
    
    let readme = await readFile(resolve(__dirname, "../readme.md"), "utf8");
    
    for (const s of supers) {
        const current = classes[s];
        const list = generateItem(current) + "\n";
        
        readme = readme.replace(
            new RegExp(`<summary>${s}<\\/summary>\\n\\n\`\`\`([^\`]*)\`\`\``),
            (match) => {
                return `<summary>${s}</summary>\n\n\`\`\`\n${list}\`\`\``;
            });
    }
    
    await writeFile(resolve(__dirname, "../readme.md"), readme);
}

function generateItem({ name, childs }: ClassDescription, level: number = 0): string {
    const output = [];
    const indent = "  ";
    
    if (name[0] !== "_" && level > 0) {
        output.push(indent.repeat(level) + name);
    }
    
    output.push(...childs.map(item => {
        return generateItem(item, level + 1);
    }));
    
    return output.join("\n");
}

function getClassDescription(name: string, classes: ClassDescriptionsArray) {
    if (!(name in classes)) {
        classes[name] = {
            name,
            childs: [],
        };
    }
    return classes[name];
}

function getSuperClasses(classes: ClassDescriptionsArray) {
    const result: string[] = [];
    const keys = Object.keys(classes);
    
    for (const key of keys) {
        let mutableFound = false;

        for (const key2 of keys) {
            const cls = classes[key2];

            if (cls.childs.find(c => c.name === key)) {
                mutableFound = true;
                break;
            }
        }

        !mutableFound && result.push(key);
    }
    return result;
}
