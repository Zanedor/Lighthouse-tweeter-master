

$(document).ready(function () {
  console.log("composer-char-counter.js Doc Ready");

  $("#tweet-text").on("keyup", updateCounter); /* Updates the counter when a key is released */

  /* Should probubly add something to Update the counter due to cut and pasts */

});

const updateCounter = function(event) { /* Sets up a function to update the counter. NOTE as we know that the function is being invoked at the "textarea" with a id=tweet-text assum "this" and all other location dependant things are coded only for there */
  const text = $(this).val(); /* Gets the text from textarea and puts it into the "text" variable */
  const parent = $(this).parent(); /* Sets the "parent" container we're looking through. As "this" is our "textarea" element then the parent would be the container it's in, ie. "form" */
  const counter = parent.find("div output.counter"); /* Locates the counter html element (an "output" with a class of "counter" inside a "div") inside the parent, and "getting it" into the "counter" variable */
  count = text.length; /* Get the CURRENT lenght of the text entered into textarea. */

  counter.text(140 - count); /* Updates the text of the counter element, by subtracting the count from the starting value */

  if(count > 140) { /* if else statment that changes the counter to red if it goes in the nagatives and back when not */
    counter.addClass("colour-red"); /* Adds the class "colour-red" which is referanced in tweets.css to be red */
  } else{
    counter.removeClass("colour-red"); /* Removes the class "colour-red" so it is no longer read */
  };
};