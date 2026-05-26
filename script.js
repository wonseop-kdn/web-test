/* ===== KDN 바이브코딩 아카데미 - Main Script ===== */

/* JS가 실행되면 애니메이션 모드 활성화 (no-JS 폴백 보호) */
document.documentElement.classList.add('anim-ready');

/* ===== Scroll & UI Utilities ===== */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.classList.toggle('visible', window.scrollY > 400);
});

/* ===== Mobile Nav ===== */
function openMobileNav() {
  document.getElementById('mobileNav')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  document.getElementById('mobileNav')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== Intersection Observer – Fade In ===== */
function initFadeIn() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (!fadeEls.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.05 });
    fadeEls.forEach(el => io.observe(el));
  } else {
    // IO 미지원 환경 폴백: 전부 즉시 표시
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // 300ms 후에도 viewport 내 요소가 hidden이면 강제 표시
  setTimeout(() => {
    fadeEls.forEach(el => {
      if (!el.classList.contains('visible')) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 50) el.classList.add('visible');
      }
    });
  }, 300);
}
initFadeIn();

/* ===== Counter Animation (Hero Stats) ===== */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 20);
}

const statNums = document.querySelectorAll('[data-target]');
if (statNums.length) {
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, parseInt(e.target.dataset.target));
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObs.observe(el));
}

/* ===== Homepage Course Filter ===== */
function filterCourses(category, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cards = document.querySelectorAll('#courses-grid .course-card');
  cards.forEach(card => {
    const show = category === 'all' || card.dataset.category === category;
    card.style.display = show ? '' : 'none';
  });
}

/* ===== Courses Page Data ===== */
const COURSES = [
  { id: 1, emoji: '🤖', color: 'blue', category: 'AI 도구', level: '입문', title: 'Claude로 시작하는 바이브코딩 완전정복', desc: 'Claude AI를 활용해 코딩 없이도 앱을 만드는 바이브코딩의 핵심 개념과 실전 기술을 학습합니다.', hours: 12, lessons: 24, students: 342, price: 0, new: true },
  { id: 2, emoji: '✨', color: 'purple', category: 'AI 도구', level: '초급', title: 'GitHub Copilot 실전 마스터 클래스', desc: 'VS Code에서 Copilot을 최대한 활용하는 프롬프트 엔지니어링과 페어 프로그래밍 기법을 배웁니다.', hours: 8, lessons: 16, students: 218, price: 49000 },
  { id: 3, emoji: '🌐', color: 'green', category: '웹 개발', level: '초급', title: 'AI로 만드는 반응형 웹사이트 (HTML/CSS/JS)', desc: 'AI의 도움을 받아 현대적인 웹사이트를 처음부터 완성하는 실전 프로젝트 중심 강좌입니다.', hours: 20, lessons: 38, students: 487, price: 69000 },
  { id: 4, emoji: '📊', color: 'orange', category: '데이터 분석', level: '중급', title: 'Python 데이터 분석을 AI와 함께 10배 빠르게', desc: 'Pandas, NumPy 분석 코드를 AI로 자동 생성하고, 데이터 인사이트를 시각화하는 기술을 익힙니다.', hours: 16, lessons: 32, students: 156, price: 79000 },
  { id: 5, emoji: '⚙️', color: 'teal', category: '자동화', level: '중급', title: 'AI 에이전트로 업무 자동화 시스템 구축', desc: '반복 업무를 자동화하는 AI 에이전트를 설계하고, Claude API와 Python으로 실전 도구를 만듭니다.', hours: 18, lessons: 36, students: 203, price: 89000 },
  { id: 6, emoji: '🚀', color: 'red', category: 'AI 도구', level: '고급', title: 'Cursor IDE로 풀스택 앱 개발 (고급편)', desc: 'Cursor의 AI 기능을 극한까지 활용해 React + FastAPI 풀스택 서비스를 처음부터 배포까지 완성합니다.', hours: 24, lessons: 48, students: 98, price: 119000 },
  { id: 7, emoji: '🐍', color: 'green', category: 'AI 도구', level: '초급', title: 'Python 기초 + AI 코딩 첫걸음', desc: '파이썬 문법을 AI의 도움으로 빠르게 익히고, 간단한 자동화 스크립트를 만들어 봅니다.', hours: 10, lessons: 20, students: 512, price: 0 },
  { id: 8, emoji: '🎨', color: 'purple', category: '웹 개발', level: '초급', title: 'AI로 만드는 나만의 포트폴리오 사이트', desc: 'GitHub Pages + AI 도구로 개발자 포트폴리오를 빠르게 제작하고 배포합니다.', hours: 6, lessons: 12, students: 389, price: 39000 },
  { id: 9, emoji: '🛠️', color: 'teal', category: '백엔드', level: '중급', title: 'FastAPI + Claude API로 AI 서비스 개발', desc: 'Python FastAPI 백엔드에 Claude API를 연동해 지능형 REST API 서비스를 구축합니다.', hours: 14, lessons: 28, students: 134, price: 89000 },
  { id: 10, emoji: '🤝', color: 'blue', category: '자동화', level: '초급', title: 'n8n + AI로 노코드 업무 자동화', desc: 'n8n 자동화 툴과 AI를 결합해 코딩 없이 업무 워크플로우를 자동화하는 방법을 배웁니다.', hours: 8, lessons: 16, students: 276, price: 49000 },
  { id: 11, emoji: '📈', color: 'orange', category: '데이터 분석', level: '고급', title: '머신러닝 + AI 코딩으로 데이터 모델 구축', desc: 'Scikit-learn과 AI 코딩 어시스턴트로 예측 모델을 빠르게 개발하고 배포합니다.', hours: 22, lessons: 44, students: 87, price: 99000 },
  { id: 12, emoji: '🌩️', color: 'blue', category: '백엔드', level: '고급', title: 'AI 에이전트 배포 & 운영 (AWS/GCP)', desc: '개발한 AI 에이전트를 클라우드에 배포하고 모니터링하는 DevOps 기술을 학습합니다.', hours: 16, lessons: 32, students: 62, price: 109000 },
];

function renderCourseCard(c) {
  return `
    <div class="course-card-h" data-category="${c.category}" data-level="${c.level}" data-price="${c.price}" data-students="${c.students}" data-new="${c.new || false}">
      <div class="course-thumb ${c.color}" style="width:120px; min-height:120px; height:auto; flex-shrink:0; border-radius:0; font-size:36px; display:flex; align-items:center; justify-content:center; position:relative;">
        ${c.emoji}
        <span class="course-level-badge" style="font-size:10px;">${c.level}</span>
      </div>
      <div class="course-body" style="padding:16px; flex:1; display:flex; flex-direction:column;">
        <div class="course-category">${c.category}${c.new ? ' &nbsp;<span style="background:#10B981;color:white;padding:1px 7px;border-radius:50px;font-size:10px;">NEW</span>' : ''}</div>
        <h3 class="course-title" style="font-size:15px; font-weight:700; color:var(--text-dark); margin-bottom:6px; line-height:1.4;">${c.title}</h3>
        <p class="course-desc" style="font-size:12px; color:var(--text-mid); line-height:1.7; margin-bottom:10px; flex:1;">${c.desc}</p>
        <div class="course-meta" style="font-size:11px; color:var(--text-light); display:flex; gap:12px; margin-bottom:12px;">
          <span>⏱️ ${c.hours}시간</span>
          <span>📖 ${c.lessons}강</span>
          <span>👥 ${c.students.toLocaleString()}명</span>
        </div>
        <div class="course-footer" style="display:flex; align-items:center; justify-content:space-between; padding-top:12px; border-top:1px solid var(--border);">
          <span class="course-price" style="font-size:15px; font-weight:700; color:${c.price === 0 ? '#10B981' : 'var(--kdn-blue)'};">${c.price === 0 ? '무료' : '₩' + c.price.toLocaleString()}</span>
          <button class="btn-course" onclick="alert('수강신청 기능은 로그인 후 이용 가능합니다.')" style="padding:7px 16px; background:var(--kdn-blue); color:white; border-radius:8px; font-size:12px; font-weight:500; cursor:pointer; border:none; font-family:inherit; transition:all 0.2s;">수강신청</button>
        </div>
      </div>
    </div>
  `;
}

function applyFilters() {
  const list = document.getElementById('courses-list');
  if (!list) return;

  const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase();
  const catRadio = document.querySelector('input[name="category"]:checked');
  const cat = catRadio ? catRadio.value : 'all';
  const levels = [...document.querySelectorAll('input[type="checkbox"][value="입문"], input[type="checkbox"][value="초급"], input[type="checkbox"][value="중급"], input[type="checkbox"][value="고급"]')]
    .filter(el => el.checked).map(el => el.value);
  const filterFree = document.getElementById('filter-free')?.checked;
  const filterPaid = document.getElementById('filter-paid')?.checked;
  const sortVal = document.getElementById('sort-select')?.value || 'popular';

  let filtered = COURSES.filter(c => {
    if (searchVal && !c.title.toLowerCase().includes(searchVal) && !c.desc.toLowerCase().includes(searchVal)) return false;
    if (cat !== 'all' && c.category !== cat) return false;
    if (levels.length && !levels.includes(c.level)) return false;
    if (filterFree && !filterPaid && c.price !== 0) return false;
    if (filterPaid && !filterFree && c.price === 0) return false;
    return true;
  });

  if (sortVal === 'popular') filtered.sort((a, b) => b.students - a.students);
  else if (sortVal === 'new') filtered.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
  else if (sortVal === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (sortVal === 'price-high') filtered.sort((a, b) => b.price - a.price);

  const count = document.getElementById('courses-count');
  if (count) count.innerHTML = `총 <strong>${filtered.length}</strong>개 강좌`;

  const noResults = document.getElementById('no-results');
  if (filtered.length === 0) {
    list.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
  } else {
    list.innerHTML = filtered.map(renderCourseCard).join('');
    if (noResults) noResults.style.display = 'none';
  }
}

function resetFilters() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('input[name="category"]').forEach(el => { el.checked = el.value === 'all'; });
  document.querySelectorAll('input[type="checkbox"]').forEach(el => { el.checked = false; });
  const sortSel = document.getElementById('sort-select');
  if (sortSel) sortSel.value = 'popular';
  applyFilters();
}

if (document.getElementById('courses-list')) {
  applyFilters();
}

/* ===== Playground Challenges ===== */
const CHALLENGES = [
  { id: 1, num: '#001', name: 'Hello, 바이브코딩!', tags: ['easy'], status: '✅', lang: 'python', code: `# 🌟 첫 번째 챌린지: Hello World\n# AI 힌트: print() 함수를 사용해보세요!\n\n# 아래에 코드를 작성하세요\nprint("Hello, 바이브코딩!")\nprint("AI와 함께라면 코딩이 즐거워요 🤖")`, problem: { title: '#001 · Hello, 바이브코딩!', level: 'easy', desc: '가장 기본적인 출력 프로그램을 작성해보세요.', input: '없음', output: '두 줄의 메시지 출력', hint: 'print() 함수에 문자열을 넣으면 화면에 출력할 수 있어요!' } },
  { id: 2, num: '#002', name: '피보나치 수열', tags: ['easy', 'python'], status: '✅', lang: 'python', code: `# 🎯 챌린지: 피보나치 수열\n# n번째 피보나치 수를 반환하는 함수를 작성하세요.\n\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# 테스트\nfor i in range(10):\n    print(f"fibonacci({i}) = {fibonacci(i)}")`, problem: { title: '#002 · 피보나치 수열', level: 'easy', desc: 'n번째 피보나치 수를 반환하는 함수를 작성하세요.\n\nfibonacci(0) = 0\nfibonacci(1) = 1\nfibonacci(n) = fibonacci(n-1) + fibonacci(n-2)', input: '정수 n (0 ≤ n ≤ 30)', output: 'n번째 피보나치 수', hint: '재귀 함수로 구현할 수 있어요. 성능이 걱정된다면 @lru_cache 데코레이터를 사용해보세요!' } },
  { id: 3, num: '#003', name: '버블 정렬 구현', tags: ['med', 'python'], status: '⭕', lang: 'python', code: `# 🎯 챌린지: 버블 정렬\n# 리스트를 버블 정렬 알고리즘으로 정렬하세요.\n\ndef bubble_sort(arr):\n    n = len(arr)\n    # 여기에 코드를 작성하세요\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\n# 테스트\ntest = [64, 34, 25, 12, 22, 11, 90]\nprint("정렬 전:", test)\nresult = bubble_sort(test.copy())\nprint("정렬 후:", result)`, problem: { title: '#003 · 버블 정렬 구현', level: 'med', desc: '버블 정렬 알고리즘을 구현하고 리스트를 오름차순으로 정렬하세요.\n\n인접한 두 원소를 비교해 순서가 틀리면 위치를 교환하는 방식으로 동작합니다.', input: '정수 리스트', output: '오름차순으로 정렬된 리스트', hint: '이중 반복문을 사용합니다. 외부 루프는 n번, 내부 루프는 정렬되지 않은 부분을 순회해요!' } },
  { id: 4, num: '#004', name: 'Claude API 호출', tags: ['med', 'ai'], status: '⭕', lang: 'python', code: `# 🤖 챌린지: Claude API 활용\n# Claude API를 사용해 텍스트를 요약하는 함수를 만드세요.\n\nimport anthropic\n\ndef summarize_text(text: str) -> str:\n    """\n    주어진 텍스트를 Claude API로 요약합니다.\n    \"\"\"\n    client = anthropic.Anthropic()\n    \n    message = client.messages.create(\n        model="claude-opus-4-7",\n        max_tokens=1024,\n        messages=[\n            {\n                "role": "user",\n                "content": f"다음 텍스트를 3줄로 요약해주세요:\\n\\n{text}"\n            }\n        ]\n    )\n    \n    return message.content[0].text\n\n# 테스트\nsample = """\n바이브코딩은 AI 도구를 활용하여 개발자가 \n자연어로 의도를 표현하면 AI가 코드를 생성하는\n새로운 개발 패러다임입니다.\n"""\n\nresult = summarize_text(sample)\nprint("요약 결과:", result)`, problem: { title: '#004 · Claude API 호출', level: 'med', desc: 'Claude API를 사용해 텍스트를 요약하는 함수를 작성하세요.\n\n실제 API 키가 없어도 코드 구조를 이해하는 것이 목표입니다.', input: '긴 텍스트 문자열', output: 'Claude가 생성한 3줄 요약', hint: 'anthropic.Anthropic() 클라이언트를 생성하고, messages.create()를 호출하세요!' } },
  { id: 5, num: '#005', name: '웹 스크래핑 봇', tags: ['hard', 'python'], status: '⭕', lang: 'python', code: `# 🕷️ 챌린지: 웹 스크래핑\n# requests + BeautifulSoup으로 웹 데이터를 수집하세요.\n\nimport requests\nfrom bs4 import BeautifulSoup\n\ndef scrape_titles(url: str) -> list:\n    """\n    주어진 URL에서 h2 태그 텍스트를 수집합니다.\n    \"\"\"\n    headers = {'User-Agent': 'Mozilla/5.0'}\n    response = requests.get(url, headers=headers, timeout=10)\n    response.raise_for_status()\n    \n    soup = BeautifulSoup(response.text, 'html.parser')\n    titles = [h.get_text(strip=True) for h in soup.find_all('h2')]\n    return titles\n\n# 테스트 (실제 실행 시 네트워크 필요)\ntry:\n    titles = scrape_titles("https://example.com")\n    for i, title in enumerate(titles[:5], 1):\n        print(f"{i}. {title}")\nexcept Exception as e:\n    print(f"에러: {e}")\n    print("실제 URL과 네트워크 연결이 필요합니다.")`, problem: { title: '#005 · 웹 스크래핑 봇', level: 'hard', desc: 'requests와 BeautifulSoup을 사용해 웹 페이지에서 데이터를 수집하는 함수를 작성하세요.', input: '웹 페이지 URL', output: '수집된 h2 태그 텍스트 리스트', hint: 'requests.get()으로 HTML을 받아오고, BeautifulSoup으로 파싱 후 find_all()로 요소를 추출하세요!' } },
  { id: 6, num: '#006', name: 'JS 비동기 처리', tags: ['med'], status: '⭕', lang: 'javascript', code: `// 🌐 챌린지: Promise와 async/await\n// 비동기 함수를 작성하고 데이터를 처리하세요.\n\nasync function fetchUserData(userId) {\n  // 실제 API 호출 시뮬레이션\n  return new Promise((resolve) => {\n    setTimeout(() => {\n      resolve({\n        id: userId,\n        name: '김바이브',\n        course: 'AI 코딩 마스터',\n        progress: 75\n      });\n    }, 500);\n  });\n}\n\nasync function displayProgress(userId) {\n  try {\n    console.log('데이터 로딩 중...');\n    const user = await fetchUserData(userId);\n    console.log(\`사용자: \${user.name}\`);\n    console.log(\`수강 강좌: \${user.course}\`);\n    console.log(\`진행률: \${user.progress}%\`);\n    return user;\n  } catch (error) {\n    console.error('오류:', error.message);\n  }\n}\n\n// 실행\ndisplayProgress(1);`, problem: { title: '#006 · JS 비동기 처리', level: 'med', desc: 'JavaScript의 Promise와 async/await를 사용해 비동기 데이터를 처리하는 함수를 작성하세요.', input: '사용자 ID (정수)', output: '사용자 정보 콘솔 출력', hint: 'async 함수 안에서 await를 사용하면 Promise가 완료될 때까지 기다릴 수 있어요!' } },
  { id: 7, num: '#007', name: 'AI 자동화 파이프라인', tags: ['hard', 'ai'], status: '⭕', lang: 'python', code: `# 🤖 챌린지: AI 처리 파이프라인\n# 여러 단계로 구성된 AI 자동화 파이프라인을 구현하세요.\n\nimport anthropic\nfrom typing import List, Dict\n\nclient = anthropic.Anthropic()\n\ndef step1_extract_keywords(text: str) -> List[str]:\n    """텍스트에서 핵심 키워드 추출"""\n    response = client.messages.create(\n        model="claude-opus-4-7",\n        max_tokens=256,\n        messages=[{\n            "role": "user",\n            "content": f"다음 텍스트에서 핵심 키워드 5개를 콤마로 구분해 추출해줘:\\n{text}"\n        }]\n    )\n    keywords = response.content[0].text.split(',')\n    return [kw.strip() for kw in keywords]\n\ndef step2_generate_summary(text: str, keywords: List[str]) -> str:\n    """키워드 기반 요약 생성"""\n    kw_str = ', '.join(keywords)\n    response = client.messages.create(\n        model="claude-opus-4-7",\n        max_tokens=512,\n        messages=[{\n            "role": "user",\n            "content": f"키워드 [{kw_str}]를 중심으로 다음 텍스트를 요약해줘:\\n{text}"\n        }]\n    )\n    return response.content[0].text\n\ndef pipeline(text: str) -> Dict:\n    """전체 파이프라인 실행"""\n    print("1단계: 키워드 추출...")\n    keywords = step1_extract_keywords(text)\n    print(f"   추출된 키워드: {keywords}")\n    \n    print("2단계: 요약 생성...")\n    summary = step2_generate_summary(text, keywords)\n    \n    return {"keywords": keywords, "summary": summary}\n\n# 실행\nresult = pipeline("바이브코딩 예시 텍스트를 여기에 입력하세요.")\nprint(result)`, problem: { title: '#007 · AI 자동화 파이프라인', level: 'hard', desc: 'Claude API를 사용해 여러 단계로 구성된 AI 처리 파이프라인을 구현하세요.\n\n1단계: 텍스트에서 키워드 추출\n2단계: 키워드 기반 요약 생성', input: '긴 텍스트', output: '키워드와 요약이 담긴 딕셔너리', hint: '각 단계를 별도의 함수로 분리하고, 이전 단계의 출력을 다음 단계의 입력으로 사용하세요!' } },
];

let currentChallenge = CHALLENGES[0];
let currentLang = 'python';
let currentSideTab = 'all';

function renderChallengeList(challenges) {
  const list = document.getElementById('challenge-list');
  if (!list) return;
  list.innerHTML = challenges.map(c => `
    <div class="pg-challenge-item ${c.id === currentChallenge.id ? 'active' : ''}" onclick="selectChallenge(${c.id})">
      <div class="pg-ch-header">
        <span class="pg-ch-num">${c.num}</span>
        <span class="pg-ch-status">${c.status}</span>
      </div>
      <div class="pg-ch-name">${c.name}</div>
      <div class="pg-ch-tags">
        ${c.tags.map(t => `<span class="pg-ch-tag tag-${t}">${t === 'easy' ? '입문' : t === 'med' ? '중급' : t === 'hard' ? '고급' : 'AI'}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function selectChallenge(id) {
  const ch = CHALLENGES.find(c => c.id === id);
  if (!ch) return;
  currentChallenge = ch;
  currentLang = ch.lang || 'python';

  const editor = document.getElementById('code-editor');
  if (editor) editor.value = ch.code;

  renderProblem(ch);
  renderChallengeList(getFilteredChallenges());
  clearConsole();

  document.querySelectorAll('.pg-lang-tab').forEach((tab, i) => {
    tab.classList.toggle('active', (i === 0 && currentLang === 'python') || (i === 1 && currentLang === 'javascript'));
  });
  const langStatus = document.getElementById('lang-status');
  if (langStatus) langStatus.textContent = currentLang === 'python' ? '🐍 Python 3.11' : '🌐 JavaScript (Node)';
}

function renderProblem(ch) {
  const pane = document.getElementById('problem-content');
  if (!pane) return;
  const p = ch.problem;
  const levelMap = { easy: '입문', med: '중급', hard: '고급', ai: 'AI' };
  const levelColor = { easy: '#10B981', med: '#F59E0B', hard: '#EF4444', ai: '#8B5CF6' };
  pane.innerHTML = `
    <div class="problem-title">${p.title}</div>
    <div class="problem-meta">
      ${ch.tags.map(t => `<span class="pg-ch-tag tag-${t}" style="font-size:11px;">${levelMap[t] || t}</span>`).join('')}
    </div>
    <div class="problem-body">
      <p>${p.desc.replace(/\n/g, '<br/>')}</p>
      <h4>📥 입력</h4>
      <p>${p.input}</p>
      <h4>📤 출력</h4>
      <p>${p.output}</p>
      ${p.hint ? `<div class="hint-box"><strong>💡 AI 힌트</strong><br>${p.hint}</div>` : ''}
    </div>
  `;
}

function getFilteredChallenges() {
  const search = document.getElementById('ch-search')?.value.toLowerCase() || '';
  return CHALLENGES.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search);
    const matchTab = currentSideTab === 'all' ||
      (currentSideTab === 'python' && c.lang === 'python') ||
      (currentSideTab === 'js' && c.lang === 'javascript') ||
      (currentSideTab === 'ai' && c.tags.includes('ai'));
    return matchSearch && matchTab;
  });
}

function filterChallenges() {
  renderChallengeList(getFilteredChallenges());
}

function switchSideTab(el, tab) {
  document.querySelectorAll('.pg-sidebar-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentSideTab = tab;
  renderChallengeList(getFilteredChallenges());
}

function switchLang(lang, el) {
  document.querySelectorAll('.pg-lang-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentLang = lang;
  const langStatus = document.getElementById('lang-status');
  if (langStatus) langStatus.textContent = lang === 'python' ? '🐍 Python 3.11' : '🌐 JavaScript (Node)';
}

/* ===== Panel Tabs ===== */
function switchPanelTab(el, tab) {
  document.querySelectorAll('.pg-panel-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const pane = document.getElementById(`pane-${tab}`);
  if (pane) pane.classList.add('active');
}

/* ===== Code Execution (Simulated) ===== */
function clearConsole() {
  const out = document.getElementById('console-output');
  if (out) out.innerHTML = '<div class="console-empty">▶ 실행 버튼을 눌러 코드를 실행하세요.</div>';
}

function appendConsole(text, type = 'out') {
  const out = document.getElementById('console-output');
  if (!out) return;
  out.querySelector('.console-empty')?.remove();
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  line.textContent = text;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

function runCode() {
  const code = document.getElementById('code-editor')?.value || '';
  const statusEl = document.getElementById('run-status');
  if (statusEl) statusEl.textContent = '실행 중...';

  // Switch to console tab
  document.querySelectorAll('.pg-panel-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('[onclick*="console"]')?.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('pane-console')?.classList.add('active');

  clearConsole();

  setTimeout(() => {
    appendConsole(`$ run ${currentLang === 'python' ? 'main.py' : 'main.js'}`, 'sys');

    // Simulate output based on challenge
    const simulatedOutputs = {
      1: ['Hello, 바이브코딩!', 'AI와 함께라면 코딩이 즐거워요 🤖'],
      2: ['fibonacci(0) = 0', 'fibonacci(1) = 1', 'fibonacci(2) = 1', 'fibonacci(3) = 2', 'fibonacci(4) = 3', 'fibonacci(5) = 5', 'fibonacci(6) = 8', 'fibonacci(7) = 13', 'fibonacci(8) = 21', 'fibonacci(9) = 34'],
      3: ['정렬 전: [64, 34, 25, 12, 22, 11, 90]', '정렬 후: [11, 12, 22, 25, 34, 64, 90]'],
      4: ['[시뮬레이션] Claude API 호출 중...', '요약 결과: 바이브코딩은 AI를 활용한 새로운 개발 방식입니다.'],
      5: ['에러: Connection refused', '실제 URL과 네트워크 연결이 필요합니다.'],
      6: ['데이터 로딩 중...', '사용자: 김바이브', '수강 강좌: AI 코딩 마스터', '진행률: 75%'],
      7: ['1단계: 키워드 추출...', '   추출된 키워드: [바이브코딩, AI, 자동화, 파이프라인, API]', '2단계: 요약 생성...'],
    };

    const outputs = simulatedOutputs[currentChallenge.id] || ['코드가 실행되었습니다.'];
    outputs.forEach((line, i) => {
      setTimeout(() => {
        const type = line.startsWith('에러:') ? 'err' : line.startsWith('[시뮬레이션]') ? 'warn' : 'out';
        appendConsole(line, type);
      }, i * 100);
    });

    setTimeout(() => {
      appendConsole('', 'sys');
      appendConsole('✅ 실행 완료 (0.' + Math.floor(Math.random() * 90 + 10) + 's)', 'info');
      if (statusEl) statusEl.textContent = '✅ 실행 완료';
    }, outputs.length * 100 + 200);
  }, 300);
}

function resetCode() {
  const editor = document.getElementById('code-editor');
  if (editor && currentChallenge) {
    editor.value = currentChallenge.code;
    clearConsole();
  }
}

function submitCode() {
  const code = document.getElementById('code-editor')?.value || '';
  if (!code.trim()) {
    alert('코드를 먼저 작성해주세요!');
    return;
  }

  // Simulate submission
  const passed = Math.random() > 0.3;
  if (passed) {
    appendConsole('', 'sys');
    appendConsole('🎉 제출 성공! 테스트 케이스 5/5 통과', 'info');
    appendConsole('🏆 배지 획득: "' + currentChallenge.name + '" 완료!', 'warn');
    setTimeout(() => alert('🎉 정답입니다! 배지를 획득했습니다.'), 100);
  } else {
    appendConsole('', 'sys');
    appendConsole('❌ 일부 테스트 케이스 실패 (3/5 통과)', 'err');
    appendConsole('💡 AI 튜터 탭에서 힌트를 받아보세요!', 'warn');
  }
}

/* ===== AI Chat ===== */
const AI_RESPONSES = [
  '좋은 질문이에요! 이 문제는 재귀 함수를 사용하면 깔끔하게 풀 수 있어요. `if n <= 1: return n` 으로 기저 조건을 설정하고, 나머지는 `return f(n-1) + f(n-2)` 로 표현할 수 있습니다.',
  '코드를 보니 거의 다 왔어요! 🎯 한 가지 팁: 성능을 위해 `@lru_cache(maxsize=None)` 데코레이터를 함수 위에 추가해보세요. 중복 계산이 없어져서 훨씬 빠릅니다.',
  '바이브코딩의 핵심은 AI와 협업하는 것이에요! 복잡한 로직은 AI에게 설명하고, 생성된 코드를 이해하고 수정하는 과정에서 실력이 늘어납니다. 🤖',
  '이 오류는 `IndexError`인 것 같아요. 리스트 인덱스가 범위를 벗어났는지 확인해보세요. `if i < len(arr):` 조건을 추가해보시겠어요?',
  '정말 잘 하고 있어요! 코드 구조가 깔끔합니다. 변수명을 좀 더 명확하게 (예: `i` → `index`) 바꾸면 가독성이 높아질 것 같아요. 🌟',
];

let aiMsgCount = 0;

function sendAIMessage() {
  const input = document.getElementById('ai-input');
  const text = input?.value.trim();
  if (!text) return;

  appendAIMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    const response = AI_RESPONSES[aiMsgCount % AI_RESPONSES.length];
    appendAIMessage(response, 'bot');
    aiMsgCount++;
  }, 800);
}

function sendQuickPrompt(btn) {
  const text = btn.textContent.replace(/^[^\s]+\s/, '').trim();
  appendAIMessage(btn.textContent, 'user');

  setTimeout(() => {
    const response = AI_RESPONSES[aiMsgCount % AI_RESPONSES.length];
    appendAIMessage(response, 'bot');
    aiMsgCount++;
    switchPanelTab(document.querySelector('[onclick*="ai"]'), 'ai');
  }, 600);
}

function appendAIMessage(text, role) {
  const wrap = document.getElementById('ai-messages');
  if (!wrap) return;
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  div.innerHTML = `<div class="ai-msg-label">${role === 'bot' ? '🤖 AI 튜터' : '👤 나'}</div>${text}`;
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;

  // Switch to AI tab
  document.querySelectorAll('.pg-panel-tab').forEach(t => t.classList.remove('active'));
  const aiTab = [...document.querySelectorAll('.pg-panel-tab')].find(t => t.getAttribute('onclick')?.includes('ai'));
  if (aiTab) aiTab.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('pane-ai')?.classList.add('active');
}

function askAI(prompt) {
  appendAIMessage(prompt, 'user');
  setTimeout(() => {
    const response = AI_RESPONSES[aiMsgCount % AI_RESPONSES.length];
    appendAIMessage(response, 'bot');
    aiMsgCount++;
  }, 600);
}

function handleAIInput(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAIMessage();
  }
}

/* ===== Editor Utilities ===== */
function handleTab(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    el.value = el.value.substring(0, start) + '    ' + el.value.substring(end);
    el.selectionStart = el.selectionEnd = start + 4;
  }
}

/* Track cursor position */
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('code-editor');
  if (editor) {
    editor.addEventListener('keyup', updateCursorPos);
    editor.addEventListener('click', updateCursorPos);
    updateCursorPos({ target: editor });
  }
});

function updateCursorPos(e) {
  const el = e?.target || document.getElementById('code-editor');
  if (!el) return;
  const text = el.value.substring(0, el.selectionStart);
  const lines = text.split('\n');
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;
  const pos = document.getElementById('cursor-pos');
  if (pos) pos.textContent = `줄 ${line}, 열 ${col}`;
}

/* ===== Init Playground ===== */
if (document.getElementById('challenge-list')) {
  renderChallengeList(CHALLENGES);
  selectChallenge(1);
}
