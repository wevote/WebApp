// Prepare the searchAllBox for action
export function enterSearch () {
  // Change color of search button
  // const searchButton = document.getElementsByClassName("site-search__button")[0];
  // searchButton.classList.remove("btn-default");
  // searchButton.classList.add("btn-primary");

  // Clear out the contents of the search box. Then select the text in searchInput. We're searching the DOM and then
  // using setSelectionRange because the normal way I'd do things in React (e.target.select(), instead of the
  // relatively-slow DOM search) apparently doesn't work in some iPhone mobile browsers. I haven't verified that
  // (Nico 9/28/16)
  const searchInput = document.getElementById("SearchAllBox-input");
  searchInput.setSelectionRange(0, 999);

  // Hide the hamburger navigation and site name
  const siteLogoText = document.getElementsByClassName("page-logo")[0];
  siteLogoText.style.display = "none";
  // const searchBox = document.getElementsByClassName("page-header__search")[0];
  // Show the search box drop-down
  const searchResultsBox = document.getElementsByClassName("search-container")[0];
  searchResultsBox.style.display = "block";
  searchResultsBox.classList.remove("search-container__hidden");
}


// Clean up the searchAllBox after arriving at your destination
export function exitSearch () {
  // Change color of search button
  // const searchButton = document.getElementsByClassName("site-search__button")[0];
  // searchButton.classList.remove("btn-primary");
  // searchButton.classList.add("btn-default");

  // Add the name of the item you are looking at to the search box
  // const searchInput = document.getElementsByTagName("input")[0];
  // searchInput.value = textForSearchBox;
  // Show the hamburger navigation and site name
  const siteLogoText = document.getElementsByClassName("page-logo")[0];
  siteLogoText.style.display = null;
  // const searchBox = document.getElementsByClassName("page-header__search")[0];
  // Hide the search box drop-down
  const searchResultsBox = document.getElementsByClassName("search-container")[0];
  searchResultsBox.style.display = "none";
  searchResultsBox.className += " search-container__hidden";
}

export function makeSearchLink (twitter_handle, we_vote_id, kind_of_owner) {
  var search_link = "";
  switch (kind_of_owner) {
    case "CANDIDATE":
      search_link = twitter_handle ? "/" + twitter_handle : "/candidate/" + we_vote_id;
      break;
    case "OFFICE":
      search_link = "/office/" + we_vote_id;
      break;
    case "ORGANIZATION":
      search_link = twitter_handle ? "/" + twitter_handle : "/voterguide/" + we_vote_id;
      break;
    case "MEASURE":
      search_link = "/measure/" + we_vote_id;
      break;
    case "POLITICIAN":
      search_link = twitter_handle ? "/" + twitter_handle : "/voterguide/" + we_vote_id;
      break;
    default:
      break;
  }
  return search_link;
}
