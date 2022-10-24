/* eslint-disable @typescript-eslint/restrict-template-expressions */
function createGroup(fields) {
  fetch('/api/groups', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function joinLeaveGroup(fields) {
  fetch('/api/groups', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function respondRequestGroup(fields) {
  fields.response = true;
  fields.accept = fields.accept === 'on';
  fetch('/api/groups', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function addGroupAdmin(fields) {
  fetch('/api/groups/admins', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function changeGroupOwner(fields) {
  fetch('/api/groups/owner', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteGroup(fields) {
  fetch('/api/groups', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewGroupsByUser(fields) {
  fetch(`/api/groups?username=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}
