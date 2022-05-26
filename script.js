const postsPerRequest = 100;
const responses = [];
const allPosts = [];
var subredditList = new Set();
var counter = 0;
var solution = "";
var successes = 0;
var failures = 0;
var filteredPosts = [];
var maxLength = 0;
var hintsFirstLetter = 3;
const fetchPosts = async e => {
  e.preventDefault();
  const response = await fetch(
    `https://www.reddit.com/r/all.json?limit=${postsPerRequest}`
  );
  const responseJSON = await response.json();
  responses.push(responseJSON);
  parseResults(responses);
};
const parseResults = responses => {
  document.getElementById("start-game").className = "hidden";
  document.getElementById("in-game").classList.remove("hidden");
  document.getElementById("footer").classList.remove("hidden");
  responses.forEach(response => {
    allPosts.push(...response.data.children);
  });
  filteredPosts = allPosts.filter(function(value) {
    return (
      value.data.preview != undefined &&
      value.data.preview.enabled &&
      !value.data.over_18 &&
      value.data.thumbnail != "image"
    );
  });
  for (var index = 0; index < filteredPosts.length; index++) {
    subredditList = subredditList.add(filteredPosts[index].data.subreddit);
    if (filteredPosts[index].data.subreddit.length > maxLength) {
      maxLength = filteredPosts[index].data.subreddit.length;
    }
  }
  subredditList = [...subredditList];
  autocomplete(document.getElementById("next-text"), subredditList);
  document.getElementById("next-text").size = maxLength;
  actualGame();
};

const correctAnswersPercentage = () => {
  if (successes + failures == 0) {
    return 0;
  }
  return Math.round(((successes * 100) / (successes + failures)) * 10) / 10;
};

const gifvToMp4 = url => {
  var name = url.substring(0, url.lastIndexOf("."));
  var format = url.substring(url.lastIndexOf("."), url.length);
  return format == ".gifv" ? name + ".mp4" : url;
};

//URL parser
const setUrl = (index, flag) => {
  var url = filteredPosts[index].data.url;
  var checkResult = [];
  if (flag) {
    if (filteredPosts[index].data.is_video) {
      document.getElementById("img-content").className = "hidden";
      document.getElementById("video-content").classList.remove("hidden");
      document.getElementById("video-content-src").src = gifvToMp4(url);
      document.getElementById("video-url").href = url;
    } else {
      checkResult = parseUrl(url, index);
      if (checkResult[1]) {
        document.getElementById("img-content").className = "hidden";
        document.getElementById("video-content").classList.remove("hidden");
        document.getElementById("video-content-src").src = gifvToMp4(
          checkResult[0]
        );
        document.getElementById("video-url").href = url;
      } else {
        document.getElementById("video-content").className = "hidden";
        document.getElementById("img-content").classList.remove("hidden");
        document.getElementById("img-content").src = checkResult[0];
        document.getElementById("img-url").href = url;
      }
    }
  } else {
    if (filteredPosts[index].data.is_video) {
      document.getElementById("img-content-preload").src = url;
      document.getElementById("video-content-src-preload").src = gifvToMp4(url);
    } else {
      checkResult = parseUrl(url, index);
      document.getElementById("img-content-preload").src = checkResult[0];
      document.getElementById("video-content-src-preload").src = gifvToMp4(
        checkResult[0]
      );
    }
  }
  console.log(checkResult);
};

const parseUrl = (url, index) => {
  var finalUrl = "";
  var isVideo = false;
  var parseResults = [];
  if (url.indexOf("gfycat") == 8) {
    //finalUrl = url.substring(0, 8) + "giant." + url.substring(8, url.length) + ".mp4";
    finalUrl =
      filteredPosts[index].data.preview.reddit_video_preview.fallback_url;
    isVideo = true;
  } else if (url.substring(url.lastIndexOf("."), url.length) == ".gifv") {
    finalUrl = gifvToMp4(url);
    isVideo = true;
  } else {
    finalUrl = url;
  }
  console.log(finalUrl);
  parseResults.push(finalUrl);
  parseResults.push(isVideo);
  return parseResults;
};

const actualGame = async e => {
  if (counter > 0) {
    //IDK
    e.preventDefault();
    //PREVENT LEAVING THE PAGE
    window.onbeforeunload = function() {
      return "You are about to leave the page so progress will be lost. Are you sure?";
    };
    //AQUIRING SOLUTION
    var enteredSolution = document.getElementById("next-text").value;
    // REMOVE HIDDEN CLASS FROM RECAP
    document
      .getElementById("answer-recap-post-link-summary")
      .classList.remove("hidden");
    // AVOIDING BLANK/WRONG ANSWERS
    if (enteredSolution == "") {
      window.alert(
        "You did not submit an answer. Careful! Try typing a few letters and then select a subreddit from the autocomplete list."
      );
      return;
    } else if (subredditList.includes(enteredSolution) == false) {
      window.alert(
        "You did not enter one of the possible subreddits! Try typing a few letters and then select a subreddit from the autocomplete list."
      );
      return;
    }
    if (counter >= filteredPosts.length) {
      gameOver(document.getElementById("next-text").value);
      return;
    }
    document.getElementById("video-content-src").src = "";
    document.getElementById("img-content").src = "";
    // RIGHT/WRONG ANSWER
    if (solution.toUpperCase() == enteredSolution.toUpperCase()) {
      successes++;
      document.getElementById("answer-recap").innerHTML =
        '<span id="correct-text">Correct!</span> It was <span class="subreddit">' +
        solution +
        "</span>!";
      document.getElementById("summary").innerHTML =
        " Your score: " +
        successes +
        "/" +
        counter +
        " - " +
        correctAnswersPercentage() +
        "%";
    } else {
      failures++;
      document.getElementById("answer-recap").innerHTML =
        '<span id="wrong-text">Wrong</span> - it was <span class="subreddit">' +
        solution +
        '</span> (you entered <span class="subreddit">' +
        enteredSolution +
        "</span>).";
      document.getElementById("summary").innerHTML =
        " Your score: " +
        successes +
        "/" +
        counter +
        " - " +
        correctAnswersPercentage() +
        "%";
    }
    // SETTING PREVIOUS POST LINK
    document.getElementById("post-link").href =
      "https://reddit.com" + filteredPosts[counter - 1].data.permalink;
  }
  //
  setUrl(counter, true);
  setUrl(counter + 1, false);
  document.getElementById("title").innerHTML =
    filteredPosts[counter].data.title;
  /*preloading
    document.getElementById('video-content-src-preload').src = gifvToMp4(filteredPosts[counter + 1].data.url);
    document.getElementById('img-content-preload').src = filteredPosts[counter + 1].data.url;
    
    if (filteredPosts[counter].data.is_video) {
        document.getElementById('img-content').className = "hidden";
        document.getElementById('video-content').classList.remove("hidden");
        document.getElementById('video-content-src').src = gifvToMp4(filteredPosts[counter].data.url);
    } else {
        document.getElementById('video-content').className = "hidden";
        document.getElementById('img-content').classList.remove("hidden");
        document.getElementById('img-content').src = filteredPosts[counter].data.url;
    }*/

  solution = filteredPosts[counter].data.subreddit;
  //document.getElementById('debug').innerHTML += solution;
  counter++;
  //Reset text field
  document.getElementById("next-text").value = "";

  //LISTA SUBREDDIT SUL LATO
  //   subredditList.forEach(element => {
  //     var node = document.createElement("LI");
  //     var textnode = document.createTextNode(element);
  //     node.appendChild(textnode);
  //     document.getElementById("subreddit-sidelist").appendChild(node);
  // });
};

function toggleSubredditList() {
  var isHidden = document
    .getElementById("subreddit-sidelist")
    .classList.contains("hidden");
  if (isHidden) {
    document.getElementById("subreddit-sidelist").classList.remove("hidden");
  } else {
    document.getElementById("subreddit-sidelist").classList.add("hidden");
  }
}

const gameOver = enteredSolution => {
  document.getElementById("various-info").className = "hidden";
  solution == enteredSolution ? successes++ : failures++;
  document.getElementById("end-game").innerHTML =
    "The game is over! Your score is " +
    correctAnswersPercentage() +
    "% (" +
    successes +
    "-" +
    failures +
    ")<br>Login, leaderboards, and many more things are coming soon!";
};

function revealFirstLetter() {
  if (hintsFirstLetter == 0) {
    window.alert("You do not have hints left.");
  } else {
    hintsFirstLetter--;
    document.getElementById("next-text").value = solution
      .charAt(0)
      .toUpperCase();
    document.getElementById(
      "fisrt-letter-hints-left"
    ).innerHTML = hintsFirstLetter;
  }
}

const subredditSelectForm = document.getElementById("start-game");
subredditSelectForm.addEventListener("submit", fetchPosts);

const goNext = document.getElementById("next-form");
goNext.addEventListener("submit", actualGame);

//AUTOCOMPLETE
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}
