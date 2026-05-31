import React, { createContext, useContext, useState } from "react";
import { Platform } from "react-native";

// ─── Idiomas disponíveis ───────────────────────────────────────────────────
export const LANGUAGES = [
  { code: "pt", label: "Português", flag: "🇵🇹", name: "Português" },
  { code: "en", label: "English", flag: "🇬🇧", name: "English" },
  { code: "es", label: "Español", flag: "🇪🇸", name: "Español" },
  { code: "fr", label: "Français", flag: "🇫🇷", name: "Français" },
  { code: "it", label: "Italiano", flag: "🇮🇹", name: "Italiano" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", name: "Deutsch" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱", name: "Nederlands" },
  { code: "zh", label: "中文", flag: "🇨🇳", name: "中文" },
  { code: "ja", label: "日本語", flag: "🇯🇵", name: "日本語" },
  { code: "ru", label: "Русский", flag: "🇷🇺", name: "Русский" },
  { code: "he", label: "עברית", flag: "🇮🇱", name: "עברית" },
  { code: "ar", label: "العربية", flag: "🇸🇦", name: "العربية" },
  { code: "ko", label: "한국어", flag: "🇰🇷", name: "한국어" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", name: "हिन्दी" },
];

// ─── Traduções ─────────────────────────────────────────────────────────────
const translations: Record<string, Record<string, string>> = {
  // Tabs
  tab_home:        { pt: "Início",      en: "Home",        es: "Inicio",      fr: "Accueil",    it: "Home",       de: "Start",      nl: "Start",      zh: "主页",   ja: "ホーム",  ru: "Главная",    he: "בית",      ar: "الرئيسية",  ko: "홈",      hi: "होम" },
  tab_health:      { pt: "Saúde",       en: "Health",      es: "Salud",       fr: "Santé",      it: "Salute",     de: "Gesundheit", nl: "Gezondheid", zh: "健康",   ja: "健康",    ru: "Здоровье",   he: "בריאות",   ar: "الصحة",     ko: "건강",    hi: "स्वास्थ्य" },
  tab_consult:     { pt: "Consulta",    en: "Consult",     es: "Consulta",    fr: "Consultation",it: "Consulta",  de: "Beratung",   nl: "Consult",    zh: "咨询",   ja: "相談",    ru: "Консультация",he: "ייעוץ",   ar: "استشارة",   ko: "상담",    hi: "परामर्श" },
  tab_community:   { pt: "Comunidade",  en: "Community",   es: "Comunidad",   fr: "Communauté", it: "Comunità",  de: "Community",  nl: "Gemeenschap",zh: "社区",  ja: "コミュニティ",ru: "Сообщество",he: "קהילה",   ar: "المجتمع",  ko: "커뮤니티", hi: "समुदाय" },
  tab_market:      { pt: "Loja",        en: "Shop",        es: "Tienda",      fr: "Boutique",   it: "Negozio",    de: "Shop",       nl: "Winkel",     zh: "商城",   ja: "ショップ", ru: "Магазин",    he: "חנות",     ar: "المتجر",    ko: "쇼핑",    hi: "दुकान" },
  tab_profile:     { pt: "Perfil",      en: "Profile",     es: "Perfil",      fr: "Profil",     it: "Profilo",    de: "Profil",     nl: "Profiel",    zh: "个人",   ja: "プロフィール",ru: "Профиль",  he: "פרופיל",   ar: "الملف",     ko: "프로필",  hi: "प्रोफाइल" },

  // Saúde - secções
  health_vaccines:    { pt: "Vacinas",        en: "Vaccines",      es: "Vacunas",      fr: "Vaccins",       it: "Vaccini",       de: "Impfungen",     nl: "Vaccins",      zh: "疫苗",    ja: "ワクチン",   ru: "Вакцины",       he: "חיסונים",    ar: "اللقاحات",    ko: "백신",      hi: "टीके" },
  health_consults:    { pt: "Consultas",      en: "Appointments",  es: "Consultas",    fr: "Rendez-vous",   it: "Visite",        de: "Termine",       nl: "Afspraken",    zh: "预约",    ja: "診察",       ru: "Приёмы",        he: "תורים",      ar: "المواعيد",    ko: "진료",      hi: "नियुक्तियाँ" },
  health_prescripts:  { pt: "Receitas",       en: "Prescriptions", es: "Recetas",      fr: "Ordonnances",   it: "Ricette",       de: "Rezepte",       nl: "Recepten",     zh: "处方",    ja: "処方箋",     ru: "Рецепты",       he: "מרשמים",     ar: "الوصفات",     ko: "처방전",    hi: "नुस्खे" },
  health_deworming:   { pt: "Desparasit.",    en: "Deworming",     es: "Desparasit.",  fr: "Déparasitage",  it: "Antiparassit.", de: "Entwurmung",    nl: "Ontworming",   zh: "驱虫",    ja: "駆虫",       ru: "Дегельм.",      he: "הדברה",      ar: "التطهير",     ko: "구충",      hi: "कृमि मुक्ति" },
  health_weight:      { pt: "Peso",           en: "Weight",        es: "Peso",         fr: "Poids",         it: "Peso",          de: "Gewicht",       nl: "Gewicht",      zh: "体重",    ja: "体重",       ru: "Вес",           he: "משקל",       ar: "الوزن",       ko: "체중",      hi: "वजन" },
  health_diary:       { pt: "Diário",         en: "Diary",         es: "Diario",       fr: "Journal",       it: "Diario",        de: "Tagebuch",      nl: "Dagboek",      zh: "日记",    ja: "日記",       ru: "Дневник",       he: "יומן",       ar: "اليوميات",    ko: "일기",      hi: "डायरी" },
  health_docs:        { pt: "Documentos",     en: "Documents",     es: "Documentos",   fr: "Documents",     it: "Documenti",     de: "Dokumente",     nl: "Documenten",   zh: "文件",    ja: "書類",       ru: "Документы",     he: "מסמכים",     ar: "الوثائق",     ko: "서류",      hi: "दस्तावेज़" },

  // Início
  home_hello:         { pt: "Olá",            en: "Hello",         es: "Hola",         fr: "Bonjour",       it: "Ciao",          de: "Hallo",         nl: "Hallo",        zh: "你好",    ja: "こんにちは",  ru: "Привет",       he: "שלום",       ar: "مرحباً",      ko: "안녕하세요", hi: "नमस्ते" },
  home_subtitle:      { pt: "Aqui os teus animais são bem cuidados! 🐾", en: "Your pets are well taken care of here! 🐾", es: "¡Aquí tus mascotas están bien cuidadas! 🐾", fr: "Ici vos animaux sont bien soignés! 🐾", it: "Qui i tuoi animali sono ben curati! 🐾", de: "Hier werden Ihre Haustiere gut betreut! 🐾", nl: "Hier worden uw huisdieren goed verzorgd! 🐾", zh: "在这里，您的宠物得到精心照顾！🐾", ja: "ここであなたのペットは大切にされています！🐾", ru: "Здесь ваши питомцы в хороших руках! 🐾", he: "כאן חיות המחמד שלך מטופלות היטב! 🐾", ar: "هنا يتم الاعتناء بحيواناتك الأليفة! 🐾", ko: "여기서 당신의 반려동물이 잘 돌봐집니다! 🐾", hi: "यहाँ आपके पालतू जानवरों की अच्छी देखभाल होती है! 🐾" },

  // Geral
  add:                { pt: "Adicionar",      en: "Add",           es: "Añadir",       fr: "Ajouter",       it: "Aggiungi",      de: "Hinzufügen",    nl: "Toevoegen",    zh: "添加",    ja: "追加",       ru: "Добавить",      he: "הוסף",       ar: "إضافة",       ko: "추가",      hi: "जोड़ें" },
  save:               { pt: "Guardar",        en: "Save",          es: "Guardar",      fr: "Enregistrer",   it: "Salva",         de: "Speichern",     nl: "Opslaan",      zh: "保存",    ja: "保存",       ru: "Сохранить",     he: "שמור",       ar: "حفظ",         ko: "저장",      hi: "सहेजें" },
  cancel:             { pt: "Cancelar",       en: "Cancel",        es: "Cancelar",     fr: "Annuler",       it: "Annulla",       de: "Abbrechen",     nl: "Annuleren",    zh: "取消",    ja: "キャンセル",  ru: "Отмена",       he: "בטל",        ar: "إلغاء",       ko: "취소",      hi: "रद्द करें" },
  delete:             { pt: "Eliminar",       en: "Delete",        es: "Eliminar",     fr: "Supprimer",     it: "Elimina",       de: "Löschen",       nl: "Verwijderen",  zh: "删除",    ja: "削除",       ru: "Удалить",       he: "מחק",        ar: "حذف",         ko: "삭제",      hi: "हटाएं" },
  gallery:            { pt: "Galeria",        en: "Gallery",       es: "Galería",      fr: "Galerie",       it: "Galleria",      de: "Galerie",       nl: "Galerij",      zh: "相册",    ja: "ギャラリー",  ru: "Галерея",      he: "גלריה",      ar: "المعرض",      ko: "갤러리",    hi: "गैलरी" },
  camera:             { pt: "Câmara",         en: "Camera",        es: "Cámara",       fr: "Appareil photo",it: "Fotocamera",   de: "Kamera",        nl: "Camera",       zh: "相机",    ja: "カメラ",     ru: "Камера",       he: "מצלמה",      ar: "الكاميرا",    ko: "카메라",    hi: "कैमरा" },
  my_pets:            { pt: "Os meus animais",en: "My Pets",       es: "Mis mascotas", fr: "Mes animaux",   it: "I miei animali",de: "Meine Tiere",   nl: "Mijn dieren",  zh: "我的宠物", ja: "私のペット",  ru: "Мои питомцы",  he: "החיות שלי",  ar: "حيواناتي",    ko: "내 반려동물", hi: "मेरे पालतू" },
  no_pets:            { pt: "Adicione um animal para começar", en: "Add a pet to get started", es: "Añade una mascota para comenzar", fr: "Ajoutez un animal pour commencer", it: "Aggiungi un animale per iniziare", de: "Fügen Sie ein Tier hinzu", nl: "Voeg een dier toe om te beginnen", zh: "添加宠物开始", ja: "ペットを追加して始めましょう", ru: "Добавьте питомца, чтобы начать", he: "הוסף חיה כדי להתחיל", ar: "أضف حيوانًا للبدء", ko: "반려동물을 추가하여 시작하세요", hi: "शुरू करने के लिए पालतू जोड़ें" },
  choose_language:    { pt: "Idioma",         en: "Language",      es: "Idioma",       fr: "Langue",        it: "Lingua",        de: "Sprache",       nl: "Taal",         zh: "语言",    ja: "言語",       ru: "Язык",          he: "שפה",        ar: "اللغة",       ko: "언어",      hi: "भाषा" },
};

// ─── Contexto ──────────────────────────────────────────────────────────────
type LangContextType = {
  lang: string;
  setLang: (l: string) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextType>({
  lang: "pt",
  setLang: () => {},
  t: (key) => key,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState("pt");

  const setLang = (l: string) => {
    setLangState(l);
    // Persistir
    try {
      if (Platform.OS === "web") {
        localStorage.setItem("app_lang", l);
      } else {
        const SecureStore = require("expo-secure-store");
        SecureStore.setItemAsync("app_lang", l).catch(() => {});
      }
    } catch {}
  };

  const t = (key: string): string => {
    const row = translations[key];
    if (!row) return key;
    return row[lang] ?? row["pt"] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
