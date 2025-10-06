class MisterVPN {
    constructor() {
        this.config = null;
        this.init();
    }

    async init() {
        try {
            await this.loadConfig();
            this.populateContent();
            this.setupEventListeners();
            this.hideLoadingScreen();
        } catch (error) {
            console.error('Erro ao inicializar:', error);
            this.showError();
        }
    }

    async loadConfig() {
        try {
            const response = await fetch('config.json?' + Date.now());
            if (!response.ok) {
                throw new Error('Erro ao carregar configuração');
            }
            this.config = await response.json();
        } catch (error) {
            console.error('Erro ao carregar config.json:', error);
            throw error;
        }
    }

    populateContent() {
        if (!this.config) return;

        this.updateTexts();
        this.createPlans();
        this.createResellerPlans();
        this.createBenefits();
        this.updateLinks();
    }

    updateTexts() {
        const empresaNome = document.getElementById('empresaNome');
        const empresaNomeFooter = document.getElementById('empresaNomeFooter');
        const tituloPrincipal = document.getElementById('tituloPrincipal');
        const subtitulo = document.getElementById('subtitulo');
        const descricaoPlanos = document.getElementById('descricaoPlanos');
        const descricaoRevenda = document.getElementById('descricaoRevenda');
        const descricaoDownload = document.getElementById('descricaoDownload');

        if (empresaNome) empresaNome.textContent = this.config.empresa.nome;
        if (empresaNomeFooter) empresaNomeFooter.textContent = this.config.empresa.nome;
        if (tituloPrincipal) tituloPrincipal.textContent = this.config.textos.titulo_principal;
        if (subtitulo) subtitulo.textContent = this.config.textos.subtitulo;
        if (descricaoPlanos) descricaoPlanos.textContent = this.config.textos.descricao_planos;
        if (descricaoRevenda) descricaoRevenda.textContent = this.config.textos.descricao_revenda;
        if (descricaoDownload) descricaoDownload.textContent = this.config.textos.descricao_download;
    }

    createPlans() {
        const plansGrid = document.getElementById('planosGrid');
        if (!plansGrid || !this.config.planos_usuarios) return;

        plansGrid.innerHTML = '';

        this.config.planos_usuarios.forEach((plano, index) => {
            const planCard = document.createElement('div');
            planCard.className = `plan-card ${index === 1 ? 'featured' : ''}`;
            
            planCard.innerHTML = `
                <div class="plan-header">
                    <div class="plan-logins">${plano.logins} ${plano.logins === 1 ? 'Login' : 'Logins'}</div>
                    <div class="plan-price">
                        R$ <span class="plan-currency">${plano.preco}</span>
                    </div>
                </div>
                <div class="plan-description">${plano.descricao}</div>
                <ul class="plan-features">
                    <li>${plano.detalhes}</li>
                    <li>Navegação 100% anônima</li>
                    <li>Proteção contra hackers</li>
                    <li>Acesso a conteúdo bloqueado</li>
                    <li>Velocidade ultra-rápida</li>
                    <li>Suporte 24/7</li>
                </ul>
                <div class="plan-buttons">
                    <a href="${this.config.links.comprar}" class="btn btn-primary btn-plan" target="_blank">
                        <i class="fas fa-shopping-cart"></i>
                        Comprar Agora
                    </a>
                    <a href="${this.config.links.criar_teste}" class="btn btn-secondary btn-plan" target="_blank">
                        <i class="fas fa-play"></i>
                        Criar Teste
                    </a>
                </div>
            `;

            plansGrid.appendChild(planCard);
        });
    }

    createResellerPlans() {
        const revendaGrid = document.getElementById('revendaGrid');
        if (!revendaGrid || !this.config.planos_revenda) return;

        revendaGrid.innerHTML = '';

        this.config.planos_revenda.forEach((plano) => {
            const resellerCard = document.createElement('div');
            resellerCard.className = 'reseller-card';
            
            resellerCard.innerHTML = `
                <div class="reseller-logins">${plano.logins} Logins</div>
                <div class="reseller-price">R$ ${plano.preco}</div>
                <div class="reseller-description-card">${plano.descricao}</div>
                <ul class="reseller-features">
                    <li>Painel de gerenciamento completo</li>
                    <li>Criar usuários mensais</li>
                    <li>Gerar testes gratuitos</li>
                    <li>Sistema de sub-revendas</li>
                    <li>Relatórios detalhados</li>
                    <li>Suporte prioritário</li>
                </ul>
                <a href="${this.config.links.comprar}" class="btn btn-primary btn-plan" target="_blank">
                    <i class="fas fa-handshake"></i>
                    Seja um Revendedor
                </a>
            `;

            revendaGrid.appendChild(resellerCard);
        });
    }

    createBenefits() {
        const beneficiosGrid = document.getElementById('beneficiosGrid');
        if (!beneficiosGrid || !this.config.textos.beneficios) return;

        beneficiosGrid.innerHTML = '';

        const benefits = [
            { icon: 'fas fa-user-secret', title: 'Navegação Anônima', description: 'Mantenha sua privacidade online protegida' },
            { icon: 'fas fa-shield-alt', title: 'Proteção Total', description: 'Defenda-se contra hackers e malwares' },
            { icon: 'fas fa-globe', title: 'Acesso Global', description: 'Desbloqueie conteúdo de qualquer lugar do mundo' },
            { icon: 'fas fa-bolt', title: 'Velocidade Máxima', description: 'Navegue com a velocidade da sua internet' },
            { icon: 'fas fa-headset', title: 'Suporte 24/7', description: 'Nossa equipe está sempre disponível para ajudar' },
            { icon: 'fas fa-mobile-alt', title: 'Multiplataforma', description: 'Use em qualquer dispositivo Android' }
        ];

        benefits.forEach((benefit) => {
            const benefitCard = document.createElement('div');
            benefitCard.className = 'benefit-card';
            
            benefitCard.innerHTML = `
                <div class="benefit-icon">
                    <i class="${benefit.icon}"></i>
                </div>
                <h3 class="benefit-title">${benefit.title}</h3>
                <p class="benefit-description">${benefit.description}</p>
            `;

            beneficiosGrid.appendChild(benefitCard);
        });
    }

    updateLinks() {
        const btnCriarTeste = document.getElementById('btnCriarTeste');
        const btnDownload = document.getElementById('btnDownload');
        const btnSuporte = document.getElementById('btnSuporte');
        const appScreenshot = document.getElementById('appScreenshot');

        if (btnCriarTeste) btnCriarTeste.href = this.config.links.criar_teste;
        if (btnDownload) btnDownload.href = this.config.links.download_app;
        if (btnSuporte) btnSuporte.href = this.config.links.suporte;
        if (appScreenshot) appScreenshot.src = this.config.imagens.app_screenshot;
    }

    setupEventListeners() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupAnimations();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });

            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
    }

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.benefit-card, .plan-card, .reseller-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    showError() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Erro ao carregar</h3>
                    <p>Verifique se o arquivo config.json existe e está acessível.</p>
                    <button onclick="location.reload()" class="btn btn-primary">Tentar Novamente</button>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MisterVPN();
});

window.addEventListener('beforeunload', () => {
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
            });
        });
    }
});
