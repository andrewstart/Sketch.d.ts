"use strict";
function onRun(context) {
    const artboards = context.document.artboards();
    context.document.showMessage("This page has " + artboards.count() + " artboards");
}
