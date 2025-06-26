// 공통 유틸리티 함수들

// 공통 네임스페이스
window.CommonUtils = {
    // API 기본 URL
    API_BASE_URL: 'http://localhost:5000/api',

    // 인증 상태 확인
    async checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            window.location.href = 'login.html';
            return false;
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = "login.html";
                return false;
            }

            return true;
        } catch (error) {
            console.error('Auth check error:', error);
            return true;
        }
    },

    // 로그아웃 기능
    logout() {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        }
    },

    // 엔터키로 검색 핸들러
    handleSearchEnter(event, searchCallback) {
        if (event.key === 'Enter') {
            searchCallback();
        }
    },

    // 페이지 변경 공통 함수
    async changePage(page, loadCallback) {
        if (typeof loadCallback === 'function') {
            await loadCallback(page);
        }
    },

    // 메인 콘텐츠 위치를 헤더 높이에 맞춰 조정하는 함수
    adjustMainContentPosition(enableTransition = false) {
        const header = document.querySelector('.header');
        const filterSection = document.querySelector('.filter-section');
        const mainContent = document.querySelector('.main-content');

        if (header && filterSection && mainContent) {
            if (enableTransition) {
                setTimeout(() => {
                    mainContent.classList.add('positioned');
                    const headerHeight = header.offsetHeight;
                    filterSection.style.marginTop = `${headerHeight}px`;
                    const totalHeight = headerHeight + filterSection.offsetHeight;
                    mainContent.style.marginTop = `${totalHeight + 20}px`;
                }, 50);
            } else {
                const headerHeight = header.offsetHeight;
                filterSection.style.marginTop = `${headerHeight}px`;
                const totalHeight = headerHeight + filterSection.offsetHeight;
                mainContent.style.marginTop = `${totalHeight + 20}px`;
            }
        }
    },

    // 화면 크기 변경 시 메인 콘텐츠 위치 조정
    setupResizeHandler() {
        window.addEventListener('resize', function () {
            CommonUtils.adjustMainContentPosition(true);
        });
    },

    // 날짜 포맷팅
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('ko-KR');
    },

    // 모달 공통 핸들러
    setupModalHandlers(modalId, closeCallback) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                closeCallback();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeCallback();
            }
        });
    },

    // 필터 초기화 공통 함수
    resetFilters() {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    },

    // 고급 필터 토글 공통 함수
    toggleAdvancedFilters() {
        const advancedFilters = document.querySelector('.advanced-filters');
        if (advancedFilters) {
            advancedFilters.classList.toggle('show');
            CommonUtils.adjustMainContentPosition(true);

            // 상세검색창이 열릴 때 외부 클릭 이벤트 설정
            if (advancedFilters.classList.contains('show')) {
                CommonUtils.setupAdvancedFiltersOutsideClick();
            } else {
                CommonUtils.removeAdvancedFiltersOutsideClick();
            }
        }
    },

    // 상세검색창 외부 클릭 시 닫기 이벤트 설정
    setupAdvancedFiltersOutsideClick() {
        // 기존 이벤트 리스너가 있다면 제거
        CommonUtils.removeAdvancedFiltersOutsideClick();

        // 새로운 이벤트 리스너 추가
        CommonUtils._outsideClickHandler = function (event) {
            const advancedFilters = document.querySelector('.advanced-filters');
            const advancedToggle = document.querySelector('.advanced-filter-toggle');

            // 클릭된 요소가 상세검색창 내부나 토글 버튼이 아닌 경우
            if (advancedFilters &&
                !advancedFilters.contains(event.target) &&
                !advancedToggle.contains(event.target)) {

                // 상세검색창 닫기
                advancedFilters.classList.remove('show');
                CommonUtils.adjustMainContentPosition(true);
                CommonUtils.removeAdvancedFiltersOutsideClick();
            }
        };

        // 약간의 지연 후 이벤트 리스너 추가 (현재 클릭 이벤트와 충돌 방지)
        setTimeout(() => {
            document.addEventListener('click', CommonUtils._outsideClickHandler);
        }, 100);
    },

    // 상세검색창 외부 클릭 이벤트 제거
    removeAdvancedFiltersOutsideClick() {
        if (CommonUtils._outsideClickHandler) {
            document.removeEventListener('click', CommonUtils._outsideClickHandler);
            CommonUtils._outsideClickHandler = null;
        }
    },

    // 로컬스토리지 유틸리티
    storage: {
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (error) {
                console.error('Storage get error:', error);
                return defaultValue;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Storage set error:', error);
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (error) {
                console.error('Storage remove error:', error);
            }
        }
    },

    // 페이지네이션 렌더링 공통 함수
    renderPagination(current, total, changePageCallback) {
        const paginationElement = document.getElementById('pagination');
        if (!paginationElement) return;

        let paginationHTML = '';

        if (current > 1) {
            paginationHTML += `<button class="page-btn" onclick="${changePageCallback}(${current - 1})">이전</button>`;
        }

        for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
            paginationHTML += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="${changePageCallback}(${i})">${i}</button>`;
        }

        if (current < total) {
            paginationHTML += `<button class="page-btn" onclick="${changePageCallback}(${current + 1})">다음</button>`;
        }

        paginationElement.innerHTML = paginationHTML;
    },

    // 공통 검색 이벤트 설정
    setupSearchEvents(searchCallback) {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                CommonUtils.handleSearchEnter(e, searchCallback);
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', searchCallback);
        }
    },

    // 공통 필터 이벤트 설정
    setupFilterEvents(filterCallback, sortCallback) {
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const category = this.getAttribute('data-filter');
                filterCallback(category);
            });
        });

        const advancedToggle = document.querySelector('.advanced-filter-toggle');
        if (advancedToggle) {
            advancedToggle.addEventListener('click', CommonUtils.toggleAdvancedFilters);
        }

        const sortSelect = document.getElementById('sortType');
        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                sortCallback(this.value);
            });
        }
    }
}; 