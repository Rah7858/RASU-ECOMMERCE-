const mongoose = require('mongoose');
const Product = require('../src/models/Product');

const MONGO = 'mongodb+srv://rasustore:rasustore1017@rasustore.mkca67h.mongodb.net/rasu_db?retryWrites=true&w=majority';

const P = (n,p,cat,sub,desc,img,g,opts={}) => ({
  name:n, price:p, category:cat, subcategory:sub, description:desc,
  image:img, images:[img], gender:g, ageGroup:'adult', occasion:'casual',
  sizes: opts.sizes||['S','M','L','XL'], colors: opts.colors||['Black','White'],
  stock: opts.stock||50, rating: opts.rating||4.5, numReviews: opts.nr||100,
  isNew: opts.isNew||false, isTrending: opts.trend||false, brand:'RASU', isActive:true
});

const products = [
  // MEN HOODIES (5)
  P('Urban Oversized Hoodie',1299,'clothing','hoodies','Premium heavyweight hoodie','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800','men',{isNew:true,trend:true,nr:128}),
  P('Tech Fleece Hoodie',1799,'clothing','hoodies','Lightweight tech fleece','https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800','men',{isNew:true,nr:178}),
  P('Vintage Wash Hoodie',1499,'clothing','hoodies','Garment-dyed vintage wash','https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800','men',{trend:true,nr:95}),
  P('Zip-Up Street Hoodie',1599,'clothing','hoodies','Full-zip premium hoodie','https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800','men',{nr:67}),
  P('Graphic Print Hoodie',1399,'clothing','hoodies','Bold graphic print hoodie','https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?w=800','men',{isNew:true,trend:true,nr:143}),
  // MEN JACKETS (5)
  P('Bomber Jacket Elite',2999,'clothing','jackets','Premium bomber jacket','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800','men',{isNew:true,trend:true,rating:4.7,nr:203}),
  P('Streetwear Windbreaker',2499,'clothing','jackets','Lightweight windbreaker','https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800','men',{isNew:true,trend:true,rating:4.6,nr:92}),
  P('Denim Trucker Jacket',2199,'clothing','jackets','Classic denim trucker','https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800','men',{rating:4.3,nr:87}),
  P('Leather Biker Jacket',4999,'clothing','jackets','Genuine leather biker','https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800','men',{trend:true,rating:4.9,nr:312}),
  P('Puffer Jacket Pro',3499,'clothing','jackets','Down-filled puffer jacket','https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800','men',{isNew:true,nr:156}),
  // MEN TSHIRTS (5)
  P('Oversized Graphic Tee',599,'clothing','tshirts','Drop-shoulder oversized tee','https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800','men',{rating:4.2,nr:445}),
  P('Premium Plain Tee',499,'clothing','tshirts','Heavyweight 220gsm cotton','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800','men',{rating:4.4,nr:678}),
  P('Tie-Dye Street Tee',699,'clothing','tshirts','Hand tie-dyed unique tee','https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800','men',{isNew:true,trend:true,nr:89}),
  P('Polo Classic',899,'clothing','tshirts','Premium pique polo','https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800','men',{rating:4.3,nr:234}),
  P('Longline Curved Hem Tee',799,'clothing','tshirts','Extended length curved hem','https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800','men',{isNew:true,nr:123}),
  // MEN TROUSERS (5)
  P('Cargo Joggers Pro',999,'clothing','trousers','Multi-pocket cargo joggers','https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800','men',{trend:true,rating:4.3,nr:89}),
  P('Slim Fit Chinos',1299,'clothing','trousers','Stretch chino trousers','https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800','men',{sizes:['28','30','32','34','36'],rating:4.4,nr:167}),
  P('Wide Leg Trousers',1499,'clothing','trousers','Relaxed wide-leg trousers','https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800','men',{isNew:true,trend:true,nr:134}),
  P('Athletic Track Pants',899,'clothing','trousers','Performance track pants','https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800','men',{rating:4.1,nr:98}),
  P('Linen Blend Pants',1199,'clothing','trousers','Breathable linen blend','https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800','men',{isNew:true,rating:4.2,nr:76}),
  // MEN JEANS (5)
  P('Slim Fit Dark Wash Jeans',1499,'clothing','jeans','Premium slim fit jeans','https://images.unsplash.com/photo-1542272604-787c3835535d?w=800','men',{sizes:['28','30','32','34','36'],rating:4.4,nr:167}),
  P('Ripped Skinny Jeans',1299,'clothing','jeans','Distressed skinny jeans','https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800','men',{isNew:true,trend:true,rating:4.2,nr:234}),
  P('Relaxed Baggy Jeans',1699,'clothing','jeans','90s inspired baggy fit','https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800','men',{isNew:true,trend:true,rating:4.6,nr:189}),
  P('Straight Cut Jeans',1399,'clothing','jeans','Classic straight cut denim','https://images.unsplash.com/photo-1542272604-787c3835535d?w=800','men',{sizes:['28','30','32','34','36','38'],rating:4.3,nr:312}),
  P('White Denim Jeans',1599,'clothing','jeans','Clean white denim slim','https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800','men',{rating:4.1,nr:67}),

  // WOMEN CO-ORDS (5)
  P('Premium Co-ord Set',1999,'clothing','coord-sets','Matching top and bottom set','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800','women',{sizes:['XS','S','M','L'],isNew:true,trend:true,rating:4.8,nr:312}),
  P('Blazer Co-ord Power Set',2799,'clothing','coord-sets','Structured blazer and trouser','https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800','women',{sizes:['XS','S','M','L'],trend:true,nr:143}),
  P('Knit Co-ord Set',1799,'clothing','coord-sets','Cozy knit matching set','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800','women',{sizes:['XS','S','M','L','XL'],isNew:true,trend:true,rating:4.6,nr:198}),
  P('Linen Summer Set',1499,'clothing','coord-sets','Breathable linen co-ord','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800','women',{sizes:['XS','S','M','L'],isNew:true,nr:167}),
  P('Athletic Matching Set',1299,'clothing','coord-sets','Sports bra and leggings set','https://images.unsplash.com/photo-1538805060514-97d9cc172bbb?w=800','women',{sizes:['XS','S','M','L','XL'],trend:true,rating:4.7,nr:423}),
  // WOMEN HOODIES (5)
  P('Oversized Crop Hoodie',1199,'clothing','hoodies','Trendy crop hoodie','https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800','women',{sizes:['XS','S','M','L','XL'],isNew:true,trend:true,rating:4.6,nr:289}),
  P('Cropped Sweatshirt',799,'clothing','hoodies','Casual cropped sweatshirt','https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800','women',{sizes:['XS','S','M','L','XL'],rating:4.2,nr:189}),
  P('Tie-Dye Hoodie Dress',1399,'clothing','hoodies','Extended length hoodie dress','https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800','women',{sizes:['XS','S','M','L'],isNew:true,nr:134}),
  P('Zip-Up Crop Hoodie',999,'clothing','hoodies','Half-zip crop hoodie','https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800','women',{sizes:['XS','S','M','L'],trend:true,nr:212}),
  P('Fluffy Teddy Hoodie',1599,'clothing','hoodies','Ultra-soft teddy fleece','https://images.unsplash.com/photo-1565693413579-8ff3fdc1b03b?w=800','women',{sizes:['XS','S','M','L','XL'],isNew:true,trend:true,rating:4.8,nr:356}),
  // WOMEN JACKETS (5)
  P('Crop Leather Jacket',3499,'clothing','jackets','Premium faux leather crop','https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800','women',{sizes:['XS','S','M','L'],isNew:true,trend:true,rating:4.9,nr:421}),
  P('Oversized Blazer',2299,'clothing','jackets','Oversized structured blazer','https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800','women',{sizes:['XS','S','M','L','XL'],trend:true,nr:178}),
  P('Denim Jacket Cropped',1799,'clothing','jackets','Cropped denim jacket','https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800','women',{sizes:['XS','S','M','L'],rating:4.3,nr:145}),
  P('Puffer Crop Jacket',2499,'clothing','jackets','Cropped puffer jacket','https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800','women',{sizes:['XS','S','M','L'],isNew:true,trend:true,rating:4.6,nr:234}),
  P('Shacket Oversized',1999,'clothing','jackets','Shirt-jacket hybrid flannel','https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800','women',{sizes:['XS','S','M','L','XL'],isNew:true,nr:167}),
  // WOMEN DRESSES (5)
  P('Mini Slip Dress',999,'clothing','dresses','Satin mini slip dress','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800','women',{sizes:['XS','S','M','L'],trend:true,nr:287}),
  P('Midi Wrap Dress',1299,'clothing','dresses','Flowy wrap midi dress','https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800','women',{sizes:['XS','S','M','L','XL'],isNew:true,trend:true,rating:4.6,nr:312}),
  P('Bodycon Dress',1199,'clothing','dresses','Sleek bodycon dress','https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800','women',{sizes:['XS','S','M','L'],trend:true,nr:198}),
  P('Shirt Dress Oversized',1099,'clothing','dresses','Oversized shirt dress','https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800','women',{sizes:['XS','S','M','L','XL'],isNew:true,nr:156}),
  P('Knit Mini Dress',1499,'clothing','dresses','Ribbed knit mini dress','https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800','women',{sizes:['XS','S','M','L'],isNew:true,trend:true,rating:4.7,nr:234}),
  // WOMEN TROUSERS (5)
  P('Wide Leg Trousers',1299,'clothing','trousers','Elegant wide-leg trousers','https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800','women',{sizes:['XS','S','M','L'],trend:true,nr:198}),
  P('High Waist Yoga Pants',899,'clothing','trousers','Squat-proof yoga pants','https://images.unsplash.com/photo-1538805060514-97d9cc172bbb?w=800','women',{sizes:['XS','S','M','L','XL'],rating:4.7,nr:534}),
  P('Linen Wide Leg Pants',1199,'clothing','trousers','Breathable linen pants','https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800','women',{sizes:['XS','S','M','L'],isNew:true,nr:145}),
  P('Cargo Trousers Women',1399,'clothing','trousers','Utility cargo trousers','https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800','women',{sizes:['XS','S','M','L','XL'],isNew:true,trend:true,nr:189}),
  P('Pleated Palazzo Pants',1599,'clothing','trousers','Flowy palazzo pants','https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800','women',{sizes:['XS','S','M','L'],rating:4.6,nr:123}),

  // ACCESSORIES CAPS (5)
  P('Structured Logo Cap',599,'cap','caps','Premium 6-panel cap','https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,nr:445}),
  P('Bucket Hat Urban',499,'cap','caps','Trendy bucket hat','https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800','unisex',{sizes:['One Size'],trend:true,nr:189}),
  P('Snapback Cap',449,'cap','caps','Adjustable snapback','https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800','unisex',{sizes:['One Size'],rating:4.1,nr:234}),
  P('Dad Hat Vintage',399,'cap','caps','Unstructured dad hat','https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800','unisex',{sizes:['One Size'],isNew:true,nr:312}),
  P('Beanie Knit Hat',349,'cap','caps','Soft ribbed knit beanie','https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800','unisex',{sizes:['One Size'],nr:456}),
  // ACCESSORIES BAGS (5)
  P('Crossbody Street Bag',1299,'clothing','bags','Urban crossbody bag','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,rating:4.7,nr:234}),
  P('Canvas Tote Bag',399,'clothing','bags','Heavy-duty canvas tote','https://images.unsplash.com/photo-1544816155-12df9643f363?w=800','unisex',{sizes:['One Size'],rating:4.6,nr:567}),
  P('Mini Backpack',999,'clothing','bags','Compact mini backpack','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,nr:312}),
  P('Fanny Pack Street',699,'clothing','bags','Adjustable fanny pack','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800','unisex',{sizes:['One Size'],trend:true,nr:189}),
  P('Leather Tote Bag',1799,'clothing','bags','Premium faux leather tote','https://images.unsplash.com/photo-1544816155-12df9643f363?w=800','unisex',{sizes:['One Size'],rating:4.8,nr:145}),
  // ACCESSORIES SUNGLASSES (5)
  P('Retro Round Sunglasses',799,'glasses','sunglasses','Classic round UV400','https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=800','unisex',{sizes:['One Size'],rating:4.3,nr:312}),
  P('Aviator Sunglasses',999,'glasses','sunglasses','Classic aviator metal','https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800','unisex',{sizes:['One Size'],trend:true,nr:423}),
  P('Square Frame Shades',899,'glasses','sunglasses','Bold square acetate','https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,nr:198}),
  P('Cat Eye Sunglasses',699,'glasses','sunglasses','Vintage cat-eye frames','https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800','unisex',{sizes:['One Size'],nr:156}),
  P('Sport Wrap Sunglasses',1199,'glasses','sunglasses','Polarized wraparound','https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=800','unisex',{sizes:['One Size'],isNew:true,rating:4.6,nr:234}),
  // ACCESSORIES BELTS & OTHER (10)
  P('Leather Belt Classic',699,'belt','belts','Full-grain leather belt','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800','unisex',{nr:145}),
  P('Chain Belt Fashion',599,'belt','belts','Gold chain belt','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,nr:234}),
  P('Minimalist Watch',2499,'clothing','watches','Clean minimalist watch','https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,rating:4.8,nr:456}),
  P('Layered Necklace Set',799,'clothing','jewellery','Set of 3 layered necklaces','https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,nr:312}),
  P('Silk Scarf Premium',899,'clothing','scarves','Luxurious silk scarf','https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800','unisex',{sizes:['One Size'],rating:4.6,nr:189}),
  P('Quilted Chain Bag',1499,'clothing','bags','Quilted mini chain bag','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,rating:4.7,nr:178}),
  P('Messenger Bag Pro',1199,'clothing','bags','Spacious messenger bag','https://images.unsplash.com/photo-1544816155-12df9643f363?w=800','unisex',{sizes:['One Size'],nr:267}),
  P('Trucker Mesh Cap',449,'cap','caps','Classic trucker mesh cap','https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800','unisex',{sizes:['One Size'],isNew:true,nr:167}),
  P('Luxury Baseball Cap',799,'cap','caps','Premium leather strap cap','https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800','unisex',{sizes:['One Size'],isNew:true,trend:true,rating:4.6,nr:198}),
  P('Drawstring Gym Bag',499,'clothing','bags','Lightweight drawstring bag','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800','unisex',{sizes:['One Size'],isNew:true,nr:234}),
];

(async () => {
  try {
    await mongoose.connect(MONGO);
    console.log('Connected to MongoDB Atlas');
    await Product.deleteMany({});
    console.log('Cleared existing products');
    await Product.insertMany(products);
    const total = await Product.countDocuments();
    const men = await Product.countDocuments({gender:'men'});
    const women = await Product.countDocuments({gender:'women'});
    const acc = await Product.countDocuments({gender:'unisex'});
    console.log(`Seeded ${total} products: men=${men}, women=${women}, accessories=${acc}`);
    process.exit(0);
  } catch(e) { console.error(e); process.exit(1); }
})();
