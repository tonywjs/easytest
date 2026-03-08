document.addEventListener('DOMContentLoaded', function() {
  // DOM 요소
  var introSection = document.getElementById('introSection');
  var gameSection = document.getElementById('gameSection');
  var resultSection = document.getElementById('resultSection');
  var startTestBtn = document.getElementById('startTestBtn');
  var retryBtn = document.getElementById('retryBtn');
  var colorGrid = document.getElementById('colorGrid');
  var currentLevelEl = document.getElementById('currentLevel');
  var livesDisplayEl = document.getElementById('livesDisplay');
  var progressBar = document.getElementById('progressBar');
  var gameMessage = document.getElementById('gameMessage');
  var resultScore = document.getElementById('resultScore');
  var resultIcon = document.getElementById('resultIcon');
  var levelProgress = document.getElementById('levelProgress');
  var userLevelMarker = document.getElementById('userLevelMarker');
  var kakaoShare = document.getElementById('kakaoShare');
  var facebookShare = document.getElementById('facebookShare');
  var instagramShare = document.getElementById('instagramShare');
  var linkCopy = document.getElementById('linkCopy');
  var copySuccessMessage = document.getElementById('copySuccessMessage');
  var createChallengeBtn = document.getElementById('createChallengeBtn');
  var challengeLinkContainer = document.getElementById('challengeLinkContainer');
  var challengeLinkInput = document.getElementById('challengeLink');
  var copyChallengeLink = document.getElementById('copyChallengeLink');
  var challengeComparison = document.getElementById('challengeComparison');
  var opponentScoreEl = document.getElementById('opponentScore');
  var myScoreEl = document.getElementById('myScore');
  var challengeResultText = document.getElementById('challengeResultText');

  // 이벤트 리스너 중복 등록 방지용 플래그
  var shareListenersAttached = false;
  var challengeListenersAttached = false;

  // 게임 상태
  var gameState = {
    level: 0,
    maxLevel: 20,
    lives: 3,
    maxLives: 3,
    correctTile: -1,
    isPlaying: false,
    seed: null,
    challengeData: null,
    finalLevel: 0
  };

  // 레벨 설정 (20 levels)
  var levelConfigs = generateLevelConfigs();

  // Seeded RNG (Linear Congruential Generator)
  function createSeededRNG(seed) {
    var s = seed;
    return function() {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  var rng = Math.random;

  // 레벨 설정 생성
  function generateLevelConfigs() {
    // Key points: level 1 (grid=2, delta=80), 5 (3, 50), 10 (3, 25), 15 (4, 10), 20 (5, 2)
    var keyPoints = [
      { level: 1,  grid: 2, delta: 80 },
      { level: 5,  grid: 3, delta: 50 },
      { level: 10, grid: 3, delta: 25 },
      { level: 15, grid: 4, delta: 10 },
      { level: 20, grid: 5, delta: 2 }
    ];

    var configs = [];
    for (var lvl = 1; lvl <= 20; lvl++) {
      var lower = keyPoints[0];
      var upper = keyPoints[keyPoints.length - 1];

      for (var i = 0; i < keyPoints.length - 1; i++) {
        if (lvl >= keyPoints[i].level && lvl <= keyPoints[i + 1].level) {
          lower = keyPoints[i];
          upper = keyPoints[i + 1];
          break;
        }
      }

      var t = (lvl - lower.level) / (upper.level - lower.level || 1);
      var delta = Math.round(lower.delta + (upper.delta - lower.delta) * t);
      var grid = Math.round(lower.grid + (upper.grid - lower.grid) * t);

      configs.push({ grid: grid, delta: delta });
    }
    return configs;
  }

  // 색상 생성
  function generateBaseColor() {
    var h = Math.floor(rng() * 360);
    var s = Math.floor(rng() * 40) + 40; // 40-80
    var l = Math.floor(rng() * 30) + 35; // 35-65
    return { h: h, s: s, l: l };
  }

  function generateDifferentColor(base, delta) {
    var channel = Math.floor(rng() * 3);
    var direction = rng() > 0.5 ? 1 : -1;
    var diff = { h: base.h, s: base.s, l: base.l };

    if (channel === 0) {
      diff.h = (base.h + delta * direction + 360) % 360;
    } else if (channel === 1) {
      diff.s = Math.max(0, Math.min(100, base.s + delta * direction));
    } else {
      diff.l = Math.max(0, Math.min(100, base.l + delta * direction));
    }
    return diff;
  }

  function hslToString(color) {
    return 'hsl(' + color.h + ', ' + color.s + '%, ' + color.l + '%)';
  }

  // 하트 표시 업데이트
  function updateLives() {
    var hearts = '';
    for (var i = 0; i < gameState.maxLives; i++) {
      if (i < gameState.lives) {
        hearts += '\u2764\uFE0F';
      } else {
        hearts += '\uD83E\uDE76';
      }
    }
    livesDisplayEl.textContent = hearts;
  }

  // i18n 텍스트 헬퍼
  function getText(key) {
    if (window.i18n && window.i18n.getText) {
      return window.i18n.getText(key);
    }
    var defaults = {
      colorLevel: '레벨',
      colorCorrect: '정답! 🎉',
      colorWrong: '틀렸습니다! 💔',
      colorGameOver: '게임 오버!',
      colorShareText: '내 색각 테스트 결과: 레벨 {level}! 당신은 몇 레벨까지 갈 수 있나요? #색각테스트 #색상구별',
      colorKakaoTitle: '👁️ 색각 테스트 결과',
      colorKakaoDesc: '레벨 {level} 달성! 당신도 도전해보세요!',
      colorKakaoButton: '나도 테스트하기',
      colorInstagramText: '내 색각 테스트 결과: 레벨 {level}!\n\n당신은 몇 레벨까지 갈 수 있나요? 👁️\n\n#색각테스트 #색상구별 #시력테스트 #눈건강',
      copied: '복사되었습니다!',
      linkCopied: '링크가 복사되었습니다!',
      instagramShareCopied: '인스타그램 공유 텍스트가 복사되었습니다!',
      kakaoShareCopied: '카카오톡 공유 텍스트가 복사되었습니다!',
      shareTextAlert: '공유할 텍스트:',
      copyFailed: '텍스트 복사에 실패했습니다. 수동으로 복사해주세요:',
      challengeWin: '🏆 승리!',
      challengeLose: '😢 패배...',
      challengeDraw: '🤝 무승부!',
      challengeModeLabel: '도전 모드'
    };
    return defaults[key] || key;
  }

  // 게임 초기화
  function initGame() {
    gameState.level = 0;
    gameState.lives = gameState.maxLives;
    gameState.isPlaying = true;
    gameState.correctTile = -1;

    // 챌린지 모드 확인
    if (typeof window.ChallengeUtils !== 'undefined') {
      var challengeData = window.ChallengeUtils.parseChallenge();
      if (challengeData) {
        gameState.challengeData = challengeData;
        gameState.seed = challengeData.seed;
        rng = createSeededRNG(challengeData.seed);
      }
    }

    if (!gameState.seed) {
      gameState.seed = Math.floor(Math.random() * 100000);
      rng = createSeededRNG(gameState.seed);
    }

    introSection.classList.add('hidden');
    gameSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
    gameMessage.textContent = '';

    updateLives();
    nextLevel();
  }

  // 다음 레벨
  function nextLevel() {
    gameState.level++;

    if (gameState.level > gameState.maxLevel) {
      finishGame();
      return;
    }

    currentLevelEl.textContent = gameState.level;
    progressBar.style.width = (gameState.level / gameState.maxLevel * 100) + '%';
    gameMessage.textContent = '';

    renderGrid();
  }

  // 그리드 렌더링
  function renderGrid() {
    var config = levelConfigs[gameState.level - 1];
    var gridSize = config.grid;
    var delta = config.delta;
    var totalTiles = gridSize * gridSize;

    // 그리드 클래스 설정
    colorGrid.className = 'color-grid mt-6 grid-' + gridSize + 'x' + gridSize;

    // 색상 생성
    var baseColor = generateBaseColor();
    var diffColor = generateDifferentColor(baseColor, delta);

    // 정답 타일 위치
    gameState.correctTile = Math.floor(rng() * totalTiles);

    // 타일 생성
    colorGrid.textContent = '';
    for (var i = 0; i < totalTiles; i++) {
      var tile = document.createElement('div');
      tile.className = 'color-tile';

      if (i === gameState.correctTile) {
        tile.style.backgroundColor = hslToString(diffColor);
      } else {
        tile.style.backgroundColor = hslToString(baseColor);
      }

      tile.setAttribute('data-index', String(i));
      colorGrid.appendChild(tile);
    }
  }

  // 타일 클릭 핸들러 (이벤트 위임)
  colorGrid.addEventListener('click', function(e) {
    var tile = e.target.closest('.color-tile');
    if (!tile || !gameState.isPlaying) return;
    handleTileClick(tile);
  });

  function handleTileClick(tile) {
    var index = parseInt(tile.getAttribute('data-index'), 10);

    // 클릭 중복 방지
    gameState.isPlaying = false;

    if (index === gameState.correctTile) {
      // 정답
      tile.classList.add('correct');
      gameMessage.style.color = '#10b981';
      gameMessage.textContent = getText('colorCorrect');

      setTimeout(function() {
        gameState.isPlaying = true;
        if (gameState.level >= gameState.maxLevel) {
          finishGame();
        } else {
          nextLevel();
        }
      }, 600);
    } else {
      // 오답
      tile.classList.add('wrong');

      // 정답 타일 표시
      var tiles = colorGrid.querySelectorAll('.color-tile');
      tiles[gameState.correctTile].classList.add('correct');

      gameState.lives--;
      updateLives();

      if (gameState.lives <= 0) {
        gameMessage.style.color = '#ef4444';
        gameMessage.textContent = getText('colorGameOver');
        setTimeout(function() {
          finishGame();
        }, 1000);
      } else {
        gameMessage.style.color = '#ef4444';
        gameMessage.textContent = getText('colorWrong');
        setTimeout(function() {
          gameState.isPlaying = true;
          nextLevel();
        }, 1000);
      }
    }
  }

  // 게임 종료
  function finishGame() {
    gameState.isPlaying = false;
    var finalLevel = gameState.level;

    // 마지막 레벨을 클리어한 경우
    if (gameState.lives > 0 && gameState.level > gameState.maxLevel) {
      finalLevel = gameState.maxLevel;
    }

    // 목숨이 없어서 끝난 경우: 현재 레벨 - 1 이 실제 클리어 레벨
    if (gameState.lives <= 0) {
      finalLevel = Math.max(0, gameState.level - 1);
    }

    gameState.finalLevel = finalLevel;

    gameSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    // 점수 표시
    resultScore.textContent = getText('colorLevel') + ' ' + finalLevel;

    // 등급 결정 및 아이콘 설정
    if (finalLevel >= 16) {
      resultIcon.className = 'fas fa-crown text-5xl text-amber-400 mb-2';
    } else if (finalLevel >= 8) {
      resultIcon.className = 'fas fa-eye text-5xl text-blue-400 mb-2';
    } else {
      resultIcon.className = 'fas fa-seedling text-5xl text-green-400 mb-2';
    }

    // 레벨 인디케이터 위치
    var posPercent = Math.min(95, (finalLevel / gameState.maxLevel) * 100);
    userLevelMarker.style.left = posPercent + '%';
    setTimeout(function() {
      levelProgress.style.width = posPercent + '%';
    }, 300);

    // 챌린지 비교
    if (gameState.challengeData && gameState.challengeData.score !== undefined) {
      var opponentLevel = gameState.challengeData.score;
      opponentScoreEl.textContent = getText('colorLevel') + ' ' + opponentLevel;
      myScoreEl.textContent = getText('colorLevel') + ' ' + finalLevel;

      var players = challengeComparison.querySelectorAll('.challenge-player');
      if (finalLevel > opponentLevel) {
        players[1].classList.add('winner');
        challengeResultText.textContent = getText('challengeWin');
        challengeResultText.style.color = '#10b981';
      } else if (finalLevel < opponentLevel) {
        players[0].classList.add('winner');
        challengeResultText.textContent = getText('challengeLose');
        challengeResultText.style.color = '#ef4444';
      } else {
        challengeResultText.textContent = getText('challengeDraw');
        challengeResultText.style.color = '#f59e0b';
      }

      challengeComparison.classList.remove('hidden');
    }

    // 챌린지 및 공유 리스너 등록 (한 번만)
    setupChallengeListeners();
    setupShareListeners();
  }

  // 복사 성공 메시지
  function showCopySuccess(msg) {
    var msgSpan = copySuccessMessage.querySelector('span');
    if (msgSpan) {
      msgSpan.textContent = msg;
    }
    copySuccessMessage.classList.remove('hidden');
    setTimeout(function() {
      copySuccessMessage.classList.add('hidden');
    }, 2000);
  }

  // 챌린지 리스너 설정 (한 번만 등록, gameState에서 현재 값 읽음)
  function setupChallengeListeners() {
    if (challengeListenersAttached) return;
    challengeListenersAttached = true;

    if (createChallengeBtn) {
      createChallengeBtn.addEventListener('click', function() {
        if (typeof window.ChallengeUtils !== 'undefined') {
          var url = window.ChallengeUtils.createChallengeURL('color', gameState.seed, gameState.finalLevel);
          challengeLinkInput.value = url;
          challengeLinkContainer.classList.remove('hidden');
        }
      });
    }

    if (copyChallengeLink) {
      copyChallengeLink.addEventListener('click', function() {
        navigator.clipboard.writeText(challengeLinkInput.value).then(function() {
          showCopySuccess(getText('copied'));
        });
      });
    }
  }

  // 공유 리스너 설정 (한 번만 등록, gameState에서 현재 값 읽음)
  function setupShareListeners() {
    if (shareListenersAttached) return;
    shareListenersAttached = true;

    var shareUrl = window.location.href.split('?')[0];

    // 카카오톡 공유
    if (kakaoShare) {
      kakaoShare.addEventListener('click', function() {
        var score = gameState.finalLevel;
        var shareText = getText('colorShareText').replace('{level}', score);
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized && Kakao.isInitialized()) {
          Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: getText('colorKakaoTitle'),
              description: getText('colorKakaoDesc').replace('{level}', score),
              imageUrl: 'https://via.placeholder.com/800x400/06b6d4/ffffff?text=Color+Vision+Test',
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl
              }
            },
            buttons: [
              {
                title: getText('colorKakaoButton'),
                link: {
                  mobileWebUrl: shareUrl,
                  webUrl: shareUrl
                }
              }
            ]
          });
        } else {
          var fallbackText = shareText + '\n' + shareUrl;
          if (navigator.share) {
            navigator.share({
              title: getText('colorKakaoTitle'),
              text: fallbackText,
              url: shareUrl
            }).catch(function(err) { console.log('Share failed:', err); });
          } else {
            navigator.clipboard.writeText(fallbackText).then(function() {
              showCopySuccess(getText('kakaoShareCopied'));
            }).catch(function() {
              alert(getText('shareTextAlert') + '\n' + fallbackText);
            });
          }
        }
      });
    }

    // 페이스북 공유
    if (facebookShare) {
      facebookShare.addEventListener('click', function() {
        var score = gameState.finalLevel;
        var shareText = getText('colorShareText').replace('{level}', score);
        var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl) + '&quote=' + encodeURIComponent(shareText);
        window.open(url, '_blank');
      });
    }

    // 인스타그램 공유
    if (instagramShare) {
      instagramShare.addEventListener('click', function() {
        var score = gameState.finalLevel;
        var instagramText = getText('colorInstagramText').replace('{level}', score);
        navigator.clipboard.writeText(instagramText).then(function() {
          showCopySuccess(getText('instagramShareCopied'));
        }).catch(function() {
          alert(getText('copyFailed') + '\n\n' + instagramText);
        });
      });
    }

    // 링크 복사
    if (linkCopy) {
      linkCopy.addEventListener('click', function() {
        navigator.clipboard.writeText(shareUrl).then(function() {
          showCopySuccess(getText('linkCopied'));
        });
      });
    }
  }

  // 이벤트 리스너
  startTestBtn.addEventListener('click', function() {
    initGame();
  });

  retryBtn.addEventListener('click', function() {
    gameSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    introSection.classList.remove('hidden');

    // 상태 리셋
    gameState.level = 0;
    gameState.lives = gameState.maxLives;
    gameState.isPlaying = false;
    gameState.correctTile = -1;
    gameState.seed = null;
    gameState.challengeData = null;
    rng = Math.random;

    // 챌린지 UI 리셋
    challengeComparison.classList.add('hidden');
    challengeLinkContainer.classList.add('hidden');
    var players = challengeComparison.querySelectorAll('.challenge-player');
    players.forEach(function(p) { p.classList.remove('winner'); });
  });

  // 챌린지 모드 확인 (페이지 로드 시)
  if (typeof window.ChallengeUtils !== 'undefined') {
    var challengeData = window.ChallengeUtils.parseChallenge();
    if (challengeData) {
      // 챌린지 모드 배너 표시
      var banner = document.createElement('div');
      banner.className = 'text-center mb-4 p-3 rounded-lg';
      banner.style.background = 'rgba(244, 63, 94, 0.15)';
      banner.style.border = '1px solid rgba(244, 63, 94, 0.3)';

      var icon = document.createElement('i');
      icon.className = 'fas fa-trophy text-rose-400 mr-2';
      banner.appendChild(icon);

      var label = document.createElement('span');
      label.className = 'text-rose-300 font-semibold';
      label.textContent = getText('challengeModeLabel');
      banner.appendChild(label);

      introSection.insertBefore(banner, introSection.firstChild);
    }
  }
});
