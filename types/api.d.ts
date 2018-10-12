/// <reference path="./sketch.d.ts" />
declare module "sketch/dom" {
    class dom {
        /**
         * Export an object, using the options supplied.
         * @param objectToExport The object to export.
         * @param options Options indicating which sizes and formats to use, etc..
         */
        static export(objectToExport:dom.Layer|dom.Layer[]|dom.Page|dom.Page[], options?:dom.ExportOptions):void;
    }
    namespace dom {
        class Component<NativeType = any> {
            static fromNative<NativeType>(nativeObject:NativeType):Component<NativeType>;
            toJSON():any;
            /**
             * The native Sketch model object.
             */
            readonly sketchObject:NativeType;
            /**
             * A string that represent the type of the component. If it’s undefined, it means that we couldn’t match the native object and that we returned a really lightweight wrapper.
             */
            readonly type:Types|undefined;
            /**
             * Returns the object ID of the wrapped Sketch model object.
             */
            readonly id:string;
            /**
             * returns if the component is wrapping an immutable version of a native Sketch model object. If that is the case, you won't be able to mutable the object (setting any property will be a no-op).
             */
            isImmutable():boolean;
            /**
             * Because the API objects are thin wrappers, they are created on demand and are
             * thrown away regularly.
             *
             * No attempt is made to have a one-to-one correspondence between wrapper and model
             * object - many wrapper instances may exist which point to the same model object.
             *
             * This is not the most efficient solution in some respects, but it's pragmatic and
             * works well for simple cases.
             * Because multiple wrappers might exist for a given model object, if you're
             * testing two for equality, you should test the things that they wrap, rather than
             * the wrapper objects themselves
             */
            isEqual(wrappedObject:Component):boolean;
        }
        
        export enum Types {
            Group = 'Group',
            Page = 'Page',
            Artboard = 'Artboard',
            Shape = 'Shape',
            Style = 'Style',
            Blur = 'Blur',
            Border = 'Border',
            BorderOptions = 'BorderOptions',
            Fill = 'Fill',
            Gradient = 'Gradient',
            GradientStop = 'GradientStop',
            Shadow = 'Shadow',
            Image = 'Image',
            Text = 'Text',
            Document = 'Document',
            Library = 'Library',
            SymbolMaster = 'SymbolMaster',
            SymbolInstance = 'SymbolInstance',
            Override = 'Override',
            ImageData = 'ImageData',
            Flow = 'Flow',
            HotSpot = 'HotSpot',
            ImportableObject = 'ImportableObject',
            SharedStyle = 'SharedStyle',
            DataOverride = 'DataOverride',
            ShapePath = 'ShapePath',
        }
        
        /**
         * Access the selected Document
         * @return The selected Document or undefined if no document is open.
         */
        export function getSelectedDocument():Document|undefined;
        /**
         * Access all the open Documents
         * @return An array of Documents.
         */
        export function getDocuments():Document[];
        
        export class Document extends Component<MSDocument> {
            /**
             * Access the selected Document
             * @return The selected Document or undefined if no document is open.
             */
            static getSelectedDocument():Document|undefined;
            /**
             * Access all the open Documents
             * @return An array of Documents.
             */
            static getDocuments():Document[];
            /**
             * A method to open an existing sketch document or ask the user to open one. The method is asynchronous so if you want to do something after the document is opening it, make sure that you pass a callback and continue your script there. Asks the user to select a file to open.
             * @param cb A function called after the document is opened. It is called with an Error if opening the Document was unsuccessful and a Document (or undefined).
             */
            static open(cb:(err:any, document?:Document|undefined)=>void):void;
            /**
             * A method to open an existing sketch document or ask the user to open one. The method is asynchronous so if you want to do something after the document is opening it, make sure that you pass a callback and continue your script there.
             * @param path The path to the document to open. If undefined, the user will be asked to select one.
             * @param cb A function called after the document is opened. It is called with an Error if opening the Document was unsuccessful and a Document (or undefined).
             */
            static open(path:string, cb:(err:any, document?:Document|undefined)=>void):void;
            static SaveMode:typeof SaveMode;
            /**
             * The unique ID of the document.
             */
            id: string;
            /**
             * The pages of the document.
             */
            pages: Page[];
            type: Types.Document;
            constructor();
            /**
             * A read-only property to get the current page that the user has selected.
             */
            readonly selectedPage:Page;
            /**
             * A read-only property to get the layers that the user has selected in the currently selected page.
             */
            readonly selectedLayers:Selection;
            /**
             * A method to help find the first layer in this document which has the given id.
             * @param layerID The ID of the layer to find
             * @return Return a Layer object or undefined if it’s not found.
             */
            getLayerWithID(layerID:string):Layer|undefined;
            /**
             * A method to help find the layers in this document which have the given name.
             * @param name The name of the layers to find
             * @return Return an array of Layer.
             */
            getLayersNamed(name:string):Layer[];
            /**
             * A method to get all shared layer styles defined in the document.
             * @return Return an array of the layer SharedStyle objects defined in the document.
             */
            getSharedLayerStyles():SharedStyle[];
            /**
             * A method to help find a shared style in the document.
             * @param id The ID of the shared style to find
             * @return Return a SharedStyle object or undefined if it's not found.
             */
            getSharedLayerStyleWithID(id:string):SharedStyle|undefined;
            /**
             * A method to get all shared text styles defined in the document.
             * @return Return an array of the text SharedStyle objects defined in the document.
             */
            getSharedTextStyles():SharedStyle[];
            /**
             * A method to help find a shared style in the document.
             * @param id The ID of the shared style to find
             * @return Return a SharedStyle object or undefined if it's not found.
             */
            getSharedTextStyleWithID(id:string):SharedStyle|undefined;
            /**
             * A method to get all symbol masters defined in the document.
             * @return Return an array of the SymbolMaster objects defined in the document.
             */
            getSymbols():SymbolMaster[];
            /**
             * A method to help find a symbol master in the document.
             * @param symbolID The symbol ID of the symbol master to find
             * @return Return a SymbolMaster object or undefined if it’s not found.
             */
            getSymbolMasterWithID(symbolID:string):SymbolMaster|undefined;
            /**
             * A method to help center the view of the document window on a given layer.
             * @param layer The layer to center the view onto
             */
            centerOnLayer(layer:Layer):void;
            /**
             * A method to save a document to a specific path or ask the user to choose where to save it. The method is asynchronous so if you want to do something after the document is saved, make sure that you pass a callback and continue your script there.
             * @param path The path where the document will be saved. If undefined, the user will be asked to select one.
             * @param options The options for the save operation (only used when specifing a path).
             * @param cb A function called after the document is saved. It is called with an Error if saving the Document was unsuccessful.
             */
            save(path?:string, options?:{saveMode:SaveMode, iKnowThatImOverwritingAFolder?:boolean}, cb?:(err:any)=>void):void;
            /**
             * A method to save a document to a specific path or ask the user to choose where to save it. The method is asynchronous so if you want to do something after the document is saved, make sure that you pass a callback and continue your script there.
             * @param path The path where the document will be saved. If undefined, the user will be asked to select one.
             * @param cb A function called after the document is saved. It is called with an Error if saving the Document was unsuccessful.
             */
            save(path?:string, cb?:(err:any)=>void):void;
            /**
             * A method to save a document to a specific path or ask the user to choose where to save it. The method is asynchronous so if you want to do something after the document is saved, make sure that you pass a callback and continue your script there.
             * @param cb A function called after the document is saved. It is called with an Error if saving the Document was unsuccessful.
             */
            save(cb?:(err:any)=>void):void;
            /**
             * A method to close a document.
             */
            close():void;
        }
        
        enum SaveMode {
            /**
             * Overwrites a document’s file with the document’s contents
             */
            Save,
            /**
             * 	Writes a document’s contents to a new file and then changes the document’s current location to point to the just-written file
             */
            SaveAs,
            /**
             * Writes a document’s contents to a new file without changing the document’s current location to point to the new file.
             */
            SaveTo
        }
        
        export abstract class Layer<NativeType extends MSLayer = MSLayer> extends Component<NativeType> {
            /**
             * The unique ID of the Layer. (not to be confused with symbolId on SymbolInstances)
             */
            id: string;
            /**
             * The name of the Layer
             */
            name:string;
            /**
             * The group/document the layer is in.
             */
            parent:Group|Document;
            /**
             * If the layer is locked.
             */
            locked:boolean;
            /**
             * If the layer is hidden.
             */
            hidden:boolean;
            /**
             * The frame of the Layer. This is given in coordinates that are local to the parent of the layer.
             */
            frame:Rectangle;
            /**
             * If the layer is selected.
             */
            selected:boolean;
            /**
             * The prototyping action associated with the layer.
             */
            flow:FlowProperty;
            /**
             * A new identical layer will be inserted into the parent of this layer.
             * @return A new copy of this layer.
             */
            duplicate():this;//a copy of this
            /**
             * Remove this layer from its parent.
             */
            remove():this;
            /**
             * The index of this layer in its parent. The layer at the back of the parent (visually) will be layer 0. The layer at the front will be layer n - 1 (if there are n layers).
             */
            readonly index:number;
            /**
             * Move this layer to the front of its parent.
             */
            moveToFront():this;
            /**
             * Move this layer forward in its parent.
             */
            moveForward():this;
            /**
             * Move this layer to the back of its parent.
             */
            moveToBack():this;
            /**
             * Move this layer backward in its parent.
             */
            moveBackward():this;
        }
        
        class StyledLayer<NativeType extends MSStyledLayer> extends Component<NativeType> {
            /**
             * The style of the layer.
             */
            style: Style|IStyle;
        }
        
        export type LayerPropertyType = Layer |
            (GroupProperties & {type:Types.Group}) |
            (ImageProperties & {type:Types.Image}) |
            (ShapeProperties & {type:Types.Shape}) |
            (ShapeProperties & {type:Types.ShapePath}) |
            (TextProperties & {type:Types.Text}) |
            (SymbolInstanceProperties & {type:Types.SymbolInstance}) |
            (HotSpotProperties & {type:Types.HotSpot});
        
        export type LayersPropertyType = LayerPropertyType[];
        
        
        export interface GroupProperties {
            /**
             * The name of the Group
             */
            name?:string;
            /**
             * The group the Group is in.
             */
            parent?:Group;
            /**
             * The frame of the Group. This is given in coordinates that are local to the parent of the layer.
             */
            frame?:Rectangle;
            /**
             * The prototyping action associated with the Group.
             */
            flow?:FlowProperty;
            /**
             * The style of the Group.
             */
            style?: Style|IStyle;
            /**
             * The layers that this Group has
             */
            layers?: LayersPropertyType;
        }
        
        export type ChildLayer = Group | Image | Shape | ShapePath | Text | SymbolInstance | HotSpot;
        
        class BaseGroup<NativeType extends MSLayerGroup = MSLayerGroup> extends StyledLayer<NativeType> {
            /**
             * The layers that this component groups together.
             */
            layers:ChildLayer[];
            /**
             * Adjust the group to fit its children.
             */
            adjustToFit():this;
        }
        
        export class Group extends BaseGroup {
            type: Types.Group;
            constructor(properties?:GroupProperties);
        }
        
        export interface PageProperties {
            /**
             * The name of the Page
             */
            name?:string;
            /**
             * The document the page is in.
             */
            parent?: Document;
            /**
             * The layers that this page has
             */
            layers?: LayersPropertyType;
            /**
             * The frame of the page
             */
            frame?: Rectangle;
        }
        
        export class Page extends BaseGroup<MSPage> {
            /**
             * The document the page is in.
             */
            parent: Document;
            type: Types.Page;
            constructor(properties?:PageProperties);
            /**
             * A read-only property to get the layers that the user has selected in the page.
             */
            readonly selectedLayers:Selection;
        }
        
        export interface ArtboardProperties {
            /**
             * The name of the Artboard
             */
            name?:string;
            /**
             * The document the Artboard is in.
             */
            parent?: Page;
            /**
             * The layers that this component groups together
             */
            layers?: LayersPropertyType;
            /**
             * The frame of the page
             */
            frame?: Rectangle;
            /**
             * A Start Point allows you to choose where to start your prototype from.
             */
            flowStartPoint?:boolean;
        }
        
        class BaseArtboard<NativeType extends MSArtboardGroup = MSArtboardGroup> extends BaseGroup<MSArtboardGroup> {
            /**
             * The page the Artboard is in.
             */
            parent: Page;
            /**
             * A Start Point allows you to choose where to start your prototype from.
             */
            flowStartPoint:boolean;
        }
        
        export class Artboard extends BaseArtboard {
            type: Types.Artboard;
            constructor(properties?:ArtboardProperties);
        }
        
        export interface ImageProperties {
            /**
             * The name of the Image
             */
            name?:string;
            /**
             * The group the Image is in.
             */
            parent?:Group;
            /**
             * The frame of the Image. This is given in coordinates that are local to the parent of the layer.
             */
            frame?:Rectangle;
            /**
             * The prototyping action associated with the Image.
             */
            flow?:FlowProperty;
            /**
             * The style of the Image.
             */
            style?: Style|IStyle;
            /**
             * The image property accept a wide range of input:
             * * an ImageData
             * * a native NSImage
             * * a native NSURL
             * * a native MSImageData
             * * a string: path to the file to load the image from
             * * an object with a path property: path to the file to load the image from
             * * an object with a base64 string: a base64 encoded image
             */
            image?: ImageData|NSImage|NSURL|MSImageData|string|{path:string}|{base64:string};
        }
        
        export class Image extends StyledLayer<MSBitmapLayer> {
            type: Types.Image;
            /**
             * The group the Image is in.
             */
            parent: Group;
            /**
             * The actual image of the layer.
             */
            image: ImageData;
            constructor(properties?:ImageProperties);
        }
        
        /**
         * An ImageData is a wrapper around a native NSImage.
         * You can access the native NSImage with nsimage or a native NSData representation of the image with nsdata.
         */
        export abstract class ImageData extends Component<MSImageData> {
            type: Types.ImageData;
            readonly nsimage: NSImage;
            readonly nsdata: NSData;
            /**
             * The image property accept a wide range of input:
             * * an ImageData
             * * a native NSImage
             * * a native NSURL
             * * a native MSImageData
             * * a string: path to the file to load the image from
             * * an object with a path property: path to the file to load the image from
             * * an object with a base64 string: a base64 encoded image
             */
            static from(input:ImageData|NSImage|NSURL|MSImageData|string|{path:string}|{base64:string}):ImageData;
        }
        
        export interface ShapeProperties {
            /**
             * The name of the Shape
             */
            name?:string;
            /**
             * The group the Shape is in.
             */
            parent?:Group;
            /**
             * The frame of the Shape. This is given in coordinates that are local to the parent of the layer.
             */
            frame?:Rectangle;
            /**
             * The prototyping action associated with the Shape.
             */
            flow?:FlowProperty;
            /**
             * The style of the Shape.
             */
            style?: Style|IStyle;
        }
        
        export class Shape extends BaseGroup<MSShapeGroup> {
            type: Types.Shape;
            /**
             * The group the Shape is in.
             */
            parent: Group;
            constructor(properties?:ShapeProperties);
        }
        
        export class ShapePath extends StyledLayer<MSShapePathLayer> {
            type: Types.ShapePath;
            /**
             * The group the Shape is in.
             */
            parent: Group;
            constructor(properties?:ShapeProperties);
        }
        
        export interface TextProperties {
            /**
             * The name of the Text
             */
            name?:string;
            /**
             * The group the Text is in.
             */
            parent?:Group;
            /**
             * The frame of the Text. This is given in coordinates that are local to the parent of the layer.
             */
            frame?:Rectangle;
            /**
             * The prototyping action associated with the Text.
             */
            flow?:FlowProperty;
            /**
             * The style of the Text.
             */
            style?: Style|IStyle;
            /**
             * The string value of the text layer.
             */
            text?:string;
            /**
             * The alignment of the layer.
             */
            alignment?:Alignment;
            /**
             * The line spacing of the layer.
             */
            lineSpacing?:LineSpacing;
            /**
             * Whether the layer should have a fixed width or a flexible width.
             */
            fixedWidth?:boolean;
        }
        
        export class Text extends StyledLayer<MSTextLayer> {
            type: Types.Text;
            /**
             * The group the Text is in.
             */
            parent: Group;
            /**
             * The string value of the text layer.
             */
            text:string;
            /**
             * The alignment of the layer.
             */
            alignment:Alignment;
            /**
             * The line spacing of the layer.
             */
            lineSpacing:LineSpacing;
            /**
             * Whether the layer should have a fixed width or a flexible width.
             */
            fixedWidth:boolean;
            /**
             * Enumeration of the alignments of the text.
             */
            static Alignment:typeof Alignment;
            /**
             * Enumeration of the line spacing behaviour for the text.
             */
            static LineSpacing:typeof LineSpacing;
            constructor(properties?:TextProperties);
            /**
             * Adjust the Text to fit its value.
             */
            adjustToFit():this;
            /**
             * Set the font of the text layer.
             */
            font:NSFont;
            /**
             * Set the font of the text layer as the system font of the given size.
             */
            systemFontSize:number;
            /**
             * Returns a array of the text fragments for the text. Each one is a object containing a rectangle, and a baseline offset and the range of the fragment {rect, baselineOffset, range}.
             */
            fragments: TextFragment[];
        }
        
        enum Alignment {
            /**
             * Visually left aligned
             */
            left,
            /**
             * Visually right aligned
             */
            right,
            /**
             * Visually centered
             */
            center,
            /**
             * Fully-justified. The last line in a paragraph is natural-aligned.
             */
            justify,
            /**
             * Indicates the default alignment for script
             */
            natural
        }
        
        enum LineSpacing {
            /**
             * Uses min & max line height on paragraph style
             */
            constantBaseline,
            /**
             * Uses MSConstantBaselineTypesetter for fixed line height
             */
            variable
        }
        
        export interface TextFragment {
            rect: Rectangle;
            baselineOffset: number;
            range: NSRange;
        }
        
        export interface SymbolMasterProperties {
            /**
             * The name of the SymbolMaster
             */
            name?:string;
            /**
             * The frame of the SymbolMaster. This is given in coordinates that are local to the parent of the layer.
             */
            frame?:Rectangle;
            /**
             * The prototyping action associated with the SymbolMaster.
             */
            flow?:FlowProperty;
        }
        
        export class SymbolMaster extends BaseArtboard<MSSymbolMaster> {
            type: Types.SymbolMaster;
            /**
             * The unique ID of the Symbol that the master and its instances share.
             */
            symbolID:string;
            constructor(properties?:SymbolMasterProperties);
            /**
             * Replace the artboard with a symbol master.
             * @param artboard The artboard to create the master from.
             * @return A new SymbolMaster
             */
            static fromArtboard(artboard:Artboard):SymbolMaster;
            /**
             * Replace the symbol master with an artboard and detach all its instances converting them into groups.
             * @return A new Artboard
             */
            toArtboard():Artboard;
            /**
             * Creates a new SymbolInstance linked to this master, ready for inserting in the document.
             * @return A new SymbolInstance
             */
            createNewInstance():SymbolInstance;
            /**
             * Returns an array of all instances of the symbol in the document, on all pages.
             */
            getAllInstances():SymbolInstance[];
            /**
             * @return The Library the symbol was defined in, or null if it is a local symbol.
             */
            getLibrary():Library|null;
            /**
             * If a Library has some updates, you can synchronize the local Symbol Master with the Library’s version and bypass the panel where the user chooses the updates to bring.
             * @return true if it succeeded.
             */
            syncWithLibrary():boolean;
            /**
             * You can unlink a Symbol Master from the Library it comes from and make it a local Symbol Master instead. It will be added to the Symbols Page.
             * @return true if it succeeded.
             */
            unlinkFromLibrary():boolean;
        }
        
        export interface SymbolInstanceProperties {
            /**
             * The name of the SymbolInstance
             */
            name?:string;
            /**
             * The group the SymbolInstance is in.
             */
            parent?:Group;
            /**
             * The frame of the SymbolInstance. This is given in coordinates that are local to the parent of the layer.
             */
            frame?:Rectangle;
            /**
             * The prototyping action associated with the SymbolInstance.
             */
            flow?:FlowProperty;
            /**
             * The style of the SymbolInstance.
             */
            style?: Style|IStyle;
            /**
             * The unique ID of the Symbol that the instance and its master share.
             */
            symbolID:string;
        }
        
        export class SymbolInstance extends StyledLayer<MSSymbolInstance> {
            type: Types.SymbolInstance;
            /**
             * The group the SymbolInstance is in.
             */
            parent: Group;
            /**
             * The unique ID of the Symbol that the instance and its master share.
             */
            symbolID:string;
            /**
             * The Symbol master that the instance is linked to.
             */
            master:SymbolMaster;
            /**
             * The array of the overrides to modify the instance.
             */
            overrides:Override[];
            constructor(properties:SymbolInstanceProperties);
            /**
             * Replaces a group that contains a copy of the Symbol this instance refers to. Returns null if the master contains no layers instead of inserting an empty group
             * @return A new Group or null
             */
            detach():Group|null;
            /**
             * Change the value of the override.
             * @param override The override to change.
             * @param value The value of override to set. Can be a string or an NSImage or a symbolId depending on the type of the override.
             */
            setOverrideValue(override:Override, value:string|NSImage):this;
        }
        
        /**
         * A Symbol override. This component is not exposed, it is only returned when accessing the overrides of a Symbol Instance.
         * Can't be constructed - only returned from a SymbolInstance
         */
        export abstract class Override extends Component<MSAvailableOverride> {
            type: Types.Override;
            /**
             * The path to the override. It’s formed by the symbolId of the nested symbols separated by a /.
             */
            path: string;
            /**
             * The property that this override controls. It can be "stringValue" for a text override, "symbolID" for a nested symbol, or "image" for an image override.
             */
            property: 'stringValue' | 'symbolID' | 'image';
            /**
             * The unique ID of the override (${path}_${property}).
             */
            id: string;
            /**
             * If the override is a nested symbol override.
             */
            Override: boolean;
            /**
             * The value of the override which can be change.
             */
            value: string|ImageData;
            /**
             * If the override hasn’t been changed and is the default value.
             */
            isDefault: boolean;
            /**
             * The layer the override applies to. It will be an immutable version of the layer
             */
            affectedLayer: Text|Image|SymbolInstance;
        }
        
        /**
         * The prototyping action associated with a layer.
         */
        export interface FlowProperty {
            /**
             * The target artboard of the action or Flow.BackTarget if the action is a back action
             */
            target?: Artboard|typeof Flow.BackTarget;
            /**
             * The ID of target artboard of the action or Flow.BackTarget if the action is a back action
             */
            targetId?: string|typeof Flow.BackTarget;
            /**
             * The type of the animation.
             */
            animationType?: Flow.AnimationType;
            /**
             * Returns whether the prototyping action is a back action or not, eg. whether layer.flow.target === Flow.BackTarget.
             * Is only valid on flow properties retrieved from layers
             */
            readonly isBackAction?:()=>boolean;
            /**
             * In some cases, the target of the action can be invalid, for example when the target has been removed from the document. The methods returns whether the target is valid or not.
             * Is only valid on flow properties retrieved from layers
             */
            readonly isValidConnection?:()=>boolean;
        }
        
        /**
         * Enumeration of the animation types.
         */
        export namespace Flow {
            /**
             * Enumeration of the animation types.
             */
            export enum AnimationType {
                /**
                 * No animation
                 */
                none,
                /**
                 * Slide from the left
                 */
                slideFromLeft,
                /**
                 * Slide from the right
                 */
                slideFromRight,
                /**
                 * Slide from the bottom
                 */
                slideFromBottom,
                /**
                 * Slide from the top
                 */
                slideFromTop
            }
            /**
             * Flow.BackTarget is a constant that you can set the target to in order to always take you back to the last Artboard you were looking at. When a Target has been set to Flow.BackTarget, the transition leading into it will be reversed on return.
             */
            export const BackTarget: unique symbol;
        }
        
        export interface HotSpotProperties {
            /**
             * The name of the HotSpot
             */
            name?:string;
            /**
             * The group the HotSpot is in.
             */
            parent?:Group;
            /**
             * The frame of the HotSpot. This is given in coordinates that are local to the parent of the layer.
             */
            frame?:Rectangle;
            /**
             * The prototyping action associated with the HotSpot.
             */
            flow?:FlowProperty;
        }
        
        /**
         * A Sketch hotspot. It is an instance of both Layer so all the methods defined there are available.
         */
        export class HotSpot extends Layer<MSHotspotLayer> {
            type: Types.HotSpot;
            constructor(properties?:HotSpotProperties);
            static fromLayer(layer:Layer):HotSpot;
        }
        
        /**
         * A Sketch Library.
         */
        export abstract class Library extends Component<MSAssetLibrary> {
            type: Types.Library;
            /**
             * The unique ID of the Library.
             */
            readonly id: string;
            /**
             * The name of the Library.
             */
            readonly name: string;
            /**
             * If Sketch has been able to load the Library.
             */
            readonly valid: boolean;
            /**
             * If the user has enabled the Library.
             */
            enabled: boolean;
            /**
             * The type of Library.
             */
            readonly libraryType: LibraryType;
            /**
             * The date at which the library was last updated
             */
            readonly lastModifiedAt:Date;
            static getLibraries():Library[];
            /**
             * Get the library for a local Sketch document. If the Document was already added as a Library, it will simply return it. If it is not already a Library, it will be added.
             * @param path The path of the Library.
             * @return The existing Library at the path or a new Library from the document at the path.
             */
            static getLibraryForDocumentAtPath(path:string):Library;
            /**
             * Get the remote library for an RSS feed. If the RSS feed was already added as a Library, it will simply return it. If it is not already a Library, it will be added.
             * @param url The URL to the rss feed describing the versions of the library.
             * @param cb A function called after the library is added. It is called with an Error if adding the Library was unsuccessful and a Library (or undefined).
             */
            static getRemoteLibraryWithRSS(url:string, cb:(err?:any, library?:Library)=>void):void;
            /**
             * A method to remove an existing library.
             */
            remove():void;
            /**
             * A library references a Sketch Document and you can access it with this method.
             * @returns The Document that the Library references. It can throw an error if the Document cannot be accessed.
             */
            getDocument():Document;
            getImportableReferencesForDocument(document:Document, objectType: ImportableObjectType):ImportableObject[];
            /**
             * To import a symbol from a Library, do not access its Document and look for the SymbolMaster directly. Instead, get the Symbol References of the Library and use those to import them.
             * Those references depends on the document you want to import them into. For example if a document has already imported a symbol, it will reference the local version to keep all the instances in sync.
             * @return An array of ImportableObject that represents the Symbols which you can import from the Library.
             */
            getImportableSymbolReferencesForDocument(document:Document):ImportableObject[];
            /**
             * To import a shared style from a Library, do not access its Document and look for the SharedStyle directly. Instead, get the Shared Layer Style References of the Library and use those to import them.
             * Those references depends on the document you want to import them into. For example if a document has already imported a shared style, it will reference the local version to keep all the instances in sync.
             * @return An array of ImportableObject that represents the shared Layer styles which you can import from the Library.
             */
            getImportableLayerStyleReferencesForDocument(document:Document):ImportableObject[];
            /**
             * To import a shared style from a Library, do not access its Document and look for the SharedStyle directly. Instead, get the Shared Text Style References of the Library and use those to import them.
             * Those references depends on the document you want to import them into. For example if a document has already imported a shared style, it will reference the local version to keep all the instances in sync.
             * @return An array of ImportableObject that represents the shared Text styles which you can import from the Library.
             */
            getImportableTextStyleReferencesForDocument(document:Document):ImportableObject[];
            /**
             * Enumeration of the types of Library.
             */
            static LibraryType: typeof LibraryType;
            /**
             * Enumeration of the types of Importable Objects.
             */
            static ImportableObjectType: typeof ImportableObjectType;
        }
        
        type ImportableNative = MSShareableObjectReference | MSSymbolMasterReference |
            MSSharedStyleReference | MSSharedLayerReference | MSSharedTextReference;
        /**
         * An Object that can imported from a Library. All its properties are read-only.
         */
        export abstract class ImportableObject extends Component<ImportableNative> {
            type: Types.ImportableObject;
            /**
             * The unique ID of the Object.
             */
            readonly id:string;
            /**
             * The name of the Object.
             */
            readonly name: string;
            /**
             * The type of the Object.
             */
            readonly objectType: ImportableObjectType;
            /**
             * The Library the Object is part of.
             */
            readonly library: Library;
            /**
             * An Importable Object is linked to a Document so importing it will import it in the said Document.
             * @return If the objectType of the Object is Symbol, it will return a Symbol Master which will be linked to the Library (meaning that if the Library is updated, the Symbol Instances created from the Master will be updated as well).
             */
            import():SymbolMaster;
        }
        
        enum ImportableObjectType {
            Symbol,
            LayerStyle,
            TextStyle
        }
        
        enum LibraryType {
            Internal,
            User,
            Remote
        }
        
        /**
         * A utility class to represent the layers selection. Contains some methods to make interacting with a selection easier. All the properties are read-only.
         */
        export abstract class Selection {
            /**
             * The Layers in the selection.
             */
            readonly layers: Layer[];
            /**
             * The number of Layers in the selection.
             */
            readonly length: number;
            /**
             * Does the selection contain any layers?
             */
            readonly isEmpty: boolean;
            map<T>(func:(layer:Layer)=>T):T[];
            forEach(func:(layer:Layer)=>void):void;
            reduce<T>(func:(initial: T, layer:Layer)=>T):T;
            /**
             * Clear the selection.
             */
            clear():this;
        }
        
        /**
         * A utility class to represent a rectangle. Contains some methods to make interacting with a rectangle easier.
         */
        export class Rectangle {
            /**
             * The x coordinate of the top-left corner of the rectangle.
             */
            x: number;
            /**
             * The y coordinate of the top-left corner of the rectangle.
             */
            y: number;
            /**
             * The width of the rectangle.
             */
            width: number;
            /**
             * The height of the rectangle.
             */
            height: number;
            constructor(x:number, y:number, width:number, height:number);
            constructor(rect:Rectangle);
            /**
             * Adjust the rectangle by offsetting it.
             */
            offset(x:number, y:number):this;
            /**
             * Adjust the rectangle by scaling it.
             */
            scale(scale:number):this;
            /**
             * Adjust the rectangle by scaling it.
             */
            scale(scaleWidth:number, scaleHeight:number):this;
            /**
             * Each layer defines its own system of coordinates (with its origin at the top left of the layer). You can change that basis from one layer to the other with changeBasis.
             * Both from and to can be omitted (but not at the same time) to change the basis from/to the Page coordinates.
             */
            changeBasis(change:{from?:Layer, to?:Layer}):Rectangle;
            /**
             * Return the Rectangle as a CGRect
             */
            asCGRect():CGRect;
        }
        
        /**
         * A utility class to represent the style of a Layer.
         */
        export interface IStyle {
            /**
             * The opacity of a Layer, between 0 (transparent) and 1 (opaque).
             */
            opacity?: number;
            /**
             * The opacity of a Layer, between 0 (transparent) and 1 (opaque).
             */
            blendingMode?: Style.BlendingMode;
            /**
             * The blur applied to the Layer.
             */
            blur?: Blur;
            /**
             * The fills of a Layer.
             */
            fills?: Fill[];
            /**
             * The borders of a Layer.
             */
            borders?: Border[];
            /**
             * The options that the borders share.
             */
            borderOptions?: BorderOptions;
            /**
             * The shadows of a Layer.
             */
            shadows?: Shadow[];
            /**
             * The inner shadows of a Layer.
             */
            innerShadows?: Shadow[];
        }
        
        /**
         * An object that represent the blur of the layer.
         */
        export interface Blur {
            /**
             * The type of the blur.
             */
            blurType: Style.BlurType;
            /**
             * The radius of the blur.
             */
            radius: number;
            /**
             * The angle of the blur (only used when the blur type is Motion).
             */
            motionAngle?: number;
            /**
             * The center of the blur (only used when the blur type is Zoom.
             */
            center?: {x:number, y:number};
            /**
             * Whether the fill is active or not.
             */
            enabled?:boolean;
        }
        
        /**
         * An object that represent a Fill.
         */
        export interface Fill {
            /**
             * The type of the fill.
             */
            fill: Style.FillType;
            /**
             * A rgba hex-string (#000000ff is opaque black).
             */
            color?: string;
            /**
             * The gradient of the fill.
             */
            gradient?: Gradient;
            /**
             * Whether the fill is active or not.
             */
            enabled?: boolean;
        }
        
        /**
         * An object that represent a Border.
         */
        export interface Border {
            /**
             * The type of the fill of the border.
             */
            fill: Style.FillType;
            /**
             * A rgba hex-string (#000000ff is opaque black).
             */
            color?: string;
            /**
             * The gradient of the fill.
             */
            gradient?: Gradient;
            /**
             * Whether the border is active or not.
             */
            enabled?: boolean;
            /**
             * The position of the border.
             */
            position?: Style.BorderPosition;
            /**
             * The thickness of the border.
             */
            thickness?: number;
        }
        
        /**
         * An object that represent the options that the Borders of the Layer share.
         */
        export interface BorderOptions {
            /**
             * The type of the arrow head for the start of the path.
             */
            startArrowhead?: Style.Arrowheads;
            /**
             * The type of the arrow head for the start of the path.
             */
            endArrowhead?: Style.Arrowheads;
            /**
             * The dash pattern of the borders. For example, a dash pattern of 4-2 will draw the stroke for four pixels, put a two pixel gap, draw four more pixels and then so on. A dashed pattern of 5-4-3-2 will draw a stroke of 5 px, a gap of 4 px, then a stroke of 3 px, a gap of 2 px, and then repeat.
             */
            dashPattern?: number[];
            /**
             * The type of the border ends (if visible).
             */
            lineEnd?: Style.LineEnd;
            /**
             * The type of the border joins (if any).
             */
            lineJoin?: Style.LineJoin;
        }
        
        /**
         * An object that represent a Shadow.
         */
        export interface Shadow {
            /**
             * A rgba hex-string (#000000ff is opaque black).
             */
            color: string;
            /**
             * The blur radius of the shadow.
             */
            blur: number;
            /**
             * The horizontal offset of the shadow.
             */
            x?: number;
            /**
             * The vertical offset of the shadow.
             */
            y?: number;
            /**
             * The spread of the shadow.
             */
            spread?: number;
            /**
             * Whether the fill is active or not.
             */
            enabled?: boolean;
        }
        
        /**
         * An object that represent a Gradient.
         */
        export interface Gradient {
            /**
             * The type of the Gradient.
             */
            gradientType: Style.GradientType;
            /**
             * The position of the start of the Gradient
             */
            from: {x: number, y: number};
            /**
             * The position of the end of the Gradient.
             */
            to: {x: number, y: number};
            /**
             * The different stops of the Gradient
             */
            stops: GradientStop[];
        }
        
        /**
         * An object that represent a Gradient Stop. Each of colors of a Gradient are represented by a Stop. A Gradient can have as many Stops as you’d like.
         */
        export interface GradientStop {
            /**
             * The position of the Stop. 0 represents the start of the gradient while 1 represent the end.
             */
            position: number;
            /**
             * The color of the Stop
             */
            color: string;
        }
        
        export class Style extends Component<MSStyle> {
            type: Types.Style;
            /**
             * The opacity of a Layer, between 0 (transparent) and 1 (opaque).
             */
            opacity?: number;
            /**
             * The opacity of a Layer, between 0 (transparent) and 1 (opaque).
             */
            blendingMode?: Style.BlendingMode;
            /**
             * The blur applied to the Layer.
             */
            blur?: Blur;
            /**
             * The fills of a Layer.
             */
            fills?: Fill[];
            /**
             * The borders of a Layer.
             */
            borders?: Border[];
            /**
             * The options that the borders share.
             */
            borderOptions?: BorderOptions;
            /**
             * The shadows of a Layer.
             */
            shadows?: Shadow[];
            /**
             * The inner shadows of a Layer.
             */
            innerShadows?: Shadow[];
            /**
             * @return Whether the Style has some differences with the Shared Style it is linked to. In case it isn't linked to any, returns false.
             */
            isOutOfSyncWithSharedStyle():boolean;
            /**
             * The style instance will be updated with the value of the Shared Style.
             */
            syncWithSharedStyle():void;
        }
        export namespace Style {
            export enum BlendingMode {
                Normal,
                Darken,
                Multiply,
                ColorBurn,
                Lighten,
                Screen,
                ColorDodge,
                Overlay,
                SoftLight,
                HardLight,
                Difference,
                Exclusion,
                Hue,
                Saturation,
                Color,
                Luminosity
            }
            
            export enum BlurType {
                /**
                 * A common blur type that will accurately blur in all directions.
                 */
                Gaussian,
                /**
                 * Blur only in one direction, giving the illusion of motion.
                 */
                Motion,
                /**
                 * Will blur from one particular point out.
                 */
                Zoom,
                /**
                 * This will blur any content that appears behind the layer.
                 */
                Background
            }
            
            export enum FillType {
                Color,
                Gradient,
                Pattern,
                Noise
            }
            
            export enum BorderPosition {
                Center,
                Inside,
                Outside
            }
            
            export enum Arrowheads {
                None,
                OpenArrow,
                FilledArrow,
                Line,
                OpenCircle,
                FilledCircle,
                OpenSquare,
                FilledSquare
            }
            
            export enum LineEnd {
                /**
                 * This is the default option that’ll draw the border right to the vector point.
                 */
                Butt,
                /**
                 * Creates a rounded, semi-circular end to a path that extends past the vector point.
                 */
                Round,
                /**
                 * Similar to the rounded cap, but with a straight edges.
                 */
                Projecting
            }
            
            export enum LineJoin {
                /**
                 * This will simply create an angled, or pointy join. The default setting.
                 */
                Miter,
                /**
                 * Creates a rounded corner for the border. The radius is relative to the border thickness.
                 */
                Round,
                /**
                 * This will create a chamfered edge on the border corner.
                 */
                Bevel
            }
            
            export enum GradientType {
                /**
                 * Linear gradients tend to be the most common, where two colors will appear at opposite points of an object and will blend, or transition into each other.
                 */
                Linear,
                /**
                 * A radial gradient will create an effect where the transition between color stops will be in a circular pattern.
                 */
                Radial,
                /**
                 * This effect allows you to create gradients that sweep around the circumference (measured by the maximum width or height of a layer) in a clockwise direction.
                 */
                Angular
            }
        }
        
        export abstract class SharedStyle extends Component<MSSharedStyle> {
            type: Types.SharedStyle;
            /**
             * The unique ID of the Shared Style.
             */
            id: string;
            /**
             * The type of the Shared Style (Layer or Text).
             */
            styleType: StyleType;
            /**
             * The name of the Shared Style.
             */
            name: string;
            /**
             * The Style value that is shared.
             */
            style: Style;
            static StyleType: typeof StyleType;
            /**
             * Create a new Shared Style with a specific name in a specific Document.
             */
            static fromStyle(options:{name:string, style:IStyle, document:Document}):SharedStyle;
            /**
             * Creates a new Style linked to this SharedStyle, ready for inserting in a layer.
             */
            createNewInstance():Style;
            /**
             * Returns an array of all instances of the Shared Style in the document, on all pages.
             */
            getAllInstances():Style[];
            /**
             * Returns an array of all layers with a Style which is an instance of the Shared Style in the document, on all pages.
             */
            getAllInstancesLayers():Layer[];
            /**
             * @return The Library the style was defined in, or undefined if it is a local style.
             */
            getLibrary():Library|undefined;
            /**
             * If a Library has some updates, you can synchronize the local Shared Style with the Library's version and bypass the panel where the user chooses the updates to bring.
             * @return true if it succeeded.
             */
            syncWithLibrary():boolean;
            /**
             * You can unlink a Shared Style from the Library it comes from and make it a local Shared Style instead.
             * @return true if it succeeded.
             */
            unlinkFromLibrary():boolean;
        }
        
        enum StyleType {
            Layer = "Layer",
            Text = "Text"
        }
        
        export function fromNative(nativeObject:MSDocument):Document;
        export function fromNative(nativeObject:MSLayerGroup):Group;
        export function fromNative(nativeObject:MSPage):Page;
        export function fromNative(nativeObject:MSArtboardGroup):Artboard;
        export function fromNative(nativeObject:MSBitmapLayer):Image;
        export function fromNative(nativeObject:MSShapeGroup):Shape;
        export function fromNative(nativeObject:MSShapePathLayer):ShapePath;
        export function fromNative(nativeObject:MSTextLayer):Text;
        export function fromNative(nativeObject:MSSymbolMaster):SymbolMaster;
        export function fromNative(nativeObject:MSSymbolInstance):SymbolInstance;
        export function fromNative(nativeObject:MSAvailableOverride):Override;
        export function fromNative(nativeObject:MSHotspotLayer):HotSpot;
        export function fromNative(nativeObject:MSAssetLibrary):Library;
        export function fromNative(nativeObject:MSStyle):Style;
        export function fromNative(nativeObject:MSSharedStyle):SharedStyle;
        export function fromNative(nativeObject:ImportableNative):ImportableObject;
        /**
         * A utility function to get a wrapped object from a native Sketch model object.
         * @param nativeObject The native Sketch model object to wrap.
         * @return The wrapped object of the right type (you can check is type with wrappedObject.type), eg. a native document will be wrapped as a Document while a native text layer will be wrapped as a Text.
         */
        export function fromNative<T>(nativeObject:T):Component<T>;
        
        
        
        export interface ExportOptions {
            /**
             * this is the path of the folder where all exported files are placed (defaults to "~/Documents/Sketch Exports").
             */
            output?: string;
            /**
             * Comma separated list of formats to export to (png, jpg, svg or pdf) (default to "png").
             */
            formats?: string;
            /**
             * Comma separated list of scales which determine the sizes at which the layers are exported (defaults to "1").
             */
            scales?: string;
            /**
             * Name exported images using their id rather than their name (defaults to false).
             */
            ["use-id-for-name"]?: boolean;
            /**
             * Export only layers that are contained within the group (default to false).
             */
            ["group-contents-only"]?: boolean;
            /**
             * Overwrite existing files (if any) with newly generated ones (defaults to false).
             */
            overwriting?: boolean;
            /**
             * Trim any transparent space around the exported image (defaults to false).
             */
            trimmed?: boolean;
            /**
             * If exporting a PNG, remove metadata such as the colour profile from the exported file (defaults to false).
             */
            ["save-for-web"]?: boolean;
            /**
             * If exporting a SVG, make the output more compact (defaults to false).
             */
            compact?: boolean;
            /**
             * If exporting a SVG, include extra attributes (defaults to false).
             */
            ["include-namespaces"]?: boolean;
            /**
             * If exporting a JPG, export a progressive JPEG (only used when exporting to jpeg) (defaults to false).
             */
            progressive?: boolean;
            /**
             * If exporting a JPG, the compression level to use fo jpeg (with 0 being the completely compressed, 1.0 no compression) (defaults to 1.0).
             */
            compression?: boolean;
        }
    }
    export = dom;
}

declare module "sketch/ui" {
    import dom = require("sketch/dom");
    /**
     * A set of functions to show some user interfaces. The set is small on purpose. Any more complex UI should be provided by third party libraries and doesn’t need to be in the core.
     */
    namespace ui {
        /**
         * Show a small, temporary, message to the user. The message appears at the bottom of the selected document, and is visible for a short period of time. It should consist of a single line of text.
         * @param text The message to show.
         * @param document The document to show the message into.
         */
        export function message(text:string, document?:dom.Document):void;
        /**
         * Show an alert with a custom title and message. The alert is modal, so it will stay around until the user dismisses it by pressing the OK button.
         * @param title The title of the alert.
         * @param text The text of the message.
         */
        export function alert(title:string, text:string):void;
        /**
         * Shows a simple input sheet which displays a message, and asks for a single string input.
         * @param message The prompt message to show.
         * @param initialValue The initial value of the input string.
         * @return The string that the user input, or "null" (String) if the user clicked 'Cancel'.
         */
        export function getStringFromUser(message:string, initialValue?:string):string;
        /**
         * Shows an input sheet which displays a popup with a series of options, from which the user is asked to choose.
         * @param message The prompt message to show.
         * @param options An array of option items.
         * @param selectedIndex The index of the item to select initially.
         * @return An array with a response code, the selected index and ok. The code will be one of NSAlertFirstButtonReturn or NSAlertSecondButtonReturn. The selection will be the integer index of the selected item. ok is the boolean code === NSAlertFirstButtonReturn.
         */
        export function getSelectionFromUser(message:string, options:string[], selectedIndex?:number):[number, number, boolean];
    }
    export = ui;
}

declare module "sketch/async" {
    namespace async {
        export abstract class Fiber {
            /**
             * To end a fiber, call fiber.cleanup(). This will tell Sketch that it can garbage collect the script if no other fiber is running.
             */
            cleanup():void;
            /**
             * You can run a function when the fiber is about to be cleaned up by setting a callback
             */
            onCleanup(cb:()=>void):void;
        }
        
        /**
         * By default, Sketch cleans up your script as soon as its callstack is empty. So if you schedule an asynchronous task, chances are that when the task returns, your script will be cleaned up and it will crash Sketch.
         * A fiber is a way to keep track of a asynchronous task. The script will stay alive as long as at least one fiber is running.
         */
        export function createFiber(): Fiber;
    }
    export = async;
}

declare module "sketch/settings" {
    import dom = require("sketch/dom");
    import data = require("sketch/data-supplier");
    /**
     * A set of functions to handle user settings. The settings are persisted when the user closes Sketch.
     */
    namespace settings {
        /**
         * Return the value of a setting scoped to your plugin for a given key.
         * @param key The setting to look up.
         * @return The setting that was stored for the given key. undefined if there was nothing
         */
        export function settingForKey(key:string):any;
        /**
         * Store a value of a setting scoped to your plugin for a given key.
         * @param key The setting to set.
         * @param value The value to set it to.
         */
        export function setSettingForKey(key:string, value:any):void;
        /**
         * Return the value of a Sketch setting for a given key.
         * @param key The setting to look up.
         * @return The setting that was stored for the given key. undefined if there was nothing
         */
        export function globalSettingForKey(key:string):any;
        /**
         * Store a value of a Sketch setting for a given key.
         * @param key The setting to set.
         * @param value The value to set it to.
         */
        export function setGlobalSettingForKey(key:string, value:any):void;
        /**
         * Return the value of a setting for a given key on a specific layer.
         * @param layer The layer on which a setting is stored.
         * @param key The setting to look up.
         * @return The setting that was stored for the given key. undefined if there was nothing
         */
        export function layerSettingForKey(layer:dom.Layer|dom.Override|data.DataOverride, key:string):any;
        /**
         * Store a value of a setting for a given key on a specific layer.
         * @param layer The layer on which the setting is set.
         * @param key The setting to set.
         * @param value The value to set it to.
         */
        export function setLayerSettingForKey(layer:dom.Layer|dom.Override|data.DataOverride, key:string, value:any):void;
        /**
         * Return the value of a setting for a given key on a specific document
         * @param document The document on which a setting is stored.
         * @param key The setting to look up.
         * @return The setting that was stored for the given key. undefined if there was nothing
         */
        export function documentSettingForKey(document:dom.Document, key:string):any;
        /**
         * Store a value of a setting for a given key on a specific document.
         * @param document The document on which the setting is set.
         * @param key The setting to set.
         * @param value The value to set it to.
         */
        export function setDocumentSettingForKey(document:dom.Document, key:string, value:any):void;
    }
    export = settings;
}

declare module "sketch/data-supplier" {
    import dom = require("sketch/dom");
    namespace data {
        /**
         * Register some data with a name and a key.
         * @param type The data type. Currently public.text or public.image are the only allowed values.
         * @param name The data name, will be used as the menu item title for the data.
         * @param action The name of the Action that will be dispatched when the user requests some data. See supplyData.
         */
        export function registerDataSupplier(type:'public.text'|'public.image', name:string, action:string):void;
        /**
         * The argument of the function called when you need to supply some data contains some very important information.
         */
        export interface DataSupplierContext extends SketchContext {
            data: {
                /**
                 * The number of data you need to supply
                 */
                count: number;
                /**
                 * A unique key to identify the supply request. You need to pass it to the supply method untouched.
                 */
                key: string;
                /**
                 * The array of native model objects for which we want some data. It can be either a native Text, a native Image or a native DataOverride (a special object when the data is for an Override)
                 */
                items: (dom.Text|dom.Image|DataOverride)[];
            }
        }
        /**
         * A special object passed in the context of the action to supply data when the item is an Override.
         */
        export abstract class DataOverride extends dom.Component<MSDataOverride> {
            /**
             * The name of the override.
             */
            readonly id: string;
            /**
             * The override whose value will replaced by the supplied data.
             */
            readonly override: dom.Override;
            /**
             * The symbol instance that the override is on that will have the data replaced.
             */
            readonly symbolInstance: dom.SymbolInstance
        }
        /**
         * When the plugin providing the dynamic data has finished generating the data (could be an asynchronous operation), it will call this function with the data key and the data.
         * @param key Should be equal to context.data.key
         * @param data The list of values to provide. In case of public.image, the string is the path to the image. It needs to have a length equal to the context.data.count
         */
        export function supplyData(key:string, data:string[]):void;
        /**
         * When the plugin providing the dynamic data has finished generating the datum (could be an asynchronous operation), it will call this function with the data key and the datum.
         * @param key Should be equal to context.data.key
         * @param datum The value to provide. In case of public.image, the string is the path to the image. It needs to have a length equal to the context.data.count
         * @param index The index of the item you are providing a value for.
         */
        export function supplyDataAtIndex(key:string, datum:string, index:number):void;
        /**
         * When registering something, it is good practice to clean up after it. This is especially useful if when your plugin will be updated: the Shutdown Action will be called before the Startup will. It gives you the opportunity to update your handler cleanly.
         */
        export function deregisterDataSuppliers():void;
    }
    export = data;
}

declare module "sketch" {
    import dom = require("sketch/dom");
    import ui = require("sketch/ui");
    import settings = require("sketch/settings");
    import async = require("sketch/async");
    import data = require("sketch/data-supplier");
    class sketch {
        static export: typeof dom.export;
    }
    namespace sketch {
        // it'd be really nice if we could export * from dom, but https://github.com/Microsoft/TypeScript/issues/4336
        export import Types = dom.Types;
        export import getSelectedDocument = dom.getSelectedDocument;
        export import getDocuments = dom.getDocuments;
        export import Document = dom.Document;
        export import Layer = dom.Layer;
        export import LayerPropertyType = dom.LayerPropertyType;
        export import LayersPropertyType = dom.LayersPropertyType;
        export import GroupProperties = dom.GroupProperties;
        export import Group = dom.Group;
        export import PageProperties = dom.PageProperties;
        export import Page = dom.Page;
        export import ArtboardProperties = dom.ArtboardProperties;
        export import Artboard = dom.Artboard;
        export import ImageProperties = dom.ImageProperties;
        export import Image = dom.Image;
        export import ImageData = dom.ImageData;
        export import ShapeProperties = dom.ShapeProperties;
        export import Shape = dom.Shape;
        export import ShapePath = dom.ShapePath;
        export import TextProperties = dom.TextProperties;
        export import Text = dom.Text;
        export import TextFragment = dom.TextFragment;
        export import SymbolMasterProperties = dom.SymbolMasterProperties;
        export import SymbolMaster = dom.SymbolMaster;
        export import SymbolInstanceProperties = dom.SymbolInstanceProperties;
        export import SymbolInstance = dom.SymbolInstance;
        export import Override = dom.Override;
        export import FlowProperty = dom.FlowProperty;
        export import Flow = dom.Flow;
        export import HotSpotProperties = dom.HotSpotProperties;
        export import HotSpot = dom.HotSpot;
        export import Library = dom.Library;
        export import ImportableObject = dom.ImportableObject;
        export import Selection = dom.Selection;
        export import Rectangle = dom.Rectangle;
        export import IStyle = dom.IStyle;
        export import Blur = dom.Blur;
        export import Fill = dom.Fill;
        export import Border = dom.Border;
        export import BorderOptions = dom.BorderOptions;
        export import Shadow = dom.Shadow;
        export import Gradient = dom.Gradient;
        export import GradientStop = dom.GradientStop;
        export import Style = dom.Style;
        export import SharedStyle = dom.SharedStyle;
        export import fromNative = dom.fromNative;
        export import ExportOptions = dom.ExportOptions;
        
        // other modules that are exposed as sub-modules
        export import UI = ui;
        
        export import Settings = settings;
        
        export import Async = async;
        
        export import DataSupplier = data;
    }
    export = sketch;
}