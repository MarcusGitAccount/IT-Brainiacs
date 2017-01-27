

/* Modal logic here */

function approveModal(e) {
  let location = this.dataset.href;

  window.location.href = location;
}

document.querySelector('.btn-yes').addEventListener('click', approveModal);

/* Navigation logic here  */

const spans = document.querySelectorAll('span.info');

function changeBadgeContent(span) {
  $.get(`/api/size/${span.dataset.table}`, data => {
    span.innerHTML = data.size;
  });
}

spans.forEach(span => changeBadgeContent(span));