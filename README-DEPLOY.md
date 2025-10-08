# Prestudy_IM - Netlify 배포 가이드 🚀

이 문서는 Prestudy_IM 프로젝트를 Netlify에 배포하는 방법을 안내합니다.

## 📋 사전 준비

1. **Netlify 계정 생성**
   - [Netlify](https://www.netlify.com/) 접속
   - GitHub, GitLab, Bitbucket 또는 이메일로 회원가입

2. **Git 저장소 (선택사항)**
   - GitHub, GitLab, Bitbucket에 프로젝트 업로드
   - 또는 Netlify Drop으로 직접 배포 가능

## 🚀 배포 방법

### 방법 1: Netlify Drop (가장 간단)

1. **파일 준비**
   ```
   Prestudy_IM 폴더 전체를 압축 (ZIP)
   ```

2. **Netlify Drop 사용**
   - [Netlify Drop](https://app.netlify.com/drop) 접속
   - 압축 파일을 드래그 앤 드롭
   - 자동으로 배포됨!

### 방법 2: Git 저장소 연결 (권장)

1. **Git 저장소에 푸시**
   ```bash
   # Prestudy_IM 폴더에서
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin [YOUR_REPO_URL]
   git push -u origin main
   ```

2. **Netlify에서 사이트 생성**
   - Netlify 대시보드 → "Add new site" → "Import an existing project"
   - Git provider 선택 (GitHub, GitLab, Bitbucket)
   - 저장소 선택
   - 배포 설정:
     - **Build command**: (비워두기)
     - **Publish directory**: `.` 또는 비워두기
   - "Deploy site" 클릭

3. **자동 배포 완료**
   - Git에 푸시할 때마다 자동 재배포

### 방법 3: Netlify CLI 사용

1. **Netlify CLI 설치**
   ```bash
   npm install -g netlify-cli
   ```

2. **로그인**
   ```bash
   netlify login
   ```

3. **배포**
   ```bash
   # Prestudy_IM 폴더에서
   netlify deploy --prod
   ```

## ⚙️ 배포 설정

### `netlify.toml` 파일
프로젝트에 이미 포함되어 있습니다:
- 리다이렉트 설정
- 보안 헤더
- MIME 타입 설정

### Firebase 설정
Firebase 설정은 `script.js`에 이미 포함되어 있어 별도 설정 불필요합니다.

## 🔧 배포 후 설정

### 1. 도메인 설정
- Netlify 대시보드 → Site settings → Domain management
- 커스텀 도메인 추가 가능
- 무료 SSL 인증서 자동 제공

### 2. 환경 변수 (필요시)
- Site settings → Environment variables
- Firebase 설정을 환경 변수로 관리하려면 여기서 설정

### 3. 빌드 & 배포 설정
- Site settings → Build & deploy
- 자동 배포 설정
- 배포 알림 설정

## 📱 접속 확인

배포 완료 후 제공되는 URL:
```
https://[your-site-name].netlify.app
```

### 테스트 항목
- ✅ 페이지 로딩
- ✅ 학번/이름 입력
- ✅ 문제 풀이
- ✅ Firebase 저장 확인
- ✅ 엑셀 다운로드
- ✅ 모바일 반응형

## 🔥 Firebase 보안 규칙

배포 후 Firebase Console에서 보안 규칙 설정:

```json
{
  "rules": {
    "prestudy_results": {
      ".read": false,
      ".write": true,
      "$resultId": {
        ".validate": "newData.hasChildren(['studentId', 'studentName', 'startTime'])"
      }
    }
  }
}
```

## 🌐 커스텀 도메인 연결

1. **도메인 추가**
   - Site settings → Domain management → Add custom domain
   - 도메인 입력 (예: prestudy-im.com)

2. **DNS 설정**
   - 도메인 제공업체에서 설정:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: [your-site-name].netlify.app
   ```

3. **SSL 인증서**
   - Netlify가 자동으로 Let's Encrypt SSL 인증서 발급
   - HTTPS 자동 적용

## 📊 성능 최적화

### Netlify 기본 제공
- ✅ CDN (전 세계 배포)
- ✅ HTTP/2
- ✅ 자동 압축
- ✅ 이미지 최적화

### 추가 최적화
- Asset optimization 활성화
- Form detection 비활성화 (사용하지 않는 경우)

## 🔄 지속적 배포 (CI/CD)

Git 저장소 연결 시:
1. `main` 브랜치에 푸시
2. Netlify가 자동으로 감지
3. 자동 빌드 및 배포
4. 배포 완료 알림

## 💡 유용한 팁

### 1. 배포 미리보기
- Pull Request 생성 시 자동 배포 미리보기
- 프로덕션 배포 전 테스트 가능

### 2. 롤백
- 이전 배포 버전으로 쉽게 롤백 가능
- Deploys → 특정 배포 선택 → Publish deploy

### 3. 배포 로그
- 배포 문제 발생 시 로그 확인
- Deploys → 특정 배포 → Deploy log

### 4. A/B 테스트
- Split testing 기능으로 A/B 테스트 가능
- 여러 브랜치를 다른 비율로 배포

## 🆓 무료 플랜

Netlify 무료 플랜 제공 사항:
- ✅ 100GB 대역폭/월
- ✅ 무제한 사이트
- ✅ 자동 HTTPS
- ✅ 지속적 배포
- ✅ 폼 제출 100개/월
- ✅ 빌드 시간 300분/월

## 📞 문제 해결

### 404 에러
- `netlify.toml`의 리다이렉트 설정 확인
- Publish directory 설정 확인

### Firebase 연결 안 됨
- 브라우저 콘솔에서 에러 확인
- Firebase 프로젝트 설정 확인
- CORS 설정 확인

### 파일 로드 실패
- 파일 경로 확인 (대소문자 구분)
- `netlify.toml`의 헤더 설정 확인

## 📚 참고 자료

- [Netlify 공식 문서](https://docs.netlify.com/)
- [Firebase 웹 호스팅](https://firebase.google.com/docs/hosting)
- [커스텀 도메인 설정](https://docs.netlify.com/domains-https/custom-domains/)

---

배포 완료 후 URL을 학생들과 공유하세요! 🎉


