const products = {
     hot: [
        { id: 1, title: "笔记本电脑", description: "轻薄便携，写代码、上网课、日常办公都很合适", price: 3999, discount: 0, image:"assets/images/laptop01.jpg", category: "hot" },
        { id: 2, title: "机械键盘", description: "敲击手感舒适，敲代码码字，颜值简约耐看", price: 239, discount: 15, image: "assets/images/keyboard01.jpg", category: "hot" },
        
        
    ],
    new: [
        { id: 3, title: "头戴式耳机", description: "隔音降噪，自习听歌，长时间佩戴不压耳", price: 199, discount: 0, image: "assets/images/headpnone01.jpg", category: "hot" },
    ],
    sale: [
        { id: 9, title: "简约马克杯", description: "日常喝水喝咖啡，宿舍桌面百搭好物", price: 25, discount: 0, image: "assets/images/mug01.jpg", category: "sale" },
        { id: 10, title: "纯棉洗脸毛巾", description: "柔软吸水，不掉毛，学生宿舍日常必备", price: 15, discount: 0, image: "assets/images/towel01.jpg", category: "sale" },
        
    ]
};

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let slideInterval;

// 轮播图功能
function initSlider() {
    // 初始化指示器
    updateIndicators();

    // 自动播放
    startAutoPlay();
    
    // 手动切换按钮
    document.querySelector('.prev-btn').addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    document.querySelector('.next-btn').addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    // 指示器点击
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            goToSlide(slideIndex);
            resetAutoPlay();
        });
    });
}

// 切换到指定幻灯片
function goToSlide(index) {
    currentSlide = index;
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentSlide * 25}%)`;
    updateIndicators();
}

// 上一张幻灯片
function prevSlide() {
    currentSlide = (currentSlide === 0) ? totalSlides - 1 : currentSlide - 1;
    goToSlide(currentSlide);
}

// 下一张幻灯片
function nextSlide() {
    currentSlide = (currentSlide === totalSlides - 1) ? 0 : currentSlide + 1;
    goToSlide(currentSlide);
}

// 更新指示器状态
function updateIndicators() {
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 开始自动播放
function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 5000);
}

// 重置自动播放
function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
}

// TAB栏切换功能
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 添加active类到当前按钮
            button.classList.add('active');
            
            // 获取目标tab
            const targetTab = button.getAttribute('data-tab');
            
            // 隐藏所有tab面板
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });
            
            // 显示目标tab面板
            document.getElementById(`${targetTab}-tab`).classList.add('active');
            
            // 加载对应产品
            loadProducts(targetTab);
        });
    });
    
    // 初始化加载热门产品
    loadProducts('hot');
}


function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // 如果是 # 链接，不执行滚动
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 获取当前滚动位置
                const currentScroll = window.pageYOffset;
                // 获取目标位置
                const targetOffset = targetElement.getBoundingClientRect().top + currentScroll;
                // 获取导航栏高度
                const headerHeight = document.querySelector('.header').offsetHeight;
                
                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetOffset - headerHeight,
                    behavior: 'smooth'
                });
                
                // 更新导航链接状态
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                // 如果是导航栏的链接，添加active类
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }
            }
        });
    });
}

// 加载产品到对应tab
function loadProducts(category) {
    const productList = products[category];
    const productGrid = document.querySelector(`#${category}-tab .products-grid`);
    
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        productCard.setAttribute('data-price', product.price);
        
        let discountBadge = '';
        if (product.discount > 0) {
            discountBadge = `<span class="discount">-${product.discount}%</span>`;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price">¥${product.price}</span>
                    ${discountBadge}
                    <button class="btn-add-to-cart">加入购物车</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // 更新产品计数
    updateProductCount();
}

// 下拉菜单功能
function initDropdown() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });
        
        // 点击其他地方关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-container')) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}


// 登录模态框功能
function initLoginModal() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');
    
    // 打开模态框
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('show');
    });
    
    // 关闭模态框
    closeModal.addEventListener('click', () => {
        loginModal.classList.remove('show');
    });
    
    // 点击模态框外部关闭
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('show');
        }
    });
    
    // 切换密码可见性
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // 切换图标
        const icon = togglePassword.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    // 表单提交
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = passwordInput.value;
        
        // 简单验证
        if (!username || !password) {
            alert('请填写用户名和密码');
            return;
        }
        
        // 模拟登录成功
        alert(`登录成功！欢迎，${username}`);
        loginModal.classList.remove('show');
        
        // 清空表单
        loginForm.reset();
    });
}

// 商品价格筛选和排序功能
function initFilterSort() {
    const priceFilter = document.getElementById('priceFilter');
    const minPriceSpan = document.getElementById('minPrice');
    const maxPriceSpan = document.getElementById('maxPrice');
    const sortSelect = document.getElementById('sortSelect');
    const resetFilterBtn = document.getElementById('resetFilter');
    
    // 更新价格显示
    priceFilter.addEventListener('input', () => {
        maxPriceSpan.textContent = `¥${priceFilter.value}`;
        filterProducts();
    });
    
    // 排序选择
    sortSelect.addEventListener('change', () => {
        filterProducts();
    });
    
    // 重置筛选
    resetFilterBtn.addEventListener('click', () => {
        priceFilter.value = 500;
        maxPriceSpan.textContent = '¥500';
        sortSelect.value = 'default';
        filterProducts();
    });
}

// 筛选和排序产品
function filterProducts() {
    const maxPrice = parseInt(document.getElementById('priceFilter').value);
    const sortOption = document.getElementById('sortSelect').value;
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    
    let filteredProducts = [...products[activeTab]];
    
    // 按价格筛选
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    
    // 排序
    filteredProducts.sort((a, b) => {
        switch (sortOption) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'popularity':
                // 简单模拟人气排序
                return b.id - a.id;
            case 'newest':
                // 简单模拟新上架排序
                return b.id - a.id;
            default:
                return 0;
        }
    });
    
    // 更新产品显示
    updateProductsDisplay(filteredProducts, activeTab);
}

// 更新产品显示
function updateProductsDisplay(filteredProducts, category) {
    const productGrid = document.querySelector(`#${category}-tab .products-grid`);
    
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        productCard.setAttribute('data-price', product.price);
        
        let discountBadge = '';
        if (product.discount > 0) {
            discountBadge = `<span class="discount">-${product.discount}%</span>`;
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    <span class="price">¥${product.price}</span>
                    ${discountBadge}
                    <button class="btn-add-to-cart">加入购物车</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // 更新产品计数
    updateProductCount();
}

// 更新产品计数
function updateProductCount() {
    const activeTab = document.querySelector('.tab-btn.active');
    if (!activeTab) return;
    
    const category = activeTab.getAttribute('data-tab');
    const productGrid = document.querySelector(`#${category}-tab .products-grid`);
    const productCount = productGrid ? productGrid.children.length : 0;
    
    document.getElementById('productCount').textContent = productCount;
}

// 页面加载完成后初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有功能
    initSlider();
    initTabs();
    initDropdown();
    initLoginModal();
    initFilterSort();
    initSmoothScroll(); 
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // 更新导航链接状态
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // 导航链接点击
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});