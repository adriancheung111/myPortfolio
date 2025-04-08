// 等待DOM加載完成
document.addEventListener('DOMContentLoaded', function() {
    // 獲取DOM元素
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('section');
    const navbar = document.getElementById('navbar');
    const skillTags = document.querySelectorAll('.skill-tags span');
    
    // 設置導航欄為透明初始狀態
    navbar.classList.add('transparent');
    
    // 初始時移除所有導航項的active-link狀態
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active-link');
    });
    
    // 導航欄切換功能
    burger.addEventListener('click', function() {
        // 切換導航欄
        nav.classList.toggle('nav-active');
        
        // 切換漢堡選單動畫
        burger.classList.toggle('toggle');
        
        // 移除透明類別當菜單開啟時
        if (nav.classList.contains('nav-active')) {
            navbar.classList.remove('transparent');
        } else if (window.scrollY <= 50) {
            navbar.classList.add('transparent');
        }
        
        // 導航項目動畫
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });
    
    // 點擊導航連結關閉菜單
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            
            navLinks.forEach(link => {
                link.style.animation = '';
            });
            
            // 檢查是否需要添加透明類別回來
            if (window.scrollY <= 50) {
                navbar.classList.add('transparent');
            }
        });
    });
    
    // 添加滾動顯示動畫（排除timeline元素）
    const fadeElements = document.querySelectorAll('.skill-category, .education-item, .award-item, .portfolio-item');
    
    // 檢查元素是否在視窗中可見
    function checkFade() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            } else {
                element.classList.remove('fade-in');
            }
        });
    }
    
    // 確保工作經驗時間線始終可見
    document.querySelectorAll('.timeline-item, .timeline-content').forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
    });
    
    // 初始檢查
    checkFade();
    
    // 滾動時檢查
    window.addEventListener('scroll', checkFade);
    
    // 添加CSS動畫
    const style = document.createElement('style');
    style.textContent = `
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .skill-category, .education-item, .award-item, .portfolio-item {
            opacity: 0;
            transform: translateY(20px);
        }
        
        .skill-tags span {
            animation: fadeIn 0.5s ease forwards;
            opacity: 0;
        }
        
        .active-link {
            color: var(--secondary-color) !important;
            font-weight: 700;
        }
        
        @media screen and (max-width: 768px) {
            .nav-links.nav-active li {
                animation: navLinkFade 0.5s ease forwards;
                animation-delay: calc(var(--i) * 0.1s);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 設置導航項目的動畫延遲
    navLinks.forEach((link, index) => {
        link.style.setProperty('--i', index);
    });
    
    // Add staggered animation to skill tags
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.05}s`;
    });
    
    // 滾動事件處理
    window.addEventListener('scroll', function() {
        // 導航欄背景變化
        if (window.scrollY > 50) {
            navbar.classList.remove('transparent');
        } else {
            if (!nav.classList.contains('nav-active')) {
                navbar.classList.add('transparent');
            }
        }
        
        // 高亮當前區塊對應的導航項
        highlightNavOnScroll();
    });
    
    // 高亮當前滾動位置對應的導航項
    function highlightNavOnScroll() {
        let scrollPosition = window.scrollY;
        let windowHeight = window.innerHeight;
        let documentHeight = document.body.scrollHeight;
        
        // 檢查是否在頁面頂部/header部分
        if (scrollPosition < document.querySelector('#about').offsetTop - 100) {
            // 頁面頂部時移除所有active-link效果
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active-link');
            });
            return;
        }
        
        // 檢查是否滾動到頁面底部或接近底部
        if (scrollPosition + windowHeight >= documentHeight - 50) {
            // 已接近底部，高亮最後一個導航項（Awards）
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active-link');
            });
            document.querySelector('.nav-links a[href="#awards"]').classList.add('active-link');
            return;
        }
        
        // 正常滾動處理
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 修改這一行，使用更安全的選擇器語法
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                
                // 確保找到了元素才進行操作
                if (activeLink) {
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active-link');
                    });
                    activeLink.classList.add('active-link');
                }
            }
        });
    }
    
    // 平滑滾動到錨點
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 特別處理Awards部分的滾動
                if (targetId === '#awards') {
                    window.scrollTo({
                        top: document.body.scrollHeight - window.innerHeight,
                        behavior: 'smooth'
                    });
                    
                    // 設置Awards導航項為活動狀態
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active-link');
                    });
                    this.classList.add('active-link');
                } else {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}); 