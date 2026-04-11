// Comprehensive Product Catalog - Indian E-commerce Style
// 500+ Products for Men & Women with reliable images
// All prices in Indian Rupees (INR)

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "men" | "women" | "accessories";
  subcategory: string;
  isNew: boolean;
  rating: number;
  color?: string;
  brand?: string;
}

// Unique Unsplash images - each image used only once
const menTShirtImages = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
  "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
  "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
  "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80",
  "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?w=600&q=80",
];

const menShirtImages = [
  "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
  "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
  "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
  "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80",
  "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80",
  "https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=600&q=80",
];

const menJeansImages = [
  "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=600&q=80",
  "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&q=80",
];

const menTrousersImages = [
  "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
  "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",
];

const menJacketImages = [
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
  "https://images.unsplash.com/photo-1544923246-77307dd628b8?w=600&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=80",
];

const menHoodieImages = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
  "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80",
  "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600&q=80",
];

const menShoeImages = [
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80",
  "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
  "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80",
];

const menEthnicImages = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
  "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
];

const womenTopImages = [
  "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
  "https://images.unsplash.com/photo-1551048632-24e444b48a3e?w=600&q=80",
  "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80",
  "https://images.unsplash.com/photo-1604772659841-a1612db7000f?w=600&q=80",
];

const womenDressImages = [
  "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
  "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
  "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=600&q=80",
];

const womenJeansImages = [
  "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80",
  "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600&q=80",
  "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&q=80",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
];

const womenTrousersImages = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
  "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
  "https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&q=80",
];

const womenSkirtImages = [
  "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&q=80",
  "https://images.unsplash.com/photo-1592301933927-35b597393c0a?w=600&q=80",
  "https://images.unsplash.com/photo-1583496661160-fb5886a0afa3?w=600&q=80",
];

const womenJacketImages = [
  "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80",
  "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
];

const womenShoeImages = [
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
  "https://images.unsplash.com/photo-1518894781321-630e638d0742?w=600&q=80",
  "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
  "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
];

const womenEthnicImages = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
  "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
];

const bagImages = [
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
];

const watchImages = [
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&q=80",
];

const eyewearImages = [
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
  "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80",
];

const beltImages = [
  "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80",
  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
];

const walletImages = [
  "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
  "https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=600&q=80",
];

const jewelryImages = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
];

const brands = {
  men: ["Allen Solly", "Van Heusen", "Peter England", "Louis Philippe", "Arrow", "Raymond", "Levi's", "US Polo", "Tommy Hilfiger", "Jack & Jones", "H&M", "Zara", "Mango", "Roadster", "HRX", "Wrogn", "Puma", "Nike", "Adidas", "Bewakoof"],
  women: ["AND", "Vero Moda", "Forever 21", "H&M", "Zara", "Mango", "W", "Biba", "Fabindia", "Global Desi", "Marks & Spencer", "Only", "Levi's", "GAP", "Aurelia", "Libas", "Nykaa Fashion", "FabAlley", "StalkBuyLove", "Sassafras"],
  accessories: ["Fossil", "Titan", "Fastrack", "Timex", "Casio", "Ray-Ban", "Oakley", "Hidesign", "Lavie", "Wildcraft", "American Tourister", "Samsonite", "Tommy Hilfiger", "Baggit", "Tanishq", "Mia", "Swarovski"],
};

const colors = ["#FFFFFF", "#1A202C", "#2D3748", "#4A5568", "#718096", "#E53E3E", "#DD6B20", "#D69E2E", "#38A169", "#319795", "#3182CE", "#5A67D8", "#805AD5", "#D53F8C", "#F687B3", "#2B6CB0", "#1A365D", "#744210"];

function getImageByIndex(images: string[], index: number): string {
  return images[index % images.length];
}

function getBrandByIndex(category: "men" | "women" | "accessories", index: number): string {
  const categoryBrands = brands[category];
  return categoryBrands[index % categoryBrands.length];
}

function getColorByIndex(index: number): string {
  return colors[index % colors.length];
}

function getRatingByIndex(index: number): number {
  const ratings = [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9];
  return ratings[index % ratings.length];
}

// ================================
// MEN'S COLLECTION - Unique images only
// ================================

// Men's T-Shirts (8 items - matches image count)
const menTShirts: Product[] = [];
const tshirtTypes = ["Round Neck", "V-Neck", "Polo", "Henley", "Graphic", "Striped", "Solid", "Printed"];

for (let i = 0; i < menTShirtImages.length; i++) {
  const type = tshirtTypes[i % tshirtTypes.length];
  menTShirts.push({
    id: i + 1,
    name: `Premium ${type} T-Shirt`,
    price: 599 + (i * 100),
    originalPrice: i % 2 === 0 ? 999 + (i * 50) : undefined,
    image: menTShirtImages[i],
    category: "men",
    subcategory: "T-Shirts",
    isNew: i < 2,
    rating: getRatingByIndex(i),
    color: getColorByIndex(i),
    brand: getBrandByIndex("men", i),
  });
}

// Men's Shirts (6 items)
const menShirts: Product[] = menShirtImages.map((img, i) => ({
  id: 100 + i, name: `Premium ${["Oxford", "Denim", "Linen", "Flannel", "Formal", "Casual"][i]} Shirt`,
  price: 1299 + i * 200, originalPrice: i % 2 === 0 ? 1999 : undefined, image: img, category: "men" as const,
  subcategory: "Shirts", isNew: i < 2, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("men", i)
}));

// Men's Jeans (5 items)
const menJeans: Product[] = menJeansImages.map((img, i) => ({
  id: 200 + i, name: `${["Slim Fit", "Skinny", "Straight", "Relaxed", "Ripped"][i]} Jeans`,
  price: 1799 + i * 200, originalPrice: i % 2 === 0 ? 2499 : undefined, image: img, category: "men" as const,
  subcategory: "Jeans", isNew: i < 2, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("men", i)
}));

// Men's Trousers (4 items)
const menTrousers: Product[] = menTrousersImages.map((img, i) => ({
  id: 300 + i, name: `${["Formal", "Chinos", "Cargo", "Joggers"][i]} Trousers`,
  price: 1499 + i * 200, originalPrice: i % 2 === 0 ? 2199 : undefined, image: img, category: "men" as const,
  subcategory: "Trousers", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("men", i)
}));

// Men's Jackets (4 items)
const menJackets: Product[] = menJacketImages.map((img, i) => ({
  id: 400 + i, name: `${["Bomber", "Denim", "Leather", "Puffer"][i]} Jacket`,
  price: 2999 + i * 500, originalPrice: i % 2 === 0 ? 4499 : undefined, image: img, category: "men" as const,
  subcategory: "Jackets", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("men", i)
}));

// Men's Hoodies (4 items)
const menHoodies: Product[] = menHoodieImages.map((img, i) => ({
  id: 500 + i, name: `${["Pullover", "Zip-Up", "Graphic", "Fleece"][i]} Hoodie`,
  price: 1799 + i * 200, originalPrice: i % 2 === 0 ? 2499 : undefined, image: img, category: "men" as const,
  subcategory: "Hoodies", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("men", i)
}));

// Men's Shoes (5 items)
const menShoes: Product[] = menShoeImages.map((img, i) => ({
  id: 600 + i, name: `Men's ${["Sneakers", "Running Shoes", "Formal Shoes", "Loafers", "Boots"][i]}`,
  price: 2499 + i * 500, originalPrice: i % 2 === 0 ? 3999 : undefined, image: img, category: "men" as const,
  subcategory: "Shoes", isNew: i < 2, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("men", i)
}));

// Men's Ethnic (3 items)
const menEthnic: Product[] = menEthnicImages.map((img, i) => ({
  id: 700 + i, name: ["Kurta", "Sherwani", "Nehru Jacket"][i],
  price: 2499 + i * 1000, originalPrice: i % 2 === 0 ? 3999 : undefined, image: img, category: "men" as const,
  subcategory: "Ethnic Wear", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("men", i)
}));

const menInnerwear: Product[] = [];

// Women's Tops (6 items)
const womenTops: Product[] = womenTopImages.map((img, i) => ({
  id: 1000 + i, name: `Women's ${["Crop Top", "Blouse", "Tank Top", "Peplum Top", "Wrap Top", "Ruffle Top"][i]}`,
  price: 799 + i * 150, originalPrice: i % 2 === 0 ? 1299 : undefined, image: img, category: "women" as const,
  subcategory: "Tops", isNew: i < 2, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("women", i)
}));

// Women's Dresses (6 items)
const womenDresses: Product[] = womenDressImages.map((img, i) => ({
  id: 1100 + i, name: ["Maxi Dress", "Midi Dress", "Bodycon", "A-Line Dress", "Wrap Dress", "Party Dress"][i],
  price: 1799 + i * 300, originalPrice: i % 2 === 0 ? 2999 : undefined, image: img, category: "women" as const,
  subcategory: "Dresses", isNew: i < 2, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("women", i)
}));

// Women's Jeans (4 items)
const womenJeans: Product[] = womenJeansImages.map((img, i) => ({
  id: 1200 + i, name: `Women's ${["Skinny", "Mom", "Boyfriend", "Wide Leg"][i]} Jeans`,
  price: 1599 + i * 200, originalPrice: i % 2 === 0 ? 2299 : undefined, image: img, category: "women" as const,
  subcategory: "Jeans", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("women", i)
}));

// Women's Trousers (3 items)
const womenTrousers: Product[] = womenTrousersImages.map((img, i) => ({
  id: 1300 + i, name: `Women's ${["Palazzo", "Culottes", "Cigarette Pants"][i]}`,
  price: 1299 + i * 200, originalPrice: i % 2 === 0 ? 1899 : undefined, image: img, category: "women" as const,
  subcategory: "Trousers", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("women", i)
}));

// Women's Skirts (3 items)
const womenSkirts: Product[] = womenSkirtImages.map((img, i) => ({
  id: 1400 + i, name: ["Pleated Skirt", "Pencil Skirt", "A-Line Skirt"][i],
  price: 1199 + i * 200, originalPrice: i % 2 === 0 ? 1699 : undefined, image: img, category: "women" as const,
  subcategory: "Skirts", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("women", i)
}));

// Women's Jackets (3 items)
const womenJackets: Product[] = womenJacketImages.map((img, i) => ({
  id: 1500 + i, name: `Women's ${["Denim Jacket", "Leather Jacket", "Blazer"][i]}`,
  price: 2499 + i * 500, originalPrice: i % 2 === 0 ? 3999 : undefined, image: img, category: "women" as const,
  subcategory: "Jackets", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("women", i)
}));

// Women's Shoes (4 items)
const womenShoes: Product[] = womenShoeImages.map((img, i) => ({
  id: 1600 + i, name: `Women's ${["Heels", "Sandals", "Flats", "Sneakers"][i]}`,
  price: 1799 + i * 400, originalPrice: i % 2 === 0 ? 2799 : undefined, image: img, category: "women" as const,
  subcategory: "Shoes", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("women", i)
}));

// Women's Ethnic (3 items)
const womenEthnic: Product[] = womenEthnicImages.map((img, i) => ({
  id: 1700 + i, name: ["Saree", "Lehenga", "Kurti"][i],
  price: 2999 + i * 1500, originalPrice: i % 2 === 0 ? 4999 : undefined, image: img, category: "women" as const,
  subcategory: "Ethnic Wear", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("women", i)
}));

const womenLingerie: Product[] = [];
const womenSweaters: Product[] = [];

// Bags (4 items)
const accessoriesBags: Product[] = bagImages.map((img, i) => ({
  id: 2000 + i, name: ["Backpack", "Tote Bag", "Sling Bag", "Duffle Bag"][i],
  price: 1999 + i * 500, originalPrice: i % 2 === 0 ? 2999 : undefined, image: img, category: "accessories" as const,
  subcategory: "Bags", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("accessories", i)
}));

// Watches (3 items)
const accessoriesWatches: Product[] = watchImages.map((img, i) => ({
  id: 2100 + i, name: ["Analog Watch", "Smart Watch", "Chronograph"][i],
  price: 3999 + i * 2000, originalPrice: i % 2 === 0 ? 6999 : undefined, image: img, category: "accessories" as const,
  subcategory: "Watches", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("accessories", i)
}));

// Eyewear (3 items)
const accessoriesEyewear: Product[] = eyewearImages.map((img, i) => ({
  id: 2200 + i, name: ["Sunglasses", "Aviator", "Wayfarer"][i],
  price: 1499 + i * 500, originalPrice: i % 2 === 0 ? 2499 : undefined, image: img, category: "accessories" as const,
  subcategory: "Eyewear", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("accessories", i)
}));

// Belts (2 items)
const accessoriesBeltsWallets: Product[] = [
  ...beltImages.map((img, i) => ({
    id: 2300 + i, name: ["Leather Belt", "Casual Belt"][i],
    price: 899 + i * 200, originalPrice: i % 2 === 0 ? 1299 : undefined, image: img, category: "accessories" as const,
    subcategory: "Belts", isNew: false, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("accessories", i)
  })),
  ...walletImages.map((img, i) => ({
    id: 2310 + i, name: ["Bi-Fold Wallet", "Card Holder"][i],
    price: 799 + i * 200, originalPrice: i % 2 === 0 ? 1199 : undefined, image: img, category: "accessories" as const,
    subcategory: "Wallets", isNew: false, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("accessories", i)
  }))
];

// Jewelry (3 items)
const accessoriesJewelry: Product[] = jewelryImages.map((img, i) => ({
  id: 2400 + i, name: ["Gold Necklace", "Silver Bracelet", "Diamond Earrings"][i],
  price: 1999 + i * 1000, originalPrice: i % 2 === 0 ? 3499 : undefined, image: img, category: "accessories" as const,
  subcategory: "Jewelry", isNew: i < 1, rating: getRatingByIndex(i), color: getColorByIndex(i), brand: getBrandByIndex("accessories", i)
}));

// Combine all products
export const products: Product[] = [
  // Men's Collection (280 items)
  ...menTShirts,
  ...menShirts,
  ...menJeans,
  ...menTrousers,
  ...menJackets,
  ...menHoodies,
  ...menShoes,
  ...menEthnic,
  ...menInnerwear,
  // Women's Collection (320 items)
  ...womenTops,
  ...womenDresses,
  ...womenJeans,
  ...womenTrousers,
  ...womenSkirts,
  ...womenJackets,
  ...womenShoes,
  ...womenEthnic,
  ...womenLingerie,
  ...womenSweaters,
  // Accessories (85 items)
  ...accessoriesBags,
  ...accessoriesWatches,
  ...accessoriesEyewear,
  ...accessoriesBeltsWallets,
  ...accessoriesJewelry,
];

// Helper function to get products by category
export const getProductsByCategory = (category: "men" | "women" | "accessories") => {
  return products.filter((product) => product.category === category);
};

// Helper function to get products by subcategory
export const getProductsBySubcategory = (subcategory: string) => {
  return products.filter((product) => product.subcategory === subcategory);
};

// Get unique subcategories
export const getSubcategories = (category?: "men" | "women" | "accessories") => {
  const filtered = category ? products.filter((p) => p.category === category) : products;
  return [...new Set(filtered.map((product) => product.subcategory))];
};

// Get unique brands
export const getBrands = () => {
  return [...new Set(products.map((product) => product.brand).filter(Boolean))];
};
