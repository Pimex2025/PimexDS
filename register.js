document.addEventListener('DOMContentLoaded', function() {
    // Inicializar input de teléfono internacional
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        window.intlTelInput(phoneInput, {
            initialCountry: "auto",
            geoIpLookup: function(callback) {
                fetch('https://ipapi.co/json')
                    .then(res => res.json())
                    .then(data => callback(data.country_code))
                    .catch(() => callback('us'));
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
            hiddenInput: "full_phone",
            separateDialCode: true
        });
    }

    // Navegación entre pasos
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    let currentStep = 0;

    // Mostrar paso actual
    function showStep(stepIndex) {
        // Validar que el paso existe
        if (stepIndex < 0 || stepIndex >= steps.length) return;
        
        // Ocultar todos los pasos
        steps.forEach(step => step.classList.remove('active'));
        
        // Mostrar paso actual
        steps[stepIndex].classList.add('active');
        
        // Actualizar progreso
        progressSteps.forEach((step, index) => {
            const stepElement = step.querySelector('span');
            step.classList.remove('active', 'completed');
            
            if (index < stepIndex) {
                step.classList.add('completed');
                stepElement.innerHTML = '✓';
            } else if (index === stepIndex) {
                step.classList.add('active');
                stepElement.textContent = (index + 1).toString();
            } else {
                stepElement.textContent = (index + 1).toString();
            }
        });
        
        currentStep = stepIndex;
        updateButtonStates();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Actualizar estado de los botones
    function updateButtonStates() {
        const prevButtons = document.querySelectorAll('.btn-prev');
        const nextButtons = document.querySelectorAll('.btn-next');
        const submitButton = document.querySelector('.btn-submit');
        
        // Botones Anterior
        prevButtons.forEach(btn => {
            btn.style.display = currentStep === 0 ? 'none' : 'block';
            btn.disabled = currentStep === 0;
        });
        
        // Botones Siguiente
        nextButtons.forEach(btn => {
            btn.style.display = currentStep === steps.length - 1 ? 'none' : 'block';
        });
        
        // Botón Enviar
        if (submitButton) {
            submitButton.style.display = currentStep === steps.length - 1 ? 'block' : 'none';
        }
    }

    // Validar paso actual
    function validateStep(stepIndex) {
        const currentStep = steps[stepIndex];
        const inputs = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, 'Este campo es requerido');
                isValid = false;
            } else {
                clearError(input);
                
                // Validaciones específicas por tipo
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    showError(input, 'Formato de email inválido');
                    isValid = false;
                }
                
                if (input.id === 'phone' && !isValidPhone(input.value)) {
                    showError(input, 'Número de teléfono inválido');
                    isValid = false;
                }
            }
        });

        // Validación específica para contraseñas en el último paso
        if (stepIndex === 2) {
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Las contraseñas no coinciden');
                isValid = false;
            }
            
            if (password && !isStrongPassword(password.value)) {
                showError(password, 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales');
                isValid = false;
            }
        }

        return isValid;
    }

    // Mostrar error
    function showError(input, message) {
        input.classList.add('error');
        let errorDiv = input.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            input.parentElement.appendChild(errorDiv);
        }
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Efecto de shake para llamar la atención
        input.parentElement.classList.add('error-shake');
        setTimeout(() => {
            input.parentElement.classList.remove('error-shake');
        }, 500);
    }

    // Limpiar error
    function clearError(input) {
        input.classList.remove('error');
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validar teléfono
    function isValidPhone(phone) {
        // Validación básica - al menos 8 dígitos
        const phoneRegex = /^[\d\s\+\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

    // Botones de navegación
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                showStep(currentStep + 1);
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(button => {
        button.addEventListener('click', function() {
            showStep(currentStep - 1);
        });
    });

    // Validación en tiempo real
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                clearError(this);
                
                // Validaciones específicas
                if (this.type === 'email' && !isValidEmail(this.value)) {
                    showError(this, 'Formato de email inválido');
                }
                
                if (this.id === 'phone' && !isValidPhone(this.value)) {
                    showError(this, 'Número de teléfono inválido');
                }
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                clearError(this);
            }
        });
    });

    // Validación específica para contraseñas
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            clearError(this);
            if (confirmPasswordInput && confirmPasswordInput.value) {
                validatePasswordMatch();
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    
    function validatePasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        
        if (password && confirmPassword && password.value && confirmPassword.value) {
            if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Las contraseñas no coinciden');
            } else {
                clearError(confirmPassword);
            }
        }
    }

    // Permitir navegación con Enter
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (validateStep(currentStep)) {
                    if (currentStep < steps.length - 1) {
                        showStep(currentStep + 1);
                    } else {
                        // Último paso - intentar enviar
                        document.getElementById('register-form').dispatchEvent(new Event('submit'));
                    }
                }
            }
        });
    });

    // Inicializar el primer paso
    showStep(0);

    // Envío del formulario
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    async function handleRegister(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            showNotification('Por favor, complete todos los campos requeridos correctamente.', 'error');
            return;
        }

        // Mostrar loading
        showLoading(true);

        try {
            // Obtener número de teléfono completo
            const iti = window.intlTelInputGlobals.getInstance(phoneInput);
            const fullPhone = iti.getNumber();

            const formData = new FormData();
            
            // Agregar todos los campos del formulario
            const formFields = [
                'entity_name', 'entity_type', 'country_code', 'category', 'sector',
                'pyme', 'contact_person', 'contact_email', 'address', 'website',
                'username', 'password'
            ];
            
            formFields.forEach(field => {
                const element = document.getElementById(field);
                if (element) {
                    formData.append(field, element.value);
                }
            });
            
            formData.append('full_phone', fullPhone);

            // Agregar archivos
            const logoInput = document.getElementById('logo');
            const profileInput = document.getElementById('profile-image');
            
            if (logoInput && logoInput.files[0]) {
                formData.append('logo', logoInput.files[0]);
            }
            
            if (profileInput && profileInput.files[0]) {
                formData.append('profile_image', profileInput.files[0]);
            }

            const response = await fetch('api/register.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('¡Registro exitoso! Redirigiendo al inicio de sesión...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'login.html?registered=true';
                }, 2000);
                
            } else {
                showNotification('Error en el registro: ' + data.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error al conectar con el servidor', 'error');
        } finally {
            showLoading(false);
        }
    }

    // Sistema de notificaciones
    function showNotification(message, type = 'info') {
        // Eliminar notificaciones existentes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    function showLoading(show) {
        let loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Procesando...</p>
            `;
            document.body.appendChild(loadingOverlay);
        }
        
        loadingOverlay.classList.toggle('active', show);
    }
});

// Añadir estilos para las animaciones
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .error-shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .loading-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid var(--primary-blue);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 1rem;
        transform: translateX(100%);
        transition: transform 0.5s ease;
        z-index: 1000;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background: var(--success);
        color: white;
    }
    
    .notification.error {
        background: var(--error);
        color: white;
    }
    
    .notification.info {
        background: var(--primary-blue);
        color: white;
    }
    
    .form-step {
        display: none;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .form-step.active {
        display: block;
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(additionalStyles);