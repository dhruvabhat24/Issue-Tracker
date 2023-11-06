function submitIssue(e) {
  e.preventDefault();
  const getInputValue = id => document.getElementById(id).value;
  const description = getInputValue('issueDescription');
  const severity = getInputValue('issueSeverity');
  const assignedTo = getInputValue('issueAssignedTo');
  const files = document.getElementById('issueFiles').files;
  const id = Math.floor(Math.random() * 100000000) + '';
  const status = 'Open';

  if (description.length === 0 || assignedTo.length === 0) {
    showAlertModal('Invalid Input!', 'Please fill all fields with required data.');
  } else {
    const issue = { id, description, severity, assignedTo, status, files: [] };

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileUrl = URL.createObjectURL(file);
        issue.files.push(fileUrl);
      }
    }

    saveIssue(issue);
    fetchIssues();
  }
}

function saveIssue(issue) {
  let issues = [];
  if (localStorage.getItem('issues')) {
    issues = JSON.parse(localStorage.getItem('issues'));
  }
  issues.push(issue);
  localStorage.setItem('issues', JSON.stringify(issues));
}

function updateIssue(id, updatedDescription, updatedSeverity, updatedAssignedTo) {
  let issues = JSON.parse(localStorage.getItem('issues'));
  issues = issues.map(issue => {
    if (issue.id === id) {
      issue.description = updatedDescription;
      issue.severity = updatedSeverity;
      issue.assignedTo = updatedAssignedTo;
    }
    return issue;
  });
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
}

function attachFile(id, fileUrl) {
  let issues = JSON.parse(localStorage.getItem('issues'));
  issues = issues.map(issue => {
    if (issue.id === id) {
      issue.files.push(fileUrl);
    }
    return issue;
  });
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
}

function setUserRole(userId, role) {
  // Implement logic for setting user roles and permissions
}

function showAlertModal(title, message) {
  document.getElementById('emptyFieldLabel').textContent = title;
  document.querySelector('#emptyField .modal-body').textContent = message;
  $('#emptyField').modal('show');
}

function fetchIssues() {
  const issues = JSON.parse(localStorage.getItem('issues')) || [];
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';

  for (let i = 0; i < issues.length; i++) {
    const { id, description, severity, assignedTo, status, files } = issues[i];
    let filesHtml = '';
    if (files && files.length > 0) {
      filesHtml = '<h5>Attached Files:</h5><ul>';
      files.forEach(fileUrl => {
        filesHtml += `<li><a href="${fileUrl}" target="_blank">${fileUrl}</a></li>`;
      });
      filesHtml += '</ul>';
    }

    issuesList.innerHTML += `<div class="well">
                              <h6>Issue ID: ${id} </h6>
                              <p><span class="label label-info"> ${status} </span></p>
                              <h3> ${description} </h3>
                              <p><span class="glyphicon glyphicon-time"></span> ${severity}</p>
                              <p><span class="glyphicon glyphicon-user"></span> ${assignedTo}</p>
                              ${filesHtml}
                              <button onclick="updateIssue('${id}', 'Updated Description', 'Medium', 'John Doe')" class="btn btn-info">Update</button>
                              <button onclick="attachFile('${id}', 'https://example.com/file.pdf')" class="btn btn-success">Attach File</button>
                              <button onclick="setUserRole('user123', 'admin')" class="btn btn-primary">Set User Role</button>
                              <button onclick="closeIssue('${id}')" class="btn btn-warning">Close</button>
                              <button onclick="deleteIssue('${id}')" class="btn btn-danger">Delete</button>
                              </div>`;
  }
}

function closeIssue(id) {
  let issues = JSON.parse(localStorage.getItem('issues'));
  issues = issues.map(issue => {
    if (issue.id === id) {
      issue.status = 'Closed';
      issue.description = `<strike>${issue.description}</strike>`;
    }
    return issue;
  });
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
}

function deleteIssue(id) {
  let issues = JSON.parse(localStorage.getItem('issues'));
  issues = issues.filter(issue => issue.id !== id);
  localStorage.setItem('issues', JSON.stringify(issues));
  fetchIssues();
}

fetchIssues();
