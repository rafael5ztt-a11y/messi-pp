// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("HiringPro Dashboard initialized.");

    // --- Auth State ---
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');

    // Start App hidden, Login shown
    appContainer.style.display = 'none';

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Mock Login success
        loginContainer.classList.remove('active');
        appContainer.style.display = 'flex';
    });

    // Delegate logout since button is in settings now
    document.addEventListener('click', (e) => {
        if (e.target.closest('.logout-btn')) {
            appContainer.style.display = 'none';
            loginContainer.classList.add('active');
            loginForm.reset();
            
            // Optional: reset view to dashboard on logout
            const navButtons = document.querySelectorAll('.nav-item[data-view]');
            navButtons.forEach(b => {
                if (b.dataset.view === 'dashboard') b.classList.add('active');
                else b.classList.remove('active');
            });
            const viewSections = document.querySelectorAll('.view-section');
            viewSections.forEach(section => {
                if (section.id === 'view-dashboard') section.classList.add('active');
                else section.classList.remove('active');
            });
        }
    });

    // --- State & Routing ---
    const navButtons = document.querySelectorAll('.nav-item[data-view]');
    const viewSections = document.querySelectorAll('.view-section');
    
    // Header Setting button routing
    const btnSettings = document.getElementById('btn-settings');
    if(btnSettings) {
        btnSettings.addEventListener('click', () => {
            switchView('settings');
            // Remove active state from bottom nav
            navButtons.forEach(b => b.classList.remove('active'));
        });
    }

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

    // --- Slide-over Detail View ---
    const detailPage = document.getElementById('candidate-detail');
    const detailContent = document.getElementById('detail-content');
    const closeDetailBtn = document.getElementById('close-detail-btn');

    if(closeDetailBtn) {
        closeDetailBtn.addEventListener('click', () => {
            detailPage.classList.remove('active');
        });
    }

    function openCandidateDetail(c) {
        detailContent.innerHTML = `
            <img src="https://i.pravatar.cc/150?u=${c.email}" alt="Avatar" class="d-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${c.nombre}'">
            <h2 class="d-name">${c.nombre}</h2>
            <p class="d-email">${c.email}</p>
            
            <div class="d-actions-row">
                <button class="neu-btn ripple" style="width:64px; height:64px; font-size:24px; color:var(--brand-blue); border-radius:32px;"><i class="fa-solid fa-phone"></i></button>
                <button class="neu-btn ripple" style="width:64px; height:64px; font-size:24px; color:var(--brand-purple); border-radius:32px;"><i class="fa-regular fa-envelope"></i></button>
                <button class="neu-btn ripple" style="width:64px; height:64px; font-size:24px; color:var(--brand-green); border-radius:32px;"><i class="fa-regular fa-calendar-check"></i></button>
            </div>
            
            <div class="neu-card ripple" style="margin-bottom:24px; padding:20px;">
                <h4 style="margin-bottom:16px; font-size:16px; font-weight:800; color:var(--text-muted);">ESTADO DEL PROCESO</h4>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="c-status" style="font-size:20px; color: ${c.estado === 'contratado' ? 'var(--brand-green)' : c.estado === 'entrevista' ? 'var(--brand-blue)' : 'var(--text-dark)'}">${c.estado}</span>
                    <span class="c-score ${c.score < 50 ? 'low' : ''}" style="box-shadow:inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light); background:transparent;">${c.score}% Match</span>
                </div>
            </div>
            
            <div class="neu-card ripple" style="margin-bottom:24px; padding:20px;">
                <h4 style="margin-bottom:12px; font-size:16px; font-weight:800; color:var(--text-muted);">EXPERIENCIA</h4>
                <p style="font-size:28px; font-weight:800; color:var(--text-dark);">${c.experiencia} Años</p>
            </div>
            
            <div class="neu-card ripple" style="margin-bottom:30px; padding:20px;">
                <h4 style="margin-bottom:16px; font-size:16px; font-weight:800; color:var(--text-muted);">HABILIDADES DESTACADAS</h4>
                <div class="c-skills">
                    ${c.skills.split(',').map(s => `<span class="c-skill">${s.trim()}</span>`).join('')}
                </div>
            </div>
            
            ${c.estado === 'contratado' ? 
              `<button class="btn-primary ripple mt-4" style="background:var(--brand-green);" onclick="confetti({particleCount: 150, spread: 70, origin: { y: 0.6 }})">
                  <i class="fa-solid fa-party-horn"></i> 🎉 Contratado
              </button>` : ''}
        `;
        detailPage.classList.add('active');
    }

    // --- Toast System ---
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, icon = 'fa-check-circle', type = 'success') {
        if(!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast`;
        
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // --- Themes ---
    const themeButtons = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('hiring_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('hiring_theme', theme);
            showToast('Tema aplicado', 'fa-palette', 'primary');
        });
    });

    // Attach to Login
    loginForm.addEventListener('submit', (e) => {
        // e.preventDefault already applied further up, but just in case:
        showToast('Sesión iniciada correctamente', 'fa-check-circle', 'success');
    });

    const grid = document.getElementById('candidates-grid');
    
    function renderCandidates(listaACargar = candidatos) {
        grid.innerHTML = '';
        
        if (listaACargar.length === 0) {
            grid.innerHTML = `
                <div style="text-align:center; padding: 60px 20px;">
                    <i class="fa-regular fa-folder-open" style="font-size: 56px; color: #E4E4E7; margin-bottom: 20px;"></i>
                    <h3 style="color: var(--text-muted); font-size:16px; font-weight:600;">Sin resultados</h3>
                </div>`;
            return;
        }

        listaACargar.forEach(c => {
            const skillsHtml = c.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('');
            const scoreClass = c.score < 50 ? 'low' : '';
            
            const card = document.createElement('div');
            card.className = 'candidate-card neu-card ripple';
            card.innerHTML = `
                <div class="c-head">
                    <div class="c-profile">
                        <img src="https://i.pravatar.cc/150?u=${c.email}" alt="Avatar" class="c-avatar">
                        <div class="c-info">
                            <h4>${c.nombre}</h4>
                            <p>${c.email}</p>
                        </div>
                    </div>
                    <div class="c-score ${scoreClass}">${c.score}%</div>
                </div>
                <div class="c-skills">
                    ${skillsHtml}
                </div>
                <div class="c-footer">
                    <span class="c-status" style="color: ${c.estado === 'contratado' ? 'var(--success)' : c.estado === 'entrevista' ? '#3B82F6' : 'var(--text-muted)'}">${c.estado}</span>
                </div>
            `;
            
            // Interaction: Open Details
            card.addEventListener('click', () => openCandidateDetail(c));
            
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
        const valElements = document.querySelectorAll('.n-value');
        if(valElements.length >= 3) {
            valElements[0].textContent = candidatos.length;
            valElements[1].textContent = candidatos.filter(c => c.estado === 'entrevista').length;
            valElements[2].textContent = candidatos.filter(c => c.estado === 'contratado').length;
        }
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
        
        // Confetti explosion if hired!
        if (newCandidate.estado === 'contratado' && window.confetti) {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.4 },
                zIndex: 10000,
                colors: ['#3B82F6', '#10B981', '#F59E0B']
            });
        }
    });

});
