// ====================== CHARGEMENT DES DONNÉES ======================
async function loadData() {
    const response = await fetch('data.json');
    return await response.json();
}

// ====================== RENDU DES SECTIONS ======================
async function renderTimeline() {
    const data = await loadData();
    const container = document.getElementById('timeline');
    if (!container) return;
    container.innerHTML = '';

    data.profil.forEach((item, index) => {
        const isEven = index % 2 === 0;
        const html = `
            <div class="flex flex-col md:flex-row items-center gap-8 ${isEven ? '' : 'md:flex-row-reverse'}">
                <div class="flex-1 ${isEven ? 'text-right' : ''}">
                    <div class="glass inline-block px-6 py-3 rounded-3xl mb-4">
                        <span class="text-[#3B82F6] font-medium">${item.annee}</span>
                    </div>
                    <h3 class="text-2xl font-black">${item.titre}</h3>
                    <p class="text-[#F8F9FA]/70">${item.etablissement} • ${item.lieu}</p>
                </div>
                <div class="w-8 h-8 bg-[#3B82F6] rounded-2xl flex items-center justify-center z-10 shadow-lg text-white text-sm font-bold">→</div>
                <div class="flex-1 glass p-8 rounded-3xl">
                    <p class="text-[#F8F9FA]/90">${item.description}</p>
                </div>
            </div>
        `;
        container.innerHTML += html;
    });
}

async function renderCompetences() {
    const data = await loadData();
    const container = document.getElementById('competences-container');
    if (!container) return;
    container.innerHTML = '';

    const colonnes = [
        { titre: "Gestion d’Entreprise", donnees: data.competences.gestion },
        { titre: "Outils & Digital", donnees: data.competences.outils }
    ];

    colonnes.forEach(colonne => {
        let jaugesHTML = '';
        colonne.donnees.forEach(comp => {
            const pourcentage = (comp.niveau / 5) * 100;
            jaugesHTML += `
                <div class="group mb-8 last:mb-0">
                    <div class="flex justify-between items-baseline mb-2">
                        <span class="font-medium">${comp.nom}</span>
                        <span class="text-sm text-[#F8F9FA]/60">${comp.niveau}/5</span>
                    </div>
                    <div class="h-3 bg-[#1E293B] rounded-3xl overflow-hidden">
                        <div class="h-3 bg-[#3B82F6] transition-all duration-700 group-hover:bg-[#60A5FA]" style="width: ${pourcentage}%"></div>
                    </div>
                </div>
            `;
        });

        const html = `
            <div class="glass p-10 rounded-3xl">
                <h3 class="text-2xl font-black mb-8 text-[#3B82F6]">${colonne.titre}</h3>
                ${jaugesHTML}
            </div>
        `;
        container.innerHTML += html;
    });
}

async function renderProjets() {
    const data = await loadData();
    const container = document.getElementById('projets-container');
    if (!container) return;
    container.innerHTML = '';

    data.projets.forEach(projet => {
        const html = `
            <div onclick="openModal(${projet.id})" class="glass p-6 rounded-3xl cursor-pointer hover:scale-105 transition-all duration-300 group">
                <div class="flex justify-between items-start mb-4">
                    <div class="text-5xl">📊</div>
                    <span class="px-4 py-1 text-xs font-medium bg-[#3B82F6] text-white rounded-3xl">${projet.categorie}</span>
                </div>
                <h3 class="text-xl font-black mb-2 group-hover:text-[#3B82F6]">${projet.titre}</h3>
                <p class="text-[#F8F9FA]/70 text-sm">${projet.hook}</p>
            </div>
        `;
        container.innerHTML += html;
    });
}

async function renderPassions() {
    const data = await loadData();
    const container = document.getElementById('passions-container');
    if (!container) return;
    container.innerHTML = '';

    data.passions.forEach(passion => {
        const html = `
            <div class="glass p-8 rounded-3xl text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-default">
                <div class="text-6xl mb-6">${passion.icone}</div>
                <h3 class="text-xl font-black mb-2">${passion.titre}</h3>
                <p class="text-[#F8F9FA]/70">${passion.phrase}</p>
            </div>
        `;
        container.innerHTML += html;
    });
}

// ====================== MODALES ======================
let currentProjets = [];

async function openModal(id) {
    const data = await loadData();
    currentProjets = data.projets;
    const projet = currentProjets.find(p => p.id === id);
    if (!projet) return;

    document.getElementById('modal-titre').textContent = projet.titre;
    document.getElementById('modal-date').textContent = projet.date;
    document.getElementById('modal-lieu').textContent = projet.lieu;
    document.getElementById('modal-categorie-badge').textContent = projet.categorie;
    document.getElementById('modal-description').innerHTML = `<p>${projet.description}</p>`;

    const imageContainer = document.getElementById('modal-image');
    imageContainer.innerHTML = `<div class="text-8xl opacity-30">📸</div><p class="text-white/40 mt-4">Image du projet à ajouter dans assets/images/</p>`;

    const modal = document.getElementById('modal-projet');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('modal-projet');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// ====================== MENU MOBILE ======================
function openMobileMenu() {
    document.getElementById('mobile-menu').classList.remove('hidden');
    document.getElementById('mobile-menu').classList.add('flex');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.add('hidden');
    menu.classList.remove('flex');
}

// ====================== INITIALISATION UNIQUE ======================
document.addEventListener('DOMContentLoaded', () => {
    renderTimeline();
    renderCompetences();
    renderProjets();
    renderPassions();

    // Menu mobile
    const hamburger = document.getElementById('hamburger');
    if (hamburger) hamburger.addEventListener('click', openMobileMenu);

    // Fermeture avec Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modalProjet = document.getElementById('modal-projet');
            if (modalProjet && modalProjet.classList.contains('flex')) closeModal();
            if (document.getElementById('mobile-menu').classList.contains('flex')) closeMobileMenu();
        }
    });

    console.log('%c✅ Portfolio Cécé Gilbert chargé avec succès', 'color:#3B82F6; font-weight:bold');
});