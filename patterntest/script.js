document.addEventListener('DOMContentLoaded', function() {
  // 카카오 SDK 초기화
  if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
    Kakao.init('eb68697db572e7c6b4abbf70207a69a1');
  }

  // DOM 요소
  const introSection = document.getElementById('introSection');
  const gameSection = document.getElementById('gameSection');
  const resultSection = document.getElementById('resultSection');
  const mainHeader = document.getElementById('mainHeader');
  const gameContainer = document.getElementById('gameContainer');
  const currentLevel = document.getElementById('currentLevel');
  const livesHearts = document.getElementById('livesHearts');
  const bestScore = document.getElementById('bestScore');
  const gameActionBtn = document.getElementById('gameActionBtn');
  const startTestBtn = document.getElementById('startTestBtn');
  const retryBtn = document.getElementById('retryBtn');
  const exitGameBtn = document.getElementById('exitGameBtn');
  const finalLevel = document.getElementById('finalLevel');
  const resultDescription = document.getElementById('resultDescription');
  const resultIcon = document.getElementById('resultIcon');
  const gameResults = document.getElementById('gameResults');
  const comparisonTable = document.getElementById('comparisonTable');
  const kakaoShare = document.getElementById('kakaoShare');
  const facebookShare = document.getElementById('facebookShare');
  const instagramShare = document.getElementById('instagramShare');
  const linkCopy = document.getElementById('linkCopy');
  const copySuccessMessage = document.getElementById('copySuccessMessage');

  // 게임 상태
  let gameState = {
    testActive: false,
    currentLevel: 1,
    lives: 2,
    sequence: [],
    playerSequence: [],
    isShowingSequence: false,
    isPlayerTurn: false,
    difficulty: 'easy',
    levelResults: [],
    bestRecord: parseInt(localStorage.getItem('memoryGameBest')) || 0
  };

  // 난이도별 설정
  const difficultySettings = {
    easy: { showTime: 800, pauseTime: 200 },
    normal: { showTime: 500, pauseTime: 150 },
    hard: { showTime: 300, pauseTime: 100 }
  };

  // 초기화
  function init() {
    bestScore.textContent = gameState.bestRecord > 0 ? `${gameState.bestRecord}${window.i18n.getText('stageUnit')}` : '-';
  }

  // 시작 버튼 이벤트
  startTestBtn.addEventListener('click', function() {
    // 난이도 선택 확인
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    for (const radio of difficultyRadios) {
      if (radio.checked) {
        gameState.difficulty = radio.value;
        break;
      }
    }
    
    introSection.classList.add('hidden');
    mainHeader.classList.add('hidden');
    gameSection.classList.remove('hidden');
    initializeGame();
  });

  // 재시도 버튼 이벤트
  retryBtn.addEventListener('click', function() {
    resetGame();
    resultSection.classList.add('hidden');
    introSection.classList.remove('hidden');
    mainHeader.classList.remove('hidden');
  });

  // 게임 액션 버튼 이벤트
  gameActionBtn.addEventListener('click', function() {
    if (!gameState.testActive) {
      startGame();
    }
  });

  // 나가기 버튼 이벤트
  if (exitGameBtn) {
    exitGameBtn.addEventListener('click', function() {
      console.log('나가기 버튼 클릭됨, testActive:', gameState.testActive);
      
      if (gameState.testActive) {
        const shouldExit = confirm(window.i18n.getText('exitConfirm'));
        console.log('사용자 응답:', shouldExit);
        if (shouldExit) {
          exitToIntro();
        }
      } else {
        exitToIntro();
      }
    });
  } else {
    console.error('나가기 버튼을 찾을 수 없습니다');
  }

  // 게임 초기화
  function initializeGame() {
    currentLevel.textContent = gameState.currentLevel;
    updateLivesDisplay();
    gameActionBtn.textContent = window.i18n.getText('gameStart');
    gameActionBtn.disabled = false;

    // 3x3 그리드 생성
    createGameGrid();
  }

  // 게임 그리드 생성
  function createGameGrid() {
    gameContainer.innerHTML = '';
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'pattern-container';
    
    // 9개의 카드 생성
    for (let i = 0; i < 9; i++) {
      const card = document.createElement('div');
      card.className = 'pattern-cell memory-card';
      card.dataset.index = i;
      card.addEventListener('click', () => handleCardClick(i));
      gridContainer.appendChild(card);
    }
    
    gameContainer.appendChild(gridContainer);
  }

  // 게임 시작
  function startGame() {
    gameState.testActive = true;
    gameActionBtn.textContent = window.i18n.getText('gameInProgress');
    gameActionBtn.disabled = true;
    
    generateSequence();
    showSequence();
  }

  // 시퀀스 생성
  function generateSequence() {
    const newCard = Math.floor(Math.random() * 9);
    gameState.sequence.push(newCard);
    gameState.playerSequence = [];
  }

  // 시퀀스 보여주기
  function showSequence() {
    gameState.isShowingSequence = true;
    gameState.isPlayerTurn = false;
    
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
      card.classList.remove('active', 'success', 'error', 'clickable');
    });
    
    // 안내 메시지 표시
    showMessage(window.i18n.getText('rememberOrder'), 'info');
    
    let sequenceIndex = 0;
    
    function showNextCard() {
      if (sequenceIndex >= gameState.sequence.length) {
        // 시퀀스 표시 완료
        gameState.isShowingSequence = false;
        gameState.isPlayerTurn = true;
        showMessage(window.i18n.getText('clickInOrder'), 'success');
        enablePlayerInput();
        return;
      }
      
      const cardIndex = gameState.sequence[sequenceIndex];
      const card = cards[cardIndex];
      
      // 카드 활성화 (숫자 표시 제거)
      card.classList.add('active');
      
      setTimeout(() => {
        card.classList.remove('active');
        sequenceIndex++;
        
        setTimeout(showNextCard, difficultySettings[gameState.difficulty].pauseTime);
      }, difficultySettings[gameState.difficulty].showTime);
    }
    
    setTimeout(showNextCard, 1000);
  }

  // 플레이어 입력 활성화
  function enablePlayerInput() {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
      card.classList.add('clickable');
    });
  }

  // 카드 클릭 처리
  function handleCardClick(cardIndex) {
    if (!gameState.isPlayerTurn || gameState.isShowingSequence) return;
    
    const card = document.querySelectorAll('.memory-card')[cardIndex];
    const expectedIndex = gameState.sequence[gameState.playerSequence.length];
    
    gameState.playerSequence.push(cardIndex);
    
    if (cardIndex === expectedIndex) {
      // 정답 - 초록색으로 0.3초간 표시
      card.classList.add('success');
      
      setTimeout(() => {
        card.classList.remove('success');
      }, 300);
      
      if (gameState.playerSequence.length === gameState.sequence.length) {
        // 레벨 완료 - 즉시 다음 단계로
        setTimeout(() => {
          levelComplete();
        }, 300);
      }
    } else {
      // 오답 - 플레이어 턴 즉시 종료
      gameState.isPlayerTurn = false;
      disablePlayerInput();
      
      card.classList.add('error');
      
      // 정답 카드도 표시
      const correctCard = document.querySelectorAll('.memory-card')[expectedIndex];
      correctCard.classList.add('success');
      
      setTimeout(() => {
        loseLife();
      }, 1000);
    }
  }

  // 플레이어 입력 비활성화
  function disablePlayerInput() {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
      card.classList.remove('clickable');
    });
  }

  // 레벨 완료
  function levelComplete() {
    gameState.levelResults.push({
      level: gameState.currentLevel,
      success: true,
      sequence: [...gameState.sequence]
    });
    
    gameState.currentLevel++;
    currentLevel.textContent = gameState.currentLevel;
    
    // 즉시 다음 단계로 진행 (딜레이와 메시지 제거)
    generateSequence();
    showSequence();
  }

  // 라이프 잃기
  function loseLife() {
    gameState.lives--;
    updateLivesDisplay();
    
    gameState.levelResults.push({
      level: gameState.currentLevel,
      success: false,
      sequence: [...gameState.sequence],
      playerSequence: [...gameState.playerSequence]
    });
    
    if (gameState.lives <= 0) {
      // 게임 오버
      showMessage(window.i18n.getText('gameOverMsg'), 'error');
      setTimeout(() => {
        endGame();
      }, 2000);
    } else {
      // 해당 단계 재시도 - 플레이어 시퀀스만 리셋하고 같은 단계 다시 표시
      gameState.playerSequence = [];
      showMessage(`${window.i18n.getText('wrongAnswer')} ${window.i18n.getText('lives')} ${gameState.lives}${window.i18n.getText('livesRemaining')}`, 'error');
      setTimeout(() => {
        showSequence();
      }, 2000);
    }
  }

  // 라이프 표시 업데이트
  function updateLivesDisplay() {
    const hearts = livesHearts.querySelectorAll('i');
    hearts.forEach((heart, index) => {
      if (index < gameState.lives) {
        heart.className = 'fas fa-heart text-red-500';
      } else {
        heart.className = 'far fa-heart text-gray-300';
      }
    });
  }

  // 메시지 표시
  function showMessage(text, type) {
    const messageElement = document.querySelector('.game-message');
    if (messageElement) {
      messageElement.remove();
    }
    
    const message = document.createElement('div');
    message.className = `game-message absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg font-semibold z-20`;
    
    switch (type) {
      case 'info':
        message.className += ' bg-blue-100 text-blue-800';
        break;
      case 'success':
        message.className += ' bg-green-100 text-green-800';
        break;
      case 'error':
        message.className += ' bg-red-100 text-red-800';
        break;
    }
    
    message.textContent = text;
    gameContainer.style.position = 'relative';
    gameContainer.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 3000);
  }

  // 게임 종료
  function endGame() {
    gameState.testActive = false;
    const finalLevelValue = Math.max(1, gameState.currentLevel - 1);
    
    // 최고 기록 업데이트
    if (finalLevelValue > gameState.bestRecord) {
      gameState.bestRecord = finalLevelValue;
      localStorage.setItem('memoryGameBest', finalLevelValue.toString());
    }
    
    setTimeout(() => {
      showResults(finalLevelValue);
    }, 1000);
  }

  // 결과 표시
  function showResults(level) {
    gameSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    finalLevel.textContent = `${level}${window.i18n.getText('stageUnit')}`;
    
    // 결과 설명 및 아이콘 설정
    const stageUnitText = window.i18n.getText('stageUnit');
    const finalStageLabel = window.i18n.getText('finalStage');
    const stageSpan = '<span class="font-bold text-indigo-600">' + level + stageUnitText + '</span>';
    if (level >= 10) {
      resultDescription.innerHTML = finalStageLabel + ': ' + stageSpan + '<br>' + window.i18n.getText('memoryGenius') + '!';
      resultIcon.className = 'fas fa-crown text-5xl text-amber-500 mb-2';
    } else if (level >= 6) {
      resultDescription.innerHTML = finalStageLabel + ': ' + stageSpan + '<br>' + window.i18n.getText('expert') + '!';
      resultIcon.className = 'fas fa-fire text-5xl text-orange-500 mb-2';
    } else if (level >= 3) {
      resultDescription.innerHTML = finalStageLabel + ': ' + stageSpan + '<br>' + window.i18n.getText('beginner') + '!';
      resultIcon.className = 'fas fa-star text-5xl text-yellow-500 mb-2';
    } else {
      resultDescription.innerHTML = finalStageLabel + ': ' + stageSpan + '<br>' + window.i18n.getText('beginner');
      resultIcon.className = 'fas fa-dumbbell text-5xl text-gray-500 mb-2';
    }
    
    // 단계별 결과 표시
    gameResults.innerHTML = '';
    gameState.levelResults.forEach((result, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'flex justify-between items-center p-2 border-b border-gray-200';
      
      const statusIcon = result.success ? '✅' : '❌';
      const statusClass = result.success ? 'text-green-600' : 'text-red-600';
      
      resultItem.innerHTML = `
        <span>${result.level}${window.i18n.getText('stageUnit')} ${statusIcon}</span>
        <span class="${statusClass} font-semibold">${result.success ? window.i18n.getText('resultSuccess') : window.i18n.getText('resultFailure')}</span>
      `;
      gameResults.appendChild(resultItem);
    });
    
    // 비교 테이블 생성
    comparisonTable.innerHTML = '';
    const achieved = window.i18n.getText('resultAchieved');
    const exceeded = window.i18n.getText('resultExceeded');
    const notReached = window.i18n.getText('resultNotReached');
    const su = window.i18n.getText('stageUnit');
    addComparisonRow(window.i18n.getText('beginner'), '3-5' + su, level >= 3 && level <= 5 ? achieved : level > 5 ? exceeded : notReached);
    addComparisonRow(window.i18n.getText('expert'), '6-9' + su, level >= 6 && level <= 9 ? achieved : level > 9 ? exceeded : notReached);
    addComparisonRow(window.i18n.getText('memoryGenius'), '10' + su + '+', level >= 10 ? achieved : notReached);
    
    // 공유 버튼 설정
    setupShareButtons(level);
  }

  // 비교 행 추가
  function addComparisonRow(label, range, status) {
    const row = document.createElement('tr');
    const achievedText = window.i18n.getText('resultAchieved');
    const exceededText = window.i18n.getText('resultExceeded');
    const statusClass = status === achievedText ? 'text-green-500' :
                       status === exceededText ? 'text-blue-500' : 'text-gray-500';
    
    row.innerHTML = `
      <td class="py-2 px-4 border-b border-gray-200">${label}</td>
      <td class="py-2 px-4 border-b border-gray-200 text-right">${range}</td>
      <td class="py-2 px-4 border-b border-gray-200 text-right ${statusClass} font-semibold">${status}</td>
    `;
    comparisonTable.appendChild(row);
  }

  // 공유 버튼 설정
  function setupShareButtons(level) {
    const shareText = window.i18n.getText('patternShareText').replace('{level}', level);
    const shareUrl = window.location.href;

    let resultMessage = '';
    let resultImage = '';

    if (level >= 10) {
      resultMessage = window.i18n.getText('patternResultGenius').replace('{level}', level);
      resultImage = 'https://via.placeholder.com/800x400/FFD700/000000?text=' + encodeURIComponent(window.i18n.getText('memoryGenius') + '!');
    } else if (level >= 6) {
      resultMessage = window.i18n.getText('patternResultExpert').replace('{level}', level);
      resultImage = 'https://via.placeholder.com/800x400/FF6347/000000?text=' + encodeURIComponent(window.i18n.getText('expert') + '!');
    } else if (level >= 3) {
      resultMessage = window.i18n.getText('patternResultBeginner').replace('{level}', level);
      resultImage = 'https://via.placeholder.com/800x400/FFD700/000000?text=' + encodeURIComponent(window.i18n.getText('beginner') + '!');
    } else {
      resultMessage = window.i18n.getText('patternResultPractice').replace('{level}', level);
      resultImage = 'https://via.placeholder.com/800x400/808080/000000?text=' + encodeURIComponent(window.i18n.getText('stageUnit') + level);
    }

    // 카카오톡 공유
    if (kakaoShare) {
      kakaoShare.addEventListener('click', function() {
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized && Kakao.isInitialized()) {
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: window.i18n.getText('patternKakaoTitle'),
              description: resultMessage,
              imageUrl: resultImage,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            buttons: [
              {
                title: window.i18n.getText('patternKakaoButton'),
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
        } else {
          const fallbackText = window.i18n.getText('patternKakaoFallback').replace('{result}', resultMessage).replace('{url}', shareUrl);

          if (navigator.share) {
            navigator.share({
              title: window.i18n.getText('patternKakaoTitle'),
              text: fallbackText,
              url: shareUrl
            }).catch(err => console.log('Share failed:', err));
          } else {
            navigator.clipboard.writeText(fallbackText).then(function() {
              copySuccessMessage.textContent = window.i18n.getText('kakaoShareCopied');
              copySuccessMessage.classList.remove('hidden');
              setTimeout(() => {
                copySuccessMessage.classList.add('hidden');
              }, 3000);
            }).catch(function() {
              alert(window.i18n.getText('shareTextAlert') + '\n' + fallbackText);
            });
          }
        }
      });
    }

    // 페이스북 공유
    if (facebookShare) {
      facebookShare.addEventListener('click', function() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
      });
    }

    // 인스타그램 공유
    if (instagramShare) {
      instagramShare.addEventListener('click', function() {
        const instagramText = window.i18n.getText('patternInstagramText').replace('{level}', level);

        navigator.clipboard.writeText(instagramText).then(function() {
          copySuccessMessage.textContent = window.i18n.getText('instagramShareCopied');
          copySuccessMessage.classList.remove('hidden');
          setTimeout(() => {
            copySuccessMessage.classList.add('hidden');
          }, 3000);
        }).catch(function() {
          alert(window.i18n.getText('copyFailed') + '\n\n' + instagramText);
        });
      });
    }

    // 링크 복사
    if (linkCopy) {
      linkCopy.addEventListener('click', function() {
        navigator.clipboard.writeText(shareUrl).then(function() {
          copySuccessMessage.textContent = window.i18n.getText('linkCopied');
          copySuccessMessage.classList.remove('hidden');
          setTimeout(() => {
            copySuccessMessage.classList.add('hidden');
          }, 2000);
        });
      });
    }
  }

  // 게임 리셋
  function resetGame() {
    gameState = {
      testActive: false,
      currentLevel: 1,
      lives: 2,
      sequence: [],
      playerSequence: [],
      isShowingSequence: false,
      isPlayerTurn: false,
      difficulty: 'easy',
      levelResults: [],
      bestRecord: parseInt(localStorage.getItem('memoryGameBest')) || 0
    };
    gameActionBtn.textContent = window.i18n.getText('gameStart');
    gameActionBtn.disabled = false;
  }

  // 초기 화면으로 나가기
  function exitToIntro() {
    console.log('exitToIntro 함수 실행됨');
    
    // 게임 상태 완전 초기화
    gameState.testActive = false;
    gameState.isShowingSequence = false;
    gameState.isPlayerTurn = false;
    
    // 타이머나 진행 중인 애니메이션 정리
    clearTimeout();
    
    // 메시지 제거
    const messageElement = document.querySelector('.game-message');
    if (messageElement) {
      messageElement.remove();
    }
    
    // 카드 상태 초기화
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
      card.classList.remove('active', 'success', 'error', 'clickable');
      card.textContent = '';
    });
    
    // 게임 리셋
    resetGame();
    
    // 화면 전환
    gameSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    introSection.classList.remove('hidden');
    mainHeader.classList.remove('hidden');
    
    console.log('초기 화면으로 전환 완료');
  }

  // 초기화 실행
  init();
}); 