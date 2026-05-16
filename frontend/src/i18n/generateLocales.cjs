const fs = require('fs');
const path = require('path');
const en = require('./locales/en.json');

// Translations for nav keys only (most visible). Rest falls back to English.
const t = {
  pt:{nav:{shop:"Loja",men:"Homens",women:"Mulheres",trending:"Tendências",accessories:"Acessórios"},home:{hero_title:"DEFINA SEU FUTURO",shop_now:"Comprar"},cart:{title:"Carrinho",empty:"Carrinho vazio",checkout:"Finalizar"},common:{loading:"Carregando...",continue_shopping:"Continuar Comprando"}},
  ru:{nav:{shop:"Магазин",men:"Мужчины",women:"Женщины",trending:"Тренды",accessories:"Аксессуары"},home:{hero_title:"ОПРЕДЕЛИ СВОЁ БУДУЩЕЕ",shop_now:"Купить"},cart:{title:"Корзина",empty:"Корзина пуста",checkout:"Оформить"},common:{loading:"Загрузка...",continue_shopping:"Продолжить покупки"}},
  zh:{nav:{shop:"商店",men:"男装",women:"女装",trending:"潮流",accessories:"配饰"},home:{hero_title:"定义你的未来",shop_now:"立即购买"},cart:{title:"购物车",empty:"购物车为空",checkout:"结账"},common:{loading:"加载中...",continue_shopping:"继续购物"}},
  ja:{nav:{shop:"ショップ",men:"メンズ",women:"レディース",trending:"トレンド",accessories:"アクセサリー"},home:{hero_title:"未来を定義せよ",shop_now:"今すぐ購入"},cart:{title:"カート",empty:"カートは空です",checkout:"購入手続き"},common:{loading:"読み込み中...",continue_shopping:"買い物を続ける"}},
  ko:{nav:{shop:"쇼핑",men:"남성",women:"여성",trending:"트렌드",accessories:"액세서리"},home:{hero_title:"미래를 정의하라",shop_now:"지금 쇼핑"},cart:{title:"장바구니",empty:"장바구니가 비어있습니다",checkout:"결제하기"},common:{loading:"로딩중...",continue_shopping:"쇼핑 계속하기"}},
  ar:{nav:{shop:"متجر",men:"رجال",women:"نساء",trending:"رائج",accessories:"إكسسوارات"},home:{hero_title:"حدد مستقبلك",shop_now:"تسوق الآن"},cart:{title:"السلة",empty:"السلة فارغة",checkout:"إتمام الشراء"},common:{loading:"جاري التحميل...",continue_shopping:"متابعة التسوق"}},
  bn:{nav:{shop:"দোকান",men:"পুরুষ",women:"মহিলা",trending:"ট্রেন্ডিং",accessories:"আনুষাঙ্গিক"},home:{hero_title:"আপনার ভবিষ্যৎ নির্ধারণ করুন",shop_now:"এখনই কিনুন"},cart:{title:"কার্ট",empty:"কার্ট খালি",checkout:"চেকআউট"},common:{loading:"লোড হচ্ছে...",continue_shopping:"কেনাকাটা চালিয়ে যান"}},
  ta:{nav:{shop:"கடை",men:"ஆண்கள்",women:"பெண்கள்",trending:"டிரெண்டிங்",accessories:"அணிகலன்கள்"},home:{hero_title:"உங்கள் எதிர்காலத்தை வரையறுக்கவும்",shop_now:"இப்போது வாங்கு"},cart:{title:"கார்ட்",empty:"கார்ட் காலியாக உள்ளது",checkout:"செக்அவுட்"},common:{loading:"ஏற்றுகிறது...",continue_shopping:"கொள்முதல் தொடரவும்"}},
  te:{nav:{shop:"షాప్",men:"పురుషులు",women:"మహిళలు",trending:"ట్రెండింగ్",accessories:"యాక్సెసరీస్"},home:{hero_title:"మీ భవిష్యత్తును నిర్వచించండి",shop_now:"ఇప్పుడే కొనండి"},cart:{title:"కార్ట్",empty:"కార్ట్ ఖాళీగా ఉంది",checkout:"చెక్అవుట్"},common:{loading:"లోడ్ అవుతోంది...",continue_shopping:"కొనుగోలు కొనసాగించండి"}},
  mr:{nav:{shop:"दुकान",men:"पुरुष",women:"महिला",trending:"ट्रेंडिंग",accessories:"अॅक्सेसरीज"},home:{hero_title:"तुमचे भविष्य निश्चित करा",shop_now:"आता खरेदी करा"},cart:{title:"कार्ट",empty:"कार्ट रिकामी आहे",checkout:"चेकआउट"},common:{loading:"लोड होत आहे...",continue_shopping:"खरेदी सुरू ठेवा"}},
  gu:{nav:{shop:"દુકાન",men:"પુરુષ",women:"મહિલા",trending:"ટ્રેન્ડિંગ",accessories:"એક્સેસરીઝ"},home:{hero_title:"તમારું ભવિષ્ય નક્કી કરો",shop_now:"હમણાં ખરીદો"},cart:{title:"કાર્ટ",empty:"કાર્ટ ખાલી છે",checkout:"ચેકઆઉટ"},common:{loading:"લોડ થઈ રહ્યું છે...",continue_shopping:"ખરીદી ચાલુ રાખો"}},
  kn:{nav:{shop:"ಅಂಗಡಿ",men:"ಪುರುಷರು",women:"ಮಹಿಳೆಯರು",trending:"ಟ್ರೆಂಡಿಂಗ್",accessories:"ಪರಿಕರಗಳು"},home:{hero_title:"ನಿಮ್ಮ ಭವಿಷ್ಯವನ್ನು ನಿರ್ಧರಿಸಿ",shop_now:"ಈಗ ಖರೀದಿಸಿ"},cart:{title:"ಕಾರ್ಟ್",empty:"ಕಾರ್ಟ್ ಖಾಲಿ",checkout:"ಚೆಕ್‌ಔಟ್"},common:{loading:"ಲೋಡ್ ಆಗುತ್ತಿದೆ...",continue_shopping:"ಖರೀದಿ ಮುಂದುವರಿಸಿ"}},
  ml:{nav:{shop:"ഷോപ്പ്",men:"പുരുഷന്മാർ",women:"സ്ത്രീകൾ",trending:"ട്രെൻഡിംഗ്",accessories:"ആക്സസറീസ്"},home:{hero_title:"നിങ്ങളുടെ ഭാവി നിർവചിക്കുക",shop_now:"ഇപ്പോൾ വാങ്ങുക"},cart:{title:"കാർട്ട്",empty:"കാർട്ട് ശൂന്യമാണ്",checkout:"ചെക്ക്ഔട്ട്"},common:{loading:"ലോഡ് ചെയ്യുന്നു...",continue_shopping:"ഷോപ്പിംഗ് തുടരുക"}},
  pa:{nav:{shop:"ਦੁਕਾਨ",men:"ਪੁਰਸ਼",women:"ਔਰਤਾਂ",trending:"ਟ੍ਰੈਂਡਿੰਗ",accessories:"ਐਕਸੈਸਰੀਜ਼"},home:{hero_title:"ਆਪਣਾ ਭਵਿੱਖ ਪਰਿਭਾਸ਼ਿਤ ਕਰੋ",shop_now:"ਹੁਣੇ ਖਰੀਦੋ"},cart:{title:"ਕਾਰਟ",empty:"ਕਾਰਟ ਖਾਲੀ ਹੈ",checkout:"ਚੈੱਕਆਊਟ"},common:{loading:"ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",continue_shopping:"ਖਰੀਦਦਾਰੀ ਜਾਰੀ ਰੱਖੋ"}},
  th:{nav:{shop:"ร้านค้า",men:"ผู้ชาย",women:"ผู้หญิง",trending:"มาแรง",accessories:"เครื่องประดับ"},home:{hero_title:"กำหนดอนาคตของคุณ",shop_now:"ซื้อเลย"},cart:{title:"ตะกร้า",empty:"ตะกร้าว่างเปล่า",checkout:"ชำระเงิน"},common:{loading:"กำลังโหลด...",continue_shopping:"ช้อปปิ้งต่อ"}},
  vi:{nav:{shop:"Cửa hàng",men:"Nam",women:"Nữ",trending:"Xu hướng",accessories:"Phụ kiện"},home:{hero_title:"ĐỊNH NGHĨA TƯƠNG LAI",shop_now:"Mua ngay"},cart:{title:"Giỏ hàng",empty:"Giỏ hàng trống",checkout:"Thanh toán"},common:{loading:"Đang tải...",continue_shopping:"Tiếp tục mua sắm"}},
  tr:{nav:{shop:"Mağaza",men:"Erkek",women:"Kadın",trending:"Trendler",accessories:"Aksesuarlar"},home:{hero_title:"GELECEĞİNİ BELİRLE",shop_now:"Hemen Al"},cart:{title:"Sepet",empty:"Sepet boş",checkout:"Ödeme"},common:{loading:"Yükleniyor...",continue_shopping:"Alışverişe Devam"}},
  pl:{nav:{shop:"Sklep",men:"Mężczyźni",women:"Kobiety",trending:"Trendy",accessories:"Akcesoria"},home:{hero_title:"ZDEFINIUJ SWOJĄ PRZYSZŁOŚĆ",shop_now:"Kup Teraz"},cart:{title:"Koszyk",empty:"Koszyk jest pusty",checkout:"Do kasy"},common:{loading:"Ładowanie...",continue_shopping:"Kontynuuj zakupy"}},
  nl:{nav:{shop:"Winkel",men:"Heren",women:"Dames",trending:"Trending",accessories:"Accessoires"},home:{hero_title:"BEPAAL JE TOEKOMST",shop_now:"Nu Kopen"},cart:{title:"Winkelwagen",empty:"Winkelwagen is leeg",checkout:"Afrekenen"},common:{loading:"Laden...",continue_shopping:"Verder winkelen"}},
  sv:{nav:{shop:"Butik",men:"Herr",women:"Dam",trending:"Trender",accessories:"Tillbehör"},home:{hero_title:"DEFINIERA DIN FRAMTID",shop_now:"Köp Nu"},cart:{title:"Varukorg",empty:"Varukorgen är tom",checkout:"Till kassan"},common:{loading:"Laddar...",continue_shopping:"Fortsätt handla"}}
};

// Deep merge: overlay partial translations on top of English
function deepMerge(base, overlay) {
  const result = JSON.parse(JSON.stringify(base));
  for (const key of Object.keys(overlay)) {
    if (typeof overlay[key] === 'object' && overlay[key] !== null && typeof result[key] === 'object') {
      result[key] = deepMerge(result[key], overlay[key]);
    } else {
      result[key] = overlay[key];
    }
  }
  return result;
}

const dir = path.join(__dirname, 'locales');
for (const [code, partial] of Object.entries(t)) {
  const merged = deepMerge(en, partial);
  fs.writeFileSync(path.join(dir, `${code}.json`), JSON.stringify(merged, null, 2) + '\n', 'utf8');
  console.log(`Generated ${code}.json`);
}
console.log('Done!');
