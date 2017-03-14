
function bindCustomNumberInputEvents() {
  const inputs = document.querySelectorAll('.custom-number-input');
  
  
  inputs.forEach(input => {
    const text = input.querySelector('input[type=text]');
    const spans = input.querySelectorAll('span');
    
    function spanClick(e) {
      const newValue = parseInt(text.value) + 
                       parseInt(this.dataset.step) *
                       parseInt(this.dataset.increment);
      
      if (newValue < parseInt(text.dataset.min) || newValue > parseInt(text.dataset.max))
        return ;
      
      text.value = newValue; 
      text.style.width = `${(text.value.length > 1 ? text.value.length : 0) * 10 + 10}px`;
    }

    text.style.width = `${(text.value.length > 1 ? text.value.length : 0) * 10 + 10}px`
    spans.forEach(span => span.addEventListener('click', spanClick));
  });
}

bindCustomNumberInputEvents();