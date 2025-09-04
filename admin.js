document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('admin-login-form');
    const logoutButton = document.getElementById('logout-admin');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    if (logoutButton) {
        logoutButton.addEventListener('click', handleAdminLogout);
    }
    
    // Verificar si ya está autenticado
    checkAdminAuth();
});

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Credenciales hardcodeadas (en producción usar base de datos)
    if (username === 'PimexDS' && password === 'pimex123') {
        localStorage.setItem('adminAuthenticated', 'true');
        showDashboard();
    } else {
        alert('Credenciales de administrador incorrectas');
    }
}

function handleAdminLogout() {
    localStorage.removeItem('adminAuthenticated');
    showLogin();
}

function checkAdminAuth() {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (isAuthenticated === 'true') {
        showDashboard();
        loadAdminData();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('dashboard-section').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard-section').classList.remove('hidden');
}

async function loadAdminData() {
    try {
        // Cargar estadísticas
        const statsResponse = await fetch('api/get_stats.php');
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
            document.getElementById('admin-entities-count').textContent = statsData.stats.entities_count;
            document.getElementById('admin-documents-count').textContent = statsData.stats.documents_analyzed;
            document.getElementById('admin-fake-documents').textContent = statsData.stats.fake_documents;
        }
        
        // Cargar entidades
        const entitiesResponse = await fetch('api/get_entities.php?all=true');
        const entitiesData = await entitiesResponse.json();
        
        if (entitiesData.success) {
            populateEntitiesTable(entitiesData.entities);
        }
        
        // Cargar documentos
        const documentsResponse = await fetch('api/get_documents.php');
        const documentsData = await documentsResponse.json();
        
        if (documentsData.success) {
            populateDocumentsTable(documentsData.documents);
        }
    } catch (error) {
        console.error('Error loading admin data:', error);
    }
}

function populateEntitiesTable(entities) {
    const tableBody = document.querySelector('#entities-table tbody');
    tableBody.innerHTML = '';
    
    entities.forEach(entity => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${entity.id}</td>
            <td>${entity.entity_name}</td>
            <td>${getEntityTypeLabel(entity.entity_type)}</td>
            <td>${entity.sector}</td>
            <td>${new Date(entity.registration_date).toLocaleDateString()}</td>
            <td>
                <button class="btn-action btn-edit" data-id="${entity.id}">Editar</button>
                <button class="btn-action btn-delete" data-id="${entity.id}">Eliminar</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const entityId = e.target.dataset.id;
            deleteEntity(entityId);
        });
    });
}

function populateDocumentsTable(documents) {
    const tableBody = document.querySelector('#documents-table tbody');
    tableBody.innerHTML = '';
    
    documents.forEach(doc => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${doc.entity_name}</td>
            <td>${doc.document_name}</td>
            <td>${new Date(doc.upload_date).toLocaleDateString()}</td>
            <td class="${doc.is_authentic ? 'authentic-true' : 'authentic-false'}">
                ${doc.is_authentic ? 'Auténtico' : 'Falso'} (${doc.authenticity_score}%)
            </td>
            <td>
                <button class="btn-action btn-edit" data-id="${doc.id}">Ver</button>
                <button class="btn-action btn-delete" data-id="${doc.id}">Eliminar</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const documentId = e.target.dataset.id;
            deleteDocument(documentId);
        });
    });
}

function getEntityTypeLabel(type) {
    const types = {
        'government': 'Gobierno',
        'education': 'Educación',
        'business': 'Empresa'
    };
    
    return types[type] || type;
}

async function deleteEntity(entityId) {
    if (!confirm('¿Está seguro de que desea eliminar esta entidad?')) {
        return;
    }
    
    try {
        const response = await fetch('api/delete_entity.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: entityId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Entidad eliminada correctamente');
            loadAdminData(); // Recargar datos
        } else {
            alert('Error al eliminar la entidad: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting entity:', error);
        alert('Error al conectar con el servidor');
    }
}

async function deleteDocument(documentId) {
    if (!confirm('¿Está seguro de que desea eliminar este documento?')) {
        return;
    }
    
    try {
        const response = await fetch('api/delete_document.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: documentId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Documento eliminado correctamente');
            loadAdminData(); // Recargar datos
        } else {
            alert('Error al eliminar el documento: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting document:', error);
        alert('Error al conectar con el servidor');
    }
}