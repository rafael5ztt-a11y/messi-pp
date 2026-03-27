// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("HiringPro Dashboard initialized.");

    // --- Auth State ---
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.querySelector('.logout-btn');

    // Start App hidden, Login shown
    appContainer.style.display = 'none';

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Mock Login success
        loginContainer.classList.remove('active');
        appContainer.style.display = 'flex';
    });

    logoutBtn.addEventListener('click', () => {
        appContainer.style.display = 'none';
        loginContainer.classList.add('active');
        loginForm.reset();
    });

    // --- State & Routing ---
    const navButtons = document.querySelectorAll('.nav-btn[data-view]');
    const viewSections = document.querySelectorAll('.view-section');

    function switchView(viewId) {
        // Update active nav button
        navButtons.forEach(btn => {
            if (btn.dataset.view === viewId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show active section
        viewSections.forEach(section => {
            if (section.id === `view-${viewId}`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // Attach click listeners to nav buttons
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = btn.dataset.view;
            if (viewId) {
                switchView(viewId);
            }
        });
    });

    // --- Supabase Config Placeholder ---
    // El usuario debe insertar su URL y Key aquí
    const SUPABASE_URL = 'VUESTRA_URL_AQUI';
    const SUPABASE_ANON_KEY = 'VUESTRA_ANON_KEY_AQUI';
    
    window.supabaseClient = null;

    if (typeof supabase !== 'undefined') {
        // window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase client placeholder configured. Descomenta para inicializar cuando tengas las credenciales.");
    } else {
        console.error("Supabase script failed to load.");
    }

    // --- Modal Logic ---
    const modal = document.getElementById('candidate-modal');
    const btnAddCandidate = document.getElementById('btn-add-candidate');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    function openModal() {
        modal.classList.add('active');
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.getElementById('candidate-form').reset();
    }
    
    btnAddCandidate.addEventListener('click', openModal);
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // --- Scoring Logic & Candidates Mock ---
    function calculateScore(experiencia, skillsString) {
        let score = 0;
        score += Math.min(experiencia * 10, 50); // Max 50 pts for exp
        
        const skillsArray = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
        score += Math.min(skillsArray.length * 5, 50); // Max 50 pts for skills
        
        return Math.min(score, 100);
    }

    // Mock Database with Local Storage Fallback
    let candidatos = [
        {
            id: 1, nombre: 'Ana García', email: 'ana@example.com', experiencia: 4, 
            skills: 'React, TypeScript, CSS', estado: 'entrevista', score: 55
        },
        {
            id: 2, nombre: 'Carlos Ruiz', email: 'carlos@example.com', experiencia: 2, 
            skills: 'HTML, JS, Figma', estado: 'aplicado', score: 35
        },
        {
            id: 3, nombre: 'María Fernández', email: 'maria@example.com', experiencia: 8, 
            skills: 'Python, AWS, Node, SQL', estado: 'contratado', score: 95
        }
    ];

    function saveToLocalStorage() {
        localStorage.setItem('hiringApp_candidates', JSON.stringify(candidatos));
    }

    function loadFromLocalStorage() {
        const stored = localStorage.getItem('hiringApp_candidates');
        if (stored) {
            candidatos = JSON.parse(stored);
        } else {
            // First time ever, save the mocks
            saveToLocalStorage();
        }
    }
    
    loadFromLocalStorage();

    // --- Toast System ---
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, icon = 'fa-check-circle', type = 'success') {
        if(!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast`;
        if (type === 'primary') toast.style.borderLeftColor = 'var(--primary)';
        
        toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--${type}); font-size: 18px;"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Attach to Login
    loginForm.addEventListener('submit', (e) => {
        // e.preventDefault already applied further up, but just in case:
        showToast('Sesión iniciada correctamente', 'fa-check-circle', 'success');
    });

    const grid = document.getElementById('candidates-grid');
    
    function renderCandidates(listaACargar = candidatos) {
        if (listaACargar.length === 0) {
            grid.innerHTML = '<div class="content-panel" style="grid-column: 1 / -1;"><p class="empty-state">No hay candidatos que coincidan con la búsqueda.</p></div>';
            return;
        }
        
        grid.innerHTML = '';
        listaACargar.forEach(c => {
            const skillsHtml = c.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('');
            const scoreClass = c.score < 50 ? 'low' : '';
            
            const card = document.createElement('div');
            card.className = 'candidate-card';
            card.innerHTML = `
                <div class="candidate-header-wrap">
                    <img src="https://i.pravatar.cc/150?u=${c.email}" alt="Avatar" class="candidate-avatar">
                    <div class="candidate-info">
                        <h4>${c.nombre}</h4>
                        <p>${c.email}</p>
                    </div>
                    <div class="score-badge ${scoreClass}">${c.score}%</div>
                </div>
                <div class="card-skills">
                    ${skillsHtml}
                </div>
                <div class="card-footer">
                    <span class="status-badge status-${c.estado}">${c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}</span>
                    <div class="card-actions">
                        <button class="icon-btn" title="Añadir Nota"><i class="fa-regular fa-comment"></i></button>
                        <button class="icon-btn" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        
        // Add spectacular staggered entry animation
        const cards = grid.querySelectorAll('.candidate-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s, border-color 0.2s';
            
            // Trigger reflow
            void card.offsetWidth;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 60 * index);
        });
        
        // Update Dashboard KPIs globally based on 'candidatos' array, not the filtered list
        document.querySelectorAll('.kpi-value')[0].textContent = candidatos.length;
        document.querySelectorAll('.kpi-value')[1].textContent = candidatos.filter(c => c.estado === 'entrevista').length;
        document.querySelectorAll('.kpi-value')[2].textContent = candidatos.filter(c => c.estado === 'contratado').length;
    }

    // --- Search & Filters ---
    const searchInput = document.querySelector('.header-search-input');
    const statusFilter = document.querySelectorAll('.filter-select')[0];
    const scoreFilter = document.querySelectorAll('.filter-select')[1];

    function handleFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusVal = statusFilter.value;
        const scoreSort = scoreFilter.value;

        let filtrados = candidatos.filter(c => {
            const matchesSearch = c.nombre.toLowerCase().includes(searchTerm) || 
                                  c.skills.toLowerCase().includes(searchTerm);
            const matchesStatus = statusVal === '' || c.estado === statusVal;
            return matchesSearch && matchesStatus;
        });

        if (scoreSort === 'asc') {
            filtrados.sort((a, b) => a.score - b.score);
        } else {
            // default
            filtrados.sort((a, b) => b.score - a.score);
        }

        renderCandidates(filtrados);
    }

    searchInput.addEventListener('input', handleFilters);
    statusFilter.addEventListener('change', handleFilters);
    scoreFilter.addEventListener('change', handleFilters);

    // Initial Render applying default sort natively
    handleFilters();

    // Form Submit (Add Candidate)
    const form = document.getElementById('candidate-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const exp = parseInt(formData.get('experiencia')) || 0;
        const skills = formData.get('skills') || '';
        
        const score = calculateScore(exp, skills);
        
        const newCandidate = {
            id: Date.now(),
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            experiencia: exp,
            skills: skills,
            estado: formData.get('estado'),
            score: score
        };
        
        candidatos.unshift(newCandidate); 
        saveToLocalStorage();
        handleFilters(); // Render with current filters applied
        closeModal();
        showToast('Candidato registrado con éxito', 'fa-user-check', 'primary');
    });

});
