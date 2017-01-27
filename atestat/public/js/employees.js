
const adminTable = document.querySelector('table.administrators');
const employeesTables = document.querySelector('table.employees');
const arrowsUp = document.querySelectorAll('i.fa-arrow-up');
const arrowsDown = document.querySelectorAll('button>i.fa-arrow-down');
const getTables = {
  administrators: getAdmins,
  employees: getEmployees
}

function getAdmins(sort = 'ASC', col = 'id') {
  $.get(`/api/administrators?${col}=${sort}`, data => {
    populateAdminTable(data);
    console.log(data);
  });
}

function getEmployees(sort = 'ASC', col = 'id') {
  $.get(`/api/employees?${col}=${sort}`, data => {

  });
}

function populateAdminTable(data) {
  while(adminTable.childElementCount > 1)
    adminTable.removeChild(adminTable.lastChild);
  data.rows.forEach((row, index) => {
    adminTable.innerHTML += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.email}</td><td>${row.registration_date}</td></tr>`;
  });
}

function populateTables() {
  // data-key data-column
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
