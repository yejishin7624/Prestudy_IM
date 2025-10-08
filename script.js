// Firebase 설정 및 초기화
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBL4CmHX2hAOAUoA9oUqCJZWM_jsjBOPXg",
    authDomain: "prestudy-im.firebaseapp.com",
    projectId: "prestudy-im",
    storageBucket: "prestudy-im.firebasestorage.app",
    messagingSenderId: "1035260737639",
    appId: "1:1035260737639:web:6075789eb2c1c886db7cc2",
    measurementId: "G-1KGSG7Q5B0",
    databaseURL: "https://prestudy-im-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 전역 변수
let studentId = '';
let studentName = '';
let currentQuestion = 0;
let correctCount = 0;
let userAnswers = [];
let isLearning = false;
let startTime = null;
let endTime = null;

// 근육주사 문제 데이터 (체크리스트 순서대로)
const questions = [
    {
        id: 1,
        checklistNumber: "1번",
        type: "올바르지 않은 것",
        question: "물과 비누를 이용한 손위생 수행 시 다음 중 올바르지 않은 절차는?",
        options: [
            "시계와 반지를 착용한 채로 손을 씻고, 씻은 후에 제거한다",
            "40초~1분 동안 흐르는 물에 손을 씻는다",
            "손씻기 6단계(손바닥→손등→손가락 사이→손가락 끝→엄지→손목)를 따른다",
            "사용한 종이타월로 수도꼭지를 잠근다"
        ],
        correct: 0,
        category: "손위생",
        explanation: "시계와 반지는 손위생을 시작하기 전에 먼저 제거해야 합니다. 시계와 반지 밑에는 미생물이 축적되기 쉬우므로 착용한 채로 손을 씻으면 효과적인 손위생이 불가능합니다.",
        reference: "체크리스트 1번 항목 - 5항목 모두 정확히 수행해야 2점"
    },
    {
        id: 2,
        checklistNumber: "2번",
        type: "올바른 것",
        question: "투약처방 확인 시 반드시 체크해야 하는 '5 rights' 원칙에 대한 설명으로 올바른 것은?",
        options: [
            "대상자명만 확인하면 나머지는 투약카드에 기재되어 있으므로 생략 가능하다",
            "대상자 등록번호, 대상자명, 약명, 용량, 투여경로, 시간을 모두 확인해야 한다",
            "약명과 용량만 확인하면 투약 오류를 예방할 수 있다",
            "투여경로는 의사 처방이므로 간호사가 재확인할 필요가 없다"
        ],
        correct: 1,
        category: "투약원칙",
        explanation: "투약의 5 rights는 ①올바른 대상자(등록번호, 이름) ②올바른 약물 ③올바른 용량 ④올바른 투여경로 ⑤올바른 시간입니다. 모든 항목을 빠짐없이 확인해야 투약 오류를 예방할 수 있습니다.",
        reference: "체크리스트 2번 항목 - 정확히 수행하지 않으면 0점(핵심 항목)"
    },
    {
        id: 3,
        checklistNumber: "3번",
        type: "올바르지 않은 것",
        question: "근육주사에 필요한 약물을 주사기에 준비하는 과정에서 올바르지 않은 것은?",
        options: [
            "바이알의 약물을 흡입할 때 바이알 내부 압력 조절을 위해 공기를 먼저 주입한다",
            "앰플을 열 때는 앰플 목 부분을 알코올 솜으로 감싸고 몸 쪽으로 꺾어 연다",
            "주사기에 약물을 흡입한 후 주사바늘을 위로 향하게 하여 기포를 제거한다",
            "약물 용량이 정확한지 눈높이에서 주사기 눈금을 확인한다"
        ],
        correct: 1,
        category: "약물준비",
        explanation: "앰플을 열 때 앰플 목 부분을 알코올 솜으로 감싸고 몸 쪽이 아닌 '바깥쪽(몸 반대쪽)'으로 꺾어 열어야 합니다. 몸 쪽으로 꺾으면 유리 파편이 몸 쪽으로 튈 수 있어 위험합니다.",
        reference: "체크리스트 3번 항목 - 정확한 용량과 방법 모두 정확해야 2점(핵심 항목)"
    },
    {
        id: 4,
        checklistNumber: "7번",
        type: "올바른 것",
        question: "대상자 확인 시 개방형 질문을 사용해야 하는 이유로 가장 적절한 것은?",
        options: [
            "환자가 편안하게 느끼도록 하기 위해서",
            "의사소통 시간을 단축하기 위해서",
            "환자가 단순히 '네'라고 대답하는 오류를 방지하기 위해서",
            "간호사의 업무 부담을 줄이기 위해서"
        ],
        correct: 2,
        category: "환자안전",
        explanation: "개방형 질문('성함이 어떻게 되세요?')을 사용하는 이유는 환자가 직접 자신의 이름을 말하게 하여 환자 오인을 방지하기 위함입니다. 닫힌 질문('○○○님 맞으시죠?')은 환자가 잘 듣지 못하거나 의식이 명료하지 않은 상태에서 습관적으로 '네'라고 대답할 수 있어 위험합니다.",
        reference: "체크리스트 7번 항목 - 3항목 모두 정확히 수행해야 2점(핵심 항목)"
    },
    {
        id: 5,
        checklistNumber: "10번",
        type: "올바른 것",
        question: "둔부 배면 부위(복배근) 근육주사 시 주사부위 선정 방법으로 올바른 것은?",
        options: [
            "대전자와 후상장골극을 연결한 사선의 하내측 부위를 선정한다",
            "둔부를 4등분하여 하외측 부위를 선정한다",
            "대전자와 후상장골극을 연결한 사선의 상외측 부위를 선정한다",
            "미골에서 5cm 위쪽 정중선 부위를 선정한다"
        ],
        correct: 2,
        category: "주사부위선정",
        explanation: "둔부 배면 부위 주사 시 좌골신경 손상을 피하기 위해 대전자와 후상장골극을 연결한 사선의 '상외측' 부위, 또는 장골능에서 5cm 아래, 또는 둔부를 4등분한 '상외측' 부위를 선정해야 합니다. 하내측이나 하외측은 좌골신경이 지나가는 부위로 위험합니다.",
        reference: "체크리스트 10번 항목 - 정확히 선정하지 않으면 0점(핵심 항목)"
    },
    {
        id: 6,
        checklistNumber: "12번",
        type: "올바르지 않은 것",
        question: "주사부위 소독 및 주사 준비 과정에서 올바르지 않은 것은?",
        options: [
            "소독솜으로 주사부위를 안쪽에서 바깥쪽으로 직경 5~8cm 정도 둥글게 닦는다",
            "소독약이 마르기 전에 신속하게 주사를 놓아 감염을 예방한다",
            "투약카드를 보고 약물을 재확인한 후 주사바늘 뚜껑을 제거한다",
            "주사바늘 뚜껑은 한 손으로 주사기를 잡고 제거한다"
        ],
        correct: 1,
        category: "무균술",
        explanation: "소독약(알코올)이 완전히 마른 후에 주사를 놓아야 합니다. 소독약이 마르지 않은 상태에서 주사를 놓으면 알코올이 조직 내로 들어가 통증과 조직 손상을 유발할 수 있습니다. 알코올의 소독 효과도 증발하면서 발휘되므로 마를 때까지 기다려야 합니다.",
        reference: "체크리스트 12번 항목 - 3항목 모두 수행해야 2점"
    },
    {
        id: 7,
        checklistNumber: "13-14번",
        type: "올바른 것",
        question: "근육주사 시 흡인(aspiration) 과정에 대한 설명으로 올바른 것은?",
        options: [
            "흡인은 시간이 걸리므로 생략 가능하다",
            "주사기 내관을 뒤로 당겨 혈액이 나오면 그 자리에 그대로 약물을 주입한다",
            "주사기 내관을 뒤로 당겨 혈액이 나오지 않으면 천천히 약물을 주입한다",
            "흡인은 정맥주사에서만 필요하고 근육주사에서는 불필요하다"
        ],
        correct: 2,
        category: "주사기술",
        explanation: "근육주사 시 반드시 흡인을 시행하여 혈관 내 주입을 예방해야 합니다. 내관을 뒤로 당겨 혈액이 나오지 않으면 혈관에 바늘이 들어가지 않은 것이므로 안전하게 약물을 주입할 수 있습니다. 혈액이 보이면 즉시 주사기를 빼내고 처음부터 다시 준비해야 합니다.",
        reference: "체크리스트 13-14번 항목 - 정확히 수행하지 않으면 0점(핵심 항목)"
    },
    {
        id: 8,
        checklistNumber: "15번",
        type: "올바르지 않은 것",
        question: "약물 주입 완료 후 주사기 제거 과정에서 올바르지 않은 것은?",
        options: [
            "소독솜으로 주사부위를 가볍게 누르면서 주사기를 빼낸다",
            "주사바늘을 천천히 돌리면서 빼내어 조직 손상을 최소화한다",
            "주사바늘 삽입 때와 같은 각도(90°)로 재빨리 빼낸다",
            "주사기를 트레이에 놓고 소독솜을 댄 채로 주사부위를 마사지한다"
        ],
        correct: 1,
        category: "주사기술",
        explanation: "주사바늘을 제거할 때 돌리면서 빼내면 오히려 조직 손상이 증가하고 통증이 심해집니다. 삽입할 때와 같은 각도로 일직선으로 재빨리 빼내는 것이 올바른 방법입니다.",
        reference: "체크리스트 15번 항목 - 4항목 모두 수행해야 2점"
    },
    {
        id: 9,
        checklistNumber: "19번",
        type: "올바른 것",
        question: "사용한 주사기 및 주사바늘 처리에 대한 설명으로 올바른 것은?",
        options: [
            "주사바늘에 뚜껑을 다시 씌워(recapping) 안전하게 보관한 후 폐기한다",
            "주사바늘은 뚜껑을 씌우지 않고 손상성 폐기물 전용용기에 즉시 버린다",
            "주사바늘과 주사기는 분리하지 않고 일반 쓰레기통에 버린다",
            "주사바늘은 뚜껑을 씌워 일반 의료폐기물 용기에 버린다"
        ],
        correct: 1,
        category: "감염관리",
        explanation: "사용한 주사바늘은 절대 뚜껑을 다시 씌우지 않습니다(recapping 금지). 이는 바늘 찔림 사고의 주요 원인이 됩니다. 주사바늘은 즉시 손상성 폐기물 전용용기에 버리고, 소독솜과 주사기는 일반 의료폐기물 전용용기에 버립니다.",
        reference: "체크리스트 19번 항목 - 3항목 모두 수행해야 2점"
    },
    {
        id: 10,
        checklistNumber: "21번",
        type: "올바르지 않은 것",
        question: "근육주사 후 간호기록 작성 시 반드시 포함해야 하는 내용이 아닌 것은?",
        options: [
            "5 rights(대상자명, 약명, 용량, 투약경로, 투약시간)",
            "투약 목적",
            "대상자의 반응 또는 투약하지 못한 경우 그 이유",
            "사용한 주사바늘의 게이지(gauge) 번호"
        ],
        correct: 3,
        category: "기록관리",
        explanation: "근육주사 후 기록해야 하는 필수 사항은 ①5 rights ②투약 목적 ③대상자의 반응(투약을 못한 경우 그 이유)입니다. 주사바늘의 게이지 번호는 필수 기록 사항이 아닙니다.",
        reference: "체크리스트 21번 항목 - 3항목 모두 기록해야 2점"
    }
];

// DOM 요소 참조
const messagesContainer = document.getElementById('messages');
const currentQElement = document.getElementById('currentQ');
const correctCountElement = document.getElementById('correctCount');
const progressFill = document.getElementById('progressFill');

// 통계 업데이트
function updateStats() {
    currentQElement.textContent = currentQuestion;
    correctCountElement.textContent = correctCount;
    const progressPercentage = (currentQuestion / 10) * 100;
    progressFill.style.width = `${progressPercentage}%`;
}

// 메시지 추가
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 학습 시작
window.startLearning = function() {
    const idInput = document.getElementById('studentId');
    const nameInput = document.getElementById('studentName');
    
    studentId = idInput.value.trim();
    studentName = nameInput.value.trim();
    
    if (!studentId || !studentName) {
        alert('학번과 이름을 모두 입력해주세요.');
        return;
    }
    
    isLearning = true;
    currentQuestion = 1;
    correctCount = 0;
    userAnswers = [];
    startTime = new Date();
    
    // 기존 메시지 초기화
    messagesContainer.innerHTML = '';
    
    addMessage(`<strong>${studentName}(${studentId})님, 환영합니다!</strong><br><br>🚀 근육주사 사전학습을 시작합니다!<br><br>총 10문항의 고난도 문제가 체크리스트 순서대로 출제됩니다. 각 문항을 신중히 읽고 가장 적절한 답을 선택해주세요.<br><br>틀린 경우 즉시 상세한 피드백을 제공합니다.`);
    
    setTimeout(() => {
        showCurrentQuestion();
    }, 1500);
    
    updateStats();
}

// 현재 문제 표시
function showCurrentQuestion() {
    if (currentQuestion > 10) {
        showResults();
        return;
    }

    const question = questions[currentQuestion - 1];
    
    let questionHtml = `
        <div class="question-card">
            <div class="question-header">
                <div class="question-number">${question.id}</div>
                <div class="question-title">
                    ${question.type === "올바른 것" ? "✅ 올바른 것은?" : "❌ 올바르지 않은 것은?"}
                </div>
            </div>
            
            <div style="font-size: 12px; color: #6c757d; margin-bottom: 10px;">
                📋 체크리스트 ${question.checklistNumber} | 영역: ${question.category}
            </div>
            
            <div class="question-content">
                ${question.question}
            </div>
            
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option-button" onclick="selectOption(${index})">
                        ${index + 1}. ${option}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    addMessage(questionHtml);
}

// 옵션 선택
window.selectOption = function(optionIndex) {
    const question = questions[currentQuestion - 1];
    const isCorrect = optionIndex === question.correct;
    
    // 선택한 옵션 표시
    const options = document.querySelectorAll('.option-button');
    options.forEach((option, index) => {
        option.onclick = null; // 클릭 비활성화
        if (index === optionIndex) {
            option.classList.add('selected');
        }
    });
    
    // 답안 저장
    userAnswers.push({
        questionId: question.id,
        checklistNumber: question.checklistNumber,
        selectedOption: optionIndex,
        correctOption: question.correct,
        isCorrect: isCorrect,
        category: question.category,
        question: question
    });
    
    if (isCorrect) {
        correctCount++;
    }
    
    // 피드백 표시
    setTimeout(() => {
        let feedbackHtml = '';
        if (isCorrect) {
            feedbackHtml = `
                <div class="feedback-card feedback-correct">
                    <div class="feedback-title correct">
                        ✅ 정답입니다!
                    </div>
                    <div class="feedback-content">
                        <strong>💡 해설:</strong> ${question.explanation}<br><br>
                        <strong>📖 참고:</strong> ${question.reference}
                    </div>
                </div>
            `;
        } else {
            feedbackHtml = `
                <div class="feedback-card feedback-incorrect">
                    <div class="feedback-title incorrect">
                        ❌ 틀렸습니다
                    </div>
                    <div class="feedback-content">
                        <strong>정답:</strong> ${question.options[question.correct]}<br><br>
                        <strong>💡 해설:</strong> ${question.explanation}<br><br>
                        <strong>📖 참고:</strong> ${question.reference}
                    </div>
                </div>
            `;
        }
        
        addMessage(feedbackHtml, true);
        
        // 2초 후 다음 문제로
        setTimeout(() => {
            currentQuestion++;
            updateStats();
            showCurrentQuestion();
        }, 2000);
    }, 500);
}

// 결과 표시
function showResults() {
    endTime = new Date();
    const timeTaken = Math.round((endTime - startTime) / 1000); // 초 단위
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const percentage = Math.round((correctCount / 10) * 100);
    const isPassed = correctCount >= 7;
    
    // Firebase에 결과 저장
    saveResultToFirebase();
    
    let resultHtml = `
        <div class="result-card">
            <div class="result-header ${isPassed ? 'pass' : 'fail'}">
                <h2>${isPassed ? '🎉 합격' : '😔 불합격'}</h2>
                <div class="final-score">${correctCount}/10 정답</div>
                <div>정답률: ${percentage}%</div>
                <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">
                    소요시간: ${minutes}분 ${seconds}초
                </div>
                <div style="font-size: 14px; margin-top: 5px; opacity: 0.9;">
                    ${isPassed ? 
                        '축하합니다! 근육주사 실습 준비가 잘 되어 있네요!' : 
                        '조금 더 학습이 필요합니다. 틀린 문항을 복습해보세요!'
                    }
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                <h3 style="margin-bottom: 10px; color: #333;">📊 영역별 정답률</h3>
    `;

    // 카테고리별 분석
    const categoryStats = {};
    userAnswers.forEach(answer => {
        if (!categoryStats[answer.category]) {
            categoryStats[answer.category] = { correct: 0, total: 0 };
        }
        categoryStats[answer.category].total++;
        if (answer.isCorrect) {
            categoryStats[answer.category].correct++;
        }
    });

    Object.entries(categoryStats).forEach(([category, stats]) => {
        const categoryAccuracy = Math.round((stats.correct / stats.total) * 100);
        let statusIcon = '🟢';
        if (categoryAccuracy < 70) statusIcon = '🔴';
        else if (categoryAccuracy < 85) statusIcon = '🟡';
        
        resultHtml += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; margin: 6px 0; border-radius: 8px; font-size: 13px;">
                <span>${statusIcon} <strong>${category}</strong></span>
                <span style="color: #666;">${stats.correct}/${stats.total} (${categoryAccuracy}%)</span>
            </div>
        `;
    });

    resultHtml += '</div>';
    
    // 틀린 문제 복습
    const wrongAnswers = userAnswers.filter(a => !a.isCorrect);
    if (wrongAnswers.length > 0) {
        resultHtml += `
            <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 12px; padding: 15px; margin: 15px 0;">
                <div style="color: #856404; font-weight: 600; font-size: 15px; margin-bottom: 10px;">
                    🎓 복습이 필요한 문항 (${wrongAnswers.length}개)
                </div>
        `;
        
        wrongAnswers.forEach(answer => {
            resultHtml += `
                <div style="background: #f8d7da; border: 1px solid #dc3545; border-radius: 8px; padding: 12px; margin: 8px 0; font-size: 12px;">
                    <div style="font-weight: 600; color: #721c24; margin-bottom: 6px;">
                        ${answer.checklistNumber} | Q${answer.questionId}. ${answer.question.question}
                    </div>
                    <div style="margin: 4px 0;">
                        <span style="color: #dc3545;">❌ 선택: ${answer.question.options[answer.selectedOption]}</span><br>
                        <span style="color: #28a745;">✅ 정답: ${answer.question.options[answer.correctOption]}</span>
                    </div>
                    <div style="margin-top: 6px; font-size: 11px; color: #721c24;">
                        💡 ${answer.question.explanation}
                    </div>
                </div>
            `;
        });
        
        resultHtml += '</div>';
    } else {
        resultHtml += `
            <div style="background: #d4edda; border: 2px solid #28a745; border-radius: 12px; padding: 15px; margin: 15px 0; text-align: center;">
                <div style="color: #155724; font-weight: 600; font-size: 15px;">
                    🎉 완벽합니다! 모든 문제를 맞히셨습니다!
                </div>
            </div>
        `;
    }
    
    resultHtml += `
        <div style="margin-top: 15px;">
            <button class="action-button" onclick="downloadExcel()">
                📥 결과 엑셀로 다운로드
            </button>
            <button class="action-button secondary" onclick="restartLearning()">
                🔄 다시 학습하기
            </button>
        </div>
    </div>`;
    
    addMessage(resultHtml);
}

// Firebase에 결과 저장
function saveResultToFirebase() {
    try {
        const resultRef = ref(database, 'prestudy_results');
        const newResultRef = push(resultRef);
        
        const resultData = {
            studentId: studentId,
            studentName: studentName,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            timeTaken: Math.round((endTime - startTime) / 1000),
            correctCount: correctCount,
            totalQuestions: 10,
            percentage: Math.round((correctCount / 10) * 100),
            isPassed: correctCount >= 7,
            answers: userAnswers.map(a => ({
                questionId: a.questionId,
                checklistNumber: a.checklistNumber,
                category: a.category,
                isCorrect: a.isCorrect,
                selectedOption: a.selectedOption,
                correctOption: a.correctOption
            }))
        };
        
        set(newResultRef, resultData);
        console.log('결과가 Firebase에 저장되었습니다.');
    } catch (error) {
        console.error('Firebase 저장 오류:', error);
    }
}

// 엑셀 다운로드
window.downloadExcel = function() {
    // 기본 정보
    const data = [
        ['근육주사 사전학습 결과'],
        ['학번', studentId],
        ['이름', studentName],
        ['평가일시', startTime.toLocaleString('ko-KR')],
        ['소요시간', `${Math.floor((endTime - startTime) / 60000)}분 ${Math.floor(((endTime - startTime) % 60000) / 1000)}초`],
        ['총 문항수', '10'],
        ['정답수', correctCount],
        ['정답률', `${Math.round((correctCount / 10) * 100)}%`],
        ['합격여부', correctCount >= 7 ? 'PASS' : 'FAIL'],
        [],
        ['문항별 결과'],
        ['번호', '체크리스트', '영역', '문제유형', '정답여부', '선택답안', '정답']
    ];

    // 문항별 결과
    userAnswers.forEach(answer => {
        data.push([
            answer.questionId,
            answer.checklistNumber,
            answer.category,
            answer.question.type,
            answer.isCorrect ? 'O' : 'X',
            answer.question.options[answer.selectedOption],
            answer.question.options[answer.correctOption]
        ]);
    });

    // 영역별 통계
    data.push([]);
    data.push(['영역별 정답률']);
    data.push(['영역', '정답수', '총문항수', '정답률']);

    const categoryStats = {};
    userAnswers.forEach(answer => {
        if (!categoryStats[answer.category]) {
            categoryStats[answer.category] = { correct: 0, total: 0 };
        }
        categoryStats[answer.category].total++;
        if (answer.isCorrect) {
            categoryStats[answer.category].correct++;
        }
    });

    Object.entries(categoryStats).forEach(([category, stats]) => {
        data.push([
            category,
            stats.correct,
            stats.total,
            `${Math.round((stats.correct / stats.total) * 100)}%`
        ]);
    });

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // 열 너비 설정
    ws['!cols'] = [
        {wch: 8},
        {wch: 15},
        {wch: 15},
        {wch: 15},
        {wch: 10},
        {wch: 50},
        {wch: 50}
    ];

    XLSX.utils.book_append_sheet(wb, ws, '평가결과');

    // 파일명 생성
    const fileName = `근육주사_${studentId}_${studentName}_${startTime.toISOString().slice(0,10)}.xlsx`;

    // 다운로드
    XLSX.writeFile(wb, fileName);

    alert('엑셀 파일이 다운로드되었습니다!');
}

// 다시 시작
window.restartLearning = function() {
    location.reload();
}

