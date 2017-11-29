"use strict";
const propertyGetters = true;
const extraSymbols = ["_MSArtboardGroup", "_MSAssetCollection", "_MSBaseGrid", "_MSBitmapLayer", "_MSColor", "_MSCurvePoint", "_MSDocumentData", "_MSExportFormat", "_MSExportOptions", "_MSExportPreset", "_MSForeignSymbol", "_MSGradient", "_MSGradientStop", "_MSGraphicsContextSettings", "_MSImageCollection", "_MSImmutableArtboardGroup", "_MSImmutableAssetCollection", "_MSImmutableBaseGrid", "_MSImmutableBitmapLayer", "_MSImmutableColor", "_MSImmutableCurvePoint", "_MSImmutableDocumentData", "_MSImmutableExportFormat", "_MSImmutableExportOptions", "_MSImmutableExportPreset", "_MSImmutableForeignSymbol", "_MSImmutableGradient", "_MSImmutableGradientStop", "_MSImmutableGraphicsContextSettings", "_MSImmutableImageCollection", "_MSImmutableLayer", "_MSImmutableLayerGroup", "_MSImmutableLayoutGrid", "_MSImmutableOvalShape", "_MSImmutablePage", "_MSImmutablePolygonShape", "_MSImmutableRect", "_MSImmutableRectangleShape", "_MSImmutableRulerData", "_MSImmutableShapeGroup", "_MSImmutableShapePath", "_MSImmutableShapePathLayer", "_MSImmutableSharedObject", "_MSImmutableSharedObjectContainer", "_MSImmutableSharedStyle", "_MSImmutableSharedStyleContainer", "_MSImmutableSharedTextStyleContainer", "_MSImmutableSimpleGrid", "_MSImmutableSliceLayer", "_MSImmutableStarShape", "_MSImmutableStyle", "_MSImmutableStyleBasicFill", "_MSImmutableStyleBlur", "_MSImmutableStyleBorder", "_MSImmutableStyleBorderOptions", "_MSImmutableStyleColorControls", "_MSImmutableStyledLayer", "_MSImmutableStyleFill", "_MSImmutableStyleInnerShadow", "_MSImmutableStylePart", "_MSImmutableStyleReflection", "_MSImmutableStyleShadow", "_MSImmutableSymbol", "_MSImmutableSymbolContainer", "_MSImmutableSymbolInstance", "_MSImmutableSymbolMaster", "_MSImmutableTextLayer", "_MSImmutableTextStyle", "_MSImmutableTriangleShape", "_MSLayer", "_MSLayerGroup", "_MSLayoutGrid", "_MSOvalShape", "_MSPage", "_MSPolygonShape", "_MSRect", "_MSRectangleShape", "_MSRulerData", "_MSShapeGroup", "_MSShapePath", "_MSShapePathLayer", "_MSSharedObject", "_MSSharedObjectContainer", "_MSSharedStyle", "_MSSharedStyleContainer", "_MSSharedTextStyleContainer", "_MSSimpleGrid", "_MSSliceLayer", "_MSStarShape", "_MSStyle", "_MSStyleBasicFill", "_MSStyleBlur", "_MSStyleBorder", "_MSStyleBorderOptions", "_MSStyleColorControls", "_MSStyledLayer", "_MSStyleFill", "_MSStyleInnerShadow", "_MSStylePart", "_MSStyleReflection", "_MSStyleShadow", "_MSSymbol", "_MSSymbolContainer", "_MSSymbolInstance", "_MSSymbolMaster", "_MSTextLayer", "_MSTextStyle", "_MSTriangleShape"];
function generate(context) {
    try {
        const output = String(context.scriptPath).replace(/\/[^\/]*\/[^\/]*\/[^\/]*\/[^\/]*\/[^\/]*$/, "/types/sketch.d.ts");
        generateDo(context, /^MS/, output);
    }
    catch (e) {
        context.document.showMessage(e.message || String(e));
        throw e;
    }
}
function generateDo(context, symbolMatch, outputFile) {
    const info = context.document.showMessage;
    let mutableNotFoundSymbolsCount = 0;
    let mutableOutput = "// Generated with Sketch " + MSApplicationMetadata.metadata().appVersion + "\n\n";
    const symbolNames = uniqueArray(array(Mocha.sharedRuntime().globalSymbolNames())
        .map(s => String(s))
        .filter(s => s.match(symbolMatch))
        .concat(extraSymbols)
        .sort());
    for (const symbolName of symbolNames) {
        if (symbolName === "JSExport") {
            mutableNotFoundSymbolsCount++;
            continue;
        }
        const symbol = check(symbolName);
        if (symbol === false) {
            mutableNotFoundSymbolsCount++;
            continue;
        }
        const output = symbol.class ? genClass(symbol, symbolName) : genFunction(symbol, symbolName);
        if (!output) {
            mutableNotFoundSymbolsCount++;
            continue;
        }
        mutableOutput += output;
    }
    const ok = writeFile(outputFile, mutableOutput);
    info(ok ? "Generation successful, " + mutableNotFoundSymbolsCount + " symbols skipped." : "Generation failed");
}
// noinspection JSUnusedLocalSymbols
function genFunction(symbol, symbolName) {
    return "declare function " + symbolName + "(...args: any[]): any\n\n";
}
function genClass(symbol, symbolName) {
    const classObject = symbol.class();
    if (!classObject.mocha) {
        return;
    }
    const desc = classObject.mocha();
    const declare = "declare class ";
    const ancestors = desc.ancestors();
    const extend = ancestors.count() ? " extends " + ancestors[0].name() : "";
    const protocols = desc.protocols();
    const implement = protocols.count() ? " /* implements " + array(protocols).map(p => p.name()).join(", ") + " */" : "";
    const properties = array(desc.properties()).sort(sortProperty).map(p => "\t" + genProperty(p) + "\n").join("");
    const classMethods = array(desc.classMethods()).sort(sortMethod).map(m => "\t" + genMethod(m, true) + "\n").join("");
    const instanceMethods = array(desc.instanceMethods()).sort(sortMethod).map(m => "\t" + genMethod(m) + "\n").join("");
    return declare + symbolName + extend + implement + " {\n" +
        [properties, classMethods, instanceMethods].filter(a => a).join("\n") +
        "}\n\n";
}
function genProperty(prop) {
    const p = String(prop).replace(/^.*(typeEncoding=.*)>$/, "$1");
    const name = conformName(String(prop.name()));
    const getter = propertyGetters ? "()" : "";
    const type = genType(String(prop.typeEncoding()));
    return "/* " + p + " */\n\t" + name + getter + ": " + type + ";";
}
function sortProperty(a, b) {
    const aName = String(a.name());
    const bName = String(b.name());
    if (aName < bName) {
        return -1;
    }
    if (aName > bName) {
        return 1;
    }
    return 0;
}
function genMethod(method, isStatic = false) {
    const p = String(method).replace(/^.*(typeEncoding=.*)>$/, "$1");
    const name = conformName(String(method.selector()));
    const staticName = isStatic ? "static " : "";
    const type = String(method.typeEncoding()) === "v16@0:8" ? "(): void" : "(...args: any[]): any";
    return "/* " + p + " */\n\t" + staticName + name + type + ";";
}
function sortMethod(a, b) {
    const aName = String(a.selector());
    const bName = String(b.selector());
    if (aName < bName) {
        return -1;
    }
    if (aName > bName) {
        return 1;
    }
    return 0;
}
function genType(type) {
    switch (type[0]) {
        case "B":
        case "c": return "boolean";
        case "i":
        case "s":
        case "l":
        case "q":
        case "C":
        case "I":
        case "S":
        case "L":
        case "Q":
        case "f":
        case "d":
        case "D": return "number";
        case "v":
        case "?":
            return "void";
        case ":":
        case "#":
        case "^":
        case "r":
            return "any";
        case "{":
            if (type[1] === "?") {
                return "any";
            }
            return type.substr(1).replace(/=.*$/, "");
        case "@":
            const t = type.substr(1).replace(/[\42?]/g, "");
            if (t[0] === "<") {
                return t.replace(/[<>]/g, "");
            }
            if (t.includes("<")) {
                return t.replace(/<.*>/, "");
            }
            if (t) {
                return t;
            }
            return "any";
    }
    return type;
}
function conformName(name) {
    return name.replace(/[:.]/g, "_").replace(/_$/, "");
}
function check(symbolName) {
    try {
        return eval(symbolName);
    }
    catch (e) {
    }
    return false;
}
function array(objects) {
    const length = objects.count();
    const mutableResult = new Array(length);
    for (let mutableI = 0; mutableI < length; mutableI++) {
        mutableResult[mutableI] = objects[mutableI];
    }
    return mutableResult;
}
function uniqueArray(arr) {
    return arr.filter((item, pos) => arr.indexOf(item) === pos);
}
function readFile(path) {
    return NSString.stringWithContentsOfFile_encoding_error(path, NSUTF8StringEncoding, null);
}
function writeFile(path, content) {
    const string = NSString.stringWithFormat("%@", content);
    return string.writeToFile_atomically(path, true);
}
