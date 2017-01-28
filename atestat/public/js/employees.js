
const adminTable = document.querySelector('table.administrators');
const employeesTables = document.querySelector('table.employees');
const arrowsUp = document.querySelectorAll('i.fa-arrow-up');
const arrowsDown = document.querySelectorAll('button>i.fa-arrow-down');
const insideInputs = document.querySelectorAll('td');
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
    employeesTables.innerHTML += `<tr><td>${row.id}</td><td>${row.first_name}</td><td>${row.last_name}</td><td><input data-col="phone_number" data-original="${row.phone_number}" type="text" value="${row.phone_number}" pattern="[\d\s]+"></td><td><input data-col="salary" data-original="${row.salary}" type="text" value="${row.salary}" pattern="[\d\.]+"></td><td><input data-col="job_name" data-original="${row.job_name}" type="text" value="${row.job_name}" pattern="[\w]+"></td><td><input data-col="email" data-original="${row.email}" type="text" value="${row.email}" pattern="[\w]+@[\w]+"></td></tr>`;
  });
}

function arrowSortAsc(i) {
  getTables[i.dataset.table]('ASC', i.dataset.col);
}

function arrowSortDesc(i) {
  getTables[i.dataset.table]('DESC', i.dataset.col);
}


//arrowsUp.forEach(arrow => {arrow.addEventListener('click', arrowSortAsc); console.log(arrow)});/
//arrowsDown.forEach(arrow => arrow.addEventListener('click', arrowSortDesc));

getAdmins();
getEmployees();