/* eslint-disable @typescript-eslint/restrict-template-expressions */

function createComment(fields) {
  console.log(fields);
  fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify(fields),
    headers: {'Content-Type': 'application/json'}
  })
    .then(showResponse)
    .catch(showResponse);
}

function viewCommentsByComment(fields) {
  fetch(`/api/comments?commentId=${fields.commentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewCommentsByFreet(fields) {
  fetch(`/api/comments?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function deleteComment(fields) {
  console.log(fields);
  fetch(`/api/comments/${fields.commentId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
