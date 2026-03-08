// 전역 변수
let currentSection = 'intro';
let score = {
    number: 0,
    word: 0,
    position: 0,
    overall: 0
};

// 테스트 데이터
const numberTests = [
    { sequence: '38295', time: 3 },
    { sequence: '172394', time: 4 },
    { sequence: '5928374', time: 5 }
];

const wordTests = [
    { 
        words: ['바다', '노트북', '자전거', '커피', '책상'], 
        options: ['바다', '노트북', '자전거', '커피', '책상', '전화기', '기차', '우산'],
        time: 5 
    },
    { 
        words: ['하늘', '음악', '여행', '시계', '선물', '카메라'], 
        options: ['하늘', '음악', '여행', '시계', '선물', '카메라', '나무', '도시', '칼', '사진'],
        time: 6 
    }
];

const positionTests = [
    {
        items: ['🍎', '🍌', '🍇', '🍊'],
        positions: [0, 2, 6, 8],
        time: 4
    },
    {
        items: ['🐶', '🐱', '🐰', '🐻', '🦊'],
        positions: [0, 1, 4, 6, 8],
        time: 5
    }
];

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 랜덤 테스트 카운트
    document.getElementById('testCount').textContent = (15000 + Math.floor(Math.random() * 2000)).toLocaleString();
    
    // 버튼 이벤트 리스너
    document.getElementById('startButton').addEventListener('click', function() {
        showSection('instructions');
    });
    
    document.getElementById('startTestButton').addEventListener('click', function() {
        showSection('numberTest');
        startNumberTest();
    });
    
    document.getElementById('submitNumberButton').addEventListener('click', submitNumberAnswer);
    document.getElementById('submitWordButton').addEventListener('click', submitWordAnswer);
    document.getElementById('submitPositionButton').addEventListener('click', submitPositionAnswer);
    document.getElementById('retryButton').addEventListener('click', function() {
        showSection('intro');
    });
    
    // 숫자 입력 엔터키 제출
    document.getElementById('numberAnswer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitNumberAnswer();
        }
    });
});

// 섹션 변경 함수
function showSection(sectionId) {
    document.getElementById(currentSection).classList.remove('active');
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;
    
    window.scrollTo(0, 0);
}

// 숫자 테스트 시작
let currentNumberTest = 0;

function startNumberTest() {
    document.getElementById('numberProgress').style.width = `${(currentNumberTest / numberTests.length) * 100}%`;
    
    if (currentNumberTest >= numberTests.length) {
        startWordTest();
        return;
    }
    
    const test = numberTests[currentNumberTest];
    document.getElementById('numberDisplay').classList.remove('hidden');
    document.getElementById('numberInput').classList.add('hidden');
    document.getElementById('numberSequence').textContent = test.sequence;
    
    let timeLeft = test.time;
    document.getElementById('numberTimer').textContent = `${timeLeft}초 후에 사라집니다`;
    
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('numberTimer').textContent = `${timeLeft}초 후에 사라집니다`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('numberDisplay').classList.add('hidden');
            document.getElementById('numberInput').classList.remove('hidden');
            document.getElementById('numberAnswer').focus();
        }
    }, 1000);
}

// 숫자 답변 제출
function submitNumberAnswer() {
    const userAnswer = document.getElementById('numberAnswer').value;
    const correctAnswer = numberTests[currentNumberTest].sequence;
    
    // 점수 계산 (정확한 숫자 개수 / 전체 숫자 개수)
    let correct = 0;
    for (let i = 0; i < correctAnswer.length; i++) {
        if (userAnswer[i] === correctAnswer[i]) {
            correct++;
        }
    }
    
    const testScore = Math.round((correct / correctAnswer.length) * 100);
    score.number += testScore;
    
    // 다음 테스트로
    document.getElementById('numberAnswer').value = '';
    currentNumberTest++;
    startNumberTest();
}

// 단어 테스트 시작
let currentWordTest = 0;
let correctWords = [];

function startWordTest() {
    document.getElementById('wordProgress').style.width = `${(currentWordTest / wordTests.length) * 100}%`;
    
    if (currentWordTest >= wordTests.length) {
        showSection('positionTest');
        startPositionTest();
        return;
    }
    
    showSection('wordTest');
    const test = wordTests[currentWordTest];
    correctWords = [...test.words];
    
    document.getElementById('wordDisplay').classList.remove('hidden');
    document.getElementById('wordSelection').classList.add('hidden');
    
    // 단어 목록 표시
    const wordList = document.getElementById('wordList');
    wordList.innerHTML = '';
    test.words.forEach(word => {
        const wordElem = document.createElement('div');
        wordElem.textContent = word;
        wordList.appendChild(wordElem);
    });
    
    // 타이머 설정
    let timeLeft = test.time;
    document.getElementById('wordTimer').textContent = `${timeLeft}초 후에 사라집니다`;
    
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('wordTimer').textContent = `${timeLeft}초 후에 사라집니다`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('wordDisplay').classList.add('hidden');
            
            // 선택지 표시
            const wordOptions = document.getElementById('wordOptions');
            wordOptions.innerHTML = '';
            
            // 선택지 순서 섞기
            const shuffledOptions = [...test.options].sort(() => Math.random() - 0.5);
            
            shuffledOptions.forEach(word => {
                const option = document.createElement('div');
                option.className = 'p-3 border rounded-lg text-center cursor-pointer hover:bg-gray-100';
                option.textContent = word;
                option.dataset.word = word;
                option.addEventListener('click', function() {
                    this.classList.toggle('bg-yellow-100');
                    this.classList.toggle('border-yellow-500');
                });
                wordOptions.appendChild(option);
            });
            
            document.getElementById('wordSelection').classList.remove('hidden');
        }
    }, 1000);
}

// 단어 답변 제출
function submitWordAnswer() {
    const selectedElements = document.querySelectorAll('#wordOptions .bg-yellow-100');
    const selectedWords = Array.from(selectedElements).map(el => el.dataset.word);
    
    // 점수 계산 (정확히 맞춘 단어 수 / 전체 단어 수)
    let correctSelections = 0;
    let falseSelections = 0;
    
    selectedWords.forEach(word => {
        if (correctWords.includes(word)) {
            correctSelections++;
        } else {
            falseSelections++;
        }
    });
    
    const missedWords = correctWords.length - correctSelections;
    const testScore = Math.round(((correctSelections - falseSelections - missedWords) / correctWords.length) * 100);
    score.word += Math.max(0, testScore);
    
    currentWordTest++;
    startWordTest();
}

// 위치 테스트 시작
let currentPositionTest = 0;
let currentPositionQuestion = 0;
let positionItems = [];
let positionPositions = [];

function startPositionTest() {
    document.getElementById('positionProgress').style.width = `${(currentPositionTest / positionTests.length) * 100}%`;
    
    if (currentPositionTest >= positionTests.length) {
        calculateFinalScore();
        showSection('results');
        showResults();
        return;
    }
    
    const test = positionTests[currentPositionTest];
    positionItems = [...test.items];
    positionPositions = [...test.positions];
    currentPositionQuestion = 0;
    
    document.getElementById('positionDisplay').classList.remove('hidden');
    document.getElementById('positionSelection').classList.add('hidden');
    
    // 그리드 생성 (3x3)
    const grid = document.getElementById('positionGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'memory-item';
        
        const itemIndex = positionPositions.indexOf(i);
        if (itemIndex !== -1) {
            cell.textContent = positionItems[itemIndex];
        } else {
            cell.innerHTML = '&nbsp;';
        }
        
        grid.appendChild(cell);
    }
    
    // 타이머 설정
    let timeLeft = test.time;
    document.getElementById('positionTimer').textContent = `${timeLeft}초 후에 사라집니다`;
    
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById('positionTimer').textContent = `${timeLeft}초 후에 사라집니다`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            showNextPositionQuestion();
        }
    }, 1000);
}

// 위치 테스트 문제 표시
function showNextPositionQuestion() {
    if (currentPositionQuestion >= positionItems.length) {
        currentPositionTest++;
        startPositionTest();
        return;
    }
    
    document.getElementById('positionDisplay').classList.add('hidden');
    document.getElementById('positionSelection').classList.remove('hidden');
    
    document.getElementById('positionQuestion').textContent = positionItems[currentPositionQuestion];
    
    // 선택지 표시 (3x3 그리드)
    const options = document.getElementById('positionOptions');
    options.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'memory-item cursor-pointer';
        cell.dataset.position = i;
        cell.innerHTML = '&nbsp;';
        
        cell.addEventListener('click', function() {
            // 이전 선택 제거
            const selected = document.querySelector('#positionOptions .bg-yellow-100');
            if (selected) {
                selected.classList.remove('bg-yellow-100', 'border-yellow-500');
            }
            
            // 새 선택 표시
            this.classList.add('bg-yellow-100', 'border-yellow-500');
        });
        
        options.appendChild(cell);
    }
}

// 위치 답변 제출
function submitPositionAnswer() {
    const selected = document.querySelector('#positionOptions .bg-yellow-100');
    
    if (!selected) return; // 선택이 없으면 무시
    
    const selectedPosition = parseInt(selected.dataset.position);
    const correctPosition = positionPositions[currentPositionQuestion];
    
    // 정답인지 체크 및 점수 계산
    if (selectedPosition === correctPosition) {
        score.position += 100;
    }
    
    currentPositionQuestion++;
    showNextPositionQuestion();
}

// 최종 점수 계산
function calculateFinalScore() {
    score.number = Math.round(score.number / numberTests.length);
    score.word = Math.round(score.word / wordTests.length);
    score.position = Math.round(score.position / (positionTests.length * positionTests[0].items.length));
    
    // 전체 점수는 각 영역의 가중 평균
    score.overall = Math.round((score.number * 0.35) + (score.word * 0.35) + (score.position * 0.3));
    
    // 점수 조정 (사용자에게 긍정적인 경험을 위해)
    score.overall = Math.min(100, Math.max(65, score.overall));
}

// 결과 표시
function showResults() {
    // 점수 표시
    document.getElementById('overallScore').textContent = score.overall;
    document.getElementById('overallGauge').style.width = `${score.overall}%`;
    
    document.getElementById('numberScore').textContent = `${score.number}%`;
    document.getElementById('wordScore').textContent = `${score.word}%`;
    document.getElementById('positionScore').textContent = `${score.position}%`;
    
    // 백분위 계산 (사용자가 공유하도록 긍정적인 결과)
    const percentile = Math.min(99, Math.max(70, 100 - Math.round((100 - score.overall) / 2)));
    document.getElementById('percentileResult').textContent = `당신의 기억력은 상위 ${percentile}%입니다!`;
    
    // 천재 코멘트 조건부 표시
    if (percentile > 90) {
        document.getElementById('geniusComment').textContent = "혹시 천재?";
    } else if (percentile > 80) {
        document.getElementById('geniusComment').textContent = "뛰어난 기억력을 가지셨네요!";
    } else {
        document.getElementById('geniusComment').textContent = "평균 이상의 좋은 기억력입니다.";
    }
    
    // 나이대 비교 (가상의 데이터)
    const ageAverage = Math.round(55 + Math.random() * 15);
    document.getElementById('ageAverage').textContent = `${ageAverage}점`;
    document.getElementById('ageGauge').style.width = `${ageAverage}%`;
    
    const ageDifference = Math.round(((score.overall - ageAverage) / ageAverage) * 100);
    document.getElementById('ageComparison').textContent = 
        `당신은 나이대 평균보다 ${ageDifference}% 높습니다`;
        
    // 결과 애니메이션
    createConfetti();
}

// 공유 기능
function shareKakao() {
    alert('카카오 공유 API를 연동하려면 카카오 개발자 계정과 API 키가 필요합니다');
}

function shareTwitter() {
    const text = `내 암기력은 상위 ${document.getElementById('percentileResult').textContent.match(/\d+/)[0]}%! 당신은 어떤가요? #암기력테스트 #기억력`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`);
}

function shareFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
}

function shareLink() {
    navigator.clipboard.writeText(window.location.href)
        .then(() => alert('링크가 복사되었습니다!'))
        .catch(err => console.error('링크 복사 실패:', err));
}

// 폭죽 애니메이션
function createConfetti() {
    const confettiCount = 100;
    const container = document.getElementById('resultAnimation');
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // 다양한 색상
        const colors = ['#FFDE00', '#FF9500', '#FF4D00', '#E3242B', '#60D394', '#AAF683', '#9ADDF3'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // 랜덤 형태
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // 랜덤 위치
        const startPositionX = 50;
        const startPositionY = 50;
        
        confetti.style.left = `${startPositionX}%`;
        confetti.style.top = `${startPositionY}%`;
        
        // 애니메이션
        const animationDuration = Math.random() * 3 + 2;
        const xDistance = Math.random() * 300 - 150;
        const yDistance = Math.random() * 200 - 50;
        
        confetti.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${xDistance}px, ${yDistance}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: animationDuration * 1000,
            easing: 'cubic-bezier(0,0,0.2,1)'
        });
        
        container.appendChild(confetti);
        
        // 애니메이션 후 요소 제거
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
} 