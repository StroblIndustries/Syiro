/*
	This is the namespace for Syiro List component and it's sub-component, List Item
*/

/// <reference path="../interfaces/list.ts" />
/// <reference path="../component.ts" />
/// <reference path="../style.ts" />
/// <reference path="../utilities.ts" />

namespace syiro.list {

	// New
	// Create a List
	export function New(properties : ListPropertiesObject) : ComponentObject { // Generate a List Component and return a Component Object
		let componentId : string = syiro.component.IdGen("list"); // Generate a component Id
		let componentElement : HTMLElement = syiro.utilities.ElementCreator("div", {  "data-syiro-component" : "list", "data-syiro-component-id" : componentId, "aria-live" : "polite", "id" : componentId, "role" : "listbox" }); // Generate a List Element with an ID and listbox role for ARIA purposes

		if ((syiro.utilities.TypeOfThing(properties.items, "Array")) && (properties.items.length > 0)){ // If we are adding sub-Lists or List Items
			if (syiro.utilities.TypeOfThing(properties.header, "string")){ // If a List Header is defined
				let listHeaderElement : HTMLElement = syiro.utilities.ElementCreator("div", { "data-syiro-minor-component" : "list-header", "content" : properties.header}); // Generate the listHeaderElement
				componentElement.appendChild(listHeaderElement); // Add the listHeaderElement
			}

			// #region Sub-List and List Item Adding

			let listContentContainer : HTMLElement = syiro.utilities.ElementCreator("div", { "data-syiro-minor-component" : "list-content" }); // Create the listContent container

			for (let individualItem of properties.items){ // For each list item in navigationItems Object array
				let individualItemComponentObject : ComponentObject = individualItem;
				let typeOfIndividualItem : string = syiro.utilities.TypeOfThing(individualItem); // Get the type of the individualItem

				if (typeOfIndividualItem == "Object"){ // If this is an Object
					let typeOfHeader : string = syiro.utilities.TypeOfThing(individualItem.header); // Get the type of the header key/val
					let typeOfItems : string = syiro.utilities.TypeOfThing(individualItem.item); // Get the type of items /key/val

					if ((typeOfHeader == "string") && (typeOfItems == "Array")){ // If this is a List (with the necessary List Header and List Items properties)
						individualItemComponentObject = syiro.list.New(individualItem); // Create a List based on the individualItem
					} else { // If this is a List Item
						individualItemComponentObject = syiro.listitem.New(individualItem); // Generate a List Item based on the individualItem
					}
				}

				if (syiro.utilities.TypeOfThing(individualItemComponentObject, "ComponentObject")){ // If we have a valid Component Object
					listContentContainer.appendChild(syiro.component.Fetch(individualItemComponentObject)); // Append the List or List Item component to the List
				}
			}

			componentElement.appendChild(listContentContainer); // Append the List Content Container

			// #endregion
		}

		syiro.data.Write(componentId + "->HTMLElement", componentElement); // Add the componentElement to the HTMLElement key/val of the component
		return { "id" : componentId, "type" : "list" }; // Return a Component Object
	}

	// SetHeader
	// Set the Header of a List
	export function SetHeader(component : ComponentObject, content : any){
		let componentElement : Element = syiro.component.Fetch(component); // Fetch the componentElement of the List
		let listHeader : any = componentElement.querySelector('div[data-syiro-minor-component="list-header"]'); // Fetch the List's Header
		let typeOfContent : string = syiro.utilities.TypeOfThing(content); // Get the type of the content

		if ((typeOfContent == "string") || (typeOfContent == "Element")){ // If the content is a string or Element
			content = syiro.utilities.SanitizeHTML(content); // Sanitize the content
			
			if (typeOfContent == "Element"){ // If the content is an Element
				content = content.outerHTML; // Change to being an HTML string
			}
			
			if (content !== ""){ // If the content is not an empty string
				if (listHeader == null){ // If the listHeader does not exist
					listHeader = syiro.utilities.ElementCreator("div", { "data-syiro-minor-component" : "list-header" }); // Generate the listHeader
					componentElement.insertBefore(listHeader, componentElement.firstChild); // Prepend the listHeader
				}
				
				listHeader.innerHTML = content; // Set innerHTML to the content
			} else if ((content == "") && (listHeader !== null)){ // If we are removing content from a valid listHeader
				componentElement.removeChild(listHeader); // Remove the listHeader
			}

			syiro.component.Update(component.id, componentElement); // Update if necessary
		}
	}

	// Toggle
	// Toggle visibility of List's inner content container
	export function Toggle(component : any){
		let componentElement : Element = syiro.component.Fetch(component); // Fetch the componentElement of the component provided

		if (syiro.utilities.TypeOfThing(componentElement, "Element")){ // If componentElement is an Element
			if (componentElement.parentElement.getAttribute("data-syiro-minor-component") == "list-content"){ // If this is indeed a nested List
				let listHeader : Element = componentElement.querySelector('div[data-syiro-minor-component="list-header"]'); // Fetch the List's Header
				let listContent : Element = componentElement.querySelector('div[data-syiro-minor-component="list-content"]'); // Fetch the List's Content Container

				if (syiro.style.Get(listContent, "display") !== "block"){ // If the listContent is currently hidden
					listHeader.setAttribute("active", ""); // Set listHeader "active" attribute to flip the Dropdown icon
					syiro.style.Set(listContent, "display", "block"); // Show the List content
				} else { // If the listContent is currently showing
					listHeader.removeAttribute("active"); // Remove the active attribute to unflip the Dropdown icon
					syiro.style.Set(listContent, "display", ""); // Hide the List content
				}
			}
		}
	}

	export var AddItem = syiro.component.Add; // Meta-function for adding a List Item component to a List component
	export var RemoveItem = syiro.component.Remove; // Meta-function for removing a List Item component from a List Item component
}

// #region List Item Component

namespace syiro.listitem {

	// New
	// Create a List Item
	export function New(properties : ListItemPropertiesObject) : ComponentObject { // Generate a ListItem Component and return a Component Object
		let componentId : string = syiro.component.IdGen("list-item"); // Generate a component Id
		let componentElement : HTMLElement = syiro.utilities.ElementCreator("div", {  "data-syiro-component" : "list-item", "data-syiro-component-id" : componentId, "role" : "option" }); // Generate a List Item Element with the role as "option" for ARIA

		let generatedElement : Element; // Define generatedElement as an Element we'll assign generated content to

		if (!syiro.utilities.TypeOfThing(properties.html, "Element")){ // If we are not adding ANY HTML code to the List Item (therefore not needing nonstrict formatting)
			for (let propertyKey in properties){ // Recursive go through each propertyKey
				let append : boolean = false; // Define append as boolean defaulting to false
				let thing : any = properties[propertyKey]; // Define thing

				if ((propertyKey == "control") && !syiro.utilities.TypeOfThing(properties.image, "string")){ // If we are adding a control and image is not defined
					if (thing.type == "button"){ // If the component is either a basic or toggle button
						generatedElement = syiro.component.Fetch(thing); // Get the component's (HTML)Element
						append = true; // Define append as true
					}
				} else if ((propertyKey == "image") && (typeof properties.control == "undefined")){ // If we are adding an image and a control is NOT defined
					generatedElement = syiro.utilities.ElementCreator("img", { "src" : thing } ); // Create an image with the source set the properties.image
					append = true;
				} else if ((propertyKey == "label") && (typeof properties.link == "undefined")){ // If we are adding a label (and link is undefined)
					generatedElement = syiro.utilities.ElementCreator("label", { "content" : thing }); // Create a label within the "label" (labelception) to hold the defined text.

					if (componentElement.querySelector("img") !== null){ // If we have added an image to the List Item
						append = true; // Define append as true
					}
				} else if ((propertyKey == "link") && (typeof properties.control == "undefined") && (typeof properties.label == "undefined")){ // If we are adding a link (and no control or label)
					append = true; // Define append as true
					generatedElement  = syiro.utilities.ElementCreator("a", { "href" : thing.link, "content" : thing.title }); // Generate a generic Link
				}

				if (append){ // If we are appending the generatedElement
					componentElement.appendChild(generatedElement); // Append the generatedElement
				} else { // If we are prepending the generatedElement
					componentElement.insertBefore(generatedElement, componentElement.firstChild); // Prepend the generated Element
				}
			}
		} else { // If HTML is being added to the List Item
			componentElement.setAttribute("data-syiro-nonstrict-formatting", ""); // Add the nonstrict-formatting attribute to the List Item so we know not to apply any styling
			generatedElement = properties.html;
			componentElement.innerHTML = syiro.utilities.SanitizeHTML(generatedElement).outerHTML; // Set the innerHTML of the componentElement to the outerHTML of the sanitized HTML
		}

		syiro.data.Write(componentId + "->HTMLElement", componentElement); // Add the componentElement to the HTMLElement key/val of the component

		return { "id" : componentId, "type" : "list-item" }; // Return a Component Object
	}

	// SetControl
	// Set a Control in a List Item
	export function SetControl(component : ComponentObject, control : ComponentObject) : boolean {
		let setControlSucceeded : boolean = false; // Variable we return with a boolean value of success, defaulting to false.

		if ((syiro.utilities.TypeOfThing(component, "ComponentObject")) && (component.type == "list-item")){ // Make sure the component is in fact a List Item
			if (syiro.component.IsComponentObject(control) && (control.type == "button")){ // If the content is a Component Object and is a Button
				let listItemElement = syiro.component.Fetch(component); // Get the List Item Element

				if (listItemElement.querySelector("div") !== null){ // If there is already a control inside the List Item
					listItemElement.removeChild(listItemElement.querySelector("div")); // Remove the inner Control
				}

				let innerListImage : Element = listItemElement.querySelector("img"); // Get the inner image if it exists
				if (innerListImage !== null){ // If there already is an image
					syiro.component.Remove(innerListImage); // Remove the innerListImage
				}

				let innerLink : Element = listItemElement.querySelector("a"); // Get the inner link if it exists
				if (listItemElement.querySelector("a") !== null){ // If there is a link
					syiro.component.Remove(innerLink); // Remove the innerLink
				}

				syiro.events.Remove(syiro.events.Strings["up"], component); // Ensure the List Item has no up listeners after adding the new Control
				syiro.component.Add("append", component, control); // Append the control to the List Item

				setControlSucceeded = true; // Set setLabelSucceeded to true
			}
		}

		return setControlSucceeded;
	}

	// SetImage
	// Set an Image in a List Item
	export function SetImage(component : ComponentObject, content : string) : boolean {
		let setImageSucceeded : boolean = false; // Variable we return with a boolean value, defaulint to false.

		if ((syiro.utilities.TypeOfThing(component, "ComponentObject")) && (component.type == "list-item")){ // Make sure the component is in fact a List Item
			if (typeof content == "string"){ // Make sure the content is a string
				let listItemElement = syiro.component.Fetch(component); // Get the List Item Element

				let listItemLabel = listItemElement.querySelector("label"); // Define listItemLabel as the potential label within the List Item Element
				let listItemImage = listItemElement.querySelector('img'); // Get any existing image within the List Item

				if (content !== ""){ // If content is not empty (adding an image source)
					let listItemControl = listItemElement.querySelector('div[data-syiro-component="button"]'); // Define listItemControl as the potential control within the List Item Element

					if (listItemControl !== null){ // If there is already a control in the List Item
						syiro.component.Remove(listItemControl); // Remove this inner control
					}

					 if (listItemImage == null){ // If listItemImage does not exist
						listItemImage = document.createElement("img"); // Create an image tag
						syiro.component.Add("prepend", component, listItemImage); // Prepend the img tag
					}

					listItemImage.setAttribute("src", syiro.utilities.SanitizeHTML(content)); // Set the src to a sanitized form of the content provided
					syiro.component.Update(component.id, listItemElement); // Update the List Item Element if necessary in syiro.data
				} else if ((content == "") && (listItemImage !== null)){ // If content is empty (removing the image) and listItemImage exists
					syiro.component.Remove(listItemImage); // Remove the List Item Image
				}

				setImageSucceeded = true; // Set setImageSucceeded to true
			}
		}

		return setImageSucceeded;
	}

	// SetLabel
	// Set a Label in a List Item
	export function SetLabel(component : ComponentObject, content : string) : boolean {
		let setLabelSucceeded : boolean = false; // Variable we return with a boolean value of success, defaulting to false.

		if ((syiro.utilities.TypeOfThing(component, "ComponentObject")) && (component.type == "list-item")){ // Make sure the component is in fact a List Item
			if (typeof content == "string"){ // If the content is of type string
				let listItemElement = syiro.component.Fetch(component); // Get the List Item Element

				let listItemLabelElement : Element = listItemElement.querySelector("label"); // Get any label if it exists

				if (content !== ""){ // If the content is not empty
					let listItemImage = listItemElement.querySelector("img"); // Define listItemImage as the potential image within the List Item Element
					let listItemControl = listItemElement.querySelector('div[data-syiro-component="button"]'); // Define listItemControl as the potential control within the List Item Element

					if ((listItemImage !== null) && (listItemControl !== null)){ // If there is already an image and control in the List Item
						syiro.component.Remove(listItemControl); // Remove this inner control
					}

					let innerLink = listItemElement.querySelector("a"); // Get any innerLink
					if (innerLink !== null){ // If there is a link in the List Item
						syiro.component.Remove(innerLink); // Remove the innerLink
					}

					if (listItemLabelElement == null){ // If the label Element does not exist
						listItemLabelElement = document.createElement("label"); // Create a label and assign it to the listItemLabelElement

						if (listItemImage !== null){ // If there is an image in this List Item
							syiro.component.Add("append", component, listItemLabelElement); // Append the label
						} else { // If there is not an image in this List Item
							syiro.component.Add("prepend", component, listItemLabelElement); // Prepend the label
						}
					}

					listItemLabelElement.textContent = syiro.utilities.SanitizeHTML(content); // Set the textContent to a sanitized form of the content
				} else if ((content == "") && (listItemLabelElement !== null)){ // If content is empty, meaning delete the label, and the label exists
					syiro.component.Remove(listItemLabelElement); // Remove the label
				}

				syiro.component.Update(component.id, listItemElement); // Update the List Item Element if necessary in syiro.data
				setLabelSucceeded = true; // Set setLabelSucceeded to true
			}
		}

		return setLabelSucceeded;
	}

	// SetLink
	// Set a Link in a List Item
	export function SetLink(component : ComponentObject, properties : any) : boolean {
		let setSucceeded : boolean = false;

		if ((syiro.utilities.TypeOfThing(component, "ComponentObject")) && (component.type == "list-item")){ // Make sure the component is in fact a List Item
			let componentElement : HTMLElement = syiro.component.Fetch(component); // Fetch the componentElement of the List Item Component
			let innerLink : Element = componentElement.querySelector("a"); // Get the innerLink if it doesn't exist already
			setSucceeded = true;

			if (syiro.utilities.TypeOfThing(properties, "LinkPropertiesObject")){ // If the properties is a LinkPropertiesObject
				if (innerLink !== null){ // If there is already an innerLink here
					innerLink.setAttribute("href", properties["link"]); // Change the href attribute
					innerLink.setAttribute("title", properties["title"]); // Change the title attribute
				} else { // If there is NOT an innerLink already
					let innerControl : Element = componentElement.querySelector('div[data-syiro-component]'); // Get any innerControl
					if (innerControl !== null){ // If there is an innerControl
						syiro.component.Remove(innerControl); // Remove the control
					}

					let innerLabel : Element = componentElement.querySelector("label"); // Get any innerLabel
					if (innerLabel !== null){ // If there is an innerLabel
						syiro.component.Remove(innerLabel); // Remove the label
					}

					innerLink = syiro.utilities.ElementCreator("a", { "href" : properties["link"], "content" : properties["title"] }); // Set the innerHTML of the List Item to to the outerHTML of the link Element
					syiro.component.Add("append", component, innerLink); // Append the innerLink to the List Item
				}
			} else if (properties == ""){ // If the properties is an empty string
				syiro.component.Remove(innerLink); // Remove the link
			}

		}

		return setSucceeded;
	}

}