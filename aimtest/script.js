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
  const gameProgress = document.getElementById('gameProgress');
  const progressBar = document.getElementById('progressBar');
  const currentScore = document.getElementById('currentScore');
  const gameActionBtn = document.getElementById('gameActionBtn');
  const startTestBtn = document.getElementById('startTestBtn');
  const retryBtn = document.getElementById('retryBtn');
  const avgScore = document.getElementById('avgScore');
  const resultDescription = document.getElementById('resultDescription');
  const resultIcon = document.getElementById('resultIcon');
  const gameResults = document.getElementById('gameResults');
  const comparisonTable = document.getElementById('comparisonTable');
  const userLevelMarker = document.getElementById('userLevelMarker');
  const kakaoShare = document.getElementById('kakaoShare');
  const facebookShare = document.getElementById('facebookShare');
  const instagramShare = document.getElementById('instagramShare');
  const linkCopy = document.getElementById('linkCopy');
  const copySuccessMessage = document.getElementById('copySuccessMessage');

  // 게임 상태
  let gameState = {
    testActive: false,
    currentAttempt: 0,
    maxAttempts: 10,
    clickTime: 0,
    results: [],
    totalScore: 0
  };

  // 참조 데이터
  const referenceData = {
    proGamer: { min: 150, max: 200, avg: 175 },
    average: { min: 250, max: 350, avg: 300 },
    limit: { min: 120, max: 150, avg: 135 }
  };

  // 시작 버튼 이벤트
  startTestBtn.addEventListener('click', function() {
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
      startTest();
    }
  });

  // 게임 초기화
  function initializeGame() {
    gameProgress.textContent = `1/${gameState.maxAttempts}`;
    progressBar.style.width = '10%';
    currentScore.textContent = '0ms';
    gameActionBtn.textContent = window.i18n.getText('start');
    gameActionBtn.disabled = false;

    // 에임 테스트 UI 설정
    gameContainer.innerHTML = '';
    const aimInstructions = document.createElement('div');
    aimInstructions.className = 'aim-instructions';
    aimInstructions.innerHTML = '<p class="text-xl font-semibold text-gray-600">' + window.i18n.getText('pressStartTarget') + '</p>';
    gameContainer.appendChild(aimInstructions);
  }

  // 테스트 시작
  function startTest() {
    gameState.testActive = true;
    gameState.currentAttempt = 0;
    gameState.results = [];
    
    gameActionBtn.textContent = window.i18n.getText('testing');
    gameActionBtn.disabled = true;
    
    startAimTest();
  }

  // 에임 테스트
  function startAimTest() {
    // 게임 컨테이너 완전히 초기화
    gameContainer.innerHTML = '';
    
    let targetCreationTimeout = null;
    
    // 타겟 생성 함수
    function createTarget() {
      // 테스트가 비활성화되었을 때
      if (!gameState.testActive) {
        return;
      }
      
      // 최대 시도 횟수 확인
      if (gameState.currentAttempt >= gameState.maxAttempts) {
        finishTest();
        return;
      }
      
      // 기존 타겟이 있다면 모두 제거
      const existingTargets = gameContainer.querySelectorAll('.target');
      existingTargets.forEach(target => {
        if (gameContainer.contains(target)) {
          gameContainer.removeChild(target);
        }
      });
      
      // 새 타겟 요소 생성
      const target = document.createElement('div');
      target.className = 'target target-appear';
      
      // 랜덤 위치 설정 (여백 고려)
      const margin = 40;
      const containerWidth = gameContainer.clientWidth;
      const containerHeight = gameContainer.clientHeight;
      const x = Math.random() * (containerWidth - 2 * margin) + margin;
      const y = Math.random() * (containerHeight - 2 * margin) + margin;
      
      // 타겟 스타일 설정
      target.style.left = `${x}px`;
      target.style.top = `${y}px`;
      target.textContent = gameState.currentAttempt + 1;
      
      // 타겟 클릭 이벤트 (한 번만 실행되도록)
      let isClicked = false;
      target.onclick = function(e) {
        if (isClicked) return; // 중복 클릭 방지
        isClicked = true;
        
        e.stopPropagation();
        
        const reactionTime = Date.now() - gameState.clickTime;
        gameState.results.push(reactionTime);
        currentScore.textContent = `${reactionTime}ms`;
        
        // 타겟 제거
        if (gameContainer.contains(target)) {
          gameContainer.removeChild(target);
        }
        
        // 다음 시도로 이동
        gameState.currentAttempt++;
        gameProgress.textContent = `${gameState.currentAttempt}/${gameState.maxAttempts}`;
        progressBar.style.width = `${(gameState.currentAttempt / gameState.maxAttempts) * 100}%`;
        
        // 타임아웃 정리
        if (targetCreationTimeout) {
          clearTimeout(targetCreationTimeout);
          targetCreationTimeout = null;
        }
        
        // 다음 타겟 생성 또는 테스트 종료
        if (gameState.currentAttempt < gameState.maxAttempts) {
          targetCreationTimeout = setTimeout(() => {
            if (gameState.testActive) {
              createTarget();
            }
          }, 800);
        } else {
          finishTest();
        }
      };
      
      // 타겟을 게임 컨테이너에 추가
      gameContainer.appendChild(target);
      gameState.clickTime = Date.now();
    }
    
    // 첫 번째 타겟 생성
    targetCreationTimeout = setTimeout(() => {
      if (gameState.testActive) {
        createTarget();
      }
    }, 1000);
  }

  // 테스트 완료
  function finishTest() {
    gameState.testActive = false;
    
    // 완료 메시지 표시
    gameContainer.innerHTML = '';
    const completeMessage = document.createElement('div');
    completeMessage.className = 'test-complete-message aim-instructions';
    completeMessage.innerHTML = '<div class="text-center">' +
      '<i class="fas fa-check-circle text-4xl text-green-500 mb-2"></i><br>' +
      window.i18n.getText('testComplete') + '<br>' +
      '<small>' + window.i18n.getText('resultSoon') + '</small>' +
      '</div>';
    gameContainer.appendChild(completeMessage);
    
    setTimeout(() => {
      showResults();
    }, 2000);
  }

  // 결과 표시
  function showResults() {
    gameSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    resultSection.classList.add('fade-transition');
    
    // 평균 점수 계산
    const sum = gameState.results.reduce((a, b) => a + b, 0);
    const averageScore = Math.round(sum / gameState.results.length);
    avgScore.textContent = `${averageScore}ms`;
    gameState.totalScore = averageScore;
    
    // 레벨 표시기 위치 설정
    const positionPercent = getPositionPercentage(averageScore);
    userLevelMarker.style.left = `${positionPercent}%`;
    
    // 레벨 프로그레스 바 설정
    const levelProgress = document.getElementById('levelProgress');
    setTimeout(() => {
      levelProgress.style.width = `${positionPercent}%`;
    }, 500);
    
    // 결과 설명 및 아이콘 설정
    const descPrefix = window.i18n.getText('aimResultDesc');
    const descSuffix = window.i18n.getText('reactionResultUnit');
    if (averageScore < 180) {
      resultDescription.innerHTML = descPrefix + ' <span class="font-bold text-indigo-600">' + averageScore + 'ms</span> ' + window.i18n.getText('excellent') + ' ' + descSuffix + ' 🎯';
      resultIcon.className = 'fas fa-trophy text-5xl text-amber-500 mb-2';
    } else if (averageScore < 220) {
      resultDescription.innerHTML = descPrefix + ' <span class="font-bold text-indigo-600">' + averageScore + 'ms</span> ' + window.i18n.getText('proGamer') + ' ' + descSuffix + ' 🥇';
      resultIcon.className = 'fas fa-medal text-5xl text-indigo-500 mb-2';
    } else if (averageScore < 350) {
      resultDescription.innerHTML = descPrefix + ' <span class="font-bold text-indigo-600">' + averageScore + 'ms</span> ' + window.i18n.getText('good') + ' ' + descSuffix + ' 👍';
      resultIcon.className = 'fas fa-user text-5xl text-blue-500 mb-2';
    } else {
      resultDescription.innerHTML = descPrefix + ' <span class="font-bold text-indigo-600">' + averageScore + 'ms</span> ' + window.i18n.getText('tryAgainMsg') + ' ' + descSuffix + ' 💪';
      resultIcon.className = 'fas fa-hourglass-half text-5xl text-gray-500 mb-2';
    }
    
    // 시도별 결과 표시
    gameResults.innerHTML = '';
    gameState.results.forEach((result, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'flex justify-between items-center p-2 border-b border-gray-200';
      
      // 성능에 따른 색상 표시
      let colorClass = 'text-gray-700';
      if (result < 180) colorClass = 'text-green-600 font-semibold';
      else if (result < 220) colorClass = 'text-blue-600 font-semibold';
      else if (result > 400) colorClass = 'text-red-600';
      
      resultItem.innerHTML = `
        <span>${window.i18n.getText('targetLabel')} ${index + 1}</span>
        <span class="${colorClass}">${result}ms</span>
      `;
      gameResults.appendChild(resultItem);
    });
    
    // 비교 테이블 생성
    comparisonTable.innerHTML = '';
    addComparisonRow(window.i18n.getText('topLevel'), referenceData.limit.avg, averageScore - referenceData.limit.avg);
    addComparisonRow(window.i18n.getText('proGamer'), referenceData.proGamer.avg, averageScore - referenceData.proGamer.avg);
    addComparisonRow(window.i18n.getText('normalUser'), referenceData.average.avg, averageScore - referenceData.average.avg);
    
    // 공유 버튼 설정
    setupShareButtons(averageScore);
  }

  // 점수에 따른 위치 퍼센트 계산
  function getPositionPercentage(score) {
    if (score <= 150) return 10; // 최고 수준
    if (score <= 200) return 30; // 프로게이머
    if (score <= 350) return 70; // 일반인
    return Math.min(90, 70 + (score - 350) / 30); // 350ms 이상
  }

  // 비교 행 추가
  function addComparisonRow(label, reference, difference) {
    const row = document.createElement('tr');
    const diffText = difference > 0 ? `+${difference}ms` : `${difference}ms`;
    const diffClass = difference > 0 ? 'text-red-500' : 'text-green-500';
    
    row.innerHTML = `
      <td class="py-2 px-4 border-b border-gray-200">${label}</td>
      <td class="py-2 px-4 border-b border-gray-200 text-right">${reference}ms</td>
      <td class="py-2 px-4 border-b border-gray-200 text-right ${diffClass} font-semibold">${diffText}</td>
    `;
    comparisonTable.appendChild(row);
  }

  // 공유 버튼 설정 함수
  function setupShareButtons(score) {
    // 공유 텍스트 생성
    const shareText = window.i18n.getText('aimShareText').replace('{score}', score);
    const shareUrl = window.location.href;
    
    // 결과에 따른 메시지와 이미지 설정
    let resultMessage = '';
    let resultImage = '';
    
    if (score < 180) {
      resultMessage = window.i18n.getText('aimResultExcellent').replace('{score}', score);
      resultImage = 'https://via.placeholder.com/800x400/FFD700/000000?text=최고수준!';
    } else if (score < 220) {
      resultMessage = window.i18n.getText('aimResultPro').replace('{score}', score);
      resultImage = 'https://via.placeholder.com/800x400/C0C0C0/000000?text=프로게이머급!';
    } else if (score < 350) {
      resultMessage = window.i18n.getText('aimResultAverage').replace('{score}', score);
      resultImage = 'https://via.placeholder.com/800x400/CD7F32/000000?text=평균!';
    } else {
      resultMessage = window.i18n.getText('aimResultNeedsWork').replace('{score}', score);
      resultImage = 'https://via.placeholder.com/800x400/808080/000000?text=연습필요!';
    }
    
    // 카카오톡 공유
    if (kakaoShare) {
      kakaoShare.addEventListener('click', function() {
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized && Kakao.isInitialized()) {
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: window.i18n.getText('aimTestResult'),
              description: resultMessage,
              imageUrl: resultImage,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            itemContent: {
              profileText: window.i18n.getText('aimTest'),
              profileImageUrl: resultImage,
              titleImageUrl: resultImage,
              titleImageText: window.i18n.getText('aimReactionSpeed').replace('{score}', score),
              titleImageCategory: window.i18n.getText('testResult'),
              items: gameState.results.map((result, index) => ({
                item: `${window.i18n.getText('targetLabel')} ${index + 1}`,
                itemOp: `${result}ms`,
              })),
              sum: window.i18n.getText('aimAvgReactionSpeed'),
              sumOp: `${score}ms`,
            },
            buttons: [
              {
                title: window.i18n.getText('tryTestToo'),
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
        } else {
          // 카카오 SDK가 초기화되지 않았을 때 대체 동작
          const fallbackText = `${resultMessage}\n\n${window.i18n.getText('aimShareQuestion')} ${shareUrl}`;
          
          if (navigator.share) {
            navigator.share({
              title: window.i18n.getText('aimTestResult'),
              text: fallbackText,
              url: shareUrl
            }).catch(err => console.log('공유 실패:', err));
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
        const instagramText = window.i18n.getText('aimInstagramText').replace('{score}', score);
        
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
      currentAttempt: 0,
      maxAttempts: 10,
      clickTime: 0,
      results: [],
      totalScore: 0
    };
    gameActionBtn.textContent = window.i18n.getText('start');
    gameActionBtn.disabled = false;
  }
});