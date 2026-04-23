// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {

    // --- DİL SEÇİMİ VE UYGULAMA MANTIĞI ---
    let currentLang = localStorage.getItem('siteLang') || 'tr';
    const langBtns = document.querySelectorAll('.lang-btn');

    let textToType = currentLang === 'en' ? "Hello, I'm Rüveyda Kakşı" : "Merhaba, ben Rüveyda Kakşı";
    let typeIndex = 0;
    let typeTimeout;
    const typewriterElement = document.getElementById('typewriter-text');

    function typeWriter() {
        if (!typewriterElement) return;
        if (typeIndex < textToType.length) {
            typewriterElement.innerHTML += textToType.charAt(typeIndex);
            typeIndex++;
            typeTimeout = setTimeout(typeWriter, 100);
        }
    }

    function applyTranslations(lang) {
        document.title = lang === 'en' ? "Rüveyda - Software Engineering Student" : "Rüveyda - Yazılım Mühendisliği Öğrencisi";

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active-lang');
            } else {
                btn.classList.remove('active-lang');
            }
        });

        if (typewriterElement) {
            textToType = lang === 'en' ? "Hello, I'm Rüveyda Kakşı" : "Merhaba, ben Rüveyda Kakşı";
            typewriterElement.innerHTML = '';
            typeIndex = 0;
            clearTimeout(typeTimeout);
            typeWriter();
        }

        // Dinamik gelen Github kartlarındaki "GitHub'da incele" metnini güncelle
        document.querySelectorAll('.project-link').forEach(link => {
            if(translations[lang] && translations[lang]["view-on-github"]){
                link.innerHTML = translations[lang]["view-on-github"];
            }
        });
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            if (selectedLang !== currentLang) {
                currentLang = selectedLang;
                localStorage.setItem('siteLang', currentLang);
                applyTranslations(currentLang);
            }
        });
    });

    // Sayfa ilk yüklendiğinde mevcut dile göre başlat (Aksi takdirde varsayılan HTML(TR) görünür)
    applyTranslations(currentLang);

    // Sertifika butonlarını ve telefon ekranındaki resmi seçiyoruz
    const certButtons = document.querySelectorAll('.cert-btn');
    const mockupImage = document.getElementById('mockup-image');

    // Her bir butona tıklama özelliği ekliyoruz
    certButtons.forEach(button => {
        button.addEventListener('click', () => {

            // 1. Önce aktif olan butondan 'active' sınıfını kaldır
            certButtons.forEach(btn => btn.classList.remove('active'));

            // 2. Tıklanan butona 'active' sınıfını ekle
            button.classList.add('active');

            // 3. Geçişin yumuşak olması için resmin görünürlüğünü sıfırla (CSS transition ile)
            mockupImage.style.opacity = 0;

            // 4. Kısa bir süre sonra (200ms) resmi değiştir ve tekrar görünür yap
            setTimeout(() => {
                // Butonun içindeki 'data-img' değerini al ve resmin kaynağına ata
                const newImageSrc = button.getAttribute('data-img');
                mockupImage.src = newImageSrc;

                // Resmi tekrar görünür yap
                mockupImage.style.opacity = 1;
            }, 200);
        });
    });

    // Yazı yazma efekti dil değiştirici fonksiyona taşındı ve yönetiliyor

    // --- ARKA PLAN PARTİKÜLLERİ ---
    function createParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        const particleTypes = ['♡', '𓇼', 'ᯤ', '</>', '🖳', '✦'];
        const particleCount = 40; // Ekranda görünecek partikül sayısı
        const colors = ['#FFF0F5', '#FFEFD5', '#4169E1', '#c6a229ff', '#bfd5c3ff']; // Reel'deki mercan/pembe/sarı tonlar

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Rastgele partikül tipi
            particle.innerText = particleTypes[Math.floor(Math.random() * particleTypes.length)];

            // Rastgele boyut
            const size = Math.random() * 15 + 10; // 10px ile 25px arası
            particle.style.fontSize = `${size}px`;

            // Rastgele konum (tüm ekranda dağınık)
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;

            // Rastgele animasyon süresi ve gecikme
            const duration = Math.random() * 5 + 5; // 5s ile 10s arası titreşim
            const delay = Math.random() * 5;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `-${delay}s`;

            // Rastgele renk
            particle.style.color = colors[Math.floor(Math.random() * colors.length)];

            container.appendChild(particle);
        }
    }

    createParticles();

    // --- GITHUB PROJELERİNİ ÇEKME ---
    async function fetchGitHubProjects() {
        const container = document.getElementById('github-projects-container');
        if (!container) return;

        try {
            // Rkaksi kullanıcısının son güncellenen 3 reposunu çekiyoruz
            const response = await fetch('https://api.github.com/users/Rkaksi/repos?sort=updated&per_page=3');
            
            if (!response.ok) {
                throw new Error('Ağ yanıtı başarısız oldu');
            }

            const repos = await response.json();
            
            // Konteyneri temizle (Yükleniyor yazısını kaldır)
            container.innerHTML = '';

            // Repoları dönüp HTML oluştur
            repos.forEach(repo => {
                const card = document.createElement('div');
                card.className = 'project-card glass-panel';

                // Eğer açıklama yoksa varsayılan metin
                const noDescText = currentLang === 'en' ? 'No description provided for this project.' : 'Bu proje için henüz bir açıklama eklenmemiş.';
                const description = repo.description ? repo.description : noDescText;
                
                // Dil (Language) etiketini oluştur
                const languageTag = repo.language ? `<span class="skill-tag">${repo.language}</span>` : '';

                const viewText = translations[currentLang] && translations[currentLang]["view-on-github"] 
                    ? translations[currentLang]["view-on-github"] 
                    : "GitHub'da İncele &rarr;";

                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${description}</p>
                    <div class="skills">
                        ${languageTag}
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" data-i18n="view-on-github">${viewText}</a>
                `;

                container.appendChild(card);
            });

        } catch (error) {
            console.error('Projeler çekilirken hata oluştu:', error);
            const errorText = translations[currentLang] && translations[currentLang]["error-projects"] 
                ? translations[currentLang]["error-projects"] 
                : "Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
            container.innerHTML = `
                <div class="loader-container">
                    <p data-i18n="error-projects">${errorText}</p>
                </div>
            `;
        }
    }

    fetchGitHubProjects();

});
