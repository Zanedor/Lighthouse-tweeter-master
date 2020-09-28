/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function () { /* the "$(document).ready" function ensures that the code doen't run until the DOM is loaded */
  console.log("Document Ready") ; /* creats a console log when ^ fires to conferm that everything is working right */

  /* Doesn't actualy do anything atm but may come in handy latter, or at least for memorising this part */
  const $button = $("#btn-submit") ; /* Pulls in the html so JavaScript can act on it, always needs to point to a id */
  console.log("$button", $button); /* Logs if the ^ worked */

  $("form").on("submit", submitTweet) ; /* Listiner for the form submit event. Runs the "submitTweet" function when the form is "submitted." */

  loadTweets(); /* Calls loadTweets to... well... load the tweets */

}) ;

/* To keep "$(document).ready" clean and readable we are going to define all of our functions (sometimes called worker functions) OUTSIDE of "$(document).ready" */

const submitTweet = function(event) { /* Listiner for if the texarea is submitted. Done then the button with type=submit is pressed*/
  event.preventDefault(); /* Prevents the page form reloging/changing when the button is pressed */
  console.log("Tweet clicked and Handler for .submit() called."); /* Logs if the ^ worked */

  const tweetQString = $('form').serialize();  /* Checks what query string was produced via ".serialize()" and saves it for later if nessiary */
  console.log("The following query string was produced from the Tweet: " + tweetQString) ; /* Logs if the ^ worked */

  const request = $.ajax ({ /* Preforms a "Ajax call", and sticks it in the "request" variable so it can be referanced later */
    url: "/tweets",  /* The url we want to talk to. In this case this is a "relative url" as we didn't any leading "http://" so it "starts" from whereever the .html file is being run. As we put /tweets it's going to interact with a child .url ON THE SERVER. Will error if no such child .url exists or can't talk to it for some reason */
    method: "post", /* The thing we're tring to do usually "get" or "post" */
    data: tweetQString, /*  If "type" is "post" then whatever data you want to send. In this case its the "form data" */
    /* dataType: would also go here but you don't need it here as this is only concered with what data type you get BACK and we aren't getting anything back */
  }) ;

  request.done(function(data) { /* Attaches a callback (like a listiner but only 1 can exist) to "request" which is holding the Ajax query, so it trigers if Ajax query is sucessful/"done". Stores anything we get back in the variable between the function's ()'s', in this case "data". This is called the callback peramiter. Post doesn't send anything back so we can leave blank */
    console.log("Tweet sent/posted.", data) /* Logs if the ^ worked and also logs value of data if any */
    loadTweets(); /* Loads the updated list of Tweets */
  });

  request.fail(function(error) { /* Attaches a callback to "request." Runs if reques fails */
    console.log("Error submitTweet:", error) ; // Logs if ^ fires
  });

};

const createTweetElement = function(tweet) {  /* Creats html from a tweet object so it can be added to the "tweets container" in index.html */
  const tweetElement = /* The escape() functions added in here protect from XSS attacks in those fields */
      `<article class="tweet">
        <header class="tweet--header">
          <img class="tweet--avatar" src="https://i.imgur.com/lRUnDgU.png" />
          <h2 class="tweet--name">${escape(tweet.user.name)}</h2>
          <small class="tweet--handle">${escape(tweet.user.handle)}</small>
        </header>
        <div class="tweet--body">
          <p>${escape(tweet.content.text)}</p> 
        </div>
        <footer class="tweet--footer">
          <small class="footer--age">10 days ago</small>        
          <span class="footer--actions">
            <a href="#"><i class="fa fa-flag"></i></a>
            <a href="#"><i class="fa fa-retweet"></i></a>
            <a href="#"><i class="fa fa-heart"></i></a>
          </span>
        </footer>
      </article>`;
  return tweetElement

  /* A Tweet object looks like this:
   {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png",
        "handle": "@SirIsaac"
      },
    "content": {
        "text": "If I have seen further it is by standing on the shoulders of giants"
      },
    "created_at": 1461116232227
 } */
}

const renderTweets = function(tweets) { /* Displays the Tweets on the main page */
  for(const tweet of tweets) { /* Loops through all tweets */
    const tweetElement = createTweetElement(tweet); /* Creats the html version of the tweet via the "reateTweetElement" function and assigns it to the tweetElement variable to be used on the next line */
    $('#tweets-container').prepend(tweetElement); /* Puts a tweet element in the tweet container. We used .prepend so the most recent are at the top */
  }
}

const loadTweets = function() {/* Read and display all the Tweets from the server */
  const request = $.ajax ({ /* The Ajax call to read the tweets */
    url: "/tweets", /* The url we want to talk to. In this case this is a "relative url" as we didn't any leading "http://" so it "starts" from whereever the .html file is being run. As we put /tweets it's going to interact with a child .url ON THE SERVER. Will error if no such child .url exists or can't talk to it for some reason */
    type: "get", /* The thing we're tring to do usually "get" or "post" */
    dataType: "json" /*  What data type we expect to get back, in this case .json */
  });

  request.done(function(data) {
    console.log("Tweets retreaved=", data.length)
    renderTweets(data)
  });

  request.fail(function(error) { /* Attaches a callback to "request." Runs if reques fails */
  console.log("Error loadTweets:", error) ; // Logs if ^ fires
  });
};

const escape =  function(str) { /* This function is added to strings to protect from XSS attacks in those fields via an "escape." Wraps strings ####### */
  let div = document.createElement('div'); /* creates <div> */
  div.appendChild(document.createTextNode(str));/*  Wrap the text in a <div> and converts specal characters to something else*/
  return div.innerHTML; /* returns the altered string */
}
