// EasyTest 다국어 시스템
class I18n {
    constructor() {
        this.currentLang = 'kr';
        this.translations = {
            kr: {
                // 메인 페이지
                mainTitle: 'EasyTest',
                mainSubtitle: '당신의 능력을 테스트하고 다른 사람들과 비교해보세요!',
                mainDescription: '간단하고 재미있는 다양한 테스트를 경험해보세요',
                availableTests: '이용 가능한 테스트',

                // 공통 UI
                startTest: '테스트 시작하기',
                backToHome: '홈으로',
                tryAgain: '다시 시도하기',
                share: '공유하기',
                duration: '소요시간',
                start: '시작',
                close: '닫기',
                cancel: '취소',
                save: '저장하기',
                settings: '설정',
                exit: '나가기',

                // 공통 게임 UI
                progress: '진행 상황',
                currentScore: '현재 점수',
                testResult: '테스트 결과',
                gameResult: '게임 결과',
                yourGrade: '당신의 등급',
                attemptResults: '시도별 결과',
                comparisonAnalysis: '비교 분석',
                shareResult: '결과 공유하기',
                retryTest: '다시 테스트하기',

                // 비교표 헤더
                levelLabel: '레벨',
                reactionSpeedLabel: '반응속도',
                differenceLabel: '차이',

                // 벤치마크 라벨
                proGamer: '프로게이머',
                normalUser: '일반인',
                humanLimit: '인간 한계',
                topLevel: '최고 수준',
                you: '당신',

                // 공유 버튼
                kakaoTalk: '카카오톡',
                facebook: '페이스북',
                instagram: '인스타그램',
                copyLink: '링크 복사',
                copied: '복사되었습니다!',
                kakaoShare: '카카오톡 공유',
                facebookShare: '페이스북 공유',

                // 테스트 안내
                testGuide: '테스트 안내',

                // 반응속도 테스트
                reactionTest: '반응속도 테스트',
                reactionDesc: '빨간색에서 초록색으로 변할 때 얼마나 빠르게 반응할 수 있나요?',
                reactionDuration: '약 1분',
                reactionInstruction: '화면이 초록색으로 바뀌면 클릭',
                reactionAnalysis: '프로게이머와 비교 분석',
                reactionIntroTitle: '색상 변경 반응속도 테스트',
                reactionIntroDesc: '화면이 빨간색에서 초록색으로 변할 때 최대한 빠르게 클릭하세요!',
                reactionRule1: '화면이 빨간색에서 초록색으로 변하면 즉시 클릭하세요',
                reactionRule2: '총 5회 측정하여 평균값을 계산합니다',
                reactionRule3: '너무 일찍 클릭하면 다시 시작됩니다',
                reactionRule4: '집중하고 준비된 상태에서 테스트하세요',
                reactionResultDesc: '당신의 평균 반응 속도는',
                reactionResultUnit: '입니다',

                // 타이핑 테스트
                typingTest: '타이핑 테스트',
                typingDesc: '아래 문장을 정확히 타이핑해보세요!',
                typingDuration: '약 1-2분',
                typingSpeed: '타이핑 속도 및 정확도 측정',
                typingWPM: 'WPM 속도 분석 및 비교',
                typingPlaceholder: '타이핑을 시작하면 자동으로 테스트가 시작됩니다...',
                accuracy: '정확도(%)',
                time: '시간(초)',
                testComplete: '테스트 완료!',
                typingSpeedLabel: '타이핑 속도:',
                accuracyLabel: '정확도:',
                timeLabel: '소요 시간:',
                customTestLabel: '내 맘대로 테스트',
                customTextPlaceholder: '원하는 텍스트를 입력하세요 (비워두면 기본 문장 사용)',
                applyText: '텍스트 적용',

                // 에임테스트
                aimTest: '에임테스트',
                aimDesc: '화면에 나타나는 목표물을 얼마나 빠르게 클릭할 수 있나요?',
                aimDuration: '약 1분',
                aimTarget: '랜덤 위치 타겟 클릭',
                aimAccuracy: '정확도와 반응속도 측정',
                aimIntroTitle: '에임 정확도 & 반응속도 테스트',
                aimIntroDesc: '화면에 나타나는 목표물을 최대한 빠르게 클릭하세요!',
                aimRule1: '화면에 나타나는 빨간 원형 타겟을 빠르게 클릭하세요',
                aimRule2: '총 10회 측정하여 평균값을 계산합니다',
                aimRule3: '타겟의 위치는 랜덤으로 변경됩니다',
                aimRule4: '마우스 정확도와 반응속도가 모두 중요합니다',
                aimResultDesc: '당신의 평균 에임 반응 속도는',

                // 패턴기억테스트
                patternTest: '패턴기억테스트',
                patternDesc: '불이 켜진 박스를 얼마나 빠르게 찾을 수 있나요?',
                patternDuration: '약 2분',
                patternGrid: '3x3 그리드 패턴 기억',
                patternRecognition: '패턴 인식 능력 측정',
                patternIntroTitle: '순차 기억력 & 집중력 테스트',
                patternIntroDesc: '점점 늘어나는 카드 순서를 기억하고 똑같이 클릭하세요!',
                beginner: '초급자',
                expert: '고수',
                memoryGenius: '기억력 천재',
                stages3to5: '3-5단계',
                stages6to9: '6-9단계',
                stages10plus: '10단계+',
                gameRules: '게임 규칙',
                patternRule1: '1단계부터 시작하여 카드가 깜빡이는 순서를 기억하세요',
                patternRule2: '기억한 순서대로 카드를 클릭하세요',
                patternRule3: '성공하면 다음 단계에서 카드 개수가 1개씩 늘어납니다',
                patternRule4: '실수하면 라이프가 1개 줄어들고, 라이프가 0이 되면 게임 종료!',
                patternRule5: '최대한 많은 단계까지 도전해보세요!',
                difficultySelect: '난이도 선택',
                easyDifficulty: '쉬움 (0.8초 표시)',
                normalDifficulty: '보통 (0.5초 표시)',
                hardDifficulty: '어려움 (0.3초 표시)',
                lifeSystem: '라이프 시스템',
                lifeCount: '2개의 라이프',
                lifeDesc: '가 주어집니다.',
                lifeSubDesc: '틀릴 때마다 라이프가 1개씩 줄어들어요.',
                currentStage: '현재 단계',
                lives: '라이프',
                bestRecord: '최고 기록',
                finalStage: '최종 도달 단계',
                stageResults: '단계별 결과',
                gradeComparison: '등급 비교',
                grade: '등급',
                stage: '단계',
                evaluation: '평가',
                retryChallenge: '다시 도전하기',

                // 숫자계산테스트
                numberTest: '숫자계산 테스트(곶감게임)',
                numberDesc: '합이 10이 되는 곶감을 선택하는 퍼즐게임!',
                numberDuration: '1-3분',
                numberDrag: '드래그로 사각형 선택하여 제거',
                numberPuzzle: '두뇌 퍼즐게임',
                numberGameDesc: '합이 10이 되는 곶감을 사각형으로 선택해 제거하는 게임입니다.',
                timeSelect: '시간 선택:',
                time2m30s: '2분 30초',
                time1m30s: '1분 30초',
                time1m: '1분',
                time30s: '30초',
                vsFriend: '친구와 대결하기',
                tutorial: '게임설명',
                score: '점수',
                highScore: '최고',
                gameStart: '게임시작',
                restart: '다시시작',
                stopGame: '게임 중지',
                toMenu: '메뉴로',
                combo: '콤보',
                tutorialTitle: '게임 설명',
                tutorialRule1: '마우스나 손가락으로 드래그하여 사각형 영역을 선택합니다.',
                tutorialRule2: '선택한 사각형 안의 곶감에 적힌 숫자의 합이 10이 되면 곶감이 제거됩니다.',
                tutorialRule3: '제한시간은 난이도에 따라 다릅니다.',
                tutorialRule4: '제거한 곶감 개수만큼 점수를 얻습니다.',
                timeDescription: '시간 설명:',
                timeEasyDesc: '충분한 시간으로 여유롭게 게임',
                timeNormalDesc: '적당한 긴장감으로 즐기는 게임',
                timeHardDesc: '빠른 판단력이 필요한 게임',
                timeProDesc: '극한의 집중력 도전!',
                paused: '일시 정지',
                continueGame: '게임 계속하기',
                endGame: '게임 종료하기',
                finalScore: '최종 점수',
                removedPersimmons: '개 제거',
                maxCombo: '최대 콤보',
                totalMoves: '총 제거 횟수',
                newHighScore: '새 최고 기록 달성!',
                previousRecord: '이전 기록',
                allTimeHigh: '역대 최고 기록',
                selectedDifficulty: '선택한 난이도',
                shareScore: '내 점수를 공유해보세요!',
                playAgain: '다시 도전',
                mainMenu: '메인 메뉴',
                gameSettings: '게임 설정',
                adjustDifficulty: '원하는 시간을 선택하여 게임의 난이도를 조절하세요',
                vsFriendTitle: '친구와 대결하기',
                vsFriendDesc: '친구와 같은 게임판에서 대결해보세요!',
                vsFriendShareDesc: '아래 버튼으로 대결 링크를 공유하세요.',
                startBattle: '대결 시작하기',
                difficultyEasy: '쉬움',
                difficultyNormal: '보통',
                difficultyHard: '어려움',
                difficultyPro: '프로',

                // 공통 메시지
                loading: '로딩 중...',
                ready: '준비',
                waiting: '대기 중...',
                tooFast: '너무 빨라요! 초록색을 기다리세요.',
                clickGreen: '초록색이 되면 클릭하세요!',
                yourTime: '당신의 시간',
                average: '평균',
                excellent: '훌륭해요!',
                good: '좋아요!',
                tryAgainMsg: '다시 시도해보세요!',

                // 푸터
                copyright: '© 2025 EasyTest.'
            },

            en: {
                mainTitle: 'EasyTest',
                mainSubtitle: 'Test your abilities and compare with others!',
                mainDescription: 'Experience various simple and fun tests',
                availableTests: 'Available Tests',
                startTest: 'Start Test',
                backToHome: 'Home',
                tryAgain: 'Try Again',
                share: 'Share',
                duration: 'Duration',
                start: 'Start',
                close: 'Close',
                cancel: 'Cancel',
                save: 'Save',
                settings: 'Settings',
                exit: 'Exit',
                progress: 'Progress',
                currentScore: 'Current Score',
                testResult: 'Test Result',
                gameResult: 'Game Result',
                yourGrade: 'Your Grade',
                attemptResults: 'Results by Attempt',
                comparisonAnalysis: 'Comparison',
                shareResult: 'Share Results',
                retryTest: 'Try Again',
                levelLabel: 'Level',
                reactionSpeedLabel: 'Speed',
                differenceLabel: 'Diff',
                proGamer: 'Pro Gamer',
                normalUser: 'Average',
                humanLimit: 'Human Limit',
                topLevel: 'Top Level',
                you: 'You',
                kakaoTalk: 'KakaoTalk',
                facebook: 'Facebook',
                instagram: 'Instagram',
                copyLink: 'Copy Link',
                copied: 'Copied!',
                kakaoShare: 'Share on KakaoTalk',
                facebookShare: 'Share on Facebook',
                testGuide: 'Test Guide',
                reactionTest: 'Reaction Speed Test',
                reactionDesc: 'How fast can you react when the color changes from red to green?',
                reactionDuration: 'About 1 min',
                reactionInstruction: 'Click when the screen turns green',
                reactionAnalysis: 'Compare with pro gamers',
                reactionIntroTitle: 'Color Change Reaction Test',
                reactionIntroDesc: 'Click as fast as you can when the screen changes from red to green!',
                reactionRule1: 'Click immediately when the screen changes from red to green',
                reactionRule2: '5 measurements to calculate the average',
                reactionRule3: 'Clicking too early will restart the attempt',
                reactionRule4: 'Test when focused and ready',
                reactionResultDesc: 'Your average reaction speed is',
                reactionResultUnit: '',
                typingTest: 'Typing Test',
                typingDesc: 'Type the sentence below accurately!',
                typingDuration: 'About 1-2 min',
                typingSpeed: 'Measure typing speed and accuracy',
                typingWPM: 'WPM speed analysis and comparison',
                typingPlaceholder: 'Start typing to begin the test automatically...',
                accuracy: 'Accuracy(%)',
                time: 'Time(sec)',
                testComplete: 'Test Complete!',
                typingSpeedLabel: 'Typing Speed:',
                accuracyLabel: 'Accuracy:',
                timeLabel: 'Time Taken:',
                customTestLabel: 'Custom Test',
                customTextPlaceholder: 'Enter desired text (leave empty for default)',
                applyText: 'Apply Text',
                aimTest: 'Aim Test',
                aimDesc: 'How fast can you click the targets that appear on the screen?',
                aimDuration: 'About 1 min',
                aimTarget: 'Click random position targets',
                aimAccuracy: 'Measure accuracy and reaction speed',
                aimIntroTitle: 'Aim Accuracy & Reaction Speed Test',
                aimIntroDesc: 'Click the targets as fast as you can!',
                aimRule1: 'Click the red circular targets as fast as possible',
                aimRule2: '10 measurements to calculate the average',
                aimRule3: 'Target positions change randomly',
                aimRule4: 'Both mouse accuracy and reaction speed matter',
                aimResultDesc: 'Your average aim reaction speed is',
                patternTest: 'Pattern Memory Test',
                patternDesc: 'How fast can you find the lit boxes?',
                patternDuration: 'About 2 min',
                patternGrid: '3x3 grid pattern memory',
                patternRecognition: 'Measure pattern recognition ability',
                patternIntroTitle: 'Sequential Memory & Focus Test',
                patternIntroDesc: 'Remember the card sequence and click them in the same order!',
                beginner: 'Beginner',
                expert: 'Expert',
                memoryGenius: 'Memory Genius',
                stages3to5: 'Stage 3-5',
                stages6to9: 'Stage 6-9',
                stages10plus: 'Stage 10+',
                gameRules: 'Game Rules',
                patternRule1: 'Starting from stage 1, remember the order cards flash',
                patternRule2: 'Click the cards in the order you remember',
                patternRule3: 'Success adds 1 more card in the next stage',
                patternRule4: 'Mistakes cost 1 life. Game over at 0 lives!',
                patternRule5: 'Try to reach as many stages as possible!',
                difficultySelect: 'Difficulty',
                easyDifficulty: 'Easy (0.8s display)',
                normalDifficulty: 'Normal (0.5s display)',
                hardDifficulty: 'Hard (0.3s display)',
                lifeSystem: 'Life System',
                lifeCount: '2 lives',
                lifeDesc: ' are given.',
                lifeSubDesc: 'Each mistake costs 1 life.',
                currentStage: 'Current Stage',
                lives: 'Lives',
                bestRecord: 'Best Record',
                finalStage: 'Final Stage Reached',
                stageResults: 'Results by Stage',
                gradeComparison: 'Grade Comparison',
                grade: 'Grade',
                stage: 'Stage',
                evaluation: 'Rating',
                retryChallenge: 'Try Again',
                numberTest: 'Number Puzzle (Persimmon Game)',
                numberDesc: 'A puzzle to select persimmons that add up to 10!',
                numberDuration: '1-3 min',
                numberDrag: 'Drag to select and remove rectangles',
                numberPuzzle: 'Brain puzzle game',
                numberGameDesc: 'Select persimmons in a rectangle that add up to 10 to remove them.',
                timeSelect: 'Time Select:',
                time2m30s: '2m 30s',
                time1m30s: '1m 30s',
                time1m: '1m',
                time30s: '30s',
                vsFriend: 'Play with Friend',
                tutorial: 'How to Play',
                score: 'Score',
                highScore: 'Best',
                gameStart: 'Start Game',
                restart: 'Restart',
                stopGame: 'Stop',
                toMenu: 'Menu',
                combo: 'Combo',
                tutorialTitle: 'How to Play',
                tutorialRule1: 'Drag with mouse or finger to select a rectangular area.',
                tutorialRule2: 'If the numbers add up to 10, they are removed.',
                tutorialRule3: 'Time limit varies by difficulty.',
                tutorialRule4: 'You earn points for each persimmon removed.',
                timeDescription: 'Time Guide:',
                timeEasyDesc: 'Plenty of time for a relaxed game',
                timeNormalDesc: 'Moderate tension for an enjoyable game',
                timeHardDesc: 'Quick decision-making required',
                timeProDesc: 'Ultimate focus challenge!',
                paused: 'Paused',
                continueGame: 'Continue',
                endGame: 'End Game',
                finalScore: 'Final Score',
                removedPersimmons: ' removed',
                maxCombo: 'Max Combo',
                totalMoves: 'Total Removals',
                newHighScore: 'New High Score!',
                previousRecord: 'Previous',
                allTimeHigh: 'All-time High',
                selectedDifficulty: 'Difficulty',
                shareScore: 'Share your score!',
                playAgain: 'Play Again',
                mainMenu: 'Main Menu',
                gameSettings: 'Game Settings',
                adjustDifficulty: 'Select time to adjust game difficulty',
                vsFriendTitle: 'Play with Friend',
                vsFriendDesc: 'Compete with friends on the same board!',
                vsFriendShareDesc: 'Share the battle link below.',
                startBattle: 'Start Battle',
                difficultyEasy: 'Easy',
                difficultyNormal: 'Normal',
                difficultyHard: 'Hard',
                difficultyPro: 'Pro',
                loading: 'Loading...',
                ready: 'Ready',
                waiting: 'Waiting...',
                tooFast: 'Too fast! Wait for green.',
                clickGreen: 'Click when it turns green!',
                yourTime: 'Your Time',
                average: 'Average',
                excellent: 'Excellent!',
                good: 'Good!',
                tryAgainMsg: 'Try again!',
                copyright: '© 2025 EasyTest.'
            },

            ja: {
                mainTitle: 'EasyTest',
                mainSubtitle: 'あなたの能力をテストして他の人と比較してみてください！',
                mainDescription: 'シンプルで楽しい様々なテストを体験してみてください',
                availableTests: '利用可能なテスト',
                startTest: 'テスト開始',
                backToHome: 'ホーム',
                tryAgain: 'もう一度試す',
                share: 'シェア',
                duration: '所要時間',
                start: 'スタート',
                close: '閉じる',
                cancel: 'キャンセル',
                save: '保存',
                settings: '設定',
                exit: '退出',
                progress: '進行状況',
                currentScore: '現在のスコア',
                testResult: 'テスト結果',
                gameResult: 'ゲーム結果',
                yourGrade: 'あなたの等級',
                attemptResults: '試行別結果',
                comparisonAnalysis: '比較分析',
                shareResult: '結果をシェア',
                retryTest: 'もう一度テスト',
                levelLabel: 'レベル',
                reactionSpeedLabel: '反応速度',
                differenceLabel: '差',
                proGamer: 'プロゲーマー',
                normalUser: '一般人',
                humanLimit: '人間の限界',
                topLevel: '最高水準',
                you: 'あなた',
                kakaoTalk: 'カカオトーク',
                facebook: 'Facebook',
                instagram: 'Instagram',
                copyLink: 'リンクコピー',
                copied: 'コピーされました！',
                kakaoShare: 'カカオトークでシェア',
                facebookShare: 'Facebookでシェア',
                testGuide: 'テストガイド',
                reactionTest: '反応速度テスト',
                reactionDesc: '赤から緑に変わったときどのくらい速く反応できますか？',
                reactionDuration: '約1分',
                reactionInstruction: '画面が緑になったらクリック',
                reactionAnalysis: 'プロゲーマーとの比較分析',
                reactionIntroTitle: '色変更反応速度テスト',
                reactionIntroDesc: '画面が赤から緑に変わったらできるだけ速くクリックしてください！',
                reactionRule1: '画面が赤から緑に変わったらすぐにクリックしてください',
                reactionRule2: '5回測定して平均値を計算します',
                reactionRule3: '早すぎるクリックは再スタートされます',
                reactionRule4: '集中して準備ができてからテストしてください',
                reactionResultDesc: 'あなたの平均反応速度は',
                reactionResultUnit: 'です',
                typingTest: 'タイピングテスト',
                typingDesc: '下の文章を正確にタイピングしてください！',
                typingDuration: '約1-2分',
                typingSpeed: 'タイピング速度と正確性の測定',
                typingWPM: 'WPM速度分析と比較',
                typingPlaceholder: 'タイピングを開始すると自動的にテストが始まります...',
                accuracy: '正確度(%)',
                time: '時間(秒)',
                testComplete: 'テスト完了！',
                typingSpeedLabel: 'タイピング速度:',
                accuracyLabel: '正確度:',
                timeLabel: '所要時間:',
                customTestLabel: 'カスタムテスト',
                customTextPlaceholder: '希望するテキストを入力してください (空欄の場合デフォルト使用)',
                applyText: 'テキスト適用',
                aimTest: 'エイムテスト',
                aimDesc: '画面に現れるターゲットをどのくらい速くクリックできますか？',
                aimDuration: '約1分',
                aimTarget: 'ランダム位置ターゲットクリック',
                aimAccuracy: '正確性と反応速度測定',
                aimIntroTitle: 'エイム精度＆反応速度テスト',
                aimIntroDesc: '画面に現れるターゲットをできるだけ速くクリックしてください！',
                aimRule1: '画面に現れる赤い円形ターゲットを素早くクリックしてください',
                aimRule2: '10回測定して平均値を計算します',
                aimRule3: 'ターゲットの位置はランダムに変更されます',
                aimRule4: 'マウスの正確さと反応速度の両方が重要です',
                aimResultDesc: 'あなたの平均エイム反応速度は',
                patternTest: 'パターン記憶テスト',
                patternDesc: '点灯したボックスをどのくらい速く見つけられますか？',
                patternDuration: '約2分',
                patternGrid: '3x3グリッドパターン記憶',
                patternRecognition: 'パターン認識能力測定',
                patternIntroTitle: '順次記憶力＆集中力テスト',
                patternIntroDesc: '増えていくカードの順序を覚えて同じようにクリックしてください！',
                beginner: '初級者',
                expert: '上級者',
                memoryGenius: '記憶力の天才',
                stages3to5: '3-5段階',
                stages6to9: '6-9段階',
                stages10plus: '10段階+',
                gameRules: 'ゲームルール',
                patternRule1: '1段階から始めてカードが点滅する順序を覚えてください',
                patternRule2: '覚えた順序でカードをクリックしてください',
                patternRule3: '成功すると次の段階でカードが1枚増えます',
                patternRule4: '間違えるとライフが1つ減り、0になるとゲーム終了！',
                patternRule5: 'できるだけ多くの段階まで挑戦してください！',
                difficultySelect: '難易度選択',
                easyDifficulty: '簡単 (0.8秒表示)',
                normalDifficulty: '普通 (0.5秒表示)',
                hardDifficulty: '難しい (0.3秒表示)',
                lifeSystem: 'ライフシステム',
                lifeCount: '2つのライフ',
                lifeDesc: 'が与えられます。',
                lifeSubDesc: '間違えるたびにライフが1つ減ります。',
                currentStage: '現在の段階',
                lives: 'ライフ',
                bestRecord: '最高記録',
                finalStage: '最終到達段階',
                stageResults: '段階別結果',
                gradeComparison: '等級比較',
                grade: '等級',
                stage: '段階',
                evaluation: '評価',
                retryChallenge: 'もう一度挑戦',
                numberTest: '数字計算テスト（柿ゲーム）',
                numberDesc: '合計が10になる柿を選ぶパズルゲーム！',
                numberDuration: '1-3分',
                numberDrag: 'ドラッグで四角形を選択して削除',
                numberPuzzle: '脳パズルゲーム',
                numberGameDesc: '合計が10になる柿を四角形で選んで削除するゲームです。',
                timeSelect: '時間選択：',
                time2m30s: '2分30秒',
                time1m30s: '1分30秒',
                time1m: '1分',
                time30s: '30秒',
                vsFriend: '友達と対戦',
                tutorial: 'ゲーム説明',
                score: 'スコア',
                highScore: '最高',
                gameStart: 'ゲーム開始',
                restart: '再スタート',
                stopGame: 'ゲーム停止',
                toMenu: 'メニューへ',
                combo: 'コンボ',
                tutorialTitle: 'ゲーム説明',
                tutorialRule1: 'マウスか指でドラッグして四角形のエリアを選択します。',
                tutorialRule2: '選択した四角形内の柿の数字の合計が10になると削除されます。',
                tutorialRule3: '制限時間は難易度によって異なります。',
                tutorialRule4: '削除した柿の数だけスコアを獲得します。',
                timeDescription: '時間説明：',
                timeEasyDesc: '十分な時間でゆったりゲーム',
                timeNormalDesc: '適度な緊張感で楽しむゲーム',
                timeHardDesc: '素早い判断力が必要なゲーム',
                timeProDesc: '究極の集中力チャレンジ！',
                paused: '一時停止',
                continueGame: 'ゲームを続ける',
                endGame: 'ゲーム終了',
                finalScore: '最終スコア',
                removedPersimmons: '個削除',
                maxCombo: '最大コンボ',
                totalMoves: '総削除回数',
                newHighScore: '新記録達成！',
                previousRecord: '以前の記録',
                allTimeHigh: '歴代最高',
                selectedDifficulty: '選択した難易度',
                shareScore: 'スコアをシェアしよう！',
                playAgain: 'もう一度挑戦',
                mainMenu: 'メインメニュー',
                gameSettings: 'ゲーム設定',
                adjustDifficulty: '希望する時間を選んでゲームの難易度を調整してください',
                vsFriendTitle: '友達と対戦',
                vsFriendDesc: '友達と同じゲームボードで対戦してみてください！',
                vsFriendShareDesc: '下のボタンで対戦リンクをシェアしてください。',
                startBattle: '対戦開始',
                difficultyEasy: '簡単',
                difficultyNormal: '普通',
                difficultyHard: '難しい',
                difficultyPro: 'プロ',
                loading: '読み込み中...',
                ready: '準備',
                waiting: '待機中...',
                tooFast: '早すぎます！緑を待ってください。',
                clickGreen: '緑になったらクリックしてください！',
                yourTime: 'あなたの時間',
                average: '平均',
                excellent: '素晴らしい！',
                good: '良い！',
                tryAgainMsg: 'もう一度試してみてください！',
                copyright: '© 2025 EasyTest.'
            },

            zh: {
                mainTitle: 'EasyTest',
                mainSubtitle: '测试你的能力并与他人比较！',
                mainDescription: '体验各种简单有趣的测试',
                availableTests: '可用测试',
                startTest: '开始测试',
                backToHome: '首页',
                tryAgain: '重试',
                share: '分享',
                duration: '所需时间',
                start: '开始',
                close: '关闭',
                cancel: '取消',
                save: '保存',
                settings: '设置',
                exit: '退出',
                progress: '进度',
                currentScore: '当前分数',
                testResult: '测试结果',
                gameResult: '游戏结果',
                yourGrade: '你的等级',
                attemptResults: '各次结果',
                comparisonAnalysis: '比较分析',
                shareResult: '分享结果',
                retryTest: '重新测试',
                levelLabel: '级别',
                reactionSpeedLabel: '反应速度',
                differenceLabel: '差异',
                proGamer: '职业玩家',
                normalUser: '普通人',
                humanLimit: '人类极限',
                topLevel: '最高水平',
                you: '你',
                kakaoTalk: 'KakaoTalk',
                facebook: 'Facebook',
                instagram: 'Instagram',
                copyLink: '复制链接',
                copied: '已复制！',
                kakaoShare: 'KakaoTalk分享',
                facebookShare: 'Facebook分享',
                testGuide: '测试说明',
                reactionTest: '反应速度测试',
                reactionDesc: '当颜色从红变绿时，你能多快做出反应？',
                reactionDuration: '约1分钟',
                reactionInstruction: '屏幕变绿时点击',
                reactionAnalysis: '与职业玩家比较分析',
                reactionIntroTitle: '颜色变化反应速度测试',
                reactionIntroDesc: '屏幕从红色变为绿色时，请尽快点击！',
                reactionRule1: '屏幕从红色变为绿色时立即点击',
                reactionRule2: '共测量5次计算平均值',
                reactionRule3: '点击太早会重新开始',
                reactionRule4: '请在集中注意力后进行测试',
                reactionResultDesc: '你的平均反应速度为',
                reactionResultUnit: '',
                typingTest: '打字测试',
                typingDesc: '请准确输入下面的句子！',
                typingDuration: '约1-2分钟',
                typingSpeed: '测量打字速度和准确度',
                typingWPM: 'WPM速度分析与比较',
                typingPlaceholder: '开始打字后测试将自动开始...',
                accuracy: '准确度(%)',
                time: '时间(秒)',
                testComplete: '测试完成！',
                typingSpeedLabel: '打字速度：',
                accuracyLabel: '准确度：',
                timeLabel: '所用时间：',
                customTestLabel: '自定义测试',
                customTextPlaceholder: '输入想要的文本（留空使用默认）',
                applyText: '应用文本',
                aimTest: '瞄准测试',
                aimDesc: '你能多快点击屏幕上出现的目标？',
                aimDuration: '约1分钟',
                aimTarget: '点击随机位置目标',
                aimAccuracy: '测量准确度和反应速度',
                aimIntroTitle: '瞄准精度与反应速度测试',
                aimIntroDesc: '请尽快点击屏幕上出现的目标！',
                aimRule1: '快速点击屏幕上出现的红色圆形目标',
                aimRule2: '共测量10次计算平均值',
                aimRule3: '目标位置随机变化',
                aimRule4: '鼠标准确度和反应速度同样重要',
                aimResultDesc: '你的平均瞄准反应速度为',
                patternTest: '图案记忆测试',
                patternDesc: '你能多快找到亮起的方块？',
                patternDuration: '约2分钟',
                patternGrid: '3x3网格图案记忆',
                patternRecognition: '测量图案识别能力',
                patternIntroTitle: '顺序记忆力与专注力测试',
                patternIntroDesc: '记住卡片闪烁的顺序并按相同顺序点击！',
                beginner: '初级',
                expert: '高手',
                memoryGenius: '记忆天才',
                stages3to5: '3-5阶段',
                stages6to9: '6-9阶段',
                stages10plus: '10阶段+',
                gameRules: '游戏规则',
                patternRule1: '从第1阶段开始，记住卡片闪烁的顺序',
                patternRule2: '按记忆的顺序点击卡片',
                patternRule3: '成功后下一阶段会多出1张卡片',
                patternRule4: '失误会减少1条生命，生命为0时游戏结束！',
                patternRule5: '尽可能挑战更多阶段！',
                difficultySelect: '难度选择',
                easyDifficulty: '简单（0.8秒显示）',
                normalDifficulty: '普通（0.5秒显示）',
                hardDifficulty: '困难（0.3秒显示）',
                lifeSystem: '生命系统',
                lifeCount: '2条生命',
                lifeDesc: '。',
                lifeSubDesc: '每次失误减少1条生命。',
                currentStage: '当前阶段',
                lives: '生命',
                bestRecord: '最高记录',
                finalStage: '最终阶段',
                stageResults: '各阶段结果',
                gradeComparison: '等级比较',
                grade: '等级',
                stage: '阶段',
                evaluation: '评价',
                retryChallenge: '再次挑战',
                numberTest: '数字计算测试（柿饼游戏）',
                numberDesc: '选择总和为10的柿饼的益智游戏！',
                numberDuration: '1-3分钟',
                numberDrag: '拖动选择矩形并消除',
                numberPuzzle: '脑力益智游戏',
                numberGameDesc: '用矩形选择总和为10的柿饼来消除它们。',
                timeSelect: '时间选择：',
                time2m30s: '2分30秒',
                time1m30s: '1分30秒',
                time1m: '1分钟',
                time30s: '30秒',
                vsFriend: '与朋友对战',
                tutorial: '游戏说明',
                score: '分数',
                highScore: '最高',
                gameStart: '开始游戏',
                restart: '重新开始',
                stopGame: '暂停游戏',
                toMenu: '菜单',
                combo: '连击',
                tutorialTitle: '游戏说明',
                tutorialRule1: '用鼠标或手指拖动选择矩形区域。',
                tutorialRule2: '如果所选矩形内的数字之和为10，则柿饼被消除。',
                tutorialRule3: '时间限制因难度而异。',
                tutorialRule4: '每消除一个柿饼获得相应分数。',
                timeDescription: '时间说明：',
                timeEasyDesc: '充足的时间，轻松游戏',
                timeNormalDesc: '适度紧张，享受游戏',
                timeHardDesc: '需要快速判断力',
                timeProDesc: '极限专注力挑战！',
                paused: '暂停',
                continueGame: '继续游戏',
                endGame: '结束游戏',
                finalScore: '最终分数',
                removedPersimmons: '个已消除',
                maxCombo: '最大连击',
                totalMoves: '总消除次数',
                newHighScore: '新最高记录！',
                previousRecord: '上次记录',
                allTimeHigh: '历史最高',
                selectedDifficulty: '所选难度',
                shareScore: '分享你的分数！',
                playAgain: '再次挑战',
                mainMenu: '主菜单',
                gameSettings: '游戏设置',
                adjustDifficulty: '选择时间来调整游戏难度',
                vsFriendTitle: '与朋友对战',
                vsFriendDesc: '在同一个游戏板上与朋友竞争！',
                vsFriendShareDesc: '通过下方按钮分享对战链接。',
                startBattle: '开始对战',
                difficultyEasy: '简单',
                difficultyNormal: '普通',
                difficultyHard: '困难',
                difficultyPro: '专业',
                loading: '加载中...',
                ready: '准备',
                waiting: '等待中...',
                tooFast: '太快了！请等待绿色。',
                clickGreen: '变绿时请点击！',
                yourTime: '你的时间',
                average: '平均',
                excellent: '太棒了！',
                good: '不错！',
                tryAgainMsg: '再试一次！',
                copyright: '© 2025 EasyTest.'
            }
        };

        this.init();
    }

    init() {
        this.currentLang = this.detectLanguage();
        this.createLanguageSelector();
        this.applyTranslations();
    }

    detectLanguage() {
        // 1. URL 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.translations[urlLang]) {
            this.saveLanguagePreference(urlLang);
            return urlLang;
        }

        // 2. 저장된 사용자 선택
        const savedLang = localStorage.getItem('easytest_lang');
        if (savedLang && this.translations[savedLang]) {
            return savedLang;
        }

        // 3. 브라우저 언어 감지
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('en')) return 'en';
        if (browserLang.startsWith('ja')) return 'ja';
        if (browserLang.startsWith('ko')) return 'kr';
        if (browserLang.startsWith('zh')) return 'zh';

        // 4. 기본값
        return 'kr';
    }

    saveLanguagePreference(lang) {
        localStorage.setItem('easytest_lang', lang);
    }

    changeLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.saveLanguagePreference(lang);
            this.applyTranslations();
            this.updateURL(lang);
            this.updateLanguageSelector();
            this.updateAllLinks();
            // html lang 속성 업데이트
            var langMap = { kr: 'ko', en: 'en', ja: 'ja', zh: 'zh' };
            document.documentElement.lang = langMap[lang] || lang;
        }
    }

    updateURL(lang) {
        var url = new URL(window.location);
        if (lang === 'kr') {
            url.searchParams.delete('lang');
        } else {
            url.searchParams.set('lang', lang);
        }
        window.history.replaceState({}, '', url);
    }

    getText(key) {
        return this.translations[this.currentLang][key] || this.translations['kr'][key] || key;
    }

    applyTranslations() {
        // data-i18n 속성을 가진 모든 요소 번역
        document.querySelectorAll('[data-i18n]').forEach(function(element) {
            var key = element.getAttribute('data-i18n');
            var text = this.getText(key);

            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = text;
            } else if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                element.placeholder = text;
            } else if (element.tagName === 'TEXTAREA' && element.placeholder !== undefined) {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }.bind(this));

        // title과 meta description 업데이트
        if (document.querySelector('[data-i18n="mainTitle"]')) {
            document.title = this.getText('mainTitle') + ' - ' + this.getText('mainSubtitle');
        }
    }

    createLanguageSelector() {
        var existingSelector = document.getElementById('language-selector');
        if (existingSelector) {
            existingSelector.remove();
        }

        var selector = document.createElement('div');
        selector.id = 'language-selector';
        selector.style.cssText = 'position:fixed;top:16px;right:16px;z-index:9999;display:flex;gap:4px;background:rgba(255,255,255,0.95);padding:6px 8px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.15);backdrop-filter:blur(10px);';

        var languages = [
            { code: 'kr', flag: '\u{1F1F0}\u{1F1F7}', name: '\uD55C\uAD6D\uC5B4' },
            { code: 'en', flag: '\u{1F1FA}\u{1F1F8}', name: 'EN' },
            { code: 'ja', flag: '\u{1F1EF}\u{1F1F5}', name: '\u65E5\u672C\u8A9E' },
            { code: 'zh', flag: '\u{1F1E8}\u{1F1F3}', name: '\u4E2D\u6587' }
        ];

        var self = this;
        languages.forEach(function(lang) {
            var button = document.createElement('button');
            button.style.cssText = 'border:none;background:none;padding:4px 8px;border-radius:8px;cursor:pointer;font-size:13px;transition:all 0.2s;white-space:nowrap;';
            if (self.currentLang === lang.code) {
                button.style.background = '#667eea';
                button.style.color = 'white';
                button.style.fontWeight = '600';
            } else {
                button.style.color = '#374151';
            }
            button.textContent = lang.flag + ' ' + lang.name;
            button.setAttribute('data-lang', lang.code);
            button.addEventListener('mouseenter', function() {
                if (self.currentLang !== lang.code) {
                    this.style.background = '#f3f4f6';
                }
            });
            button.addEventListener('mouseleave', function() {
                if (self.currentLang !== lang.code) {
                    this.style.background = 'none';
                }
            });
            button.addEventListener('click', function() {
                self.changeLanguage(lang.code);
            });
            selector.appendChild(button);
        });

        document.body.appendChild(selector);
    }

    updateLanguageSelector() {
        var self = this;
        var buttons = document.querySelectorAll('#language-selector button');
        buttons.forEach(function(button) {
            var langCode = button.getAttribute('data-lang');
            if (self.currentLang === langCode) {
                button.style.background = '#667eea';
                button.style.color = 'white';
                button.style.fontWeight = '600';
            } else {
                button.style.background = 'none';
                button.style.color = '#374151';
                button.style.fontWeight = 'normal';
            }
        });
    }

    updateAllLinks() {
        var self = this;
        document.querySelectorAll('a[href^="./"]').forEach(function(link) {
            var href = link.getAttribute('href');
            var url = new URL(href, window.location.origin + window.location.pathname);

            if (self.currentLang !== 'kr') {
                url.searchParams.set('lang', self.currentLang);
            } else {
                url.searchParams.delete('lang');
            }

            link.setAttribute('href', url.pathname + url.search);
        });
    }
}

// 전역 i18n 인스턴스 생성
window.i18n = new I18n();

// 페이지 로드 완료 후 링크 업데이트
document.addEventListener('DOMContentLoaded', function() {
    window.i18n.updateAllLinks();
});
