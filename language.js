document.addEventListener('DOMContentLoaded', function() {
    const languageSelector = document.getElementById('language-selector');
    
    if (languageSelector) {
        // Cargar idioma guardado o usar predeterminado
        const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';
        languageSelector.value = savedLanguage;
        
        languageSelector.addEventListener('change', function() {
            changeLanguage(this.value);
        });
        
        // Aplicar traducciones al cargar
        applyTranslations(savedLanguage);
    }
});

function changeLanguage(language) {
    localStorage.setItem('preferredLanguage', language);
    applyTranslations(language);
}

function applyTranslations(language) {
    // Traducciones (simplificado para el ejemplo)
    const translations = {
        'es': {
            'nav-home': 'Inicio',
            'nav-about': 'Nosotros',
            'nav-impact': 'Impacto',
            'nav-partners': 'Socios',
            'nav-unesco': 'UNESCO',
            'nav-login': 'Iniciar Sesión',
            'nav-register': 'Registrarse',
            'hero-title': 'Verificación de Documentos con Inteligencia Artificial',
            'hero-subtitle': 'Combatiendo la falsificación documental en Guinea Ecuatorial y África',
            'hero-button1': 'Comenzar ahora',
            'hero-button2': 'Escanear documento',
            'about-title': 'La Historia de PimexDS',
            'scan-title': 'Verificación de Documentos',
            'impact-title': 'Impacto y Resultados',
            'partners-title': 'Entidades asociadas',
            'unesco-title': 'Colaboración con la UNESCO',
            // ... más traducciones
        },
        'en': {
            'nav-home': 'Home',
            'nav-about': 'About',
            'nav-impact': 'Impact',
            'nav-partners': 'Partners',
            'nav-unesco': 'UNESCO',
            'nav-login': 'Login',
            'nav-register': 'Register',
            'hero-title': 'Document Verification with Artificial Intelligence',
            'hero-subtitle': 'Fighting document forgery in Equatorial Guinea and Africa',
            'hero-button1': 'Get started',
            'hero-button2': 'Scan document',
            'about-title': 'The History of PimexDS',
            'scan-title': 'Document Verification',
            'impact-title': 'Impact and Results',
            'partners-title': 'Partner Entities',
            'unesco-title': 'Collaboration with UNESCO',
            // ... más traducciones
        },
        'fr': {
            'nav-home': 'Accueil',
            'nav-about': 'À propos',
            'nav-impact': 'Impact',
            'nav-partners': 'Partenaires',
            'nav-unesco': 'UNESCO',
            'nav-login': 'Connexion',
            'nav-register': 'S\'inscrire',
            'hero-title': 'Vérification de Documents avec l\'Intelligence Artificielle',
            'hero-subtitle': 'Lutter contre la falsification de documents en Guinée équatoriale et en Afrique',
            'hero-button1': 'Commencer',
            'hero-button2': 'Scanner un document',
            'about-title': 'L\'Histoire de PimexDS',
            'scan-title': 'Vérification de Documents',
            'impact-title': 'Impact et Résultats',
            'partners-title': 'Entités partenaires',
            'unesco-title': 'Collaboration avec l\'UNESCO',
            // ... más traducciones
        }
        // Se pueden agregar más idiomas aquí
    };
    
    // Aplicar traducciones a los elementos
    Object.keys(translations[language]).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            element.textContent = translations[language][key];
        });
    });
    
    // Actualizar el selector de idioma
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = language;
    }
}