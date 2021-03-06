/*
	This is a namespace for Syiro utilities that are commonly used throughout Syiro's core code and may be useful to others.
*/

namespace syiro.utilities {

	// ElementCreator
	// Create an Element, taking an optional componentId, componentType or the desired element tag name and attributes
	export function ElementCreator(type : string, attributes : Object) {
		if ((typeof type == "string") && (typeof attributes == "object")){
			let generatedElement : any = document.createElement(type); // Define componentElement as the generated HTMLElement based on the type supplied by argument 0

			for (let attributeKey in attributes){ // For each attributeKey in attributes
				let attributeValue = attributes[attributeKey]; // Get the attribute value based on key
				let typeOfValue : string = syiro.utilities.TypeOfThing(attributeValue); // Get the type of the value

				if ((typeOfValue !== "undefined") && (typeOfValue !== "null")){ // If the value is not undefined or null
					attributeValue = syiro.utilities.SanitizeHTML(attributeValue); // Sanitize the value

					if (attributeKey !== "content"){ // If the attributeKey is not content
						if (attributeKey == "content-attr"){ // If the attributeKey is "content-attr" (used in meta tag creation)
							attributeKey = "content"; // Set to content instead.
						}

						generatedElement.setAttribute(attributeKey, attributeValue); // Set the attribute to a sanitized form of the attributeValue
					} else { // If the attributeKey IS "content"
						if (typeOfValue == "string"){ // If the attributeValue we passed is a string
							generatedElement.innerHTML = attributeValue; // Set generatedElement innerHTML to sanitizedContent
						} else if (typeOfValue == "Element"){ // If this is an Element
							generatedElement.appendChild(attributeValue); // Append the sanitizedContent
						}
					}
				}
			}

			return generatedElement; // Return the componentElement
		}
	}

	// Run
	// Run a function using promises and requestAnimationFrames.
	// Returns boolean if function was executed in the *most* optimized state.
	export function Run(func : Function) : boolean {
		let runOptimized : boolean = false;

		let runWithAnimationFrame : Function = function(func : any){ // Define runWithAnimationFrame as a function for checking and attempt to run the func provided with requestAnimationFrame
			if (syiro.device.SupportsRequestAnimationFrame){ // If we support requestAnimationFrame
				requestAnimationFrame(func); // Run via requestAnimationFrame
			} else { // If we do not support requestAnimationFrame
				func(); // Directly call func
			}
		}.bind(this, func);

		if (typeof Promise == "function"){ // If Promises are supported
			new Promise(runWithAnimationFrame);
			runOptimized = true;
		} else {
			runWithAnimationFrame(); // Immediately run without Promise
		}

		return runOptimized;
	}

	// Sanitize HTML
	// Removes script tags from HTML
	export function SanitizeHTML(content : any){
		let updatedContent : any = false; // Define updatedContent as false (failure) by default

		if (typeof content == "string"){ // If the content we passed is a string
			updatedContent = content.replace(/<*[^]script*>/g, ""); // Replace all <script> and </script> tags
		} else if (syiro.utilities.TypeOfThing(content, "Element")){ // If this is an Element
			if (content.tagName.toLowerCase() !== "script"){ // If we are not including a singular script tag
				let innerScriptElements = content.querySelectorAll("script"); // Get all inner JavaScript tags

				if (innerScriptElements.length !== 0){ // If there are inner JavaScript tags
					for (let innerScriptElementIndex in innerScriptElements){ // For each inner JavaScript tag
						let innerScriptElement = innerScriptElements[innerScriptElementIndex];

						if (syiro.utilities.TypeOfThing(innerScriptElement, "Element")){ // IF this is an Element
							innerScriptElement.parentElement.removeChild(innerScriptElement); // Remove the script tag
						}
					}
				}
			}

			updatedContent = content; // Set the updatedContent to the HTML Element
		}

		return updatedContent; // Return the updatedContent
	}

	// SecondsToTimeFormat
	// Calculates hours, minutes, and seconds based on seconds provided, returning them in an Object
	export function SecondsToTimeFormat(seconds : number) : Object {
		let timeObject : Object = {};

		if (seconds >= 3600){ // If there is more than 1 hour in "seconds"
			timeObject["hours"] = Math.floor(seconds / 3600); // Divide the seconds by 1 hour to get the number of hours (rounded down)
			timeObject["minutes"] = Math.floor((seconds - (3600 * timeObject["hours"])) / 60); // Set minutes = the seconds minus by 3600 (1 hour) times number of hours, divided by 60 to get total minutes
			timeObject["seconds"] = Math.floor((seconds - (3600 * timeObject["hours"])) - (60 * timeObject["minutes"])); // Set seconds = seconds minus by 3600 (1 hour) times number of hours, minus 60 * number of minutes
		} else if ((seconds >= 60) && (seconds < 3600)){ // If there is greater than 1 minute in seconds, but less than 1 hour
			timeObject["minutes"] = Math.floor(seconds / 60); // Set number = minutes by dividing minutes by 60 and rounding down
			timeObject["seconds"] = Math.floor(seconds - (timeObject["minutes"] * 60)); // Set seconds = seconds divided by minutes times 60
		} else { // If there is less than 1 minute of content
			timeObject["minutes"] = 0; // Set minutes to zero
			timeObject["seconds"] = seconds; // Round down the seconds
		}

		timeObject["seconds"] = Math.floor(timeObject["seconds"]); // Seconds should always round down

		for (let timeObjectKey in timeObject){ // For each key in the timeObject
			let timeObjectValue = timeObject[timeObjectKey]; // Set timeObjectValue as the value based on key
			let timeObjectValueString = timeObjectValue.toString(); // Convert the int to string

			if (timeObjectValue < 10){ // If we are dealing with an int less than 10
				timeObjectValueString = "0" + timeObjectValueString; // Prepend a 0
			}

			timeObject[timeObjectKey] = timeObjectValueString; // Set the key/val to the stringified and parsed int
		}

		return timeObject;
	}

	// TypeOfThing
	// Get more clear type information about what is provided
	export function TypeOfThing(thing : any, checkAgainstType ?: string) : any {
		let thingType : any = (typeof thing); // Initially set thingType as the typeof

		if ((thingType !== "undefined") && (thing !== null)){ // If the thing provided is not undefined
			if ((thingType == "object") && (typeof thing.nodeType == "undefined")){ // If the thing is an Object and doesn't have a nodeType
				if ((typeof thing.id !== "undefined") && (typeof thing.type !== "undefined")){ // If this Object has an id and type
					thingType = "ComponentObject"; // Define thingType as Component Object
				} else if ((typeof thing["link"] !== "undefined") && (typeof thing["title"] !== "undefined")){ // If this Object has href and title properties
					thingType = "LinkPropertiesObject"; // Define as Link Properties Object
				} else if (Array.isArray(thing) == true){ // If the thing is an Array
					thingType = "Array"; // Set as an Array
				} else {
					thingType = thing.toString().replace("[object ", "").replace("]", ""); // Remove the surrounding [object and ]
				}
			} else if (typeof thing.nodeType !== "undefined"){ // If this has a nodeType (it is some sort of Element)
				if (thing.nodeType !== 9){ // If the nodeType is not 9
					thingType = "Element"; // Assume Element for now
				} else if (thing.nodeType ==  9){  // If the nodeType is 9
					thingType = "Document"; // Set thingType to Document
				}
			}
		} else if ((thingType == "object") && (thing == null)){ // If null was passed
			thingType = "null"; // Change thingType to null
		}

		if (typeof checkAgainstType == "string"){ // If checkAgainstType is defined
			thingType = (checkAgainstType == thingType); // Define thingType as the boolean returned by the == check
		}

		return thingType;
	}
}
