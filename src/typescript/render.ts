/*
	This is the namespace for render-oriented functionality for Components, such as positioning.
*/

/// <reference path="component.ts" />
/// <reference path="data.ts" />
/// <reference path="style.ts" />
/// <reference path="utilities.ts" />

namespace syiro.render {

	// Position
	// Position a Component or Element relative to another one
	export function Position(positioningList : string | Array<string>, componentObject : any, relativeComponentObject : any) : boolean {
		let positioningAllowed : boolean = false; // Define positioningAllowed as a boolean, defaulting to false

		if (arguments.length == 3){ // If three arguments were passed
			let componentElement : Element; // Define componentElement as the Element (if a Component Object was passed, of the Component)
			let relativeComponentElement : Element; // Define realtiveComponentElement as an Element (if a relativeComponentObject was passed, of the Component)

			let typeOfPositioningList : string = syiro.utilities.TypeOfThing(positioningList); // Get the type of the positioningList

			if (typeOfPositioningList == "string"){ // If the positioningList is a string
				positioningList = [arguments[0]]; // Redefine as an array
			}

			if (syiro.component.IsComponentObject(componentObject)){ // If the componentObject passed is in fact a Syiro Component Object
				componentElement = syiro.component.Fetch(componentObject); // Define componentElement as the Component Element that we fetch from the Component Object
			}

			if (syiro.component.IsComponentObject(relativeComponentObject)){ // If the relativeComponentObject passed is in fact a Syiro Component Object
				relativeComponentElement = syiro.component.Fetch(relativeComponentObject); // Define relativeComponentElement as the Component Element that we fetch from the relativeComponentObject
			}

			if ((typeof positioningList == "object") && (componentElement !== null) && (relativeComponentElement !== null)){ // If all the variables necessary for positioning are defined
				positioningAllowed = true; // Define positioningAllowed as true

				// #region Primary Component & Relative Component Position Variable Defining

				let componentDimensionsAndPosition : Object = syiro.component.FetchDimensionsAndPosition(componentElement); // Get the dimensions of the Component
				let relativeComponentDimensionsAndPosition : Object = syiro.component.FetchDimensionsAndPosition(relativeComponentElement); // Get the dimensions and position of the Relative Component Element

				let componentHeight : number = componentDimensionsAndPosition["height"]; // Get the height of the primaryComponent
				let componentWidth : number = componentDimensionsAndPosition["width"]; // Get the width of the primaryComponent

				let relativeComponentHeight : number = relativeComponentDimensionsAndPosition["height"]; // Get the height of the relativeComponentElement
				let relativeComponentWidth : number = relativeComponentDimensionsAndPosition["width"]; // Get the width of the relativeComponentElement
				let relativeComponentYPosition : number = relativeComponentDimensionsAndPosition["top"]; // Get the top position of the relativeComponentElement
				let relativeComponentXPosition : number = relativeComponentDimensionsAndPosition["left"]; // Get the left position of the relativeComponentElement

				let componentWidthDifference = (componentWidth - relativeComponentWidth); // Set as the componentElement width minus the relativeComponent Element width

				// #endregion

				// #region Position Calculation and Setting

				let componentAbovePosition : number = (relativeComponentYPosition - componentHeight); // Set the Component's above position to the relative Component's Y position minus the height of the component we are positioning
				let componentBelowPosition : number = (relativeComponentYPosition + relativeComponentHeight); // Set the Component's below position to the relative Component's Y position plus the height of said Component
				let componentLeftPosition : number = relativeComponentXPosition; // Set the Component's left position to the same as the relative Component's X position, since we are aligning to the left edge of the Components
				let componentRightPosition : number = relativeComponentXPosition; // Initially set componentRightPosition to the relative Component's X position (assume initially that widths are same)

				if (componentWidthDifference > 0){ // If the Component is wider than the relative Component
					componentRightPosition = (relativeComponentXPosition - componentWidthDifference); // Set componentRightPosition to the X position of the relativeComponent minus the difference in width
				} else if (componentWidthDifference < 0){ // If the Component is narrower than the relative Component
					componentRightPosition = (relativeComponentXPosition + Math.abs(componentWidthDifference)); // Set componentRightPosition to the X position + the positive form (using Math.abs) of the negative difference number
				}

				for (let position of positioningList){ // For each position in the positioningList
					let positionValue : number; // Define positionValue as the variable to hold the coordinate of where the componentElement should render

					switch (position) {
						case "above": // If we are positioning the Component above the relativeComponent
							if (componentAbovePosition >= 0){ // If the component will not clip on the top of the page
								positionValue = componentAbovePosition; // Set positionValue to componentAbovePosition
							} else { // If it would clip the top of the page
								positionValue = componentBelowPosition; // Force to position below instead of above
							}

							break;
						case "below": // If we are positioning the Component below the relativeComponent
							if (componentBelowPosition <= (syiro.device.height - componentHeight)){ // If the Component would not be clipping through the bottom of the screen
								positionValue = componentBelowPosition; // Set positionValue to componentBelowPosition
							} else { // If it would clip the bottom of the page
								positionValue = componentAbovePosition; // Force to position above instead of below
							}

							break;
						case "left": // If we are positioning the Component to the left of the relativeComponent
							if ((componentLeftPosition >= 0) && ((componentLeftPosition + componentWidth) < (syiro.device.width - componentWidth))){ // If the left position is greater or equal to zero but doesn't partially clip on right side of page
								positionValue = componentLeftPosition; // Set positionValue to componentLeftPosition
							} else { // If it is less than zero or clips the page
								positionValue = componentRightPosition; // Force to position right instead of left.
							}

							break;
						case "right": // If we are positioning the Component to the right of the relativeComponent
							if (componentRightPosition > 0){ //If the Component will not clip on the left side of the page
								positionValue = componentRightPosition; // Set positionValue to the componentRightPosition
							} else { // If the Component will clip on the left side of the page
								positionValue = componentLeftPosition; // Force to position left instead of right
							}

							break;
						case "center": // If we are positioning the Component centered to the relativeComponent
							if (componentWidthDifference > 0){ // If the Component is wider than the relative Component
								let primaryComponentSideLength = (componentWidthDifference / 2); // Get the amount of pixels that each side of the primaryComponent would have

								if (((relativeComponentXPosition - primaryComponentSideLength) + componentWidth) > syiro.device.width){ // If the X position of the relative Component minus the diff (since Component is wider) plus the total length means it will clip the right side of the page
									positionValue = componentRightPosition; // Force to position right instead of center
								} else if ((relativeComponentXPosition - primaryComponentSideLength) < 0){ // If the relative Component X position minus the side difference means the Component will clip the left side of the page
									positionValue = componentLeftPosition; // Force to position left instead of center
								} else { // If it will not clip on either side
									positionValue = (relativeComponentXPosition - primaryComponentSideLength); // Set positionValue to the centered value
								}
							} else if (componentWidthDifference < 0){ // If the Component is narrower than the relative Component
								positionValue = (relativeComponentXPosition + (Math.abs(componentWidthDifference) / 2)); // Set the positionValue to be the X position of the relative Component plus the positive form of componentWidthDifference (since it is negative) divided by 2
							} else { // If the Component and relative Component widths are equal
								positionValue = relativeComponentXPosition; // Set to the X position of the relative Component
							}

							break;
					}

					if ((position == "above") || (position == "below")){ // If we are setting vertical positioning
						syiro.style.Set(componentElement, "top", positionValue.toString() + "px"); // Set the top variable to be the Y position + px (ex. 100px)
					} else { // If we are setting horizontal positioning
						syiro.style.Set(componentElement, "left", positionValue.toString() + "px"); // Set the left variable to the X position + px (ex. 400px)
					}
				}

				// #endregion
			}
		}

		return positioningAllowed;
	}
}