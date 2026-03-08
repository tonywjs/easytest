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
    gameActionBtn.textContent = '시작';
    gameActionBtn.disabled = false;
    
    // 색상 테스트 UI 설정
    const colorTest = document.createElement('div');
    colorTest.className = 'color-test';
    colorTest.style.backgroundColor = '#F44336';
    colorTest.innerHTML = '시작 버튼을 누르면<br>테스트가 시작됩니다.';
    gameContainer.innerHTML = '';
    gameContainer.appendChild(colorTest);
  }

  // 테스트 시작
  function startTest() {
    gameState.testActive = true;
    gameState.currentAttempt = 0;
    gameState.results = [];
    
    gameActionBtn.textContent = '테스트 중...';
    gameActionBtn.disabled = true;
    
    startColorTest();
  }

  // 색상 변경 테스트
  function startColorTest() {
    const colorTest = gameContainer.querySelector('.color-test');
    colorTest.style.backgroundColor = '#F44336'; // 빨간색
    colorTest.textContent = '색상이 초록색으로 변하면 클릭하세요!';
    
    let timeoutDelay = Math.random() * 3000 + 1000; // 1-4초 랜덤 딜레이
    
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
          colorTest.textContent = '색상이 초록색으로 변하면 클릭하세요!';
          timeoutDelay = Math.random() * 3000 + 1000;
          setTimeout(changeToGreen, timeoutDelay);
        } else {
          finishTest();
        }
      } else {
        // 너무 일찍 클릭했을 때
        colorTest.style.backgroundColor = '#FF9800'; // 주황색
        colorTest.textContent = '너무 일찍 클릭했습니다! 잠시 후 다시 시작합니다.';
        setTimeout(() => {
          colorTest.style.backgroundColor = '#F44336';
          colorTest.textContent = '색상이 초록색으로 변하면 클릭하세요!';
          timeoutDelay = Math.random() * 3000 + 1000;
          setTimeout(changeToGreen, timeoutDelay);
        }, 1500);
      }
    };
    
    function changeToGreen() {
      if (gameState.testActive) {
        colorTest.style.backgroundColor = '#4CAF50'; // 초록색
        colorTest.textContent = '지금 클릭하세요!';
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
      테스트 완료!<br>
      <small>잠시 후 결과를 확인할 수 있습니다.</small>
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
      resultDescription.innerHTML = `당신의 평균 반응 속도는 <span class="font-bold text-indigo-600">${averageScore}ms</span>로, 프로게이머급 반응 속도를 가지고 있습니다! 🏆`;
      resultIcon.className = 'fas fa-trophy text-5xl text-amber-500 mb-2';
    } else if (averageScore < 200) {
      resultDescription.innerHTML = `당신의 평균 반응 속도는 <span class="font-bold text-indigo-600">${averageScore}ms</span>로, 매우 우수한 반응 속도입니다! 🥇`;
      resultIcon.className = 'fas fa-medal text-5xl text-indigo-500 mb-2';
    } else if (averageScore < 250) {
      resultDescription.innerHTML = `당신의 평균 반응 속도는 <span class="font-bold text-indigo-600">${averageScore}ms</span>로, 일반인 평균 수준입니다. 👍`;
      resultIcon.className = 'fas fa-user text-5xl text-blue-500 mb-2';
    } else {
      resultDescription.innerHTML = `당신의 평균 반응 속도는 <span class="font-bold text-indigo-600">${averageScore}ms</span>로, 더 연습하면 향상될 수 있습니다! 💪`;
      resultIcon.className = 'fas fa-hourglass-half text-5xl text-gray-500 mb-2';
    }
    
    // 시도별 결과 표시
    gameResults.innerHTML = '';
    gameState.results.forEach((result, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'flex justify-between items-center p-2 border-b border-gray-200';
      resultItem.innerHTML = `
        <span>시도 ${index + 1}</span>
        <span class="font-semibold">${result}ms</span>
      `;
      gameResults.appendChild(resultItem);
    });
    
    // 비교 테이블 생성
    comparisonTable.innerHTML = '';
    addComparisonRow('프로게이머', referenceData.proGamer.avg, averageScore - referenceData.proGamer.avg);
    addComparisonRow('일반인', referenceData.average.avg, averageScore - referenceData.average.avg);
    addComparisonRow('인간 한계', referenceData.limit.avg, averageScore - referenceData.limit.avg);
    
    // 공유 버튼 설정
    setupShareButtons(averageScore);
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
    const shareText = `내 반응속도 테스트 결과: ${score}ms! 당신은 어떤가요? #반응속도테스트 #프로게이머테스트`;
    const shareUrl = window.location.href;
    
    // 결과에 따른 메시지와 이미지 설정
    let resultMessage = '';
    let resultImage = '';
    
    if (score < 160) {
      resultMessage = `🏆 프로게이머급 반응속도! ${score}ms로 놀라운 결과를 기록했습니다!`;
      resultImage = 'https://via.placeholder.com/800x400/FFD700/000000?text=프로게이머급!';
    } else if (score < 200) {
      resultMessage = `🥇 우수한 반응속도! ${score}ms로 일반인보다 빠른 반응속도를 보여줬습니다!`;
      resultImage = 'https://via.placeholder.com/800x400/C0C0C0/000000?text=우수함!';
    } else if (score < 250) {
      resultMessage = `👍 평균적인 반응속도! ${score}ms로 일반인 수준의 반응속도입니다.`;
      resultImage = 'https://via.placeholder.com/800x400/CD7F32/000000?text=평균!';
    } else {
      resultMessage = `💪 연습이 필요해요! ${score}ms... 더 연습하면 향상될 수 있어요!`;
      resultImage = 'https://via.placeholder.com/800x400/808080/000000?text=연습필요!';
    }
    
    // 카카오톡 공유
    if (kakaoShare) {
      kakaoShare.addEventListener('click', function() {
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized && Kakao.isInitialized()) {
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: '⚡ 반응속도 테스트 결과',
              description: resultMessage,
              imageUrl: resultImage,
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
            itemContent: {
              profileText: '반응속도 테스트',
              profileImageUrl: resultImage,
              titleImageUrl: resultImage,
              titleImageText: `${score}ms 반응속도`,
              titleImageCategory: '테스트 결과',
              items: gameState.results.map((result, index) => ({
                item: `시도 ${index + 1}`,
                itemOp: `${result}ms`,
              })),
              sum: '평균 반응속도',
              sumOp: `${score}ms`,
            },
            buttons: [
              {
                title: '나도 테스트하기',
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl,
                },
              },
            ],
          });
        } else {
          // 카카오 SDK가 초기화되지 않았을 때 대체 동작
          const fallbackText = `${resultMessage}\n\n당신의 반응속도는 어떤가요?\n테스트 해보세요: ${shareUrl}`;
          
          if (navigator.share) {
            navigator.share({
              title: '⚡ 반응속도 테스트 결과',
              text: fallbackText,
              url: shareUrl
            }).catch(err => console.log('공유 실패:', err));
          } else {
            navigator.clipboard.writeText(fallbackText).then(function() {
              copySuccessMessage.textContent = '카카오톡 공유 텍스트가 복사되었습니다!';
              copySuccessMessage.classList.remove('hidden');
              setTimeout(() => {
                copySuccessMessage.classList.add('hidden');
              }, 3000);
            }).catch(function() {
              alert('공유할 텍스트:\n' + fallbackText);
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
        const instagramText = `내 반응속도 테스트 결과: ${score}ms!\n\n당신의 반응속도는 어떤가요? 🎯\n\n#반응속도테스트 #프로게이머테스트 #게임 #반응속도 #도전`;
        
        navigator.clipboard.writeText(instagramText).then(function() {
          copySuccessMessage.textContent = '인스타그램 공유 텍스트가 복사되었습니다!';
          copySuccessMessage.classList.remove('hidden');
          setTimeout(() => {
            copySuccessMessage.classList.add('hidden');
          }, 3000);
        }).catch(function() {
          alert('텍스트 복사에 실패했습니다. 수동으로 복사해주세요:\n\n' + instagramText);
        });
      });
    }
    
    // 링크 복사
    if (linkCopy) {
      linkCopy.addEventListener('click', function() {
        navigator.clipboard.writeText(shareUrl).then(function() {
          copySuccessMessage.textContent = '링크가 복사되었습니다!';
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
      maxAttempts: 5,
      clickTime: 0,
      results: [],
      totalScore: 0
    };
    gameActionBtn.textContent = '시작';
    gameActionBtn.disabled = false;
  }
}); 