function onRun(context: SketchContext) {
    const artboards = context.document.artboards() as NSArray;
    
    context.document.showMessage("This page has " + artboards.count() + " artboards");
}
