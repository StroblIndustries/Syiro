/*
 This is the module for Syiro Header component.
*/

/// <reference path="component.ts" />
/// <reference path="generator.ts" />

module syiro.footer {

	// #region Footer Generation

	export function Generate(properties : Object) : Object { // Generate a Footer Component and return a Component Object
		var componentId : string = syiro.generator.IdGen("footer"); // Generate a component Id
		var componentElement : HTMLElement = syiro.generator.ElementCreator(componentId, "footer"); // Generate a Footer Element

		if (typeof properties["items"] !== "undefined"){ // If we are adding items to the Footer
			for (var individualItem in properties["items"]){ // For each individualItem in navigationItems Object array
				var individualItem : any = properties["items"][individualItem]; // Get the individualItem


				if (syiro.component.IsComponentObject(individualItem) == false){ // If we are adding a link
					var generatedElement : HTMLElement; // Define generatedElement as the element we will be appending

					if (typeof individualItem.nodeType == "undefined"){ // If a nodeType is not defined, meaning it is not an element
						generatedElement = syiro.generator.ElementCreator("a", // Generate a generic link element
							{
								"href" : individualItem["href"], // Set the href (link)
								"title" : individualItem["title"], // Also set title of the <a> tag to title provided
								"content" : individualItem["title"] // Also set the inner content of the <a> tag to title
							}
						);
					}
					else{ // If a nodeType is defined meaning it is an Element
						generatedElement = individualItem; // Define generatedElement as individualItem
					}

					componentElement.appendChild(generatedElement); // Append the component to the parent component element
				}
			}
		}

		if (typeof properties["content"] !== "undefined"){ // If we are adding a Footer label
			var generatedElement : HTMLElement = syiro.generator.ElementCreator("label", { "content" : properties["content"] }); // Generate a generic label element
			componentElement.insertBefore(generatedElement, componentElement.firstChild); // Prepend the label to the footer
		}

		syiro.data.Write(componentId + "->HTMLElement", componentElement); // Add the componentElement to the HTMLElement key/val of the component
		return { "id" : componentId, "type" : "footer" }; // Return a Component Object
	}

	// #endregion

	// #region Function to set the Footer label (typically something like a Copyright notice)

	export function SetLabel(component : Object, labelText : string) : boolean{ // Set the label text of the footer component to the labelText defined
		if ((typeof component !== "undefined") && (typeof labelText !== "undefined")){ // If the component and labelText is defined
			var parentElement = syiro.component.Fetch(component); // Get the Element of the footer component
			var labelComponent : Element = parentElement.querySelector("pre"); // Fetch the labelComponent if it exists

			if (labelComponent == null){ // If the labelComponent does not exist
				labelComponent = syiro.generator.ElementCreator("pre", { "content" : labelText }); // Create a label Element with the content set to labelText
				parentElement.insertBefore(labelComponent, parentElement.firstChild); // Pre-emptively insert the empty label
			}
			else{ // If the labelComponent does exist
				labelComponent.textContent = labelText; // Set the labelComponent textContent to the labelText defined
			}

			syiro.component.Update(component["id"], parentElement); // Update the storedComponent HTMLElement if necessary
			return true; // Return a success boolean
		}
		else{ // If the component is NOT defined
			return false; // Return a failure boolean
		}
	}

	// #endregion

	// #region Function to add a link to the Footer based on properties of that link

	export function AddLink(prepend : boolean, component : Object, properties : Object) : boolean { // Returns boolean if it was successful or not
		var componentAddingSucceeded : boolean; // Variable to store the determination of success

		if (typeof properties == "Object"){ // If the linkProperties is in fact an Object
			if ((typeof properties["title"] !== "undefined") && (typeof properties["link"] !== "undefined")){ // If the linkProperties object has the valid properties needed
				var linkElement : Element = syiro.generator.ElementCreator("a", { "title" : properties["title"], "content" : properties["title"], "href" : properties["link"] }); // Create a link Element
				componentAddingSucceeded = syiro.component.Add(prepend, component, linkElement);
			}
			else{ // If it did not contain the appropriate properties
				componentAddingSucceeded = false; // Set to false
			}
		}
		else{ // If linkProperties was NOT an Object
			componentAddingSucceeded = false; // Set to false
		}

		return componentAddingSucceeded;
	}

	// #endregion

	// #region Function to remove a link from the Footer based on the properties of that link

	export function RemoveLink(component : Object, properties : Object) : boolean { // Return boolean if it was successful or not
		var componentRemovingSucceed : boolean; // Variable to store the determination of success
		var footerElement : Element = syiro.component.Fetch(component); // Get the Element of the Footer component
		var potentialLinkElement : Element = footerElement.querySelector('a[href="' + properties["link"] + '"][title="' + properties["title"] + '"]'); // Get the potential link element.

		if (potentialLinkElement !== null){ // If we successfully got the link element
			footerElement.removeChild(potentialLinkElement); // Remove the element

			syiro.component.Update(component["id"], footerElement); // Update the storedComponent HTMLElement if necessary
			componentRemovingSucceed = true; // Set the removingSucceed to true
		}
		else{ // If the link does not exist in the footer
			componentRemovingSucceed = false; // Set the removingSucceed to false
		}

		return componentRemovingSucceed;
	}

	// #endregion

}
