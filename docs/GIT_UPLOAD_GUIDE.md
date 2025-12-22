
## 📤 GitHub에 업로드하는 방법

### 1. GitHub에서 새 저장소 생성
- GitHub.com에 로그인
- 새 저장소(repository) 생성
- 저장소 이름 예: 'business-run'

### 2. 로컬 저장소와 연결
```bash
git remote add origin https://github.com/YOUR_USERNAME/business-run.git
```

### 3. 코드 푸시
```bash
git push -u origin main
```

### 4. 이후 변경사항 업로드
```bash
git add .
git commit -m "커밋 메시지"
git push
```

