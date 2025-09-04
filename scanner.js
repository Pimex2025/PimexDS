class DocumentScanner {
    constructor() {
        this.currentDocuments = [];
        this.stream = null;
        this.currentFacingMode = 'environment';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Tabs de métodos de escaneo
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Subida de archivos
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e.target.files);
            });
        }

        // Drag and drop
        const dropZone = document.getElementById('drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                this.handleFileSelect(e.dataTransfer.files);
            });
        }

        // Cámara
        document.getElementById('start-camera')?.addEventListener('click', () => this.startCamera());
        document.getElementById('capture-btn')?.addEventListener('click', () => this.captureImage());
        document.getElementById('switch-camera')?.addEventListener('click', () => this.switchCamera());
        document.getElementById('upload-camera')?.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        // Desde URL
        document.getElementById('fetch-document')?.addEventListener('click', () => this.fetchFromURL());

        // Controles de vista previa
        document.getElementById('analyze-btn')?.addEventListener('click', () => this.analyzeDocuments());
        document.getElementById('cancel-preview')?.addEventListener('click', () => this.cancelPreview());
        document.getElementById('close-preview')?.addEventListener('click', () => this.cancelPreview());

        // Controles de resultados
        document.getElementById('new-analysis')?.addEventListener('click', () => this.resetScanner());
        document.getElementById('download-report')?.addEventListener('click', () => this.downloadReport());

        // Tabs de detalles
        document.querySelectorAll('.detail-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchDetailTab(e.target.dataset.tab);
            });
        });
    }

    switchTab(tabName) {
        // Actualizar botones activos
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Mostrar contenido activo
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Inicializar cámara si es necesario
        if (tabName === 'camera' && !this.stream) {
            this.startCamera();
        } else if (tabName !== 'camera' && this.stream) {
            this.stopCamera();
        }
    }

    switchDetailTab(tabName) {
        document.querySelectorAll('.detail-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        document.querySelectorAll('.detail-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-panel`);
        });
    }

    async handleFileSelect(files) {
        if (files.length === 0) return;

        this.currentDocuments = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (this.isValidFileType(file)) {
                const documentData = await this.processFile(file);
                this.currentDocuments.push(documentData);
            }
        }

        if (this.currentDocuments.length > 0) {
            this.showPreview();
        } else {
            this.showNotification('No se seleccionaron documentos válidos', 'error');
        }
    }

    isValidFileType(file) {
        const validTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'image/tiff',
            'image/bmp',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        
        return validTypes.includes(file.type);
    }

    async processFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve({
                    file: file,
                    dataUrl: e.target.result,
                    name: file.name,
                    type: file.type,
                    size: this.formatFileSize(file.size),
                    thumbnail: this.generateThumbnail(file, e.target.result)
                });
            };
            
            reader.readAsDataURL(file);
        });
    }

    generateThumbnail(file, dataUrl) {
        if (file.type.includes('image')) {
            return dataUrl;
        } else {
            // Para PDF y otros documentos, generar un icono representativo
            return this.getFileIcon(file.type);
        }
    }

    getFileIcon(fileType) {
        const icons = {
            'application/pdf': 'fas fa-file-pdf',
            'image/': 'fas fa-file-image',
            'application/msword': 'fas fa-file-word',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fas fa-file-word',
            'text/plain': 'fas fa-file-alt'
        };

        for (const [key, icon] of Object.entries(icons)) {
            if (fileType.includes(key)) {
                return icon;
            }
        }

        return 'fas fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showPreview() {
        this.hideAllSections();
        document.getElementById('document-preview').classList.remove('hidden');
        
        const thumbnailsContainer = document.getElementById('document-thumbnails');
        thumbnailsContainer.innerHTML = '';

        this.currentDocuments.forEach((doc, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'document-thumb';
            
            if (doc.thumbnail.startsWith('data:') || doc.thumbnail.startsWith('http')) {
                thumb.innerHTML = `
                    <img src="${doc.thumbnail}" alt="${doc.name}">
                    <div class="file-name">${doc.name}</div>
                `;
            } else {
                thumb.innerHTML = `
                    <div class="file-icon">
                        <i class="${doc.thumbnail}"></i>
                    </div>
                    <div class="file-name">${doc.name}</div>
                `;
            }
            
            thumbnailsContainer.appendChild(thumb);
        });
    }

    async analyzeDocuments() {
        if (this.currentDocuments.length === 0) return;

        this.showLoading(true);
        
        try {
            const formData = new FormData();
            this.currentDocuments.forEach(doc => {
                formData.append('documents[]', doc.file);
            });

            // Obtener información del usuario logueado
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.id) {
                formData.append('entity_id', user.id);
            }

            const response = await fetch('api/analyze_document.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                this.showResults(data.results);
                this.saveToDashboard(data.results);
                this.updateActivity(data.results);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error analyzing documents:', error);
            this.showNotification('Error al analizar los documentos: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    showResults(results) {
        this.hideAllSections();
        document.getElementById('analysis-result').classList.remove('hidden');

        // Actualizar puntuación general
        const overallScore = results.overall_authenticity;
        document.getElementById('score-value').textContent = `${overallScore}%`;
        
        const scoreCircle = document.getElementById('score-circle');
        scoreCircle.style.background = `conic-gradient(${this.getScoreColor(overallScore)} 0% ${overallScore}%, #eee ${overallScore}% 100%)`;

        // Actualizar etiqueta de autenticidad
        const authenticityLabel = document.getElementById('authenticity-label');
        authenticityLabel.textContent = this.getAuthenticityLabel(overallScore);

        // Actualizar nivel de confianza
        document.getElementById('confidence-level').textContent = `Nivel de confianza: ${this.getConfidenceLevel(results.confidence)}`;

        // Actualizar información general
        document.getElementById('doc-type').textContent = results.document_type;
        document.getElementById('doc-size').textContent = results.file_size;
        document.getElementById('doc-resolution').textContent = results.resolution || 'N/A';
        document.getElementById('analysis-date').textContent = new Date().toLocaleDateString();

        // Actualizar elementos de seguridad
        this.updateSecurityElements(results.security_elements);

        // Actualizar comparación
        this.updateComparisonResults(results.comparison_results);

        // Actualizar metadatos
        this.updateMetadata(results.metadata);

        // Actualizar resumen
        this.updateSummary(results.summary);
    }

    getScoreColor(score) {
        if (score >= 80) return 'var(--success)';
        if (score >= 60) return 'var(--warning)';
        return 'var(--error)';
    }

    getAuthenticityLabel(score) {
        if (score >= 80) return 'Documento Auténtico';
        if (score >= 60) return 'Documento Sospechoso';
        return 'Documento Potencialmente Falso';
    }

    getConfidenceLevel(confidence) {
        if (confidence >= 0.9) return 'Muy Alto';
        if (confidence >= 0.7) return 'Alto';
        if (confidence >= 0.5) return 'Moderado';
        return 'Bajo';
    }

    updateSecurityElements(elements) {
        const container = document.getElementById('security-elements');
        container.innerHTML = '';

        elements.forEach(element => {
            const item = document.createElement('div');
            item.className = `security-item ${element.status}`;
            
            item.innerHTML = `
                <div class="security-info">
                    <div class="security-name">${element.name}</div>
                    <div class="security-description">${element.description}</div>
                </div>
                <div class="security-status status-${element.status}">
                    ${element.status === 'verified' ? 'Verificado' : 
                      element.status === 'suspicious' ? 'Sospechoso' : 'Falso'}
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    updateComparisonResults(comparisons) {
        const container = document.getElementById('comparison-results');
        container.innerHTML = '';

        comparisons.forEach(comparison => {
            const item = document.createElement('div');
            item.className = 'comparison-item';
            
            item.innerHTML = `
                <div class="security-info">
                    <div class="security-name">${comparison.field}</div>
                    <div class="security-description">${comparison.description}</div>
                </div>
                <div class="security-status status-${comparison.status}">
                    ${comparison.similarity}% de similitud
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    updateMetadata(metadata) {
        const container = document.getElementById('metadata-list');
        container.innerHTML = '';

        Object.entries(metadata).forEach(([key, value]) => {
            const item = document.createElement('div');
            item.className = 'metadata-item';
            
            item.innerHTML = `
                <div class="security-info">
                    <div class="security-name">${this.formatMetadataKey(key)}</div>
                </div>
                <div class="detail-value">${value || 'N/A'}</div>
            `;
            
            container.appendChild(item);
        });
    }

    formatMetadataKey(key) {
        return key.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    updateSummary(summary) {
        document.getElementById('summary-content').textContent = summary;
    }

    async saveToDashboard(results) {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.id) return;

            const response = await fetch('api/save_to_dashboard.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    entity_id: user.id,
                    results: results,
                    documents: this.currentDocuments.map(doc => ({
                        name: doc.name,
                        type: doc.type,
                        size: doc.size
                    }))
                })
            });

            const data = await response.json();
            if (!data.success) {
                console.error('Error saving to dashboard:', data.message);
            }
        } catch (error) {
            console.error('Error saving to dashboard:', error);
        }
    }

    updateActivity(results) {
        // Esta función se implementará en activity.js
        if (window.activityManager) {
            window.activityManager.addActivity({
                type: 'document_analysis',
                title: 'Documento analizado',
                description: `Se analizó ${this.currentDocuments.length} documento(s)`,
                result: results.overall_authenticity,
                timestamp: new Date().toISOString()
            });
        }
    }

    // Métodos de cámara (similares a los anteriores pero mejorados)
    async startCamera() {
        try {
            this.stopCamera();
            
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: this.currentFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            const video = document.getElementById('video');
            video.srcObject = this.stream;
            
            document.getElementById('capture-btn').disabled = false;
        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showNotification('No se pudo acceder a la cámara', 'error');
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    switchCamera() {
        this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
        this.startCamera();
    }

    captureImage() {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'document-capture.jpg', { 
                type: 'image/jpeg',
                lastModified: Date.now()
            });

            this.handleFileSelect([file]);
            this.stopCamera();
            this.switchTab('upload');
        }, 'image/jpeg', 0.9);
    }

    async fetchFromURL() {
        const url = document.getElementById('document-url').value;
        if (!url) {
            this.showNotification('Por favor, ingrese una URL válida', 'error');
            return;
        }

        try {
            this.showLoading(true);
            const response = await fetch(`api/fetch_document.php?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (data.success) {
                // Convertir base64 a blob y luego a file
                const blob = this.base64ToBlob(data.content, data.type);
                const file = new File([blob], data.filename, { type: data.type });
                this.handleFileSelect([file]);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            this.showNotification('Error al obtener el documento: ' + error.message, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    base64ToBlob(base64, contentType) {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    cancelPreview() {
        this.hideAllSections();
        this.currentDocuments = [];
        this.switchTab('upload');
    }

    resetScanner() {
        this.hideAllSections();
        this.currentDocuments = [];
        document.getElementById('file-input').value = '';
        document.getElementById('document-url').value = '';
        this.switchTab('upload');
    }

    hideAllSections() {
        document.getElementById('document-preview').classList.add('hidden');
        document.getElementById('analysis-result').classList.add('hidden');
    }

    downloadReport() {
        // Implementar generación de reporte PDF
        this.showNotification('Funcionalidad de descarga de reporte en desarrollo', 'info');
    }

    showLoading(show) {
        // Implementar overlay de carga
        const btn = document.getElementById('analyze-btn');
        if (btn) {
            btn.classList.toggle('analyzing', show);
            btn.innerHTML = show ? 
                '<i class="fas fa-spinner fa-spin"></i> Analizando...' : 
                '<i class="fas fa-search"></i> Analizar Documento';
            btn.disabled = show;
        }
    }

    showNotification(message, type = 'info') {
        // Implementar sistema de notificaciones
        console.log(`${type}: ${message}`);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.documentScanner = new DocumentScanner();
});