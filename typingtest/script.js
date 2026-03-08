class TypingTest {
    constructor() {
        this.targetTexts = [
            "커피 없이는 코딩이 불가능하다는 것은 과학적으로 증명된 사실입니다. 디버깅 중에는 더더욱 그렇죠.",
            "스마트폰을 보다가 목이 아프면 거북목이 되고, 키보드를 치다가 손목이 아프면 개발자가 됩니다.",
            "구글에서 검색하는 것도 실력이고, 스택오버플로우에서 복사하는 것도 능력입니다. 인정하세요.",
            "월요일은 재시작 버튼이고, 금요일은 저장 버튼입니다. 주말은 시스템 업데이트 시간이에요.",
            "인생은 마치 자바스크립트 같습니다. 예상대로 동작하지 않지만 어쨌든 돌아가거든요.",
            "Wi-Fi가 안 되면 현대인은 석기시대로 돌아갑니다. 인터넷 연결을 확인해주세요.",
            "백엔드 개발자는 사용자가 안 보는 것을 만들고, 프론트엔드 개발자는 백엔드가 안 보는 것을 만듭니다.",
            "코드를 짜다 보면 밤이 새고, 밤을 새다 보면 코드가 더 꼬입니다. 악순환의 고리에요."
        ];
        
        this.currentText = "";
        this.startTime = null;
        this.isTestActive = false;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.timer = null;
        this.usingCustomText = false;
        this.isComposing = false;
        
        this.initElements();
        this.initEventListeners();
        this.loadRandomText();
    }
    
    initElements() {
        this.targetTextEl = document.getElementById('target-text');
        this.typingInputEl = document.getElementById('typing-input');
        this.wpmEl = document.getElementById('wpm');
        this.accuracyEl = document.getElementById('accuracy');
        this.timerEl = document.getElementById('timer');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.shareButtons = document.getElementById('share-buttons');
        this.kakaoShareBtn = document.getElementById('kakao-share-btn');
        this.facebookShareBtn = document.getElementById('facebook-share-btn');
        this.resultContainer = document.getElementById('result-container');
        this.finalWpmEl = document.getElementById('final-wpm');
        this.finalAccuracyEl = document.getElementById('final-accuracy');
        this.finalTimeEl = document.getElementById('final-time');
        this.customTextInputEl = document.getElementById('custom-text-input');
        this.applyCustomTextBtn = document.getElementById('apply-custom-text');
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTest(true)); // 버튼 클릭 시에는 입력 필드 비우기
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.kakaoShareBtn.addEventListener('click', () => this.shareToKakao());
        this.facebookShareBtn.addEventListener('click', () => this.shareToFacebook());
        this.typingInputEl.addEventListener('input', (e) => this.handleInput(e));
        this.typingInputEl.addEventListener('paste', (e) => e.preventDefault());
        this.typingInputEl.addEventListener('compositionstart', () => this.isComposing = true);
        this.typingInputEl.addEventListener('compositionend', () => {
            this.isComposing = false;
            // 조합 완료 후 즉시 업데이트
            setTimeout(() => this.updateDisplay(), 0);
        });
        this.applyCustomTextBtn.addEventListener('click', () => this.applyCustomText());
        
        // 카카오 SDK 초기화
        this.initKakao();
    }
    
    loadRandomText() {
        const randomIndex = Math.floor(Math.random() * this.targetTexts.length);
        this.currentText = this.targetTexts[randomIndex];
        this.usingCustomText = false;
        
        // 초기 상태에서 입력 필드 완전 초기화
        this.typingInputEl.disabled = false;
        this.typingInputEl.value = ""; // 실제 값은 비워둠
        this.typingInputEl.placeholder = "타이핑을 시작하면 자동으로 테스트가 시작됩니다...";
        
        // 텍스트 표시 (입력값이 없으므로 색상 없이 표시됨)
        this.displayText();
    }

    applyCustomText() {
        const customText = this.customTextInputEl.value.trim();
        if (customText) {
            this.currentText = customText;
            this.usingCustomText = true;
            this.displayText();
            this.showCustomTextSuccess();
        } else {
            this.loadRandomText();
        }
        this.resetTest();
        
        // 텍스트 적용 후 입력 필드에 포커스
        this.typingInputEl.focus();
    }

    showCustomTextSuccess() {
        const originalText = this.applyCustomTextBtn.textContent;
        this.applyCustomTextBtn.textContent = '적용 완료!';
        this.applyCustomTextBtn.style.background = '#28a745';
        
        setTimeout(() => {
            this.applyCustomTextBtn.textContent = originalText;
            this.applyCustomTextBtn.style.background = '';
        }, 1500);
    }

    initKakao() {
        // 카카오 SDK 초기화 (실제 앱 키로 교체 필요)
        if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
            // 테스트용 키 - 실제 사용시 본인의 카카오 앱 키로 교체하세요
            Kakao.init('테스트용키'); // 실제 카카오 앱 키로 교체 필요
        }
    }
    
    displayText() {
        const chars = this.currentText.split('');
        const inputValue = this.typingInputEl.value;
        
        this.targetTextEl.innerHTML = chars.map((char, index) => {
            let className = '';
            
            // 입력값이 있을 때만 색상 표시
            if (inputValue.length > 0 && index < inputValue.length) {
                // 한글 조합 중이면 마지막 문자는 색상 표시 안함
                if (this.isComposing && index === inputValue.length - 1) {
                    className = 'current'; // 조합 중인 글자에 커서 표시
                } else {
                    className = this.isCharCorrect(index) ? 'correct' : 'incorrect';
                }
            } else if (index === inputValue.length && this.isTestActive && !this.isComposing) {
                // 테스트가 활성화되고 조합 중이 아닐 때만 다음 글자에 커서 표시
                className = 'current';
            }
            
            // 공백 문자의 경우 &nbsp;로 변환하되, 클래스가 있을 때는 더 명확하게 표시
            let displayChar = char;
            if (char === ' ') {
                displayChar = className ? '·' : '&nbsp;'; // 색상이 있는 공백은 중점으로 표시
            }
            
            return `<span class="${className}">${displayChar}</span>`;
        }).join('');
    }
    
    isCharCorrect(index) {
        const inputChar = this.typingInputEl.value[index];
        const targetChar = this.currentText[index];
        
        // undefined 체크 및 정확한 문자 비교
        if (inputChar === undefined || targetChar === undefined) {
            return false;
        }
        
        return inputChar === targetChar;
    }
    
    startTest(clearInput = false) {
        this.isTestActive = true;
        this.startTime = new Date();
        
        // 명시적으로 요청한 경우에만 입력 필드 초기화
        if (clearInput) {
            this.typingInputEl.value = '';
        }
        this.typingInputEl.disabled = false;
        this.typingInputEl.placeholder = "위 문장을 정확히 타이핑하세요...";
        this.typingInputEl.focus();
        
        this.startBtn.disabled = true;
        this.startBtn.textContent = '테스트 진행 중...';
        this.resultContainer.style.display = 'none';
        this.shareButtons.style.display = 'none';
        
        this.timer = setInterval(() => {
            this.updateTimer();
            this.updateStats();
        }, 50);
    }
    
    resetTest() {
        this.isTestActive = false;
        this.startTime = null;
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.isComposing = false;
        
        // 입력 필드 완전 초기화
        this.typingInputEl.value = '';
        this.typingInputEl.disabled = false;
        this.typingInputEl.placeholder = "타이핑을 시작하면 자동으로 테스트가 시작됩니다...";
        this.typingInputEl.focus(); // 포커스 제거하여 placeholder 표시
        this.typingInputEl.blur();
        
        this.startBtn.disabled = false;
        this.startBtn.textContent = '테스트 시작';
        this.startBtn.style.display = 'inline-block';
        this.resultContainer.style.display = 'none';
        this.shareButtons.style.display = 'none';
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        if (!this.usingCustomText) {
            this.loadRandomText();
        } else {
            this.displayText();
        }
        this.resetStats();
    }
    
    handleInput(e) {
        const inputValue = e.target.value;
        
        // 테스트가 시작되지 않았고 입력이 있으면 자동 시작
        if (!this.isTestActive && inputValue.length > 0) {
            this.startTest(); // clearInput=false (기본값)이므로 입력값 보존됨
        }
        
        if (!this.isTestActive) return;
        
        this.updateDisplay();
        
        // 테스트 완료 체크 - 길이가 맞으면 완료 (정확도와 무관)
        if (inputValue.length >= this.currentText.length) {
            this.completeTest();
        }
    }
    
    updateDisplay() {
        const inputValue = this.typingInputEl.value;
        
        // 통계 계산용 길이 (조합 중이면 완성된 문자만 계산)
        let calculationLength = inputValue.length;
        if (this.isComposing && calculationLength > 0) {
            calculationLength = calculationLength - 1;
        }
        
        this.currentIndex = calculationLength;
        this.totalChars = calculationLength;
        
        // 정확한 문자 수 계산
        this.correctChars = 0;
        for (let i = 0; i < calculationLength; i++) {
            if (this.isCharCorrect(i)) {
                this.correctChars++;
            }
        }
        
        this.displayText();
        this.updateStats();
    }
    
    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = (new Date() - this.startTime) / 1000;
        this.timerEl.textContent = elapsed.toFixed(1);
    }
    
    updateStats() {
        if (!this.startTime) return;
        
        const elapsed = (new Date() - this.startTime) / 1000;
        
        // WPM 계산 (한국어는 글자 수 기준, 분당 타자 수)
        const wpm = this.correctChars > 0 && elapsed > 0 ? Math.round((this.correctChars / elapsed) * 60) : 0;
        this.wpmEl.textContent = Math.max(0, wpm);
        
        // 정확도 계산 - 입력된 문자가 있을 때만 계산
        const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100;
        this.accuracyEl.textContent = Math.max(0, Math.min(100, accuracy));
    }
    
    resetStats() {
        this.wpmEl.textContent = '0';
        this.accuracyEl.textContent = '100';
        this.timerEl.textContent = '0';
    }
    
    completeTest() {
        this.isTestActive = false;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        this.typingInputEl.disabled = true;
        this.startBtn.style.display = 'none';
        
        // 최종 결과 계산 - 전체 입력 기준
        const inputValue = this.typingInputEl.value;
        const finalCorrectChars = Math.min(inputValue.length, this.currentText.length);
        let correctCount = 0;
        
        for (let i = 0; i < finalCorrectChars; i++) {
            if (inputValue[i] === this.currentText[i]) {
                correctCount++;
            }
        }
        
        const elapsed = (new Date() - this.startTime) / 1000;
        const finalWpm = Math.round((correctCount / elapsed) * 60);
        const finalAccuracy = Math.round((correctCount / this.currentText.length) * 100);
        
        // 결과 표시
        this.finalWpmEl.textContent = `${finalWpm} WPM`;
        this.finalAccuracyEl.textContent = `${finalAccuracy}%`;
        this.finalTimeEl.textContent = `${elapsed.toFixed(1)}초`;
        
        this.resultContainer.style.display = 'block';
        this.shareButtons.style.display = 'flex';
        
        // 성과에 따른 메시지
        this.showCompletionMessage(finalWpm, finalAccuracy);
    }
    
    showCompletionMessage(wpm, accuracy) {
        let message = "🎉 테스트 완료!";
        
        if (wpm >= 200 && accuracy >= 95) {
            message = "🚀 정말 빠르시네요!";
        } else if (wpm >= 140 && accuracy >= 90) {
            message = "👏 정말 평번한 실력이네요!";
        } else if (wpm >= 100 && accuracy >= 85) {
            message = "🐢 빠른 거북이 정도시군요!";
        } else {
            message = "😞 정말 형편없군요!";
        }
        
        this.resultContainer.querySelector('h2').textContent = message;
    }
    
    shareToKakao() {
        const wpm = this.finalWpmEl.textContent;
        const accuracy = this.finalAccuracyEl.textContent;
        const time = this.finalTimeEl.textContent;
        
        // 숫자만 추출
        const wpmNumber = parseInt(wpm.replace(/[^0-9]/g, ''));
        const accuracyNumber = parseInt(accuracy.replace(/[^0-9]/g, ''));
        const timeNumber = parseFloat(time.replace(/[^0-9.]/g, ''));
        
        // 성능에 따른 등급 결정
        const getGrade = () => {
            if (wpmNumber >= 200 && accuracyNumber >= 95) return '🏆 마스터';
            if (wpmNumber >= 140 && accuracyNumber >= 90) return '🥇 고수';
            if (wpmNumber >= 100 && accuracyNumber >= 85) return '🥈 숙련자';
            if (wpmNumber >= 60 && accuracyNumber >= 75) return '🥉 초보자';
            return '🔰 연습생';
        };

        // 타이핑 테스트 이미지 생성 (SVG -> base64)
        const createTypingImage = () => {
            const svg = `<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="500" height="500" fill="#F8F9FA"/>
                <rect x="50" y="80" width="400" height="60" rx="10" fill="#4285F4"/>
                <text x="250" y="115" font-size="28" fill="white" text-anchor="middle" font-weight="bold">⌨️ 타이핑 속도 테스트</text>
                
                <circle cx="150" cy="220" r="60" fill="#34A853" stroke="#137333" stroke-width="4"/>
                <text x="150" y="235" font-size="32" fill="white" text-anchor="middle" font-weight="bold">${wpmNumber}</text>
                <text x="150" y="280" font-size="16" fill="#137333" text-anchor="middle">타자/분</text>
                
                <circle cx="250" cy="220" r="60" fill="#FBBC04" stroke="#F9AB00" stroke-width="4"/>
                <text x="250" y="235" font-size="28" fill="#8B4513" text-anchor="middle" font-weight="bold">${accuracyNumber}%</text>
                <text x="250" y="280" font-size="16" fill="#8B4513" text-anchor="middle">정확도</text>
                
                <circle cx="350" cy="220" r="60" fill="#EA4335" stroke="#D33B01" stroke-width="4"/>
                <text x="350" y="235" font-size="24" fill="white" text-anchor="middle" font-weight="bold">${timeNumber}s</text>
                <text x="350" y="280" font-size="16" fill="#D33B01" text-anchor="middle">소요시간</text>
                
                <text x="250" y="340" font-size="36" fill="#202124" text-anchor="middle" font-weight="bold">${getGrade()}</text>
                <text x="250" y="380" font-size="20" fill="#5F6368" text-anchor="middle">당신의 타이핑 실력</text>
                
                <text x="250" y="430" font-size="18" fill="#8B9DC3" text-anchor="middle">🚀 나도 도전해보자!</text>
            </svg>`;
            return btoa(unescape(encodeURIComponent(svg)));
        };

        const gameUrl = window.location.origin + window.location.pathname;
        const challengeUrl = gameUrl;

        if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '⌨️ 타이핑 속도 테스트 결과!',
                    description: `${wpmNumber} WPM으로 ${getGrade()} 등급을 달성했어요!`,
                    imageUrl: `data:image/svg+xml;base64,${createTypingImage()}`,
                    link: {
                        mobileWebUrl: gameUrl,
                        webUrl: gameUrl,

                    },
                },
                itemContent: {
                    profileText: '타이핑 테스트',
                    profileImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Mjg1RjQiLz4KPHR4dCB4PSIyMCIgeT0iMjgiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ijKg8L3RleHQ+Cjwvc3ZnPgo=',
                    titleImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Mjg1RjQiLz4KPHR4dCB4PSIyMCIgeT0iMjgiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ijKg8L3RleHQ+Cjwvc3ZnPgo=',
                    titleImageText: '🏆 테스트 결과',
                    
                    items: [
                        {
                            item: '📝 문자 수',
                            itemOp: `${this.currentText.length}자`,
                        },
                        {
                            item: '🎯 정확도',
                            itemOp: `${accuracyNumber}%`,
                        },
                        {
                            item: '⏱️ 소요 시간',
                            itemOp: `${timeNumber}초`,
                        },
                        {
                            item: '📊 실력 등급',
                            itemOp: getGrade(),
                        },
                    ],
                    sum: '타이핑 속도',
                    sumOp: `${wpmNumber} WPM`,
                },
                social: {
                    likeCount: Math.floor(Math.random() * 100) + 50,
                    commentCount: Math.floor(Math.random() * 30) + 10,
                    sharedCount: Math.floor(Math.random() * 50) + 20,
                },
                buttons: [
                    {
                        title: '⌨️ 나도 도전하기',
                        link: {
                            mobileWebUrl: challengeUrl,
                            webUrl: challengeUrl,
                        },
                    },
                    {
                        title: '🏠 홈',
                        link: {
                            mobileWebUrl: 'https://eeeasytest.com',
                            webUrl: 'https://eeeasytest.com',
                        },
                    },
                ],
            });
        } else {
            // 카카오 SDK가 로드되지 않은 경우 클립보드 복사
            this.fallbackShare(`⌨️ 타이핑 속도 테스트 결과\n🏆 등급: ${getGrade()}\n⚡ 속도: ${wpm}\n🎯 정확도: ${accuracy}\n⏱️ 시간: ${time}\n\n나도 도전해보자! ${window.location.href}`, this.kakaoShareBtn);
        }
    }
    
    shareToFacebook() {
        const wpm = this.finalWpmEl.textContent;
        const accuracy = this.finalAccuracyEl.textContent;
        const time = this.finalTimeEl.textContent;
        
        const shareText = `타이핑 속도 테스트 결과 - 속도: ${wpm}, 정확도: ${accuracy}, 시간: ${time}`;
        const shareUrl = encodeURIComponent(window.location.href);
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${encodeURIComponent(shareText)}`;
        
        // 새 창으로 페이스북 공유 페이지 열기
        window.open(facebookUrl, 'facebook-share', 'width=626,height=436');
    }
    
    fallbackShare(text, button) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showShareSuccess(button, '클립보드에 복사됨!');
            }).catch(() => {
                this.showShareFallback(text);
            });
        } else {
            this.showShareFallback(text);
        }
    }
    
    showShareFallback(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            alert('결과가 클립보드에 복사되었습니다!');
        } catch (err) {
            prompt('아래 텍스트를 복사하세요:', text);
        }
        
        document.body.removeChild(textarea);
    }
    
    showShareSuccess(button, message) {
        const originalText = button.textContent;
        button.textContent = message;
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }
}

// 페이지 로드 시 타이핑 테스트 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 입력 필드 강제 초기화 (브라우저 자동완성 방지)
    const typingInput = document.getElementById('typing-input');
    if (typingInput) {
        typingInput.value = '';
        typingInput.autocomplete = 'off';
        typingInput.spellcheck = false;
    }
    
    // 타이핑 테스트 인스턴스 생성
    new TypingTest();
});

// 키보드 단축키
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter로 테스트 시작/재시작
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const startBtn = document.getElementById('start-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        if (!startBtn.disabled) {
            startBtn.click(); // 버튼 클릭으로 처리하여 clearInput=true로 호출됨
        } else {
            resetBtn.click();
        }
    }
    
    // ESC로 리셋
    if (e.key === 'Escape') {
        e.preventDefault();
        document.getElementById('reset-btn').click();
    }
}); 