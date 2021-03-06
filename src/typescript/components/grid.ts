/*
	This is the namespace for Syiro Grid component and it's sub-component, Grid Item
*/

/// <reference path="../interfaces/grid.ts" />
/// <reference path="../component.ts" />
/// <reference path="../style.ts" />
/// <reference path="../utilities.ts" />

module syiro.grid {

	// New
	// Create a Grid
	export function New(properties : GridPropertiesObject) : ComponentObject {
		let component : ComponentObject = { "id" : syiro.component.IdGen("grid"), "type" : "grid" }; // Define componentObject as a new ComponentObject with a newly generated Id and type set to grid
		let renderItems : string;

		if (syiro.utilities.TypeOfThing(properties.columns, "number")){ // If the horizontal amount (columns) of grid items allowed is a number
			renderItems = properties.columns.toString(); // Set renderitems to the string of columns
		} else { // If renderItems is not a number
			renderItems = "dynamic"; // Set to dynamically set column amount
		}

		let componentElement : HTMLElement = syiro.utilities.ElementCreator("div", { "data-syiro-component-id" : component.id, "data-syiro-component" : "grid", "data-syiro-render-columns" : renderItems }); // Generate the Grid container

		if (syiro.utilities.TypeOfThing(properties.items, "Array")){ // If there are items defined
			for (let gridItemProperties of properties.items){ // For each item
				let gridItem : ComponentObject = syiro.griditem.New(gridItemProperties); // Create a Grid Item Component based on the gridItemProperties
				let gridItemElement : HTMLElement = syiro.component.Fetch(gridItem); // Fetch the Grid item Element
				componentElement.appendChild(gridItemElement); // Append the gridItemElement
			}
		}

		syiro.data.Write(component.id + "->HTMLElement", componentElement); // Set the HTMLElement of the Component as componentElement
		return component;
	}

	// Scale
	// Scales Grid and inner Grid Items
	export function Scale(component : ComponentObject){
		if ((syiro.utilities.TypeOfThing(component, "ComponentObject")) && (component.type == "grid")){ // If this is a Grid Component
			let componentElement : HTMLElement = syiro.component.Fetch(component); // Fetch the componentElement of this Grid Component
			let componentDimensions : Object = syiro.component.FetchDimensionsAndPosition(componentElement); // Get the dimensions of the componentElement

			let componentWidth : number = componentDimensions["width"]; // Get the width of the componentElement and set to componentWidth
			let gridItemWidth : number; // Define gridItemWIdth as the width of the individual Grid Items we'll be setting
			let renderColumns : any = componentElement.getAttribute("data-syiro-render-columns"); // Get the render-columns value

			let firstGridItem : Element = componentElement.querySelector('div[data-syiro-component="grid-item"]:first-of-type'); // Get the first Grid Item
			let hasInnerGridItems : boolean = (firstGridItem !== null); // Set hasInnerGridItems to the comparison between our grid-item query and null

			if (hasInnerGridItems){ // If there are Grid Items
				if (renderColumns !== "dynamic") { // If renderColumns is NOT set to dynamic
					renderColumns = Number(renderColumns); // Change renderColumns to a Number
					let innerGridItems : NodeList = componentElement.querySelectorAll('div[data-syiro-component="grid-item"]'); // Get all the inner Grid Items

					let gridItemPaddingCalculation = (componentWidth * 0.03); // Set gridItemPaddingCalculation to the width of the Grid * 3% (padding left and right are 1.5% each)
					gridItemWidth = ((componentWidth / renderColumns) - gridItemPaddingCalculation); // Set gridItemWidth as the componentWidth / renderColumns, minus gridItemPaddingCalculation

					for (let innerGridItemIndex = 0; innerGridItemIndex < innerGridItems.length; innerGridItemIndex++){
						let gridItem : any = innerGridItems[innerGridItemIndex]; // Get this gridItem
						syiro.style.Set(gridItem, "width", gridItemWidth.toString() + "px"); // Set the width of this gridItem
					}
				}
			}
		}
	}
}

module syiro.griditem {

	// New
	// Create a Grid Item
	export function New(properties : GridItemPropertiesObject) : ComponentObject {
		let gridItemComponent : ComponentObject;

		if ((syiro.utilities.TypeOfThing(properties.html, "Element")) || (syiro.utilities.TypeOfThing(properties.html, "string"))){ // If the only valid property, HTML, is defined, as an Element or string
			let gridItemComponent : ComponentObject = { "id" : syiro.component.IdGen("grid-item"), "type" : "grid-item" }; // Define componentObject as the generated ComponentObject with the unique Id as well as type to grid-item
			let componentElement : HTMLElement = syiro.utilities.ElementCreator("div", { "data-syiro-component-id" : gridItemComponent.id, "data-syiro-component" : "grid-item" }); // Create the Grid Item container

			properties.html = syiro.utilities.SanitizeHTML(properties.html); // Sanitize the HTML, whether it be a string or an Element of some sort

			if (syiro.utilities.TypeOfThing(properties.html, "Element")){ // If it is an Element
				componentElement.appendChild(properties.html); // Append the HTMLElement
			} else { // If it is a string
				componentElement.innerHTML = properties.html; // Set the innerHTML of the componentElement to the HTML
			}

			syiro.data.Write(gridItemComponent.id + "->HTMLElement", componentElement); // Write the Grid Item HTMLELement
		}

		return gridItemComponent;
	}
}