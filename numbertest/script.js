// 게임 환경 설정
const config = {
    boardWidth: 8,
    boardHeight: 8,
    gameTime: 150,
    difficulty: 'easy',
    currentSeed: null,
    difficultySettings: {
        easy: { time: 150, minNumber: 1, maxNumber: 6 },
        normal: { time: 90, minNumber: 1, maxNumber: 9 },
        hard: { time: 60, minNumber: 1, maxNumber: 9 },
        pro: { time: 30, minNumber: 1, maxNumber: 9 }
    }
};

// 시드 기반 랜덤 생성기
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }
    
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    
    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

let seededRandom = null;

// 게임 상태 관리
const gameState = {
    score: 0,
    highScore: 0,
    highScores: {
        easy: localStorage.getItem('gotgamHighScore_easy') || 0,
        normal: localStorage.getItem('gotgamHighScore_normal') || 0,
        hard: localStorage.getItem('gotgamHighScore_hard') || 0,
        pro: localStorage.getItem('gotgamHighScore_pro') || 0
    },
    timeRemaining: config.gameTime,
    gameActive: false,
    isPaused: false,
    board: [],
    comboCount: 0,
    maxCombo: 0,
    movesCount: 0,
    removedPersimmons: 0,
    lastComboTime: 0,
    timerInterval: null,
    selectionStart: null,
    selectionEnd: null,
    selectionBox: null,
    tutorialMode: false,
    tutorialStep: 0
};

// DOM 요소 참조
const elements = {
    startScreen: document.querySelector('.min-h-screen'),
    gameContainer: document.getElementById('game-container'),
    gameBoard: document.getElementById('game-board'),
    scoreDisplay: document.getElementById('score'),
    timerDisplay: document.getElementById('timer'),
    highScoreDisplay: document.getElementById('high-score'),
    finalScore: document.getElementById('final-score'),
    removedPersimmons: document.getElementById('removed-persimmons'),
    comboMax: document.getElementById('combo-max'),
    movesCount: document.getElementById('moves-count'),
    allTimeHighScore: document.getElementById('all-time-high-score'),
    playedDifficulty: document.getElementById('played-difficulty'),
    previousHighScore: document.getElementById('previous-high-score'),
    comboDisplay: document.getElementById('combo-display'),
    comboCount: document.getElementById('combo-count'),
    startBtn: document.getElementById('start-btn'),
    vsFriendBtn: document.getElementById('vs-friend-btn'),
    tutorialBtn: document.getElementById('tutorial-btn'),
    difficultyBtns: document.querySelectorAll('.difficulty-btn'),
    gameStartBtn: document.getElementById('game-start-btn'),
    restartBtn: document.getElementById('restart-btn'),
    stopGameBtn: document.getElementById('stop-game-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    backToMenuBtn: document.getElementById('back-to-menu-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
    backToMenuModalBtn: document.getElementById('back-to-menu-modal-btn'),
    resumeBtn: document.getElementById('resume-btn'),
    quitBtn: document.getElementById('quit-btn'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    closeTutorialBtn: document.getElementById('close-tutorial-btn'),
    shareKakaoBtn: document.getElementById('share-kakao'),
    shareInstagramBtn: document.getElementById('share-instagram'),
    shareFacebookBtn: document.getElementById('share-facebook'),
    shareLinkBtn: document.getElementById('share-link'),
    gameOverModal: document.getElementById('game-over-modal'),
    pauseModal: document.getElementById('pause-modal'),
    settingsModal: document.getElementById('settings-modal'),
    tutorialModal: document.getElementById('tutorial-modal'),
    highScoreMessage: document.getElementById('high-score-message'),
    difficultyOptions: document.querySelectorAll('.difficulty-option'),
    vsFriendModal: document.getElementById('vs-friend-modal'),
    vsShareKakaoBtn: document.getElementById('vs-share-kakao'),
    vsShareFacebookBtn: document.getElementById('vs-share-facebook'),
    vsShareLinkBtn: document.getElementById('vs-share-link'),
    startBattleBtn: document.getElementById('start-battle-btn'),
    closeVsModalBtn: document.getElementById('close-vs-modal-btn')
};

// 게임 초기화
function initGame() {
    checkUrlParams();
    updateHighScore();
    setupEventListeners();
    generateEmptyBoard();
}

// 최고 점수 업데이트
function updateHighScore() {
    // 현재 난이도에 맞는 최고 점수 설정
    gameState.highScore = parseInt(gameState.highScores[config.difficulty]) || 0;
    
    if (elements.highScoreDisplay) {
        elements.highScoreDisplay.textContent = gameState.highScore;
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    if (elements.startBtn) {
        elements.startBtn.addEventListener('click', showGameScreen);
    }
    
    if (elements.vsFriendBtn) {
        elements.vsFriendBtn.addEventListener('click', showVsFriendScreen);
    }
    
    if (elements.tutorialBtn) {
        elements.tutorialBtn.addEventListener('click', showTutorial);
    }
    
    elements.difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            config.difficulty = btn.dataset.difficulty;
            
            // 난이도 변경 시 해당 난이도의 최고 점수 업데이트
            updateHighScore();
            
            // 게임 화면이 표시된 상태라면 시간 표시 업데이트
            if (!elements.gameContainer.classList.contains('hidden')) {
                gameState.timeRemaining = config.difficultySettings[config.difficulty].time;
                updateTimerDisplay();
            }
        });
    });
    
    if (elements.gameStartBtn) {
        elements.gameStartBtn.addEventListener('click', startGame);
    }
    
    if (elements.restartBtn) {
        elements.restartBtn.addEventListener('click', restartGame);
    }
    
    if (elements.stopGameBtn) {
        elements.stopGameBtn.addEventListener('click', stopGameAndReturnToMenu);
    }
    
    if (elements.settingsBtn) {
        elements.settingsBtn.addEventListener('click', showSettings);
    }
    
    if (elements.backToMenuBtn) {
        elements.backToMenuBtn.addEventListener('click', backToMenu);
    }
    
    if (elements.playAgainBtn) {
        elements.playAgainBtn.addEventListener('click', restartGame);
    }
    
    if (elements.backToMenuModalBtn) {
        elements.backToMenuModalBtn.addEventListener('click', backToMenu);
    }
    
    if (elements.resumeBtn) {
        elements.resumeBtn.addEventListener('click', resumeGame);
    }
    
    if (elements.quitBtn) {
        elements.quitBtn.addEventListener('click', backToMenu);
    }
    
    if (elements.saveSettingsBtn) {
        elements.saveSettingsBtn.addEventListener('click', saveSettings);
    }
    
    if (elements.closeTutorialBtn) {
        elements.closeTutorialBtn.addEventListener('click', closeTutorial);
    }
    
    // 공유 버튼 이벤트 리스너
    if (elements.shareKakaoBtn) {
        elements.shareKakaoBtn.addEventListener('click', shareToKakao);
    }
    
    if (elements.shareInstagramBtn) {
        elements.shareInstagramBtn.addEventListener('click', shareToInstagram);
    }
    
    if (elements.shareFacebookBtn) {
        elements.shareFacebookBtn.addEventListener('click', shareToFacebook);
    }
    
    if (elements.shareLinkBtn) {
        elements.shareLinkBtn.addEventListener('click', copyLink);
    }
    
    // 친구와 대결하기 모달 이벤트 리스너
    if (elements.vsShareKakaoBtn) {
        elements.vsShareKakaoBtn.addEventListener('click', () => shareVsBattle('kakao'));
    }
    
    if (elements.vsShareFacebookBtn) {
        elements.vsShareFacebookBtn.addEventListener('click', () => shareVsBattle('facebook'));
    }
    
    if (elements.vsShareLinkBtn) {
        elements.vsShareLinkBtn.addEventListener('click', () => shareVsBattle('link'));
    }
    
    if (elements.startBattleBtn) {
        elements.startBattleBtn.addEventListener('click', startBattleGame);
    }
    
    if (elements.closeVsModalBtn) {
        elements.closeVsModalBtn.addEventListener('click', closeVsModal);
    }
    
    elements.difficultyOptions.forEach(option => {
        option.addEventListener('click', () => {
            elements.difficultyOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    if (elements.gameBoard) {
        elements.gameBoard.addEventListener('mousedown', startSelection);
        elements.gameBoard.addEventListener('mousemove', updateSelection);
        window.addEventListener('mouseup', endSelection);
        
        // 터치 이벤트 리스너 (passive: false로 설정하여 preventDefault 사용 가능)
        elements.gameBoard.addEventListener('touchstart', handleTouchStart, { passive: false });
        elements.gameBoard.addEventListener('touchmove', handleTouchMove, { passive: false });
        elements.gameBoard.addEventListener('touchend', handleTouchEnd, { passive: false });
        elements.gameBoard.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    }
}

// 화면 전환: 시작 화면 -> 게임 화면
function showGameScreen() {
    elements.startScreen.classList.add('hidden');
    elements.gameContainer.classList.remove('hidden');
    updateHighScore();
    
    // 현재 선택된 난이도에 맞는 시간 표시
    gameState.timeRemaining = config.difficultySettings[config.difficulty].time;
    updateTimerDisplay();
    
    // 모바일과 PC 모두에서 게임 화면 광고 로딩 강화
    setTimeout(() => {
        try {
            // 게임 화면의 광고 컨테이너 찾기
            const gameAdContainer = elements.gameContainer.querySelector('.main-ad-container');
            const gameAdArea = gameAdContainer ? gameAdContainer.querySelector('.kakao_ad_area') : null;
            
            console.log('게임 광고 컨테이너:', gameAdContainer);
            console.log('게임 광고 영역:', gameAdArea);
            
            if (gameAdContainer && gameAdArea) {
                // 모바일 감지 및 화면 크기 확인
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 640;
                const screenWidth = window.innerWidth;
                const isSmallScreen = screenWidth <= 480;
                const isVerySmallScreen = screenWidth <= 360;
                
                console.log('모바일 감지:', isMobile, '화면 너비:', screenWidth);
                
                // 광고 컨테이너 강제 표시 - 화면 크기별 설정
                gameAdContainer.style.display = 'flex';
                gameAdContainer.style.visibility = 'visible';
                gameAdContainer.style.opacity = '1';
                gameAdContainer.style.position = 'relative';
                gameAdContainer.style.overflow = 'visible';
                gameAdContainer.style.boxSizing = 'border-box';
                gameAdContainer.style.minHeight = isMobile ? '120px' : '100px';
                
                if (isMobile) {
                    // 모바일에서 화면 크기별 설정
                    if (isVerySmallScreen) {
                        gameAdContainer.style.width = '100%';
                        gameAdContainer.style.maxWidth = '100%';
                        gameAdContainer.style.margin = '0 5px 15px 5px';
                        gameAdContainer.style.padding = '8px 3px';
                    } else if (isSmallScreen) {
                        gameAdContainer.style.width = 'calc(100% - 20px)';
                        gameAdContainer.style.maxWidth = '100%';
                        gameAdContainer.style.margin = '0 10px 15px 10px';
                        gameAdContainer.style.padding = '10px 5px';
                    } else {
                        gameAdContainer.style.width = '100%';
                        gameAdContainer.style.maxWidth = '100%';
                        gameAdContainer.style.margin = '0 auto 15px auto';
                        gameAdContainer.style.padding = '15px 10px';
                    }
                } else {
                    // PC에서 기본 설정
                    gameAdContainer.style.maxWidth = '600px';
                    gameAdContainer.style.margin = '0 auto 15px auto';
                    gameAdContainer.style.padding = '10px';
                }
                
                // 광고 영역 강제 표시 - 화면 크기별 설정
                gameAdArea.style.display = 'block';
                gameAdArea.style.visibility = 'visible';
                gameAdArea.style.opacity = '1';
                gameAdArea.style.position = 'relative';
                gameAdArea.style.overflow = 'visible';
                gameAdArea.style.boxSizing = 'border-box';
                gameAdArea.style.minHeight = '100px';
                gameAdArea.style.height = '100px';
                gameAdArea.style.margin = '0 auto';
                
                if (isMobile) {
                    // 모바일에서 너비 설정
                    if (isVerySmallScreen) {
                        gameAdArea.style.width = '100%';
                        gameAdArea.style.maxWidth = '300px';
                    } else if (isSmallScreen) {
                        gameAdArea.style.width = '100%';
                        gameAdArea.style.maxWidth = '320px';
                    } else {
                        gameAdArea.style.width = 'auto';
                        gameAdArea.style.maxWidth = '100%';
                    }
                } else {
                    // PC에서 기본 크기
                    gameAdArea.style.width = '320px';
                }
                
                console.log('광고 영역 스타일 설정 완료');
                console.log('컨테이너 크기:', gameAdContainer.style.width, gameAdContainer.style.maxWidth);
                console.log('광고 영역 크기:', gameAdArea.style.width, gameAdArea.style.maxWidth);
                
                // 광고 스크립트 재로딩
                const existingAdScripts = document.querySelectorAll('script[src*="ba.min.js"]');
                console.log('기존 광고 스크립트 개수:', existingAdScripts.length);
                
                // 새로운 광고 스크립트 로딩
                const newAdScript = document.createElement('script');
                newAdScript.type = 'text/javascript';
                newAdScript.src = '//t1.daumcdn.net/kas/static/ba.min.js';
                newAdScript.async = true;
                
                newAdScript.onload = () => {
                    console.log('게임 화면 광고 스크립트 로딩 완료');
                };
                
                newAdScript.onerror = () => {
                    console.log('게임 화면 광고 스크립트 로딩 실패');
                };
                
                document.head.appendChild(newAdScript);
            } else {
                console.log('게임 화면 광고 요소를 찾을 수 없습니다');
            }
        } catch (e) {
            console.log('게임 화면 광고 로딩 중 오류:', e);
        }
    }, 300);
}

// 친구와 대결하기 화면 표시
function showVsFriendScreen() {
    // 새로운 시드 생성
    const seed = Math.floor(Math.random() * 1000000);
    config.currentSeed = seed;
    config.battleLink = `${window.location.href.split('?')[0]}?seed=${seed}&difficulty=${config.difficulty}`;
    
    // 모달 표시
    if (elements.vsFriendModal) {
        elements.vsFriendModal.classList.remove('hidden');
    }
}

// 친구와 대결하기 공유
function shareVsBattle(platform) {
    // i18n: battleChallengeMessage - no dedicated key, composing from existing keys
    const message = `🎮 ${window.i18n.getText('vsFriendTitle')}!\n` +
                   `${window.i18n.getText('vsFriendDesc')}\n` +
                   `${window.i18n.getText('selectedDifficulty')}: ${getDifficultyText(config.difficulty)}\n` +
                   `🎯 ${window.i18n.getText('numberGameDesc')}\n\n` +
                   `🚀 ${config.battleLink}`;
    
    switch(platform) {
        case 'kakao':
            // 카카오톡 공유 기능 구현
            if (typeof Kakao !== 'undefined' && Kakao.Share) {
                try {
                    Kakao.Share.sendDefault({
                        objectType: 'feed',
                        content: {
                            title: `🎮 ${window.i18n.getText('vsFriendTitle')}!`,
                            description: `${window.i18n.getText('selectedDifficulty')} ${getDifficultyText(config.difficulty)}`,
                            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRkZGOERDIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iODAiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiM4QjQ1MTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzZXJpZiI+8J+SqjwvdGV4dD4KPHRleHQgeD0iMjUwIiB5PSIxNDAiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiM4QjQ1MTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzZXJpZiI+64yA6rKQ64qE7J6FPC90ZXh0Pgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyNTAiIHI9IjQwIiBmaWxsPSIjRkY2NjAwIiBzdHJva2U9IiNFMjUzMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8dGV4dCB4PSIxNTAiIHk9IjI2MCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzJEMTgxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPjU8L3RleHQ+CjxjaXJjbGUgY3g9IjI1MCIgY3k9IjI1MCIgcj0iNDAiIGZpbGw9IiNGRjY2MDAiIHN0cm9rZT0iI0UyNTMwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iMjYwIiBmb250LXNpemU9IjM2IiBmaWxsPSIjMkQxODEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+MzwvdGV4dD4KPGNpcmNsZSBjeD0iMzUwIiBjeT0iMjUwIiByPSI0MCIgZmlsbD0iI0ZGNjYwMCIgc3Ryb2tlPSIjRTI1MzAwIiBzdHJva2Utd2lkdGg9IjMiLz4KPHR4dCB4PSIzNTAiIHk9IjI2MCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzJEMTgxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPjI8L3RleHQ+CjxwYXRoIGQ9Ik0xMzAgMzYwUTE1MCAzNDAgMTcwIDM2MEwyNTAgMzYwUTI3MCAzNDAgMjkwIDM2MEwzNzAgMzYwIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iNCIgZmlsbD0ibm9uZSIvPgo8dGV4dCB4PSIyNTAiIHk9IjQyMCIgZm9udC1zaXplPSIzMiIgZmlsbD0iIzhCNDUxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfkorg64+E7KCE7ZWY7IS47JqUISDwn5KAIC==',
                            link: {
                                mobileWebUrl: config.battleLink,
                                webUrl: config.battleLink,
                            },
                        },
                        itemContent: {
                            profileText: window.i18n.getText('numberTest'),
                            profileImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRjY2MDAiLz4KPHR4dCB4PSIyMCIgeT0iMjYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+5Li6PC90ZXh0Pgo8L3N2Zz4K',
                            titleImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRjY2MDAiLz4KPHR4dCB4PSIyMCIgeT0iMjYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+5Li6PC90ZXh0Pgo8L3N2Zz4K',
                            titleImageText: `🏆 ${window.i18n.getText('vsFriendTitle')}`,
                            items: [
                                {
                                    item: `🎯 ${window.i18n.getText('numberGameDesc')}`,
                                    itemOp: window.i18n.getText('numberDesc'),
                                },
                                {
                                    item: `⏰ ${window.i18n.getText('timeSelect')}`,
                                    itemOp: getTimeText(config.difficulty),
                                },
                                {
                                    // i18n: battleMethod, sameBoard - no dedicated keys
                                    item: `🎮 ${window.i18n.getText('vsFriend')}`,
                                    itemOp: window.i18n.getText('vsFriendDesc'),
                                },
                                {
                                    // i18n: winCondition, higherScore - no dedicated keys
                                    item: `🏆 ${window.i18n.getText('highScore')}`,
                                    itemOp: window.i18n.getText('allTimeHigh'),
                                },
                            ],
                            sum: window.i18n.getText('selectedDifficulty'),
                            sumOp: getDifficultyText(config.difficulty),
                        },
                        social: {
                            likeCount: Math.floor(Math.random() * 100) + 50,
                            commentCount: Math.floor(Math.random() * 30) + 10,
                            sharedCount: Math.floor(Math.random() * 50) + 20,
                        },
                        buttons: [
                            {
                                // i18n: acceptChallenge - no dedicated key
                                title: `🚀 ${window.i18n.getText('startBattle')}`,
                                link: {
                                    mobileWebUrl: config.battleLink,
                                    webUrl: config.battleLink,
                                },
                            },
                        ],
                    });
                    console.log('카카오톡 결과 공유 완료');
                } catch (error) {
                    console.log('카카오톡 결과 공유 실패:', error);
                    // 카카오톡 공유 실패 시 기본 공유 기능으로 대체
                    if (navigator.share) {
                        navigator.share({
                            title: window.i18n.getText('vsFriendTitle'),
                            text: message
                        }).catch(err => {
                            copyToClipboard(message);
                        });
                    } else {
                        copyToClipboard(message);
                    }
                }
            } else {
                // Kakao SDK가 없을 때 기본 공유 기능 사용
                console.log('Kakao SDK를 찾을 수 없습니다. 기본 공유 기능을 사용합니다.');
                if (navigator.share) {
                    navigator.share({
                        title: window.i18n.getText('vsFriendTitle'),
                        text: message
                    }).catch(err => {
                        copyToClipboard(message);
                    });
                } else {
                    copyToClipboard(message);
                }
            }
            break;
        case 'facebook':
            // 페이스북 공유 기능 구현 - 더 상세한 정보와 함께
            try {
                const battleTitle = encodeURIComponent(`🎮 ${window.i18n.getText('vsFriendTitle')}!`);
                const battleDescription = encodeURIComponent(
                    `${window.i18n.getText('vsFriendDesc')}\n\n` +
                    `🎯 ${window.i18n.getText('numberGameDesc')}\n` +
                    `⚙️ ${window.i18n.getText('selectedDifficulty')}: ${getDifficultyText(config.difficulty)}\n` +
                    `⏰ ${window.i18n.getText('timeSelect')} ${getTimeText(config.difficulty)}\n` +
                    `🎮 ${window.i18n.getText('vsFriend')}\n\n` +
                    `${window.i18n.getText('startBattle')}!`
                );
                const battleUrl = encodeURIComponent(config.battleLink);
                
                // 페이스북 공유 URL 생성
                const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?` +
                    `u=${battleUrl}&` +
                    `quote=${battleDescription}&` +
                    `hashtag=${encodeURIComponent('#' + window.i18n.getText('numberTest'))}`;
                
                // 새 창으로 페이스북 공유 페이지 열기
                const shareWindow = window.open(
                    facebookShareUrl, 
                    'facebook-share-dialog', 
                    'width=626,height=436,resizable=yes,scrollbars=yes'
                );
                
                // 공유 창이 열렸는지 확인
                if (!shareWindow) {
                    // i18n: popupBlocked - no dedicated key
                    throw new Error('Popup blocked');
                }
                
                console.log('페이스북 대결 도전장 공유 완료');
                
                // 공유 완료 알림
                setTimeout(() => {
                    // i18n: facebookBattleShared - no dedicated key
                    showCopySuccess(`📘 ${window.i18n.getText('facebookShare')}!`);
                }, 1000);
                
            } catch (error) {
                console.log('페이스북 공유 실패:', error);
                
                // 대체 방법: 간단한 페이스북 공유
                const simpleFacebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(config.battleLink)}`;
                const fallbackWindow = window.open(simpleFacebookUrl, '_blank', 'width=600,height=400');
                
                if (!fallbackWindow) {
                    // 팝업이 차단된 경우 클립보드에 복사
                    copyToClipboard(message);
                    // i18n: facebookFallbackCopied - no dedicated key
                    showCopySuccess(`📘 ${window.i18n.getText('linkCopied')}`);
                } else {
                    showCopySuccess(`📘 ${window.i18n.getText('facebookShare')}!`);
                }
            }
            break;
        case 'link':
            copyToClipboard(config.battleLink);
            showCopySuccess(`🔗 ${window.i18n.getText('linkCopied')}`);
            break;
    }
}

// 대결 게임 시작
function startBattleGame() {
    closeVsModal();
    showGameScreen();
}

// 친구와 대결하기 모달 닫기
function closeVsModal() {
    if (elements.vsFriendModal) {
        elements.vsFriendModal.classList.add('hidden');
    }
}

// 난이도 텍스트 변환
function getDifficultyText(difficulty) {
    const difficultyTexts = {
        'easy': window.i18n.getText('difficultyEasy'),
        'normal': window.i18n.getText('difficultyNormal'),
        'hard': window.i18n.getText('difficultyHard'),
        'pro': window.i18n.getText('difficultyPro')
    };
    return difficultyTexts[difficulty] || window.i18n.getText('difficultyEasy');
}

// 난이도별 시간 텍스트 변환
function getTimeText(difficulty) {
    const timeTexts = {
        'easy': window.i18n.getText('time2m30s'),
        'normal': window.i18n.getText('time1m30s'),
        'hard': window.i18n.getText('time1m'),
        'pro': window.i18n.getText('time30s')
    };
    return timeTexts[difficulty] || window.i18n.getText('time2m30s');
}

// 공유 기능들
function getShareMessage() {
    // i18n: shareResultTitle, shareScoreLabel, shareRemovedLabel, shareMaxComboLabel, shareDifficultyLabel, shareTryChallenge - keys not yet in i18n, using inline getText
    return `🎯 ${window.i18n.getText('numberTest')} ${window.i18n.getText('shareResult')}!\n` +
           `📊 ${window.i18n.getText('score')}: ${gameState.score}\n` +
           `🍊 ${window.i18n.getText('removedPersimmons')}: ${gameState.removedPersimmons}\n` +
           `🔥 ${window.i18n.getText('maxCombo')}: ${gameState.maxCombo}\n` +
           `⚙️ ${window.i18n.getText('selectedDifficulty')}: ${getDifficultyText(config.difficulty)}\n\n` +
           `🎮 ${window.i18n.getText('numberTest')}!`;
}

function shareToKakao() {
    const message = getShareMessage();
    const gameUrl = window.location.href.split('?')[0]; // 기본 URL
    
    // 현재 시드를 포함한 도전 링크 생성
    const challengeUrl = config.currentSeed ? 
        `${gameUrl}?seed=${config.currentSeed}&difficulty=${config.difficulty}` : 
        gameUrl;
    
    // 카카오톡 공유 기능 구현
    if (typeof Kakao !== 'undefined' && Kakao.Share) {
        try {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: `🎯 ${window.i18n.getText('numberTest')} ${window.i18n.getText('shareResult')}!`,
                    description: `${gameState.score} ${window.i18n.getText('score')}\n${window.i18n.getText('selectedDifficulty')}: ${getDifficultyText(config.difficulty)}`,
                    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRkZGOERDIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iODAiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiM4QjQ1MTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzZXJpZiI+8J+OrzwvdGV4dD4KPHRleHQgeD0iMjUwIiB5PSIxNDAiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiM4QjQ1MTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzZXJpZiI+7J6Q6rCM6rKM7J6EPC90ZXh0Pgo8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyMjAiIHI9IjgwIiBmaWxsPSIjRkY2NjAwIiBzdHJva2U9IiNFMjUzMDAiIHN0cm9rZS13aWR0aD0iNSIvPgo8dGV4dCB4PSIyNTAiIHk9IjI0MCIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzJEMTgxMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPjEwPC90ZXh0Pgo8dGV4dCB4PSIyNTAiIHk9IjM0MCIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzhCNDUxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPvCfkYw8L3RleHQ+Cjx0ZXh0IHg9IjI1MCIgeT0iMzkwIiBmb250LXNpemU9IjM2IiBmaWxsPSIjOEI0NTEzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7qsaQ6ICcgKyBnYW1lU3RhdGUuc2NvcmUgKyAn7KCEPC90ZXh0Pgo8dGV4dCB4PSIyNTAiIHk9IjQ0MCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzhCNDUxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+64Sk7ZWY6rOw64+EIOuNpOq7hSDnmZztla3oibQ8L3RleHQ+Cjwvc3ZnPgo=',
                    link: {
                        mobileWebUrl: gameUrl,
                        webUrl: gameUrl,
                    },
                },
                itemContent: {
                    profileText: window.i18n.getText('numberTest'),
                    profileImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRjY2MDAiLz4KPHR4dCB4PSIyMCIgeT0iMjYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+5Li6PC90ZXh0Pgo8L3N2Zz4K',
                    titleImageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGRjY2MDAiLz4KPHR4dCB4PSIyMCIgeT0iMjYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iYm9sZCI+5Li6PC90ZXh0Pgo8L3N2Zz4K',
                    titleImageText: `🏆 ${window.i18n.getText('gameResult')}`,
                    
                    items: [
                        {
                            item: `📊 ${window.i18n.getText('finalScore')}`,
                            itemOp: `${gameState.score}`,
                        },
                        {
                            item: `🍊 ${window.i18n.getText('removedPersimmons')}`,
                            itemOp: `${gameState.removedPersimmons}`,
                        },
                        {
                            item: `🔥 ${window.i18n.getText('maxCombo')}`,
                            itemOp: `${gameState.maxCombo}`,
                        },
                        {
                            item: `⚙️ ${window.i18n.getText('selectedDifficulty')}`,
                            itemOp: getDifficultyText(config.difficulty),
                        },
                        {
                            item: `🏆 ${window.i18n.getText('allTimeHigh')}`,
                            itemOp: `${gameState.highScore}`,
                        },
                    ],
                    sum: window.i18n.getText('totalMoves'),
                    sumOp: `${gameState.movesCount}`,
                },
                social: {
                    likeCount: Math.floor(Math.random() * 50) + 25,
                    commentCount: Math.floor(Math.random() * 20) + 5,
                    sharedCount: Math.floor(Math.random() * 30) + 10,
                },
                buttons: [
                    {
                        title: `🎮 ${window.i18n.getText('retryChallenge')}`,
                        link: {
                            mobileWebUrl: challengeUrl,
                            webUrl: challengeUrl,
                        },
                    },
                    {
                        title: `🏠 ${window.i18n.getText('backToHome')}`,
                        link: {
                            mobileWebUrl: gameUrl,
                            webUrl: gameUrl,
                        },
                    },
                ],
            });
            console.log('카카오톡 결과 공유 완료');
        } catch (error) {
            console.log('카카오톡 결과 공유 실패:', error);
            // 카카오톡 공유 실패 시 기본 공유 기능으로 대체
            if (navigator.share) {
                navigator.share({
                    title: `${window.i18n.getText('numberTest')} ${window.i18n.getText('shareResult')}`,
                    text: message,
                    url: challengeUrl
                }).catch(err => {
                    console.log('공유 실패:', err);
                    copyToClipboard(message + '\n' + challengeUrl);
                });
            } else {
                copyToClipboard(message + '\n' + challengeUrl);
            }
        }
    } else {
        // Kakao SDK가 없을 때 기본 공유 기능 사용
        console.log('Kakao SDK를 찾을 수 없습니다. 기본 공유 기능을 사용합니다.');
        if (navigator.share) {
            navigator.share({
                title: `${window.i18n.getText('numberTest')} ${window.i18n.getText('shareResult')}`,
                text: message,
                url: challengeUrl
            }).catch(err => {
                console.log('공유 실패:', err);
                copyToClipboard(message + '\n' + challengeUrl);
            });
        } else {
            copyToClipboard(message + '\n' + challengeUrl);
        }
    }
}

function shareToInstagram() {
    const message = getShareMessage();
    const baseUrl = window.location.href.split('?')[0];
    
    // 현재 시드를 포함한 도전 링크 생성
    const challengeUrl = config.currentSeed ? 
        `${baseUrl}?seed=${config.currentSeed}&difficulty=${config.difficulty}` : 
        baseUrl;
    
    // 모바일 기기 감지
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 모바일에서 인스타그램 앱 연결 시도
        try {
            // 인스타그램 메시지 준비 (해시태그 포함)
            // i18n: instagramHashtags - no dedicated key
            const instagramMessage = `${message}\n\n${challengeUrl}\n\n#${window.i18n.getText('numberTest')}`;

            
            // 클립보드에 메시지 복사
            copyToClipboard(instagramMessage);
            
            // 인스타그램 앱 열기 시도 (iOS)
            if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                // iOS에서 인스타그램 앱 열기
                const instagramURL = 'instagram://camera';
                window.location.href = instagramURL;
                
                // 앱이 설치되지 않은 경우를 대비한 타이머
                setTimeout(() => {
                    // 앱이 열리지 않으면 인스타그램 웹사이트로 이동
                    window.open('https://www.instagram.com/', '_blank');
                }, 1000);
                
                showCopySuccess(`📸 ${window.i18n.getText('instagramShareCopied')}`);
            } 
            // 안드로이드에서 인스타그램 앱 열기
            else if (/Android/.test(navigator.userAgent)) {
                const instagramURL = 'intent://instagram.com/_u/username/#Intent;package=com.instagram.android;scheme=https;end';
                
                try {
                    window.location.href = 'instagram://camera';
                    showCopySuccess(`📸 ${window.i18n.getText('instagramShareCopied')}`);
                } catch (e) {
                    // 앱이 없으면 구글 플레이 스토어로 이동
                    window.open('https://play.google.com/store/apps/details?id=com.instagram.android', '_blank');
                    showCopySuccess(`📸 ${window.i18n.getText('instagramShareCopied')}`);
                }
            }
            
        } catch (error) {
            console.log('인스타그램 앱 연결 실패:', error);
            // 실패 시 웹 버전으로 이동
            window.open('https://www.instagram.com/', '_blank');
            copyToClipboard(message + '\n\n' + challengeUrl);
            showCopySuccess(`📸 ${window.i18n.getText('instagramShareCopied')}`);
        }
    } else {
        // PC에서는 웹 인스타그램으로 이동하고 클립보드 복사
        // i18n: instagramHashtags - no dedicated key
        const instagramMessage = `${message}\n\n${challengeUrl}\n\n#${window.i18n.getText('numberTest')}`;
        
        // 클립보드에 복사
        copyToClipboard(instagramMessage);
        
        // 인스타그램 웹사이트 열기
        window.open('https://www.instagram.com/', '_blank');
        
        showCopySuccess(`📸 ${window.i18n.getText('instagramShareCopied')}`);
    }
}

function shareToFacebook() {
    const baseUrl = window.location.href.split('?')[0];
    
    // 현재 시드를 포함한 도전 링크 생성
    const challengeUrl = config.currentSeed ? 
        `${baseUrl}?seed=${config.currentSeed}&difficulty=${config.difficulty}` : 
        baseUrl;
    
    const gameUrl = encodeURIComponent(challengeUrl);
    const title = encodeURIComponent(`${window.i18n.getText('numberTest')} ${window.i18n.getText('shareResult')}`);
    const description = encodeURIComponent(getShareMessage());
    
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${gameUrl}&quote=${description}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

function copyLink() {
    const message = getShareMessage();
    const baseUrl = window.location.href.split('?')[0];
    
    // 현재 시드를 포함한 도전 링크 생성
    const challengeUrl = config.currentSeed ? 
        `${baseUrl}?seed=${config.currentSeed}&difficulty=${config.difficulty}` : 
        baseUrl;
    
    const fullMessage = message + '\n\n🔗 ' + challengeUrl;
    
    copyToClipboard(fullMessage);
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('복사 실패:', err);
        alert(window.i18n.getText('copyFailed') + '\n\n' + text);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess(message = `📋 ${window.i18n.getText('linkCopied')}`) {
    // 기존 알림이 있으면 제거
    const existingNotification = document.querySelector('.copy-success');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'copy-success';
    notification.style.whiteSpace = 'pre-line';
    notification.style.textAlign = 'center';
    notification.style.maxWidth = '90%';
    notification.style.padding = '16px 24px';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 0.7초 후 제거
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 700);
}

// 모든 모달 숨기기
function hideAllModals() {
    const modals = [elements.gameOverModal, elements.pauseModal, elements.settingsModal, elements.tutorialModal, elements.vsFriendModal];
    modals.forEach(modal => {
        if (modal) modal.classList.add('hidden');
    });
}

// 빈 게임 보드 생성
function generateEmptyBoard() {
    if (!elements.gameBoard) return;
    
    elements.gameBoard.innerHTML = '';
    gameState.board = [];
    
    for (let row = 0; row < config.boardHeight; row++) {
        gameState.board[row] = [];
        for (let col = 0; col < config.boardWidth; col++) {
            gameState.board[row][col] = 0;
            
            const cell = document.createElement('div');
            cell.className = 'persimmon-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.textContent = '';
            elements.gameBoard.appendChild(cell);
        }
    }
}

// 게임 시작
function startGame() {
    hideAllModals();
    gameState.gameActive = true;
    gameState.score = 0;
    gameState.timeRemaining = config.difficultySettings[config.difficulty].time;
    gameState.comboCount = 0;
    gameState.maxCombo = 0;
    gameState.movesCount = 0;
    gameState.removedPersimmons = 0;
    
    // 현재 시드가 없으면 새로운 시드 생성 (일반 게임 모드)
    if (!config.currentSeed) {
        config.currentSeed = Math.floor(Math.random() * 1000000);
        console.log('새로운 게임 시드 생성:', config.currentSeed);
    }
    
    elements.gameStartBtn.disabled = true;
    elements.restartBtn.disabled = false;
    elements.stopGameBtn.disabled = false;
    
    generateBoard();
    updateDisplay();
    startTimer();
}

// 게임 보드 생성
function generateBoard() {
    const settings = config.difficultySettings[config.difficulty];
    
    // 시드가 있다면 시드 기반 랜덤 사용
    if (config.currentSeed) {
        seededRandom = new SeededRandom(config.currentSeed);
    }
    
    for (let row = 0; row < config.boardHeight; row++) {
        for (let col = 0; col < config.boardWidth; col++) {
            let number;
            if (seededRandom) {
                number = seededRandom.nextInt(settings.minNumber, settings.maxNumber);
            } else {
                number = Math.floor(Math.random() * (settings.maxNumber - settings.minNumber + 1)) + settings.minNumber;
            }
            
            gameState.board[row][col] = number;
            const cell = elements.gameBoard.children[row * config.boardWidth + col];
            cell.textContent = number;
        }
    }
}

// 화면 업데이트
function updateDisplay() {
    if (elements.scoreDisplay) elements.scoreDisplay.textContent = gameState.score;
    updateTimerDisplay();
}

// 타이머 화면 업데이트
function updateTimerDisplay() {
    if (!elements.timerDisplay) return;
    
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    elements.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 타이머 시작
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameActive || gameState.isPaused) return;
        
        gameState.timeRemaining--;
        updateTimerDisplay();
        
        if (gameState.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

// 게임 종료
function endGame() {
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);
    
    elements.gameStartBtn.disabled = false;
    elements.restartBtn.disabled = true;
    elements.stopGameBtn.disabled = true;
    
    // 현재 난이도의 최고 점수 체크
    const currentDifficultyHighScore = parseInt(gameState.highScores[config.difficulty]) || 0;
    
    if (gameState.score > currentDifficultyHighScore) {
        // 새로운 최고 점수 저장
        gameState.highScores[config.difficulty] = gameState.score;
        localStorage.setItem(`gotgamHighScore_${config.difficulty}`, gameState.score);
        
        // 현재 최고 점수 업데이트
        gameState.highScore = gameState.score;
        
        if (elements.highScoreMessage) {
            elements.highScoreMessage.classList.remove('hidden');
            if (elements.previousHighScore) {
                elements.previousHighScore.textContent = currentDifficultyHighScore;
            }
        }
    } else {
        if (elements.highScoreMessage) {
            elements.highScoreMessage.classList.add('hidden');
        }
    }
    
    // 도전 모드인지 확인
    const isChallengeMode = config.currentSeed !== null;
    
    // 모달에 결과 표시
    if (elements.finalScore) elements.finalScore.textContent = gameState.score;
    if (elements.removedPersimmons) elements.removedPersimmons.textContent = gameState.removedPersimmons;
    if (elements.comboMax) elements.comboMax.textContent = gameState.maxCombo;
    if (elements.movesCount) elements.movesCount.textContent = gameState.movesCount;
    if (elements.allTimeHighScore) elements.allTimeHighScore.textContent = gameState.highScore;
    if (elements.playedDifficulty) {
        const difficultyText = getDifficultyText(config.difficulty);
        elements.playedDifficulty.textContent = isChallengeMode ? `${difficultyText} (${window.i18n.getText('challengeModeLabel')})` : difficultyText;
    }
    
    // 도전 모드 메시지 추가
    if (isChallengeMode) {
        addChallengeResultMessage();
    }
    
    updateHighScore();
    
    if (elements.gameOverModal) {
        elements.gameOverModal.classList.remove('hidden');
    }
}

// 도전 모드 결과 메시지 추가
function addChallengeResultMessage() {
    // 기존 도전 모드 메시지가 있으면 제거
    const existingChallengeResult = document.querySelector('.challenge-result-info');
    if (existingChallengeResult) {
        existingChallengeResult.remove();
    }
    
    // 게임 결과 모달 찾기
    const gameOverModal = elements.gameOverModal;
    if (!gameOverModal) return;
    
    // 도전 모드 결과 정보 생성
    const challengeResultDiv = document.createElement('div');
    challengeResultDiv.className = 'challenge-result-info';
    challengeResultDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #FF6B35 0%, #FF4500 100%);
            color: white;
            padding: 15px;
            border-radius: 12px;
            margin: 15px 0;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border: 2px solid #FF2500;
        ">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">
                🎮 ${window.i18n.getText('vsFriendTitle')} ${window.i18n.getText('gameResult')}!
            </div>
            <div style="font-size: 24px; font-weight: bold; margin: 10px 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                🏆 ${gameState.score} ${window.i18n.getText('score')}!
            </div>
        </div>
    `;
    
    // 최종 점수 표시 영역 다음에 삽입
    const scoreSection = gameOverModal.querySelector('.result-score-box');
    if (scoreSection) {
        scoreSection.insertAdjacentElement('afterend', challengeResultDiv);
    }
}

// 게임 재시작
function restartGame() {
    hideAllModals();
    // 시드 초기화 (새로운 게임으로 재시작)
    config.currentSeed = null;
    startGame();
}

// 메뉴로 돌아가기
function backToMenu() {
    hideAllModals();
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);
    
    // 시드 초기화
    config.currentSeed = null;
    
    elements.startScreen.classList.remove('hidden');
    elements.gameContainer.classList.add('hidden');
    
    generateEmptyBoard();
    
    elements.gameStartBtn.disabled = false;
    elements.restartBtn.disabled = true;
    elements.stopGameBtn.disabled = true;
    
    // 메인 화면 광고 재로딩
    setTimeout(() => {
        try {
            if (window.initMainAd && typeof window.initMainAd === 'function') {
                window.initMainAd();
                console.log('메인 화면 광고 초기화 함수 호출');
            } else if (window.reloadMainAd && typeof window.reloadMainAd === 'function') {
                window.reloadMainAd();
                console.log('메인 화면 광고 재로딩 함수 호출');
            } else {
                console.log('광고 함수를 찾을 수 없습니다');
                
                // 대체 방법: 직접 광고 표시
                const mainAd = elements.startScreen.querySelector('.kakao_ad_area');
                const adContainer = elements.startScreen.querySelector('.main-ad-container');
                
                if (mainAd) {
                    mainAd.style.display = 'block';
                    mainAd.style.visibility = 'visible';
                    mainAd.style.opacity = '1';
                }
                
                if (adContainer) {
                    adContainer.style.display = 'flex';
                    adContainer.style.visibility = 'visible';
                    adContainer.style.opacity = '1';
                }
                
                console.log('직접 메인 광고 표시 설정');
            }
        } catch (e) {
            console.log('메인 화면 광고 재로딩 중 오류:', e);
        }
    }, 200);
}

// 게임 중지하고 메뉴로 돌아가기
function stopGameAndReturnToMenu() {
    stopGameAndReturnToInitialScreen();
}

// 게임 중지하고 초기 게임 화면으로 돌아가기 (게임 시작 버튼이 있는 화면)
function stopGameAndReturnToInitialScreen() {
    hideAllModals();
    gameState.gameActive = false;
    clearInterval(gameState.timerInterval);
    
    // 시드 초기화
    config.currentSeed = null;
    
    // 게임 화면은 유지하되 게임 상태만 초기화
    generateEmptyBoard();
    
    // 버튼 상태 설정
    elements.gameStartBtn.disabled = false;
    elements.restartBtn.disabled = true;
    elements.stopGameBtn.disabled = true;
    
    // 게임 시작 버튼을 다시 하이라이트
    elements.gameStartBtn.classList.add('game-start-highlight');
    
    // 시간과 점수 초기화 표시
    gameState.score = 0;
    gameState.timeRemaining = config.difficultySettings[config.difficulty].time;
    gameState.comboCount = 0;
    gameState.maxCombo = 0;
    gameState.movesCount = 0;
    gameState.removedPersimmons = 0;
    
    updateDisplay();
    updateTimerDisplay();
}

// 설정 모달 표시
function showSettings() {
    if (elements.settingsModal) {
        elements.settingsModal.classList.remove('hidden');
    }
}

// 설정 저장
function saveSettings() {
    const selectedOption = document.querySelector('.difficulty-option.selected');
    if (selectedOption) {
        config.difficulty = selectedOption.dataset.difficulty;
        
        // 난이도 버튼 업데이트
        elements.difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === config.difficulty) {
                btn.classList.add('active');
            }
        });
        
        // 난이도 변경 시 해당 난이도의 최고 점수 업데이트
        updateHighScore();
    }
    
    hideAllModals();
    
    // 게임이 진행 중이었다면 초기화면으로 돌아가고 게임 시작 버튼 활성화
    if (gameState.gameActive) {
        stopGameAndReturnToInitialScreen();
    }
}

// 튜토리얼 표시
function showTutorial() {
    if (elements.tutorialModal) {
        elements.tutorialModal.classList.remove('hidden');
    }
}

// 튜토리얼 닫기
function closeTutorial() {
    if (elements.tutorialModal) {
        elements.tutorialModal.classList.add('hidden');
    }
}

// 게임 일시정지
function pauseGame() {
    gameState.isPaused = true;
    if (elements.pauseModal) {
        elements.pauseModal.classList.remove('hidden');
    }
}

// 게임 재개
function resumeGame() {
    gameState.isPaused = false;
    hideAllModals();
}

// 마우스 선택 시작
function startSelection(e) {
    if (!gameState.gameActive || gameState.isPaused) return;
    
    e.preventDefault();
    const rect = elements.gameBoard.getBoundingClientRect();
    const cellSize = rect.width / config.boardWidth;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < config.boardHeight && col >= 0 && col < config.boardWidth) {
        gameState.selectionStart = { row, col };
        gameState.selectionEnd = { row, col };
        createSelectionBox(row, col, row, col);
    }
}

// 마우스 선택 업데이트
function updateSelection(e) {
    if (!gameState.gameActive || gameState.isPaused || !gameState.selectionStart) return;
    
    e.preventDefault();
    const rect = elements.gameBoard.getBoundingClientRect();
    const cellSize = rect.width / config.boardWidth;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    if (row >= 0 && row < config.boardHeight && col >= 0 && col < config.boardWidth) {
        gameState.selectionEnd = { row, col };
        
        const startRow = Math.min(gameState.selectionStart.row, row);
        const endRow = Math.max(gameState.selectionStart.row, row);
        const startCol = Math.min(gameState.selectionStart.col, col);
        const endCol = Math.max(gameState.selectionStart.col, col);
        
        updateSelectionBox(startRow, startCol, endRow, endCol);
    }
}

// 마우스 선택 종료
function endSelection(e) {
    if (!gameState.gameActive || gameState.isPaused || !gameState.selectionStart) return;
    
    processSelection();
    gameState.selectionStart = null;
    gameState.selectionEnd = null;
    removeSelectionBox();
}

// 터치 이벤트 처리
function handleTouchStart(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!gameState.gameActive || gameState.isPaused) {
        console.log('게임이 활성화되지 않음 또는 일시정지 상태');
        return;
    }
    
    const touch = e.touches[0];
    if (!touch) {
        console.log('터치 정보가 없음');
        return;
    }
    
    // 터치 시작점이 게임 보드 내부인지 확인
    const rect = elements.gameBoard.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        console.log('터치가 게임 보드 밖');
        return;
    }
    
    // 직접 셀 좌표 계산
    const cellSize = rect.width / config.boardWidth;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    
    console.log(`터치 시작: 행=${row}, 열=${col}`);
    
    if (row >= 0 && row < config.boardHeight && col >= 0 && col < config.boardWidth) {
        gameState.selectionStart = { row, col };
        gameState.selectionEnd = { row, col }; // 터치 끝점도 저장
        createSelectionBox(row, col, row, col);
        console.log('선택 박스 생성됨');
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!gameState.gameActive || gameState.isPaused || !gameState.selectionStart) return;
    
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (!touch) return;
        
        // 직접 좌표 계산
        const rect = elements.gameBoard.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const cellSize = rect.width / config.boardWidth;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        
        if (row >= 0 && row < config.boardHeight && col >= 0 && col < config.boardWidth) {
            gameState.selectionEnd = { row, col }; // 터치 끝점 업데이트
            
            const startRow = Math.min(gameState.selectionStart.row, row);
            const endRow = Math.max(gameState.selectionStart.row, row);
            const startCol = Math.min(gameState.selectionStart.col, col);
            const endCol = Math.max(gameState.selectionStart.col, col);
            
            updateSelectionBox(startRow, startCol, endRow, endCol);
        }
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('터치 종료');
    
    // 터치 엔드 시 처리
    if (!gameState.gameActive || gameState.isPaused || !gameState.selectionStart) {
        console.log('터치 종료 - 게임 상태 확인 실패');
        gameState.selectionStart = null;
        gameState.selectionEnd = null;
        removeSelectionBox();
        return;
    }
    
    console.log('선택 처리 시작');
    
    // 선택 처리
    processSelection();
    gameState.selectionStart = null;
    gameState.selectionEnd = null;
    removeSelectionBox();
    
    console.log('터치 처리 완료');
}

// 선택 박스 생성
function createSelectionBox(startRow, startCol, endRow, endCol) {
    removeSelectionBox();
    
    if (!elements.gameBoard) return;
    
    const rect = elements.gameBoard.getBoundingClientRect();
    const cellSize = rect.width / config.boardWidth;
    
    gameState.selectionBox = document.createElement('div');
    gameState.selectionBox.className = 'selection-box';
    
    const left = startCol * cellSize;
    const top = startRow * cellSize;
    const width = (endCol - startCol + 1) * cellSize;
    const height = (endRow - startRow + 1) * cellSize;
    
    gameState.selectionBox.style.left = left + 'px';
    gameState.selectionBox.style.top = top + 'px';
    gameState.selectionBox.style.width = width + 'px';
    gameState.selectionBox.style.height = height + 'px';
    gameState.selectionBox.style.position = 'absolute';
    gameState.selectionBox.style.zIndex = '20';
    
    elements.gameBoard.appendChild(gameState.selectionBox);
    
    // 초기 스타일 설정
    updateSelectionBoxStyle(startRow, startCol, endRow, endCol);
}

// 선택 박스 업데이트
function updateSelectionBox(startRow, startCol, endRow, endCol) {
    if (!gameState.selectionBox || !elements.gameBoard) return;
    
    const rect = elements.gameBoard.getBoundingClientRect();
    const cellSize = rect.width / config.boardWidth;
    
    const left = startCol * cellSize;
    const top = startRow * cellSize;
    const width = (endCol - startCol + 1) * cellSize;
    const height = (endRow - startRow + 1) * cellSize;
    
    gameState.selectionBox.style.left = left + 'px';
    gameState.selectionBox.style.top = top + 'px';
    gameState.selectionBox.style.width = width + 'px';
    gameState.selectionBox.style.height = height + 'px';
    
    // 스타일 업데이트
    updateSelectionBoxStyle(startRow, startCol, endRow, endCol);
}

// 선택 박스 스타일 업데이트
function updateSelectionBoxStyle(startRow, startCol, endRow, endCol) {
    if (!gameState.selectionBox) return;
    
    // 선택된 영역의 합 계산
    let sum = 0;
    let cellCount = 0;
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (row >= 0 && row < config.boardHeight && 
                col >= 0 && col < config.boardWidth && 
                gameState.board[row][col] > 0) {
                sum += gameState.board[row][col];
                cellCount++;
            }
        }
    }
    
    // 박스 스타일 업데이트
    if (sum === 10 && cellCount > 1) {
        gameState.selectionBox.className = 'selection-box valid-box';
    } else {
        gameState.selectionBox.className = 'selection-box invalid-box';
    }
}

// 선택 박스 제거
function removeSelectionBox() {
    if (gameState.selectionBox) {
        gameState.selectionBox.remove();
        gameState.selectionBox = null;
    }
}

// 선택 처리
function processSelection() {
    if (!gameState.selectionStart || !gameState.selectionEnd) return;
    
    // 선택 영역 계산
    const startRow = Math.min(gameState.selectionStart.row, gameState.selectionEnd.row);
    const endRow = Math.max(gameState.selectionStart.row, gameState.selectionEnd.row);
    const startCol = Math.min(gameState.selectionStart.col, gameState.selectionEnd.col);
    const endCol = Math.max(gameState.selectionStart.col, gameState.selectionEnd.col);
    
    console.log(`선택 영역: (${startRow}, ${startCol}) ~ (${endRow}, ${endCol})`);
    
    // 선택된 영역의 합 계산
    let sum = 0;
    let selectedCells = [];
    
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            if (row >= 0 && row < config.boardHeight && 
                col >= 0 && col < config.boardWidth && 
                gameState.board[row][col] > 0) {
                sum += gameState.board[row][col];
                selectedCells.push({ row, col });
                console.log(`셀 (${row}, ${col}): ${gameState.board[row][col]}`);
            }
        }
    }
    
    console.log(`총 합: ${sum}, 선택된 셀 개수: ${selectedCells.length}`);
    
    // 합이 10이고 2개 이상의 셀이 선택되었으면 제거
    if (sum === 10 && selectedCells.length > 1) {
        console.log('곶감 제거 처리!');
        removePersimmons(selectedCells);
        updateScore(selectedCells.length);
        gameState.movesCount++;
        gameState.removedPersimmons += selectedCells.length;
        
        // 콤보 처리
        const currentTime = Date.now();
        if (currentTime - gameState.lastComboTime < 3000) {
            gameState.comboCount++;
        } else {
            gameState.comboCount = 1;
        }
        gameState.lastComboTime = currentTime;
        gameState.maxCombo = Math.max(gameState.maxCombo, gameState.comboCount);
        
        showCombo();
        fillBoard();
    } else {
        console.log('조건이 맞지 않음 - 제거되지 않음');
    }
}

// 곶감 제거
function removePersimmons(cells) {
    cells.forEach(({ row, col }) => {
        gameState.board[row][col] = 0;
        const cellElement = elements.gameBoard.children[row * config.boardWidth + col];
        cellElement.textContent = '';
        cellElement.classList.add('popping');
        
        setTimeout(() => {
            cellElement.classList.remove('popping');
        }, 300);
    });
}

// 점수 업데이트
function updateScore(cellCount) {
    let baseScore = cellCount;
    if (gameState.comboCount > 1) {
        baseScore *= gameState.comboCount;
    }
    gameState.score += baseScore;
    updateDisplay();
}

// 콤보 표시
function showCombo() {
    if (gameState.comboCount > 1 && elements.comboDisplay && elements.comboCount) {
        elements.comboCount.textContent = gameState.comboCount;
        elements.comboDisplay.style.opacity = '1';
        
        setTimeout(() => {
            elements.comboDisplay.style.opacity = '0';
        }, 2000);
    }
}

// 보드 채우기
function fillBoard() {
    // 중력 효과 제거 - 제거된 셀들만 새로운 숫자로 채우기
    const settings = config.difficultySettings[config.difficulty];
    
    for (let row = 0; row < config.boardHeight; row++) {
        for (let col = 0; col < config.boardWidth; col++) {
            // 빈 셀(제거된 셀)만 새로운 숫자로 채우기
            if (gameState.board[row][col] === 0) {
                let number;
                if (seededRandom) {
                    number = seededRandom.nextInt(settings.minNumber, settings.maxNumber);
                } else {
                    number = Math.floor(Math.random() * (settings.maxNumber - settings.minNumber + 1)) + settings.minNumber;
                }
                
                gameState.board[row][col] = number;
                const cell = elements.gameBoard.children[row * config.boardWidth + col];
                cell.textContent = number;
                
                // 새로 생성된 셀에 애니메이션 효과 추가
                cell.classList.add('new-cell');
                setTimeout(() => {
                    cell.classList.remove('new-cell');
                }, 300);
            }
        }
    }
}

// URL에서 시드 확인
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const seed = urlParams.get('seed');
    const difficulty = urlParams.get('difficulty');
    
    if (seed) {
        config.currentSeed = parseInt(seed);
        
        // 도전 링크로 들어왔을 때 알림 표시
        setTimeout(() => {
            showChallengeWelcomeMessage(difficulty);
        }, 500);
    }
    
    if (difficulty && ['easy', 'normal', 'hard', 'pro'].includes(difficulty)) {
        config.difficulty = difficulty;
        
        // 난이도 버튼 업데이트
        elements.difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === difficulty) {
                btn.classList.add('active');
            }
        });
        
        // 난이도 변경 시 해당 난이도의 최고 점수 업데이트
        updateHighScore();
    }
}

// 도전 링크 환영 메시지 표시
function showChallengeWelcomeMessage(difficulty) {
    // 기존 알림이 있으면 제거
    const existingNotification = document.querySelector('.challenge-welcome');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'challenge-welcome';
    welcomeDiv.innerHTML = `
        <div class="challenge-welcome-content">
            <div class="challenge-icon">🎮</div>
            <h3>${window.i18n.getText('vsFriendTitle')}!</h3>
            <p>${window.i18n.getText('vsFriendDesc')}</p>
            <div class="challenge-info">
                <div class="info-item">
                    <span class="info-label">${window.i18n.getText('selectedDifficulty')}:</span>
                    <span class="info-value">${getDifficultyText(difficulty || config.difficulty)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">${window.i18n.getText('vsFriend')}:</span>
                    <span class="info-value">${window.i18n.getText('vsFriendDesc')}</span>
                </div>
                <div class="info-item">
                    <!-- i18n: goal, higherScoreGoal - no dedicated keys -->
                    <span class="info-label">${window.i18n.getText('highScore')}:</span>
                    <span class="info-value">${window.i18n.getText('allTimeHigh')}</span>
                </div>
            </div>
            <div class="challenge-buttons">
                <button class="challenge-btn start-challenge">🚀 ${window.i18n.getText('startBattle')}!</button>
                <button class="challenge-btn close-challenge">${window.i18n.getText('close')}</button>
            </div>
        </div>
    `;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .challenge-welcome {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000 !important;
            animation: fadeIn 0.3s ease;
            pointer-events: auto;
        }
        
        .challenge-welcome-content {
            background: linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%);
            border: 3px solid #8B4513;
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
            z-index: 10001 !important;
            pointer-events: auto;
        }
        
        .challenge-welcome-content::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
            animation: sparkle 3s ease infinite;
            pointer-events: none;
        }
        
        .challenge-icon {
            font-size: 60px;
            margin-bottom: 15px;
            animation: bounce 2s ease infinite;
            pointer-events: none;
        }
        
        .challenge-welcome-content h3 {
            color: #8B4513;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            font-family: 'Nanum Myeongjo', serif;
            pointer-events: none;
        }
        
        .challenge-welcome-content p {
            color: #5D3A00;
            font-size: 16px;
            margin-bottom: 20px;
            pointer-events: none;
        }
        
        .challenge-info {
            background: rgba(255, 255, 255, 0.7);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid #D2B48C;
            pointer-events: none;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
            pointer-events: none;
        }
        
        .info-item:last-child {
            margin-bottom: 0;
        }
        
        .info-label {
            color: #8B4513;
            font-weight: bold;
            pointer-events: none;
        }
        
        .info-value {
            color: #5D3A00;
            pointer-events: none;
        }
        
        .challenge-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
            pointer-events: auto;
            z-index: 10002 !important;
            position: relative;
        }
        
        .challenge-btn {
            background: linear-gradient(135deg, #D2691E 0%, #8B4513 100%);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            font-family: 'Nanum Myeongjo', serif;
            pointer-events: auto !important;
            z-index: 10003 !important;
            position: relative;
            outline: none;
            user-select: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        .challenge-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        .challenge-btn:active {
            transform: translateY(0px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .start-challenge {
            background: linear-gradient(135deg, #FF6B35 0%, #FF4500 100%) !important;
        }
        
        .start-challenge:hover {
            background: linear-gradient(135deg, #FF4500 0%, #FF2500 100%) !important;
        }
        
        .close-challenge {
            background: linear-gradient(135deg, #808080 0%, #606060 100%) !important;
        }
        
        .close-challenge:hover {
            background: linear-gradient(135deg, #606060 0%, #404040 100%) !important;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        @keyframes sparkle {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
        }
        
        @media (max-width: 480px) {
            .challenge-welcome-content {
                padding: 20px;
                max-width: 95%;
            }
            
            .challenge-welcome-content h3 {
                font-size: 20px;
            }
            
            .challenge-welcome-content p {
                font-size: 14px;
            }
            
            .challenge-btn {
                padding: 10px 20px;
                font-size: 14px;
                min-height: 44px;
                min-width: 100px;
            }
            
            .challenge-buttons {
                flex-direction: column;
                gap: 15px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(welcomeDiv);
    
    // 짧은 지연 후 이벤트 리스너 추가 (DOM이 완전히 렌더링된 후)
    setTimeout(() => {
        const startButton = welcomeDiv.querySelector('.start-challenge');
        const closeButton = welcomeDiv.querySelector('.close-challenge');
        
        console.log('도전 모드 버튼들:', startButton, closeButton); // 디버깅용
        
        if (startButton) {
            // 여러 이벤트 방식으로 안전하게 처리
            startButton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('도전 시작 버튼 클릭됨');
                
                welcomeDiv.remove();
                if (style.parentNode) {
                    style.remove();
                }
                showGameScreen();
            };
            
            startButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('도전 시작 addEventListener 실행됨');
                
                welcomeDiv.remove();
                if (style.parentNode) {
                    style.remove();
                }
                showGameScreen();
            }, { passive: false });
            
            // 터치 이벤트도 추가
            startButton.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('도전 시작 터치 이벤트 실행됨');
                
                welcomeDiv.remove();
                if (style.parentNode) {
                    style.remove();
                }
                showGameScreen();
            }, { passive: false });
        }
        
        if (closeButton) {
            closeButton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('나중에 하기 버튼 클릭됨');
                
                welcomeDiv.remove();
                if (style.parentNode) {
                    style.remove();
                }
            };
            
            closeButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('나중에 하기 addEventListener 실행됨');
                
                welcomeDiv.remove();
                if (style.parentNode) {
                    style.remove();
                }
            }, { passive: false });
            
            // 터치 이벤트도 추가
            closeButton.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('나중에 하기 터치 이벤트 실행됨');
                
                welcomeDiv.remove();
                if (style.parentNode) {
                    style.remove();
                }
            }, { passive: false });
        }
        
        // 배경 클릭 시 닫기 (콘텐츠 영역 제외)
        welcomeDiv.addEventListener('click', function(e) {
            if (e.target === welcomeDiv) {
                console.log('배경 클릭으로 모달 닫기');
                welcomeDiv.remove();
                if (style.parentNode) {
                    style.remove();
                }
            }
        });
    }, 100);
}

// 게임 초기화 및 시작
document.addEventListener('DOMContentLoaded', () => {
    initGame();
}); 