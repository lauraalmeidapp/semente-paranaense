// Calculadora de Sementes
function calcularSementes() {
    // Obter valores dos inputs
    const cultura = document.getElementById('cultura').value;
    const area = parseFloat(document.getElementById('area').value);
    let densidade = parseFloat(document.getElementById('densidade').value);
    
    // Validação
    if (isNaN(area) || area <= 0) {
        alert('Por favor, insira uma área válida (maior que 0)');
        return;
    }
    
    // Definir densidade padrão baseada na cultura se não for informada
    if (isNaN(densidade) || densidade <= 0) {
        const densidadesPadrao = {
            'milho': 60000,
            'soja': 300000,
            'trigo': 200000,
            'feijao': 180000
        };
        densidade = densidadesPadrao[cultura];
        alert(`Usando densidade padrão para ${getNomeCultura(cultura)}: ${densidade.toLocaleString()} sementes/ha`);
    }
    
    // Calcular total de sementes
    const totalSementes = area * densidade;
    
    // Calcular número de sacos (cada saco tem 60.000 sementes)
    const sementesPorSaco = 60000;
    const totalSacos = Math.ceil(totalSementes / sementesPorSaco);
    
    // Calcular custo total - atualizado com feijão
    const precos = {
        'milho': 450,
        'soja': 380,
        'trigo': 520,
        'feijao': 350
    };
    
    const precoPorSaco = precos[cultura];
    const custoTotal = totalSacos * precoPorSaco;
    
    // Calcular créditos de carbono (estimativa)
    const arvoresEquivalentes = Math.round(totalSementes * 0.0000001);
    
    // Exibir resultados
    document.getElementById('totalSementes').textContent = totalSementes.toLocaleString();
    document.getElementById('totalSacos').textContent = totalSacos.toLocaleString();
    document.getElementById('custoTotal').textContent = `R$ ${custoTotal.toLocaleString('pt-BR')}`;
    document.getElementById('arvores').textContent = arvoresEquivalentes.toLocaleString();
    
    // Mostrar resultado com animação
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.style.display = 'block';
    
    // Rolagem suave até o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função auxiliar para obter nome da cultura
function getNomeCultura(cultura) {
    const nomes = {
        'milho': 'Milho Híbrido',
        'soja': 'Soja Transgênica',
        'trigo': 'Trigo Certificado',
        'feijao': 'Feijão'
    };
    return nomes[cultura];
}

// Adicionar evento de tecla Enter nos inputs
document.getElementById('area').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calcularSementes();
    }
});

document.getElementById('densidade').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        calcularSementes();
    }
});

// Rolagem suave para links de navegação
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

// Validação em tempo real para inputs
document.getElementById('area').addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
});

document.getElementById('densidade').addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
});

// Mostrar valor da densidade padrão quando mudar a cultura
document.getElementById('cultura').addEventListener('change', function() {
    const densidadeInput = document.getElementById('densidade');
    if (!densidadeInput.value || densidadeInput.value <= 0) {
        const cultura = this.value;
        const densidadesPadrao = {
            'milho': 60000,
            'soja': 300000,
            'trigo': 200000,
            'feijao': 180000
        };
        densidadeInput.placeholder = `Ex: ${densidadesPadrao[cultura].toLocaleString()}`;
    }
});

// Inicializar placeholder quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    const culturaSelect = document.getElementById('cultura');
    const event = new Event('change');
    culturaSelect.dispatchEvent(event);
});

// Efeito de fade-in para elementos ao scroll
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

// Observar elementos para animação
document.querySelectorAll('.card, .sobre-content, .calculadora-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ========== CÓDIGO DE ACESSIBILIDADE ==========

// Abrir/fechar painel de acessibilidade
const accessBtn = document.getElementById('accessBtn');
const accessPanel = document.getElementById('accessPanel');
const closePanel = document.getElementById('closePanel');

accessBtn.addEventListener('click', () => {
    accessPanel.classList.toggle('show');
});

closePanel.addEventListener('click', () => {
    accessPanel.classList.remove('show');
});

// Fechar painel ao clicar fora
document.addEventListener('click', (event) => {
    if (!accessBtn.contains(event.target) && !accessPanel.contains(event.target)) {
        accessPanel.classList.remove('show');
    }
});

// ===== FUNÇÃO DE LEITURA DE TELA (Web Speech API) =====
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;

function lerTexto(texto) {
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
    currentUtterance = new SpeechSynthesisUtterance(texto);
    currentUtterance.lang = 'pt-BR';
    currentUtterance.rate = 0.9;
    speechSynthesis.speak(currentUtterance);
}

function pararLeitura() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
        currentUtterance = null;
    }
}

// Ler página inteira
document.getElementById('readPageBtn').addEventListener('click', () => {
    // Coletar todo o texto da página
    const textos = [];
    
    // Pega textos das principais seções
    const heroText = document.querySelector('.hero-content h1')?.innerText + '. ' + 
                     document.querySelector('.hero-content p')?.innerText;
    if (heroText) textos.push(heroText);
    
    const sobreText = document.querySelector('.sobre h2')?.innerText + '. ' +
                      document.querySelector('.sobre-texto')?.innerText;
    if (sobreText) textos.push(sobreText);
    
    const sementesText = document.querySelector('.sementes h2')?.innerText + '. ';
    const cards = document.querySelectorAll('.card h3');
    cards.forEach(card => {
        const cardText = card.innerText + '. ' + card.nextElementSibling?.innerText;
        if (cardText) textos.push(cardText);
    });
    
    const calculadoraText = document.querySelector('.calculadora h2')?.innerText + '. ' +
                            document.querySelector('.calculadora > .container > p')?.innerText;
    if (calculadoraText) textos.push(calculadoraText);
    
    const footerText = document.querySelector('footer')?.innerText;
    if (footerText) textos.push(footerText);
    
    lerTexto(textos.join('. '));
});

document.getElementById('stopReadBtn').addEventListener('click', () => {
    pararLeitura();
});

// ===== AJUSTE DE FONTE (AUMENTAR E DIMINUIR) =====
let currentFontSize = 100;

function aplicarTamanhoFonte(tamanho) {
    document.documentElement.style.fontSize = tamanho + '%';
    localStorage.setItem('fontSize', tamanho);
}

function aumentarFonte() {
    if (currentFontSize < 150) {
        currentFontSize += 10;
        aplicarTamanhoFonte(currentFontSize);
    }
}

function diminuirFonte() {
    if (currentFontSize > 70) {
        currentFontSize -= 10;
        aplicarTamanhoFonte(currentFontSize);
    }
}

function resetarFonte() {
    currentFontSize = 100;
    aplicarTamanhoFonte(currentFontSize);
}

if (localStorage.getItem('fontSize')) {
    currentFontSize = parseInt(localStorage.getItem('fontSize'));
    aplicarTamanhoFonte(currentFontSize);
}

document.getElementById('increaseFont').addEventListener('click', aumentarFonte);
document.getElementById('decreaseFont').addEventListener('click', diminuirFonte);
document.getElementById('resetFont').addEventListener('click', resetarFonte);

// ===== MODO ESCURO E CLARO =====
document.getElementById('darkMode').addEventListener('click', () => {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
});

document.getElementById('lightMode').addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
});

document.getElementById
