
export const translations = {
  en: {
    food: "Food",
    appetizers: "Appetizers",
    mainCourse: "Main Course",
    desserts: "Desserts",
    beverages: "Beverages",
    orderNow: "Order Now",
    catering: "Catering",
    contact: "Contact",
  },
  fr: {
    food: "Nourriture",
    appetizers: "Entrées",
    mainCourse: "Plat Principal",
    desserts: "Desserts",
    beverages: "Boissons",
    orderNow: "Commander",
    catering: "Service Traiteur",
    contact: "Contact",
  },
  sw: {
    food: "Chakula",
    appetizers: "Vyakula vya Mwanzo",
    mainCourse: "Mlo Mkuu",
    desserts: "Kitindamlo",
    beverages: "Vinywaji",
    orderNow: "Agiza Sasa",
    catering: "Upishi",
    contact: "Wasiliana",
  }
};

export type SupportedLanguage = keyof typeof translations;
