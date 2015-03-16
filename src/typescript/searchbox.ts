/*
 This is the module for Syiro Searchbox component.
*/

/// <reference path="component.ts" />
/// <reference path="generator.ts" />

// #region Syiro Searchbox Component

module syiro.searchbox {

	// #region Searchbox Generator

	export function Generate(properties : Object) : Object { // Generate a Searchbox Component and return a Component Object
		var componentId : string = syiro.generator.IdGen("searchbox"); // Generate a component Id
		var componentElement : HTMLElement = syiro.generator.ElementCreator(componentId, "searchbox", { "aria-autocomplete" : "list", "role" : "textbox" }); // Generate a Searchbox Element with the ARIA aria-autocomplete to List (to imply there is a List of suggestions) and textbox role
		var searchboxComponentData : any = {}; // Define searchboxComponentData as the intended Component Data of the Searchbox that'll be stored via syiro.data

		if (properties == undefined){ // If no properties were passed during the Generate call
			properties = {}; // Set as an empty Object
		}

		if (properties["content"] == undefined){ // If a placeholder text is not provided
			properties["content"] = "Search here..."; // Default to "Search here..." message
		}

		for (var propertyKey in properties){ // Recursive go through each propertyKey
			if (propertyKey == "icon"){ // If we are adding an icon
				syiro.component.CSS(componentElement, "background-image", "url(" + properties["icon"] + ")"); // Set the backgroundImage to the icon URL specified
			}
			else if (propertyKey == "content"){ // If we are adding a placeholder / content
				componentElement.setAttribute("placeholder", properties["content"]); // Set the searchbox input placeholder to the one defined
			}
		}

		if ((typeof properties["suggestions"] !== "undefined") && (properties["suggestions"] == true)){ // If suggestions is enabled
			searchboxComponentData["suggestions"] = "enabled"; // Define suggestions as a string "enabled" to imply suggestions are enabled

			searchboxComponentData["handlers"] = { // Add "handlers" to the searchboxComponentData
				"list-item-handler" : properties["list-item-handler"] // Handler for dynamically generated List Items as well as preseeded ones.
			};

			var listItems : Array<Object> = []; // Define listItems as an array of Objects, defaulting to an empty array

			if (typeof properties["preseed"] == "object"){ // If a preseed []string is provided
				searchboxComponentData["preseed"] = true; // Define preseed value in searchboxComponentData as true

				for (var preseedItemIndex in properties["preseed"]){ // For each item in preseed
					listItems.push(syiro.listitem.Generate({ "label" : properties["preseed"][preseedItemIndex] })); /// Push a new generated List Item Component Object to listItemsArray
				}
			}
			else{ // If preseed []string is not provided
				searchboxComponentData["handlers"]["suggestions"] = properties["handler"]; // Faux "suggestions" key with the val as the handler passed (that we will use to get suggestions)
				searchboxComponentData["preseed"] = false; // Define preseed value in searchboxComponentData as false
			}

			var searchSuggestionsList : Object = syiro.list.Generate( { "items" : listItems }); // Generate a List with the items provided (if any)
			var searchSuggestionsListElement : Element = syiro.component.Fetch(searchSuggestionsList); // Get the List Component Element

			componentElement.setAttribute("aria-owns", searchSuggestionsList["id"]); // Define the aria-owns, setting it to the List Component to declare for ARIA that the Searchbox Component "owns" the List Component
			searchSuggestionsListElement.setAttribute("data-syiro-component-owner", componentId); // Set the List's Component owner to be the component Id

			document.querySelector("body").appendChild(searchSuggestionsListElement); // Append the List Element to the end of the document

			if (typeof properties["preseed"] !== "undefined"){ // If a preseed []string is provided
				for (var listItemIndex in listItems){ // For each List Item in listItems array
					syiro.events.Add(syiro.events.eventStrings["up"], listItems[listItemIndex], properties["list-item-handler"]); // Add a mouseup / touchend event to List Item with the handler being list-item-handler
				}
			}
		}

		searchboxComponentData["HTMLElement"] = componentElement; // Define the HTMLElement of the Searchbox as the componentElement
		syiro.data.Write(componentId, searchboxComponentData); // Add the searchboxComponentData to the syiro.data.storage for this Searchbox Component

		return { "id" : componentId, "type" : "searchbox" }; // Return a Component Object
	}

	// #endregion

	// #region Searchbox Suggestions Handler

	export function Suggestions(...args : any[]){
		var searchboxComponent : Object = arguments[0]; // Define the Searchbox Component as the first argument
		var searchboxElement : Element = syiro.component.Fetch(searchboxComponent); // Define searchboxElement as the fetched Searchbox Component Element
		var searchboxValue : string = arguments[1]; // Define searchboxValue as the second argument

		var linkedListComponent : Object = syiro.component.FetchLinkedListComponentObject(searchboxComponent); // Fetch the Linked List of the Searchbox Component
		var linkedListComponentElement : Element = syiro.component.Fetch(linkedListComponent); // Fetch the Element of the List Component
		var innerListItemsOfLinkedList : any = linkedListComponentElement.querySelectorAll('div[data-syiro-component="list-item"]'); // Fetch a NodeList of Elements of all the List Items in the List

		syiro.component.CSS(linkedListComponentElement, "width", searchboxElement.clientWidth + "px"); // Ensure the Linked List is the same width of the Searchbox
		syiro.render.Position(["below", "center"], linkedListComponent, searchboxComponent); // Position the Linked List Component below and centered in relation to the Searchbox Component

		if (searchboxValue !== ""){ // If the value is not empty
			if (syiro.data.Read(searchboxComponent["id"] + "->preseed") == true){ // If preseed is enabled
				syiro.component.CSS(linkedListComponentElement, "visibility", "visible !important"); // Immediately ensure the Linked List of the Searchbox is visible

				if (innerListItemsOfLinkedList.length > 0){ // If the Linked List of the Searchbox has List Items
					var numOfListItemsThatWillShow : number = 0; // Define numOfListItemsThatWillShow as, well the number of list items that will show, obviously.

					for (var listItemIndex =0; listItemIndex < innerListItemsOfLinkedList.length; listItemIndex++){ // For each List Item in the Linked List
						var listItem : Element = innerListItemsOfLinkedList[listItemIndex]; // Define listItem as this particular List Item in the index

						if (listItem.textContent.indexOf(searchboxValue) !== -1){ // If the List Item content contains the current searchboxValue
							numOfListItemsThatWillShow++; // Increment the numOfListItemsThatWillShow by one
							syiro.component.CSS(listItem, "display", "block !important"); // Show the List Item since it has a suggestion string, use display CSS attribute so List height changes
						}
						else{
							syiro.component.CSS(listItem, "display", "none !important"); // Hide the List Item since it does not have content of the suggestion,  use display CSS attribute so List height changes
						}
					}

					if (numOfListItemsThatWillShow == 0){ // If the numOfListItemsThatWillShow is zero
						syiro.component.CSS(linkedListComponentElement, "visibility", "hidden !important"); // Hide the List since we have no suggestions that are valid
					}
				}
			}
			else{ // If preseed is not enabled
				syiro.component.CSS(linkedListComponentElement, "visibility", "hidden !important"); // Hide the List until we get suggestions and generate the new List Items

				var suggestions : Array<string> = syiro.data.Read(searchboxComponent["id"] + "->handlers->suggestions").call(this, searchboxValue); // Call the suggestions handler function

				if (suggestions.length !== 0){ // If we were provided suggestions
					if (innerListItemsOfLinkedList.length > 0){ // If the Linked List of the Searchbox has List Items
						syiro.component.Remove(innerListItemsOfLinkedList); // Remove all the List Items in the Linked List
					}

					for (var suggestionIndex in suggestions){ // For each suggestion in suggestions
						var suggestionListItem : Object = syiro.listitem.Generate({ "label" : suggestions[suggestionIndex] }); // Create a List Item with the label being the suggestion
						syiro.list.AddItem(true, linkedListComponent, suggestionListItem); // Append the List Item to the Linked List
						syiro.events.Add(syiro.events.eventStrings["up"], suggestionListItem, syiro.data.Read(searchboxComponent["id"] + "handlers->list-item-handler")); // Add the list-item-handler we have stored from syiro.data to the suggestionListItem
					}

					syiro.component.CSS(linkedListComponentElement, "visibility", "visible !important"); // Show the List Item now that we have parsed the suggestions and generated List Items
				}
			}
		}
		else{ // If the searchboxValue is empty
			syiro.component.CSS(linkedListComponentElement, "visibility", "hidden !important"); // Hide the List
		}
	}

	// #endregion

	// #region Setting Searchbox Text / Placeholder

	export function SetText(component : Object, placeholderText : any) : void {
		var searchboxElement : Element = syiro.component.Fetch(component); // Get the Searchbox Syiro component element

		if (searchboxElement !== null){ // If the searchboxElement exists in syiro.data.storage or DOM
			var searchboxInputElement : HTMLInputElement = searchboxElement.getElementsByTagName("input")[0]; // Get the inner input tag of the searchboxElement

			if (placeholderText !== false){ // If we are updating the placeholderText
				searchboxInputElement.setAttribute("placeholder", placeholderText); // Set the placeholder string
			}
			else if (placeholderText == false){ // If the placeholderText is set to false, meaning we are removing the placeholder
				searchboxInputElement.removeAttribute("placeholder"); // Remove the placeholder attribute
			}

			syiro.component.Update(component["id"], searchboxElement); // Update the searchboxElement HTMLElement if necessary
		}
	}

	// #endregion

}
