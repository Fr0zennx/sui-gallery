# 🏎️ Sui Car NFT Marketplace

Sui blockchain üzerinde çalışan modern bir araba NFT marketplace uygulaması.

## 🚀 Özellikler

- ⚡ **Hızlı Mint**: 3 farklı araba modelinden birini seç ve özelleştir
- 🎨 **Modern UI**: Koyu tema ve yarış arabası konsepti
- 🛒 **Marketplace**: NFT'leri listele ve satın al
- 💼 **Wallet Entegrasyonu**: @mysten/dapp-kit ile sorunsuz cüzdan bağlantısı
- ⏰ **Timestamp**: Her NFT'nin mint zamanı kaydedilir

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Sui Wallet (Sui Wallet Extension)

## 🛠️ Kurulum

1. **Bağımlılıkları yükle:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Kontrat bilgilerini güncelle:**
   
   \`src/constants.ts\` dosyasını aç ve deploy ettiğin kontratın Package ID'sini gir:
   \`\`\`typescript
   export const PACKAGE_ID = "YOUR_PACKAGE_ID_HERE";
   \`\`\`

3. **Geliştirme sunucusunu başlat:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Tarayıcıda aç:**
   \`\`\`
   http://localhost:5173
   \`\`\`

## 📦 Build

Production build için:
\`\`\`bash
npm run build
npm run preview
\`\`\`

## 🎮 Kullanım

### 1. Araba Mint Et
- Cüzdanını bağla
- 3 modelden birini seç (Red Speedster, Midnight Drifter, Desert Nomad)
- Araba ismi gir ve hızı ayarla (1-100 km/h)
- "Arabayı Mint Et" butonuna tıkla

### 2. NFT'lerini Listele
- "NFT'lerim" bölümünden arabalarını gör
- Satmak istediğin araba için fiyat belirle (SUI cinsinden)
- "Listele" butonuna tıkla

### 3. Marketplace'den Satın Al
- "Pazaryeri" bölümünde satışta olan arabaları gör
- Beğendiğin arabayı seç
- "Satın Al" butonuna tıkla

## 🔧 Teknik Detaylar

### Vite Konfigürasyonu
- \`global: 'globalThis'\` tanımlaması eklendi
- CSP headers'da \`unsafe-eval\` izni var

### Sui Integration
- **dApp Kit Version**: v0.14+
- **Clock Object**: \`0x6\` SuiClock objesi mint işleminde kullanılıyor
- **Query Method**: \`getOwnedObjects\` ile ListCar nesneleri çekiliyor

### Araba Modelleri
1. **Red Speedster** - Hız tutkunları için
2. **Midnight Drifter** - Gece yarışlarının kralı
3. **Desert Nomad** - Çöl pistlerinin fatihi

## 📁 Proje Yapısı

\`\`\`
Sui Gallery/
├── src/
│   ├── components/
│   │   ├── MintCar.tsx       # Mint arayüzü ve model seçici
│   │   ├── MyNFTs.tsx        # Kullanıcının NFT'leri
│   │   └── Marketplace.tsx   # Alım-satım arayüzü
│   ├── constants.ts          # Kontrat adresleri ve sabitler
│   ├── suiClient.ts          # Sui client konfigürasyonu
│   ├── App.tsx               # Ana uygulama
│   ├── main.tsx              # React entry point
│   └── index.css             # Global stiller
├── vite.config.ts            # Vite konfigürasyonu
├── tailwind.config.js        # Tailwind konfigürasyonu
└── package.json              # Bağımlılıklar
\`\`\`

## 🎨 Tasarım Özellikleri

- **Koyu Tema**: Racing-dark (#0a0a0a) ve gradient arka planlar
- **Accent Renk**: Racing-accent (#ff0050) turuncu gradient'lerle
- **Modern Componentler**: Tailwind CSS ile hazır button ve card stilleri
- **Animasyonlar**: Hover efektleri ve smooth transitions

## 🔐 Güvenlik

- Kontrat seviyesinde hız limitleri (1-100)
- Sadece onaylı görseller kullanılabilir (3 model)
- Ödeme miktarı doğrulaması
- Freeze edilmiş metadata

## 📝 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

## 📞 İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**Built with ❤️ on Sui Network**
