let stream = null;
let currentFacingMode = 'environment'; // Cámara trasera por defecto

document.addEventListener('DOMContentLoaded', function() {
    const startCameraBtn = document.getElementById('start-camera');
    const captureBtn = document.getElementById('capture-btn');
    const switchCameraBtn = document.getElementById('switch-camera');
    const closeCameraBtn = document.getElementById('close-camera');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    
    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', startCamera);
    }
    
    if (captureBtn) {
        captureBtn.addEventListener('click', captureImage);
    }
    
    if (switchCameraBtn) {
        switchCameraBtn.addEventListener('click', switchCamera);
    }
    
    if (closeCameraBtn) {
        closeCameraBtn.addEventListener('click', stopCamera);
    }
});

async function startCamera() {
    try {
        // Detener cámara si ya está activa
        if (stream) {
            stopCamera();
        }
        
        // Solicitar acceso a la cámara
        stream = await navigator.mediaDevices.getUserMedia({
            video: { 
                facingMode: currentFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });
        
        const video = document.getElementById('video');
        video.srcObject = stream;
        
        // Mostrar vista de cámara y ocultar opciones
        document.getElementById('upload-option').classList.add('hidden');
        document.getElementById('camera-option').classList.add('hidden');
        document.getElementById('camera-preview').classList.remove('hidden');
        
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert('No se pudo acceder a la cámara. Asegúrese de permitir el acceso.');
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    const video = document.getElementById('video');
    video.srcObject = null;
    
    // Ocultar vista de cámara y mostrar opciones
    document.getElementById('camera-preview').classList.add('hidden');
    document.getElementById('upload-option').classList.remove('hidden');
    document.getElementById('camera-option').classList.remove('hidden');
}

async function switchCamera() {
    // Detener cámara actual
    stopCamera();
    
    // Cambiar modo de cámara
    currentFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    
    // Iniciar cámara con nuevo modo
    await startCamera();
}

function captureImage() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas al video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Dibujar frame actual en canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convertir a blob y crear archivo
    canvas.toBlob(function(blob) {
        // Crear archivo a partir del blob
        const file = new File([blob], 'document-capture.jpg', { 
            type: 'image/jpeg',
            lastModified: Date.now()
        });
        
        // Crear input file simulado
        const fileInput = document.getElementById('file-input');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // Previsualizar documento
        previewDocument(file);
        
        // Detener cámara
        stopCamera();
        
    }, 'image/jpeg', 0.9);
}