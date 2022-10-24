/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewLikesByFreet(fields) {
  fetch(`/api/likes?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewLikesByUsername(fields) {
  fetch(`/api/likes?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function likeFreet(fields) {
  if (fields.hidden === 'on') {
    fields.hidden = true;
  } else {
    fields.hidden = false;
  }

  fetch('/api/likes', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}
