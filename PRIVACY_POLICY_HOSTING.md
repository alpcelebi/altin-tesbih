# GitHub Pages ile Privacy Policy Yayınlama

## Adımlar:

1. GitHub'da yeni bir repository oluşturun (örn: `altin-tesbih-privacy`)
2. Repository'yi public yapın
3. Terminal'de şu komutları çalıştırın:

```bash
cd "c:\Users\90552\Desktop\Mobile Apps\zikirmatik"
git init
git add index.html
git commit -m "Add privacy policy"
git branch -M main
git remote add origin https://github.com/alpcelebi/altin-tesbih-privacy.git
git push -u origin main
```

4. GitHub repository ayarlarına gidin:
   - Settings > Pages
   - Source: "Deploy from a branch"
   - Branch: "main" / "(root)"
   - Save

5. Birkaç dakika sonra siteniz yayında olacak:
   `https://alpcelebi.github.io/altin-tesbih-privacy/index.html`

## Daha Kolay Alternatif: Netlify Drop

1. https://app.netlify.com/drop adresine gidin
2. index.html dosyasını sürükle-bırak yapın
3. Otomatik link alın

