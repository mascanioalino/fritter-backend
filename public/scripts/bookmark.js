/* eslint-disable @typescript-eslint/restrict-template-expressions */
function createBookmark(fields) {
  fetch('/api/bookmarks', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function bookmarkFreet(fields) {
  fetch('/api/bookmarks', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewBookmarks(fields) {
  fetch('/api/bookmarks')
    .then(showResponse)
    .catch(showResponse);
}

function viewFolder(fields) {
  fetch(`/api/bookmarks?folder=${fields.folder}`)
    .then(showResponse)
    .catch(showResponse);
}
