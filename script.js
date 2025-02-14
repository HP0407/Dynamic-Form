document.addEventListener('DOMContentLoaded', () => {
  const controlTypeSelect = document.getElementById('controlType');
  const controlLabelInput = document.getElementById('controlLabel');
  const formControls = document.getElementById('formControls');
  const filenameInput = document.getElementById('filename');
  const addControlButton = document.getElementById('addControl');
  const saveFormButton = document.getElementById('saveForm');
  const saveLayoutButton = document.getElementById('saveLayout');
  const loadLayoutButton = document.getElementById('loadLayout');
  const themeSwitcher = document.getElementById('themeSwitcher');

  addControlButton.addEventListener('click', addControl);
  formControls.addEventListener('click', removeControl);
  saveFormButton.addEventListener('click', saveFormData);
  saveLayoutButton.addEventListener('click', saveLayout);
  loadLayoutButton.addEventListener('click', loadLayout);
  themeSwitcher.addEventListener('change', toggleTheme);

  loadLayout();

  function addControl() {
    const controlType = controlTypeSelect.value;
    const controlLabel = controlLabelInput.value.trim();

    if (controlLabel) {
      const controlHTML = createControlHTML(controlType, controlLabel);
      const controlDiv = document.createElement('div');
      controlDiv.innerHTML =
        controlHTML + '<button class="removeControl">Remove</button>';
      formControls.appendChild(controlDiv);
      controlLabelInput.value = '';
    } else {
      alert('Please enter a control label.');
    }
  }

  function createControlHTML(type, label) {
    switch (type) {
      case 'text':
        return `<label>${label}: <input type="text"></label>`;
      case 'checkbox':
        return `<label><input type="checkbox"> ${label}</label>`;
      case 'radio':
        return `<label><input type="radio"> ${label}</label>`;
      case 'textarea':
        return `<label>${label}: <textarea></textarea></label>`;
      case 'dropdown':
        return `<label>${label}: <select><option value="">Select...</option></select></label>`;
      case 'date':
        return `<label>${label}: <input type="date"></label>`;
      case 'number':
        return `<label>${label}: <input type="number"></label>`;
      case 'password':
        return `<label>${label}: <input type="password"></label>`;
      case 'file':
        return `<label>${label}: <input type="file"></label>`;
      case 'color':
        return `<label>${label}: <input type="color"></label>`;
      default:
        return '';
    }
  }

  function removeControl(event) {
    if (event.target.classList.contains('removeControl')) {
      event.target.parentElement.remove();
    }
  }

  function saveFormData() {
    const filename = filenameInput.value.trim();
    const formData = Array.from(formControls.children)
      .map((control) => {
        const label = control.querySelector('label').innerText;
        const input = control.querySelector('input, textarea, select');
        const value = input ? input.value : '';
        return `${label} ${value}`.trim();
      })
      .join('\n');

    if (filename) {
      const blob = new Blob([formData], {type: 'text/plain'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.txt`;
      link.click();
    } else {
      alert('Please enter a filename.');
    }
  }

  function saveLayout() {
    const layout = Array.from(formControls.children).map((control) => {
      const label = control.querySelector('label').innerText;
      const input = control.querySelector('input, textarea, select');
      const type = input.tagName.toLowerCase();
      return {label, type};
    });
    localStorage.setItem('formLayout', JSON.stringify(layout));
    alert('Layout saved!');
  }

  function loadLayout() {
    const savedLayout = localStorage.getItem('formLayout');
    if (savedLayout) {
      const layout = JSON.parse(savedLayout);
      layout.forEach((control) => {
        const controlHTML = createControlHTML(control.type, control.label);
        const controlDiv = document.createElement('div');
        controlDiv.innerHTML =
          controlHTML + '<button class="removeControl">Remove</button>';
        formControls.appendChild(controlDiv);
      });
    }
  }

  function toggleTheme() {
    const theme = themeSwitcher.value;
    document.body.className = theme;
  }
});
