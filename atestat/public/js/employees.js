
const adminTable = document.querySelector('table.administrators');
const employeesTables = document.querySelector('table.employees');
const arrowsUp = document.querySelectorAll('i.fa-arrow-up');
const arrowsDown = document.querySelectorAll('button>i.fa-arrow-down');
const wrongInput = document.querySelector('div.alert.alert-danger.wrong-input');
const btnSaveChanges = document.querySelector('.btn-save-changes');
const btnUndoChanges = document.querySelector('.btn-undo-changes');
const btnAddEmployee = document.querySelector('.btn-add-employee');
let insideInputs = document.querySelectorAll('td > input');
const getTables = {
  administrators: getAdmins,
  employees: getEmployees
}

function getAdmins(sort = 'ASC', col = 'id') {
  $.get(`/api/administrators?${col}=${sort}`, data => {
    populateAdminTable(data);
  });
}

function getEmployees(sort = 'ASC', col = 'id') {
  $.get(`/api/employees?${col}=${sort}`, data => {
    populateEmployeesTable(data);
    console.log(data);
  });
}

function populateAdminTable(data) {
  while(adminTable.childElementCount > 1)
    adminTable.removeChild(adminTable.lastChild);
  data.rows.forEach((row, index) => {
    adminTable.innerHTML += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.email}</td><td>${row.registration_date}</td></tr>`;
  });
}

function populateEmployeesTable(data) {
  // key is the first item in the row (id)

  while (employeesTables.childElementCount > 1)
    employeesTables.removeChild(employeesTables.lastChild);
  data.rows.forEach((row, index) => {
    employeesTables.innerHTML += `<tr><td>${row.id}</td><td>${row.first_name}</td><td>${row.last_name}</td><td><input data-col="phone_number" data-original="${row.phone_number}" type="text" value="${row.phone_number}" pattern="[\\d\\s]+"></td><td><input data-col="salary" data-original="${row.salary}" type="text" value="${row.salary}" pattern="[\\d\\.]+"></td><td><input data-col="job_name" data-original="${row.job_name}" type="text" value="${row.job_name}" pattern="[\\w\\s]+"></td><td><input data-col="email" data-original="${row.email}" type="text" value="${row.email}" pattern="[\\w]+@[\\w]+"></td></tr>`;
  });
  insideInputs = document.querySelectorAll('td > input');
  insideInputs.forEach(input => input.addEventListener('input', textboxInput));
}

function arrowSortAsc(i) {
  getTables[i.dataset.table]('ASC', i.dataset.col);
}

function arrowSortDesc(i) {
  getTables[i.dataset.table]('DESC', i.dataset.col);
}

const patternExpressions = {
  'phone_number': new RegExp(/[\d\s]+/i),
  'job_name': new RegExp(/[a-zA-Z\s]+/i),
  'email': new RegExp(/[\w]+@[\w]+\.[\w]+/i),
  'salary': new RegExp(/[\d\.]+/i)
};

function textboxInput(e) {
  const pattern = patternExpressions[this.dataset.col];
  const matchedStr = this.value.trim().match(pattern);
  this.classList.toggle('text-changed', this.value !== this.dataset.original);

  if (!matchedStr || matchedStr[0] !== this.value) {
    wrongInput.classList.remove('hidden');

    wrongInput.innerHTML = `Invalid ${this.dataset.col.replace('_', ' ')}`;
  }
  else wrongInput.classList.add('hidden');
  //console.log();
}

getAdmins();
getEmployees();