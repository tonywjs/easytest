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
    maxAttempts: 5,
    clickTime: 0,
    results: [],
    totalScore: 0
  };

  // 참조 데이터
  const referenceData = {
    proGamer: { min: 140, max: 160, avg: 150 },
    average: { min: 200, max: 250, avg: 225 },
    limit: { min: 100, max: 120, avg: 110 }
  };

  // Seeded RNG for challenge mode
  function createSeededRNG(seed) {
    var s = seed;
    return function() {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function generateNewSeed() {
    return typeof ChallengeUtils !== 'undefined' ? ChallengeUtils.generateSeed() : Math.floor(Math.random() * 2147483647);
  }

  var rng = Math.random;
  var challengeData = null;
  var gameSeed = null;

  // Check for challenge mode
  if (typeof ChallengeUtils !== 'undefined') {
    challengeData = ChallengeUtils.parseChallenge();
    if (challengeData && challengeData.testType === 'reaction') {
      gameSeed = challengeData.seed;
      rng = createSeededRNG(gameSeed);
      // Show challenge banner
      var challengeBanner = document.getElementById('challengeBanner');
      if (challengeBanner) {
        challengeBanner.classList.remove('hidden');
        var preview = document.getElementById('opponentScorePreview');
        if (preview) preview.textContent = challengeData.score + 'ms';
      }
    }
  }
  if (!gameSeed) {
    gameSeed = generateNewSeed();
    rng = createSeededRNG(gameSeed);
  }

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
    progressBar.style.width = '20%';
    currentScore.textContent = '0ms';
    gameActionBtn.textContent = window.i18n.getText('start');
    gameActionBtn.disabled = false;

    // 색상 테스트 UI 설정
    const colorTest = document.createElement('div');
    colorTest.className = 'color-test';
    colorTest.style.backgroundColor = '#F44336';
    colorTest.innerHTML = window.i18n.getText('pressStartToBegin').replace('\n', '<br>');
    gameContainer.innerHTML = '';
    gameContainer.appendChild(colorTest);
  }

  // 테스트 시작
  function startTest() {
    gameState.testActive = true;
    gameState.currentAttempt = 0;
    gameState.results = [];
    
    gameActionBtn.textContent = window.i18n.getText('testing');
    gameActionBtn.disabled = true;
    
    startColorTest();
  }

  // 색상 변경 테스트
  function startColorTest() {
    const colorTest = gameContainer.querySelector('.color-test');
    colorTest.style.backgroundColor = '#F44336'; // 빨간색
    colorTest.textContent = window.i18n.getText('waitForColor');

    let timeoutDelay = rng() * 3000 + 1000; // 1-4초 랜덤 딜레이

    colorTest.onclick = function() {
      if (colorTest.style.backgroundColor === 'rgb(76, 175, 80)') { // 초록색
        const reactionTime = Date.now() - gameState.clickTime;
        gameState.results.push(reactionTime);
        currentScore.textContent = `${reactionTime}ms`;

        gameState.currentAttempt++;
        gameProgress.textContent = `${gameState.currentAttempt}/${gameState.maxAttempts}`;
        progressBar.style.width = `${(gameState.currentAttempt / gameState.maxAttempts) * 100}%`;

        if (gameState.currentAttempt < gameState.maxAttempts) {
          colorTest.style.backgroundColor = '#F44336'; // 다시 빨간색
          colorTest.textContent = window.i18n.getText('waitForColor');
          timeoutDelay = rng() * 3000 + 1000;
          setTimeout(changeToGreen, timeoutDelay);
        } else {
          finishTest();
        }
      } else {
        // 너무 일찍 클릭했을 때
        colorTest.style.backgroundColor = '#FF9800'; // 주황색
        colorTest.textContent = window.i18n.getText('tooEarlyClick');
        setTimeout(() => {
          colorTest.style.backgroundColor = '#F44336';
          colorTest.textContent = window.i18n.getText('waitForColor');
          timeoutDelay = rng() * 3000 + 1000;
          setTimeout(changeToGreen, timeoutDelay);
        }, 1500);
      }
    };
    
    function changeToGreen() {
      if (gameState.testActive) {
        colorTest.style.backgroundColor = '#4CAF50'; // 초록색
        colorTest.textContent = window.i18n.getText('clickNow');
        gameState.clickTime = Date.now();
      }
    }
    
    setTimeout(changeToGreen, timeoutDelay);
  }

  // 테스트 완료
  function finishTest() {
    gameState.testActive = false;
    
    // 완료 메시지 표시
    const colorTest = gameContainer.querySelector('.color-test');
    colorTest.style.backgroundColor = '#4CAF50';
    colorTest.innerHTML = `<div class="text-center">
      <i class="fas fa-check-circle text-4xl mb-2"></i><br>
      ${window.i18n.getText('testComplete')}<br>
      <small>${window.i18n.getText('resultSoon')}</small>
    </div>`;
    
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
    if (averageScore < 160) {
      resultDescription.innerHTML = `${window.i18n.getText('reactionResultDesc')} <span class="font-bold text-indigo-600">${averageScore}ms</span>${window.i18n.getText('reactionResultUnit')} ${window.i18n.getText('excellent')} 🏆`;
      resultIcon.className = 'fas fa-trophy text-5xl text-amber-500 mb-2';
    } else if (averageScore < 200) {
      resultDescription.innerHTML = `${window.i18n.getText('reactionResultDesc')} <span class="font-bold text-indigo-600">${averageScore}ms</span>${window.i18n.getText('reactionResultUnit')} ${window.i18n.getText('excellent')} 🥇`;
      resultIcon.className = 'fas fa-medal text-5xl text-indigo-500 mb-2';
    } else if (averageScore < 250) {
      resultDescription.innerHTML = `${window.i18n.getText('reactionResultDesc')} <span class="font-bold text-indigo-600">${averageScore}ms</span>${window.i18n.getText('reactionResultUnit')} ${window.i18n.getText('good')} 👍`;
      resultIcon.className = 'fas fa-user text-5xl text-blue-500 mb-2';
    } else {
      resultDescription.innerHTML = `${window.i18n.getText('reactionResultDesc')} <span class="font-bold text-indigo-600">${averageScore}ms</span>${window.i18n.getText('reactionResultUnit')} ${window.i18n.getText('tryAgainMsg')} 💪`;
      resultIcon.className = 'fas fa-hourglass-half text-5xl text-gray-500 mb-2';
    }
    
    // 시도별 결과 표시
    gameResults.innerHTML = '';
    gameState.results.forEach((result, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'flex justify-between items-center p-2 border-b border-gray-200';
      resultItem.innerHTML = `
        <span>${window.i18n.getText('reactionAttempt')} ${index + 1}</span>
        <span class="font-semibold">${result}ms</span>
      `;
      gameResults.appendChild(resultItem);
    });
    
    // 비교 테이블 생성
    comparisonTable.innerHTML = '';
    addComparisonRow(window.i18n.getText('proGamer'), referenceData.proGamer.avg, averageScore - referenceData.proGamer.avg);
    addComparisonRow(window.i18n.getText('normalUser'), referenceData.average.avg, averageScore - referenceData.average.avg);
    addComparisonRow(window.i18n.getText('humanLimit'), referenceData.limit.avg, averageScore - referenceData.limit.avg);
    
    // 공유 버튼 설정
    setupShareButtons(averageScore);

    // Challenge comparison
    if (challengeData) {
      var compSection = document.getElementById('challengeComparison');
      if (compSection) {
        compSection.classList.remove('hidden');
        document.getElementById('compOpponentScore').textContent = challengeData.score + 'ms';
        document.getElementById('compMyScore').textContent = averageScore + 'ms';

        var resultText = document.getElementById('challengeResultText');
        // For reaction test, LOWER is better
        if (averageScore < challengeData.score) {
          resultText.textContent = window.i18n.getText('challengeWin');
          resultText.style.color = '#10b981';
          document.getElementById('mySide').style.background = 'rgba(16,185,129,0.1)';
          document.getElementById('mySide').style.border = '1px solid rgba(16,185,129,0.3)';
        } else if (averageScore > challengeData.score) {
          resultText.textContent = window.i18n.getText('challengeLose');
          resultText.style.color = '#ef4444';
          document.getElementById('opponentSide').style.background = 'rgba(16,185,129,0.1)';
          document.getElementById('opponentSide').style.border = '1px solid rgba(16,185,129,0.3)';
        } else {
          resultText.textContent = window.i18n.getText('challengeDraw');
          resultText.style.color = '#f59e0b';
        }
      }
    }
  }

  // 점수에 따른 위치 퍼센트 계산
  function getPositionPercentage(score) {
    if (score <= 110) return 10; // 인간 한계
    if (score <= 160) return 30; // 프로게이머
    if (score <= 250) return 60; // 일반인
    return Math.min(90, 60 + (score - 250) / 20); // 250ms 이상
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
    const shareText = window.i18n.getText('reactionShareText').replace('{score}', score);
    const shareUrl = window.location.href;
    
    // 결과에 따른 메시지와 이미지 설정
    let resultMessage = '';
    let resultImage = '';
    
    if (score < 160) {
      resultMessage = window.i18n.getText('reactionResultPro').replace('{score}', score);
      resultImage = 'https://via.placeholder.com/800x400/FFD700/000000?text=Pro!';
    } else if (score < 200) {
      resultMessage = window.i18n.getText('reactionResultExcellent').replace('{score}', score);
      resultImage = 'https://via.placeholder.com/800x400/C0C0C0/000000?text=Excellent!';
    } else if (score < 250) {
      resultMessage = window.i18n.getText('reactionResultAverage').replace('{score}', score);
      resultImage = 'https://via.placeholder.com/800x400/CD7F32/000000?text=Average!';
    } else {
      resultMessage = window.i18n.getText('reactionResultNeedsPractice').replace('{score}', score);
      resultImage = 'https://via.placeholder.com/800x400/808080/000000?text=Practice!';
    }
    
    // 카카오톡 공유
    if (kakaoShare) {
      kakaoShare.addEventListener('click', function() {
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized && Kakao.isInitialized()) {
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: window.i18n.getText('reactionKakaoTitle'),
              description: resultMessage,
              imageUrl: resultImage,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            itemContent: {
              profileText: window.i18n.getText('reactionKakaoProfileText'),
              profileImageUrl: resultImage,
              titleImageUrl: resultImage,
              titleImageText: window.i18n.getText('reactionKakaoTitleImageText').replace('{score}', score),
              titleImageCategory: window.i18n.getText('reactionKakaoTitleImageCategory'),
              items: gameState.results.map((result, index) => ({
                item: `${window.i18n.getText('reactionAttempt')} ${index + 1}`,
                itemOp: `${result}ms`,
              })),
              sum: window.i18n.getText('reactionKakaoAvgSpeed'),
              sumOp: `${score}ms`,
            },
            buttons: [
              {
                title: window.i18n.getText('reactionKakaoButton'),
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
        } else {
          // 카카오 SDK가 초기화되지 않았을 때 대체 동작
          const fallbackText = window.i18n.getText('reactionKakaoFallback').replace('{resultMessage}', resultMessage).replace('{url}', shareUrl);
          
          if (navigator.share) {
            navigator.share({
              title: window.i18n.getText('reactionKakaoTitle'),
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
        const instagramText = window.i18n.getText('reactionInstagramText').replace('{score}', score);
        
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

    // Challenge link
    var createChallengeBtn = document.getElementById('createChallengeBtn');
    var challengeLinkContainer = document.getElementById('challengeLinkContainer');
    var challengeLinkInput = document.getElementById('challengeLink');
    var copyChallengeLink = document.getElementById('copyChallengeLink');

    if (createChallengeBtn && typeof ChallengeUtils !== 'undefined') {
      createChallengeBtn.addEventListener('click', function() {
        var url = ChallengeUtils.createChallengeURL('reaction', gameSeed, score);
        challengeLinkInput.value = url;
        challengeLinkContainer.classList.remove('hidden');
      });
    }

    if (copyChallengeLink) {
      copyChallengeLink.addEventListener('click', function() {
        navigator.clipboard.writeText(challengeLinkInput.value).then(function() {
          copySuccessMessage.textContent = window.i18n.getText('challengeLinkCopied');
          copySuccessMessage.classList.remove('hidden');
          setTimeout(function() { copySuccessMessage.classList.add('hidden'); }, 3000);
        });
      });
    }
  }

  // 게임 리셋
  function resetGame() {
    gameState = {
      testActive: false,
      currentAttempt: 0,
      maxAttempts: 5,
      clickTime: 0,
      results: [],
      totalScore: 0
    };
    gameActionBtn.textContent = window.i18n.getText('start');
    gameActionBtn.disabled = false;

    if (!challengeData) {
      gameSeed = generateNewSeed();
    }
    rng = createSeededRNG(gameSeed);
  }
}); 