// RUT formatter + validator
// Usage: add data-rut-format="dots" or "plain" (default plain), optional data-rut-maxlength.

// Match by class .rut (preferred), optional name="rut" or data-rut for backward compatibility.
const RUT_SELECTOR = 'input.rut, input[data-rut], input[name="rut"]';

const getRutConfig = () => {
  const cfg = window.ILEBEN_CF7 || {};
  return {
    defaultFormat: cfg.rutFormat === 'dots' ? 'dots' : 'plain',
    errorMessage: cfg.rutErrorMessage || 'RUT inválido',
  };
};

const normalizeRut = (value) => {
  const clean = (value || '').replace(/[^0-9kK]/g, '').toUpperCase();
  if (!clean) return { body: '', dv: '' };
  const body = clean.slice(0, -1).replace(/^0+/, '') || '';
  const dv = clean.slice(-1);
  return { body, dv };
};

const formatRut = ({ body, dv }, withDots) => {
  if (!body && !dv) return '';
  const grouped = withDots ? body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : body;
  return dv ? `${grouped}-${dv}` : grouped;
};

const validateRut = ({ body, dv }) => {
  if (!body || !dv) return false;
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const mod = 11 - (sum % 11);
  const expected = mod === 11 ? '0' : mod === 10 ? 'K' : String(mod);
  return dv === expected;
};

const applyRutMask = (input) => {
  const { defaultFormat } = getRutConfig();
  const withDots = (input.dataset.rutFormat || defaultFormat) === 'dots';
  const maxLen = Number(input.dataset.rutMaxlength) || (withDots ? 12 : 10);
  const normalized = normalizeRut(input.value);
  const formatted = formatRut(normalized, withDots);
  input.value = formatted.slice(0, maxLen);
};

const attachRutHandlers = (input) => {
  // Mark this input as RUT-validated to avoid conflicts
  input.dataset.rutValidated = 'true';
  
  input.addEventListener('input', () => {
    applyRutMask(input);
    // Clear any previous validation error while typing
    input.setCustomValidity('');
  });

  input.addEventListener('blur', () => {
    // Only validate if this input has a value
    if (!input.value.trim()) {
      input.setCustomValidity('');
      input.classList.remove('is-invalid', 'is-valid');
      return;
    }
    
    applyRutMask(input);
    const normalized = normalizeRut(input.value);
    
    // Only validate if we have both body and dv
    if (normalized.body && normalized.dv) {
      const { errorMessage } = getRutConfig();
      if (!validateRut(normalized)) {
        input.setCustomValidity(errorMessage);
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        // Trigger native validation UI
        input.reportValidity();
      } else {
        input.setCustomValidity('');
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
      }
    }
  });
  
  // Prevent form submission if RUT is invalid
  const form = input.closest('form');
  if (form && !form.dataset.rutValidationAttached) {
    form.dataset.rutValidationAttached = 'true';
    form.addEventListener('submit', (e) => {
      const rutInputs = form.querySelectorAll('[data-rut-validated="true"]');
      let hasInvalidRut = false;
      
      rutInputs.forEach((rutInput) => {
        if (rutInput.value.trim()) {
          const normalized = normalizeRut(rutInput.value);
          if (normalized.body && normalized.dv && !validateRut(normalized)) {
            const { errorMessage } = getRutConfig();
            rutInput.setCustomValidity(errorMessage);
            rutInput.reportValidity();
            hasInvalidRut = true;
          }
        }
      });
      
      if (hasInvalidRut) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }
};

export function initRutValidation() {
  const inputs = document.querySelectorAll(RUT_SELECTOR);
  inputs.forEach((input) => {
    attachRutHandlers(input);
    applyRutMask(input);
  });
}

export default initRutValidation;
