declare var Promise: any;
declare var resolve: Function;
interface Document {
    msFullscreenElement: Element;
    msExitFullscreen: Function;
    mozFullScreenElement: Element;
    mozCancelFullScreen: Function;
    SyiroFullscreenElement: Element;
}
interface Element {
    msRequestFullscreen: Function;
    mozRequestFullScreen: Function;
}
interface AnimationOptions extends Object {
    animation: "fade-in" | "fade-out" | "slide";
    postAnimationFunc?: Function;
}
interface ComponentObject extends Object {
    id: string;
    type: string;
}
interface LinkPropertiesObject extends Object {
    link: string;
    title: string;
}
interface MutationObserver {
    observe(target: HTMLElement, options: MutationObserverInit): void;
}
interface Navigator {
    doNotTrack: string;
}
interface Node {
    appendChild(newChild: (Element | HTMLElement)): Node;
    insertBefore(newChild: (Element | HTMLElement), refChild?: (Element | HTMLElement | Node)): Node;
    removeChild(newChild: (Element | HTMLElement)): Node;
}
interface Screen {
    orientation: any;
    mozOrientation: any;
    onorientationchange: any;
    onmozorientationchange: any;
}
interface MediaPlayerPropertiesObject extends Object {
    artist?: string;
    title?: string;
    generateContentInfo?: boolean;
    height?: number;
    width?: number;
    art?: string;
    ForceLiveUX?: boolean;
    menu?: ComponentObject;
    sources: Array<string>;
    type?: "audio" | "video";
    UsingExternalLibrary?: boolean;
}
declare namespace syiro.data {
    var storage: Object;
    function Manage(modificationType: string, keyList: string, data?: any): any;
    function Read(keyList: string): any;
    function Write(keyList: string, data: any): any;
    function Delete(keyList: string): any;
}
declare namespace syiro.animation {
    function Animate(componentProvided: any, properties: AnimationOptions): void;
    function Reset(componentProvided: any): void;
    function FadeIn(component: any, postAnimationFunction?: Function): void;
    function FadeOut(component: any, postAnimationFunction?: Function): void;
    function Slide(component: any, postAnimationFunction?: Function): void;
}
declare namespace syiro.events {
    var Strings: Object;
    function Handler(): void;
    function Trigger(eventType: string, componentProvided: any, eventData?: Event): void;
    function Add(listeners: any, componentProvided: any, listenerCallback: Function): boolean;
    function Remove(listeners: any, componentProvided: any, specFunc?: Function): boolean;
}
declare namespace syiro.utilities {
    function ElementCreator(type: string, attributes: Object): any;
    function Run(func: Function): boolean;
    function SanitizeHTML(content: any): any;
    function SecondsToTimeFormat(seconds: number): Object;
    function TypeOfThing(thing: any, checkAgainstType?: string): any;
}
declare namespace syiro.style {
    function Get(component: any, property: string): string;
    function GetPropertyCamelCased(property: string): string;
    function LoadColors(): void;
    function Set(component: any, property: string, value: string): boolean;
}
declare namespace syiro.render {
    function Position(positioningList: string | Array<string>, componentObject: any, relativeComponentObject: any): boolean;
}
declare namespace syiro.component {
    var lastUniqueIds: Object;
    function Fetch(component: any): any;
    function FetchComponentObject(element: any): ComponentObject;
    function FetchDimensionsAndPosition(component: any): ClientRect;
    function FetchLinkedListComponentObject(component: ComponentObject): ComponentObject;
    function IdGen(type: string): string;
    function IsComponentObject(component: any): boolean;
    function Update(componentId: string, componentElement: Element): void;
    function Add(appendOrPrepend: string, parentProvided: any, childProvided: any): boolean;
    function Remove(componentsToRemove: any): void;
}
declare module syiro.mediaplayer {
    function New(properties: MediaPlayerPropertiesObject): ComponentObject;
    function Configure(component: ComponentObject): void;
    function DurationChange(component: ComponentObject): void;
    function FetchInnerContentElement(component: ComponentObject): HTMLMediaElement;
    function FetchSources(component: ComponentObject): Array<Object>;
    function GenerateSources(type: string, sources: Array<string>): Array<HTMLElement>;
    function GetPlayerLengthInfo(component: ComponentObject): Object;
    function IsPlayable(component: ComponentObject, returnIsStreamble?: boolean): (string | boolean);
    function IsPlaying(component: ComponentObject): boolean;
    function IsStreamable(component: ComponentObject): boolean;
    function PlayOrPause(component: ComponentObject, forcePlayOrButton: any): void;
    function Reset(component: ComponentObject): void;
    function SetSources(component: ComponentObject, sources: any): void;
    function SetTime(component: ComponentObject, setting: any): void;
    function SetVolume(component: ComponentObject, volume: number, fromEvent?: string): void;
    function ToggleFullscreen(component: ComponentObject): void;
    function ToggleMenuDialog(component: ComponentObject): void;
}
declare module syiro.mediacontrol {
    function New(properties: MediaPlayerPropertiesObject): ComponentObject;
    function ShowVolumeSlider(mediaControlComponent: ComponentObject, volumeButtonComponent: ComponentObject): void;
    function TimeLabelUpdater(component: ComponentObject, timePart: number, value: any): void;
    function Toggle(component: ComponentObject, forceShow?: boolean): void;
}
declare namespace syiro.init {
    function Parser(componentElement: Element): void;
    function createContentOverlay(purpose: string): Element;
    function Buttongroup(component: ComponentObject): void;
    function Grid(component: ComponentObject): void;
    function List(component: ComponentObject): void;
    function MediaPlayer(component: ComponentObject): void;
    function MediaControl(componentObject: ComponentObject, mediaControlComponentObject: ComponentObject): void;
    function Picture(component: ComponentObject): void;
    function Searchbox(component: ComponentObject): void;
    function Sidepane(component: ComponentObject): void;
    function Toast(component: ComponentObject): void;
}
interface GridPropertiesObject extends Object {
    columns?: number;
    items: Array<GridItemPropertiesObject>;
}
interface GridItemPropertiesObject extends Object {
    html?: any;
}
declare module syiro.grid {
    function New(properties: GridPropertiesObject): ComponentObject;
    function Scale(component: ComponentObject): void;
}
declare module syiro.griditem {
    function New(properties: GridItemPropertiesObject): ComponentObject;
}
interface NavbarPropertiesObject extends Object {
    content?: string;
    logo?: any;
    fixed?: boolean;
    items: Array<any>;
    position?: "top" | "bottom";
}
declare namespace syiro.navbar {
    function New(properties: NavbarPropertiesObject): ComponentObject;
    function AddLink(append: string, component: ComponentObject, elementOrProperties: any): boolean;
    function RemoveLink(component: ComponentObject, elementOrProperties: any): boolean;
    function SetLogo(component: ComponentObject, content: string): boolean;
    function SetLabel(component: ComponentObject, content: string): boolean;
}
interface ListPropertiesObject extends Object {
    header?: string;
    items: Array<any>;
}
interface ListItemPropertiesObject extends Object {
    control?: ComponentObject;
    html?: any;
    image?: string;
    label?: string;
    link?: LinkPropertiesObject;
}
declare namespace syiro.list {
    function New(properties: ListPropertiesObject): ComponentObject;
    function SetHeader(component: ComponentObject, content: any): void;
    function Toggle(component: any): void;
    var AddItem: typeof component.Add;
    var RemoveItem: typeof component.Remove;
}
declare namespace syiro.listitem {
    function New(properties: ListItemPropertiesObject): ComponentObject;
    function SetControl(component: ComponentObject, control: ComponentObject): boolean;
    function SetImage(component: ComponentObject, content: string): boolean;
    function SetLabel(component: ComponentObject, content: string): boolean;
    function SetLink(component: ComponentObject, properties: any): boolean;
}
interface PicturePropertiesObject extends Object {
    default: string;
    sources?: QuerySource[];
    height?: string | number;
    width?: string | number;
}
interface QuerySource {
    mediaQuery: string;
    source: string;
}
declare namespace syiro.picture {
    function New(properties: PicturePropertiesObject): ComponentObject;
    function Detect(component: ComponentObject): void;
    function AddQuerySource(component: ComponentObject, querySource: QuerySource): void;
    function RemoveQuerySource(component: ComponentObject, querySource: QuerySource): void;
}
interface SearchboxPropertiesObject extends Object {
    content?: string;
    DisableInputTrigger?: boolean;
    handler?: Function;
    listItemHandler?: Function;
    preseed?: Array<string>;
    suggestions?: boolean;
}
declare namespace syiro.searchbox {
    function New(properties: SearchboxPropertiesObject): ComponentObject;
    function Suggestions(...args: any[]): void;
    function SetText(component: ComponentObject, content: any): void;
}
interface SidepanePropertiesObject extends Object {
    items?: Array<any>;
    logo?: any;
    searchbox?: ComponentObject;
}
declare namespace syiro.sidepane {
    function New(properties: SidepanePropertiesObject): ComponentObject;
    function GestureInit(): void;
    function Drag(): void;
    function Release(): void;
    function Toggle(component: ComponentObject, eventData?: any): void;
}
interface ToastPropertiesObject extends Object {
    buttons?: Array<ToastButtonPropertiesObject>;
    message: string;
    title?: string;
}
interface ToastButtonPropertiesObject extends Object {
    action?: "affirm" | "deny";
    content?: string;
    function?: Function;
}
declare namespace syiro.toast {
    function New(properties: ToastPropertiesObject): ComponentObject;
    function Clear(component: ComponentObject): void;
    function ClearAll(): void;
    function Toggle(component: ComponentObject, action?: string): void;
}
interface ButtonPropertiesObject extends Object {
    content?: string;
    default?: boolean;
    icon?: string;
    image?: string;
    items?: Array<any>;
    list?: ComponentObject;
    position?: Array<string>;
    type?: string;
}
declare namespace syiro.button {
    function New(properties: ButtonPropertiesObject): ComponentObject;
    function SetIcon(component: ComponentObject, content: string): boolean;
    function SetImage(component: ComponentObject, content: string): boolean;
    function SetText(component: ComponentObject, content: string): boolean;
    function Toggle(component: ComponentObject, active?: boolean): void;
}
declare namespace syiro.buttongroup {
    function New(properties: Object): ComponentObject;
    function CalculateInnerButtonWidth(componentProvided: any): Element;
    function Toggle(buttonComponent: ComponentObject): void;
}
declare namespace syiro.device {
    var DoNotTrack: boolean;
    var HasCryptography: boolean;
    var HasGeolocation: boolean;
    var HasLocalStorage: boolean;
    var IsOnline: boolean;
    var OperatingSystem: string;
    var SupportsMutationObserver: boolean;
    var SupportsRequestAnimationFrame: boolean;
    var SupportsTouch: boolean;
    var IsSubHD: boolean;
    var IsHD: boolean;
    var IsFullHDOrAbove: boolean;
    var Orientation: string;
    var OrientationObject: any;
    var height: number;
    var width: number;
    function Detect(): void;
    function FetchOperatingSystem(): string;
    function FetchScreenDetails(): void;
    function FetchScreenOrientation(): string;
}
declare namespace syiro {
    var page: Element;
    var backgroundColor: string;
    var primaryColor: string;
    var secondaryColor: string;
    var legacyDimensionsDetection: boolean;
    function Init(): void;
    var Fetch: typeof component.Fetch;
    var FetchComponentObject: typeof component.FetchComponentObject;
    var FetchDimensionsAndPosition: typeof component.FetchDimensionsAndPosition;
    var FetchLinkedListComponentObject: typeof component.FetchLinkedListComponentObject;
    var IsComponentObject: typeof component.IsComponentObject;
    var Add: typeof component.Add;
    var Remove: typeof component.Remove;
    var Position: typeof render.Position;
}
