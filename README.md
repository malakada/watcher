# Watcher

This is still in progress and not ready for use right now.

Watcher is a mutation detection library. It attempts to use the browser's `MutationObserver` if available, if that's not available it'll attempt to use a mutation event listener, and if that's not possible it'll attempt to manually watch for changes. Mutation observers are preferred because they're less intensive on the browser, followed by mutation event listeners, and lastly manually watching for changes. Manually watching for changes is intensive, and may crash the browser.

This allows you to react to changes in the HTML DOM of your webpage.

It should be noted that this library won't be useful for very long, as Mutation Events have been deprecated and support for them is slowly dropping. Until then, maybe this will be useful for you.

`MutationObserver` listens for the following types of mutations:

* attribute mutations (attribute)
* character data mutations (characterData)
* mutations within the tree of nodes for an element (childList)

## Setup

You can pass an object into Watcher when you first `init` it. The object can take the following properties:

|Name|Type|What it do|Default|
|---|---|---|---|
|`showLogs`|boolean|Enables `console.log()` logging.|`false`|
|`onInsert`|function|Callback to run when the HTML mutation is a node insertion.|`function(){}`|
|`onRemove`|function|Callback to run when the HTML mutation is a node removal.|`function(){}`|
|`onAlter`|function|Callback to run when the HTML mutation is an alteration of either the attributes or the character data within a node.|`function(){}`|
|`intervalWatcher`|function|Function to run during every interval check. (Used for final manual watch only.)|`function(){}`|
|`observerConfig`|`object`|Configuration object that `MutationObserver` expects. Defaults are provided.|See below.|

`observerConfig` properties:
|Name|What it do|Default|
|---|---|---|
|`attributes`||`true`|
|`childList`||`true`|
|`characterData`||`true`|
|`subtree`||`true`|

## Usage

The `onInsert`, `onRemove`, and `onAlter` user-defined methods within the initial config object will all recieve back a `mutation` object. This is just directly piped from the `MutationObserver` object itself. There's a lot of information on this object that can be used for your reaction. If a `MutationObserver` is not being used by the library because it is unavailable to the browser, every attempt has been made to send an object back as identical as possible to `MutationObserver`'s `mutation` object so that you only need to react to one type of data structure.

If you need to disconnect Watch, run `Watcher.disconnect()`.

### Some `mutation` object properties

|Name|Type|What it do|
|---|---|---|
|`type`|`string`|Indicates what type of mutation occurred. Possible values: `attribute`, `characterData`, `childList`|
|`target`|`node`|Target node for what was affected.|
|`addedNodes`|`nodeList`|Returns what nodes were added, if any.|
|`removedNodes`|`nodeList`|Returns which nodes were removed, if any.|
|`previousSibling`|`node`|Returns the previous sibling of the added or removed nodes, or `null`.|
|`nextSibling`|`node`|Returns the next sibling of the added or removed nodes, or `null`.|
|`attributeName`|`string`|Local name of the changed attribute, or `null`.|
|`attributeNamespace`|`string`|Namespace of the changed attribute, or `null`.|
|`oldValue`|`string`|Previous value before mutation occurred, unless the `type` is `childList` (then it returns `null`).|

## Troubleshooting/Debugging

In addition to setting `config.showLogs` to true to enable console logging, you can also call `Watcher.talk()` which will output some basic information about its state:

|Name|What it mean|
|---|---|
|`config`|An object of all of the config options currently set for Watcher.|
|`using`|What type of mutation watching Watcher is using.|
|`observer`|The observer object Watcher is using.|
|`interval`|The interval watcher object Watcher is using.|

## Useful links

* [David Walsh: Mutation Observer API](https://davidwalsh.name/mutationobserver-api)
* [Mozilla's blog: DOM MutationObserver](https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/)
* [MDN: MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
* [MDN: Mutation Events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Mutation_events)
