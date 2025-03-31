
import { MenuItemType } from '@/types/menu';

export const menuData = {
  appetizers: [
    {
      id: 'kebab',
      name: 'Kebab',
      price: '7.00',
      description: 'Minced meat, garlic, onions, cumin, coriander, chili, skewered & grilled.',
      image: 'images/kebab.jpg' // Changed to local path for manual image management
    },
    {
      id: 'bhajia',
      name: 'Bhajia',
      price: '6.99',
      description: 'Sliced potatoes, deep-fried and coated with spiced gram flour.',
      image: 'images/bhajia.jpg'
    },
    {
      id: 'garlic-bread',
      name: 'Garlic Bread',
      price: '5.99',
      description: 'Toasted bread infused with garlic butter and fresh parsley.',
      image: 'images/garlic-bread.jpg'
    },
    {
      id: 'stuffed-mushrooms',
      name: 'Stuffed Mushrooms',
      price: '8.49',
      description: 'Mushrooms stuffed with cheese, garlic, and breadcrumbs, then baked.',
      image: 'images/stuffed-mushrooms.jpg'
    },
    {
      id: 'mandazi',
      name: 'Mandazi',
      price: '6.49',
      description: 'Fried dough infused with coconut milk and cardamom, served with tea.',
      image: 'images/mandazi.jpg'
    },
    {
      id: 'chicken-wings',
      name: 'Chicken Wings',
      price: '9.99',
      description: 'Chicken wings marinated in a spicy sauce, deep-fried or grilled.',
      image: 'images/chicken-wings.jpg'
    }
  ],
  mainCourse: [
    {
      id: 'nyama-choma',
      name: 'Nyama Choma',
      price: '15.99',
      description: 'Grilled goat or beef meat, served with kachumbari and ugali.',
      image: 'images/nyama-choma.jpg'
    },
    {
      id: 'steak-and-fries',
      name: 'Steak and Fries',
      price: '18.99',
      description: 'Juicy steak grilled to perfection, served with crispy fries.',
      image: 'images/steak-and-fries.jpg'
    },
    {
      id: 'pasta-alfredo',
      name: 'Pasta Alfredo',
      price: '13.49',
      description: 'Fettuccine pasta tossed in a rich Alfredo sauce with parmesan.',
      image: 'images/pasta-alfredo.jpg'
    },
    {
      id: 'chicken-parmesan',
      name: 'Chicken Parmesan',
      price: '14.99',
      description: 'Breaded chicken breast topped with marinara sauce and melted cheese.',
      image: 'images/chicken-parmesan.jpg'
    },
    {
      id: 'pilau',
      name: 'Pilau',
      price: '22.99',
      description: 'Spiced rice cooked with beef or chicken, served with kachumbari.',
      image: 'images/pilau.jpg'
    },
    {
      id: 'veggie-stir-fry',
      name: 'Veggie Stir Fry',
      price: '11.99',
      description: 'A mix of fresh vegetables stir-fried with soy sauce and ginger.',
      image: 'images/veggie-stir-fry.jpg'
    }
  ],
  desserts: [
    {
      id: 'chocolate-cake',
      name: 'Chocolate Cake',
      price: '6.49',
      description: 'Rich and moist chocolate cake topped with a creamy ganache.',
      image: 'images/chocolate-cake.jpg'
    },
    {
      id: 'cheesecake',
      name: 'Cheesecake',
      price: '5.99',
      description: 'Creamy cheesecake with a graham cracker crust and berry topping.',
      image: 'images/cheesecake.jpg'
    },
    {
      id: 'ice-cream-sundae',
      name: 'Ice Cream Sundae',
      price: '4.99',
      description: 'Vanilla ice cream topped with chocolate syrup and whipped cream.',
      image: 'images/ice-cream-sundae.jpg'
    },
    {
      id: 'tiramisu',
      name: 'Tiramisu',
      price: '6.99',
      description: 'Classic Italian dessert with layers of espresso-soaked ladyfingers.',
      image: 'images/tiramisu.jpg'
    },
    {
      id: 'fruit-tart',
      name: 'Fruit Tart',
      price: '5.49',
      description: 'Crispy pastry crust filled with fresh fruit and custard.',
      image: 'images/fruit-tart.jpg'
    }
  ],
  beverages: [
    {
      id: 'pink-moscato',
      name: 'Confetti Pink Moscato - Bottle',
      price: '20.00',
      image: 'images/pink-moscato.jpg'
    },
    {
      id: 'white-wine',
      name: 'Moscato Primo Amore - Bottle',
      price: '20.00',
      image: 'images/white-wine.jpg'
    },
    {
      id: 'red-wine',
      name: 'Roscato Rosso Dolce - Bottle',
      price: '20.00',
      image: 'images/red-wine.jpg'
    },
    {
      id: 'bellini-peach-tea',
      name: 'Bellini Peach Tea',
      price: '4.29',
      image: 'images/bellini-peach-tea.jpg'
    },
    {
      id: 'classic-lemonade',
      name: 'Classic Lemonade',
      price: '3.49',
      image: 'images/classic-lemonade.jpg'
    },
    {
      id: 'iced-tea',
      name: 'Iced Tea',
      price: '3.49',
      image: 'images/iced-tea.jpg'
    },
    {
      id: 'raspberry-lemonade',
      name: 'Raspberry Lemonade',
      price: '4.29',
      image: 'images/raspberry-lemonade.jpg'
    },
    {
      id: 'soft-drink',
      name: 'Soft Drink',
      price: '3.49',
      image: 'images/soft-drink.jpg'
    }
  ]
};
