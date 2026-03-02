require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Food = require('../models/Food');
const Workout = require('../models/Workout');

const foods = [
    // === INDIAN FOODS ===
    // Grains & Rice
    { name: 'White Rice (cooked)', teluguName: 'అన్నం', region: 'Indian', category: 'Carb', caloriesPer100g: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4 },
    { name: 'Brown Rice (cooked)', teluguName: 'బ్రౌన్ రైస్', region: 'Indian', category: 'Carb', caloriesPer100g: 112, protein: 2.3, carbs: 23, fats: 0.9, fiber: 1.8 },
    { name: 'Roti (Chapati)', teluguName: 'రొట్టె', region: 'Indian', category: 'Carb', caloriesPer100g: 297, protein: 9.2, carbs: 54, fats: 5.5, fiber: 3.1 },
    { name: 'Parotta', teluguName: 'పరోటా', region: 'Indian', category: 'Carb', caloriesPer100g: 326, protein: 7, carbs: 48, fats: 12, fiber: 2 },
    { name: 'Poha (cooked)', teluguName: 'అటుకులు', region: 'Indian', category: 'Carb', caloriesPer100g: 110, protein: 2.1, carbs: 23, fats: 0.4, fiber: 0.5 },
    { name: 'Upma', teluguName: 'ఉప్మా', region: 'Indian', category: 'Carb', caloriesPer100g: 145, protein: 3.2, carbs: 26, fats: 3.5, fiber: 1.2 },
    { name: 'Idli (1 piece ~60g)', teluguName: 'ఇడ్లి', region: 'Indian', category: 'Carb', caloriesPer100g: 65, protein: 2.1, carbs: 13, fats: 0.3, fiber: 0.7 },
    { name: 'Dosa (plain)', teluguName: 'దోస', region: 'Indian', category: 'Carb', caloriesPer100g: 120, protein: 2.8, carbs: 22, fats: 3, fiber: 0.8 },
    { name: 'Masala Dosa', teluguName: 'మసాలా దోస', region: 'Indian', category: 'Carb', caloriesPer100g: 175, protein: 4.5, carbs: 28, fats: 6, fiber: 1.5 },
    { name: 'Uttapam', teluguName: 'ఉత్తపం', region: 'Indian', category: 'Carb', caloriesPer100g: 130, protein: 3.5, carbs: 22, fats: 3, fiber: 1 },
    { name: 'Biryani (chicken)', teluguName: 'బిర్యానీ', region: 'Indian', category: 'Mixed', caloriesPer100g: 185, protein: 9, carbs: 25, fats: 5.5, fiber: 0.8 },
    { name: 'Fried Rice', teluguName: 'ఫ్రైడ్ రైస్', region: 'Indian', category: 'Carb', caloriesPer100g: 170, protein: 4, carbs: 28, fats: 5, fiber: 0.5 },
    { name: 'Wheat Bread (brown)', teluguName: 'గోధుమ బ్రెడ్', region: 'Indian', category: 'Carb', caloriesPer100g: 247, protein: 9, carbs: 46, fats: 3.2, fiber: 4 },
    { name: 'White Bread', teluguName: 'తెల్ల బ్రెడ్', region: 'Indian', category: 'Carb', caloriesPer100g: 265, protein: 8, carbs: 51, fats: 3, fiber: 1.5 },

    // Proteins - Chicken & Meat
    { name: 'Chicken Breast (cooked)', teluguName: 'చికెన్ బ్రెస్ట్', region: 'Indian', category: 'Protein', caloriesPer100g: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0 },
    { name: 'Chicken Leg (cooked)', teluguName: 'చికెన్ లెగ్', region: 'Indian', category: 'Protein', caloriesPer100g: 184, protein: 26, carbs: 0, fats: 8.5, fiber: 0 },
    { name: 'Chicken Curry', teluguName: 'చికెన్ కూర', region: 'Indian', category: 'Protein', caloriesPer100g: 150, protein: 14, carbs: 4, fats: 8, fiber: 0.5 },
    { name: 'Chicken Wings', teluguName: 'చికెన్ వింగ్స్', region: 'Indian', category: 'Protein', caloriesPer100g: 203, protein: 18, carbs: 0, fats: 13, fiber: 0 },
    { name: 'Mutton Curry', teluguName: 'మటన్ కూర', region: 'Indian', category: 'Protein', caloriesPer100g: 225, protein: 17, carbs: 3, fats: 16, fiber: 0.5 },
    { name: 'Egg (whole boiled)', teluguName: 'గుడ్డు', region: 'Indian', category: 'Protein', caloriesPer100g: 155, protein: 13, carbs: 1.1, fats: 11, fiber: 0 },
    { name: 'Egg White (boiled)', teluguName: 'గుడ్డు తెల్లసొన', region: 'Indian', category: 'Protein', caloriesPer100g: 52, protein: 11, carbs: 0.7, fats: 0.17, fiber: 0 },
    { name: 'Egg Bhurji', teluguName: 'గుడ్డు భుర్జీ', region: 'Indian', category: 'Protein', caloriesPer100g: 160, protein: 10, carbs: 2, fats: 12, fiber: 0.5 },
    { name: 'Fish Fry (Rohu)', teluguName: 'చేప వేపుడు', region: 'Indian', category: 'Protein', caloriesPer100g: 180, protein: 20, carbs: 3, fats: 9, fiber: 0 },
    { name: 'Prawn Curry', teluguName: 'రొయ్యల కూర', region: 'Indian', category: 'Protein', caloriesPer100g: 145, protein: 18, carbs: 3, fats: 6, fiber: 0.5 },
    { name: 'Tuna (canned in water)', teluguName: 'టునా', region: 'International', category: 'Protein', caloriesPer100g: 116, protein: 26, carbs: 0, fats: 1, fiber: 0 },

    // Pulses & Legumes
    { name: 'Dal (Toor/Arhar, cooked)', teluguName: 'పప్పు', region: 'Indian', category: 'Protein', caloriesPer100g: 116, protein: 7, carbs: 20, fats: 0.5, fiber: 3.5 },
    { name: 'Chana Dal (cooked)', teluguName: 'సెనగపప్పు', region: 'Indian', category: 'Protein', caloriesPer100g: 164, protein: 9, carbs: 27, fats: 2.7, fiber: 8 },
    { name: 'Rajma (Kidney Beans, cooked)', teluguName: 'రాజ్మా', region: 'Indian', category: 'Protein', caloriesPer100g: 127, protein: 8.7, carbs: 22, fats: 0.5, fiber: 6.4 },
    { name: 'Black Chickpea (Kala Chana, cooked)', teluguName: 'నల్ల శనగ', region: 'Indian', category: 'Protein', caloriesPer100g: 164, protein: 9, carbs: 27, fats: 2.6, fiber: 7 },
    { name: 'White Chickpeas (Chole, cooked)', teluguName: 'శనగలు', region: 'Indian', category: 'Protein', caloriesPer100g: 164, protein: 9, carbs: 27, fats: 2.6, fiber: 7.6 },
    { name: 'Moong Dal (cooked)', teluguName: 'పెసరపప్పు', region: 'Indian', category: 'Protein', caloriesPer100g: 105, protein: 7, carbs: 19, fats: 0.4, fiber: 2 },
    { name: 'Soya Chunks (100g dry)', teluguName: 'సోయా చంక్స్', region: 'Indian', category: 'Protein', caloriesPer100g: 345, protein: 52, carbs: 33, fats: 0.5, fiber: 13 },
    { name: 'Soya Chunks (cooked)', teluguName: 'సోయా చంక్స్ వండి', region: 'Indian', category: 'Protein', caloriesPer100g: 100, protein: 15, carbs: 9, fats: 0.2, fiber: 3 },
    { name: 'Lentils Red (Masoor Dal, cooked)', teluguName: 'మసూర్ పప్పు', region: 'Indian', category: 'Protein', caloriesPer100g: 116, protein: 9, carbs: 20, fats: 0.4, fiber: 8 },

    // Dairy
    { name: 'Whole Milk (cow)', teluguName: 'పాలు', region: 'Indian', category: 'Mixed', caloriesPer100g: 61, protein: 3.2, carbs: 4.8, fats: 3.3, fiber: 0 },
    { name: 'Toned Milk', teluguName: 'తక్కువ కొవ్వు పాలు', region: 'Indian', category: 'Mixed', caloriesPer100g: 44, protein: 3.2, carbs: 4.7, fats: 1.5, fiber: 0 },
    { name: 'Curd / Yogurt (plain)', teluguName: 'పెరుగు', region: 'Indian', category: 'Mixed', caloriesPer100g: 98, protein: 3.5, carbs: 4.7, fats: 6, fiber: 0 },
    { name: 'Low Fat Curd', teluguName: 'తక్కువ కొవ్వు పెరుగు', region: 'Indian', category: 'Protein', caloriesPer100g: 45, protein: 4, carbs: 5, fats: 0.5, fiber: 0 },
    { name: 'Paneer', teluguName: 'పనీర్', region: 'Indian', category: 'Protein', caloriesPer100g: 265, protein: 18, carbs: 1.2, fats: 21, fiber: 0 },
    { name: 'Buttermilk', teluguName: 'మజ్జిగ', region: 'Indian', category: 'Mixed', caloriesPer100g: 40, protein: 3.3, carbs: 4.8, fats: 0.9, fiber: 0 },
    { name: 'Whey Protein (1 scoop = 30g)', teluguName: 'వేప్రోటీన్', region: 'International', category: 'Protein', caloriesPer100g: 350, protein: 80, carbs: 5, fats: 2, fiber: 0 },
    { name: 'Greek Yogurt (plain)', teluguName: 'గ్రీక్ యోగర్ట్', region: 'International', category: 'Protein', caloriesPer100g: 59, protein: 10, carbs: 3.6, fats: 0.4, fiber: 0 },
    { name: 'Cheese (cheddar)', teluguName: 'చీజ్', region: 'International', category: 'Fat', caloriesPer100g: 403, protein: 25, carbs: 1.3, fats: 33, fiber: 0 },

    // Vegetables
    { name: 'Spinach (raw)', teluguName: 'పాలకూర', region: 'Indian', category: 'Vegetable', caloriesPer100g: 23, protein: 2.9, carbs: 3.6, fats: 0.4, fiber: 2.2 },
    { name: 'Broccoli (cooked)', teluguName: 'బ్రోకలీ', region: 'Indian', category: 'Vegetable', caloriesPer100g: 35, protein: 2.4, carbs: 7, fats: 0.4, fiber: 2.6 },
    { name: 'Tomato', teluguName: 'టమాట', region: 'Indian', category: 'Vegetable', caloriesPer100g: 18, protein: 0.9, carbs: 3.9, fats: 0.2, fiber: 1.2 },
    { name: 'Onion', teluguName: 'ఉల్లిపాయ', region: 'Indian', category: 'Vegetable', caloriesPer100g: 40, protein: 1.1, carbs: 9.3, fats: 0.1, fiber: 1.7 },
    { name: 'Carrot', teluguName: 'క్యారెట్', region: 'Indian', category: 'Vegetable', caloriesPer100g: 41, protein: 0.9, carbs: 10, fats: 0.2, fiber: 2.8 },
    { name: 'Sambar', teluguName: 'సాంబార్', region: 'Indian', category: 'Mixed', caloriesPer100g: 60, protein: 3, carbs: 10, fats: 1, fiber: 2 },
    { name: 'Cabbage', teluguName: 'కాబేజీ', region: 'Indian', category: 'Vegetable', caloriesPer100g: 25, protein: 1.3, carbs: 5.8, fats: 0.1, fiber: 2.5 },
    { name: 'Cucumber', teluguName: 'దోసకాయ', region: 'Indian', category: 'Vegetable', caloriesPer100g: 15, protein: 0.6, carbs: 3.6, fats: 0.1, fiber: 0.5 },
    { name: 'Capsicum', teluguName: 'క్యాప్సికం', region: 'Indian', category: 'Vegetable', caloriesPer100g: 31, protein: 1, carbs: 6, fats: 0.3, fiber: 2.1 },
    { name: 'Ladies Finger (Okra)', teluguName: 'బెండకాయ', region: 'Indian', category: 'Vegetable', caloriesPer100g: 33, protein: 1.9, carbs: 7.5, fats: 0.2, fiber: 3.2 },
    { name: 'Brinjal / Eggplant', teluguName: 'వంకాయ', region: 'Indian', category: 'Vegetable', caloriesPer100g: 25, protein: 1, carbs: 6, fats: 0.2, fiber: 3 },
    { name: 'Bitter Gourd', teluguName: 'కాకరకాయ', region: 'Indian', category: 'Vegetable', caloriesPer100g: 17, protein: 1, carbs: 3.7, fats: 0.2, fiber: 2.8 },
    { name: 'Ridge Gourd', teluguName: 'బీరకాయ', region: 'Indian', category: 'Vegetable', caloriesPer100g: 20, protein: 1.2, carbs: 4.4, fats: 0.3, fiber: 1.9 },
    { name: 'Beetroot', teluguName: 'బీట్రూట్', region: 'Indian', category: 'Vegetable', caloriesPer100g: 43, protein: 1.6, carbs: 9.5, fats: 0.2, fiber: 2.8 },
    { name: 'Sweet Potato', teluguName: 'చిలగడదుంప', region: 'Indian', category: 'Carb', caloriesPer100g: 86, protein: 1.6, carbs: 20, fats: 0.1, fiber: 3 },

    // Fruits
    { name: 'Banana', teluguName: 'అరటిపండు', region: 'Indian', category: 'Fruit', caloriesPer100g: 89, protein: 1.1, carbs: 23, fats: 0.3, fiber: 2.6 },
    { name: 'Apple', teluguName: 'ఆపిల్', region: 'Indian', category: 'Fruit', caloriesPer100g: 52, protein: 0.3, carbs: 14, fats: 0.2, fiber: 2.4 },
    { name: 'Mango', teluguName: 'మామిడిపండు', region: 'Indian', category: 'Fruit', caloriesPer100g: 60, protein: 0.8, carbs: 15, fats: 0.4, fiber: 1.6 },
    { name: 'Orange', teluguName: 'నారింజ', region: 'Indian', category: 'Fruit', caloriesPer100g: 47, protein: 0.9, carbs: 12, fats: 0.1, fiber: 2.4 },
    { name: 'Papaya', teluguName: 'బొప్పాయి', region: 'Indian', category: 'Fruit', caloriesPer100g: 43, protein: 0.5, carbs: 11, fats: 0.3, fiber: 1.7 },
    { name: 'Guava', teluguName: 'జామపండు', region: 'Indian', category: 'Fruit', caloriesPer100g: 68, protein: 2.6, carbs: 14, fats: 1, fiber: 5.4 },
    { name: 'Watermelon', teluguName: 'పుచ్చకాయ', region: 'Indian', category: 'Fruit', caloriesPer100g: 30, protein: 0.6, carbs: 7.6, fats: 0.2, fiber: 0.4 },
    { name: 'Pomegranate', teluguName: 'దానిమ్మ', region: 'Indian', category: 'Fruit', caloriesPer100g: 83, protein: 1.7, carbs: 19, fats: 1.2, fiber: 4 },

    // Nuts & Seeds
    { name: 'Peanut Butter', teluguName: 'వేరుశనగ వెన్న', region: 'Indian', category: 'Fat', caloriesPer100g: 588, protein: 25, carbs: 20, fats: 50, fiber: 6 },
    { name: 'Roasted Peanuts', teluguName: 'వేరుశనగ', region: 'Indian', category: 'Fat', caloriesPer100g: 567, protein: 26, carbs: 16, fats: 49, fiber: 8.5 },
    { name: 'Almonds', teluguName: 'బాదాం', region: 'Indian', category: 'Fat', caloriesPer100g: 579, protein: 21, carbs: 22, fats: 50, fiber: 12.5 },
    { name: 'Cashews', teluguName: 'జీడిమామిడి', region: 'Indian', category: 'Fat', caloriesPer100g: 553, protein: 18, carbs: 30, fats: 44, fiber: 3.3 },
    { name: 'Walnuts', teluguName: 'అక్రోట్', region: 'Indian', category: 'Fat', caloriesPer100g: 654, protein: 15, carbs: 14, fats: 65, fiber: 6.7 },
    { name: 'Flaxseeds', teluguName: 'అవిసె గింజలు', region: 'Indian', category: 'Fat', caloriesPer100g: 534, protein: 18, carbs: 29, fats: 42, fiber: 27 },
    { name: 'Chia Seeds', teluguName: 'చియా విత్తనాలు', region: 'International', category: 'Fat', caloriesPer100g: 486, protein: 17, carbs: 42, fats: 31, fiber: 34 },
    { name: 'Sunflower Seeds', teluguName: 'పొద్దుతిరుగుడు గింజలు', region: 'Indian', category: 'Fat', caloriesPer100g: 584, protein: 21, carbs: 20, fats: 51, fiber: 8.6 },

    // Oils & Condiments
    { name: 'Coconut Oil', teluguName: 'కొబ్బరి నూనె', region: 'Indian', category: 'Fat', caloriesPer100g: 862, protein: 0, carbs: 0, fats: 100, fiber: 0 },
    { name: 'Olive Oil', teluguName: 'ఆలివ్ నూనె', region: 'International', category: 'Fat', caloriesPer100g: 884, protein: 0, carbs: 0, fats: 100, fiber: 0 },
    { name: 'Groundnut Oil', teluguName: 'వేరుశనగ నూనె', region: 'Indian', category: 'Fat', caloriesPer100g: 884, protein: 0, carbs: 0, fats: 100, fiber: 0 },
    { name: 'Ghee', teluguName: 'నెయ్యి', region: 'Indian', category: 'Fat', caloriesPer100g: 900, protein: 0.3, carbs: 0, fats: 99.7, fiber: 0 },

    // Snacks
    { name: 'Roasted Chana', teluguName: 'వేయించిన శనగ', region: 'Indian', category: 'Protein', caloriesPer100g: 364, protein: 22, carbs: 57, fats: 5.7, fiber: 17 },
    { name: 'Samosa (1 piece ~70g)', teluguName: 'సమోసా', region: 'Indian', category: 'Mixed', caloriesPer100g: 262, protein: 4.5, carbs: 28, fats: 14, fiber: 2 },
    { name: 'Pakora', teluguName: 'పకోడీ', region: 'Indian', category: 'Mixed', caloriesPer100g: 300, protein: 6, carbs: 32, fats: 16, fiber: 2 },
    { name: 'Vada Pav', teluguName: 'వడా పావ్', region: 'Indian', category: 'Mixed', caloriesPer100g: 280, protein: 7, carbs: 40, fats: 10, fiber: 2 },

    // Beverages
    { name: 'Masala Chai (with milk, no sugar)', teluguName: 'మసాలా టీ', region: 'Indian', category: 'Mixed', caloriesPer100g: 30, protein: 1.5, carbs: 3, fats: 1.5, fiber: 0 },
    { name: 'Black Coffee', teluguName: 'బ్లాక్ కాఫీ', region: 'International', category: 'Mixed', caloriesPer100g: 2, protein: 0.3, carbs: 0, fats: 0, fiber: 0 },
    { name: 'Coconut Water', teluguName: 'కొబ్బరి నీళ్ళు', region: 'Indian', category: 'Mixed', caloriesPer100g: 19, protein: 0.7, carbs: 3.7, fats: 0.2, fiber: 1 },

    // Oats & Cereals
    { name: 'Rolled Oats (raw)', teluguName: 'ఓట్సు', region: 'International', category: 'Carb', caloriesPer100g: 389, protein: 17, carbs: 66, fats: 7, fiber: 10.6 },
    { name: 'Muesli', teluguName: 'ముస్లీ', region: 'International', category: 'Carb', caloriesPer100g: 360, protein: 9, carbs: 67, fats: 7, fiber: 7 },
    { name: 'Cornflakes', teluguName: 'కార్న్‌ఫ్లేక్స్', region: 'International', category: 'Carb', caloriesPer100g: 357, protein: 7, carbs: 84, fats: 0.4, fiber: 1.2 },

    // === INTERNATIONAL FOODS ===
    { name: 'Pasta (cooked)', teluguName: '', region: 'International', category: 'Carb', caloriesPer100g: 158, protein: 5.8, carbs: 31, fats: 0.9, fiber: 1.8 },
    { name: 'Pizza Margherita (slice ~100g)', teluguName: '', region: 'International', category: 'Mixed', caloriesPer100g: 250, protein: 10, carbs: 31, fats: 9, fiber: 1.5 },
    { name: 'Burger (beef patty)', teluguName: '', region: 'International', category: 'Mixed', caloriesPer100g: 295, protein: 17, carbs: 24, fats: 14, fiber: 1.3 },
    { name: 'Sushi (California roll, per piece)', teluguName: '', region: 'International', category: 'Mixed', caloriesPer100g: 93, protein: 3.3, carbs: 16, fats: 1.7, fiber: 0.5 },
    { name: 'Tacos (chicken)', teluguName: '', region: 'International', category: 'Mixed', caloriesPer100g: 195, protein: 12, carbs: 19, fats: 7, fiber: 2 },
    { name: 'Beef Steak (sirloin)', teluguName: '', region: 'International', category: 'Protein', caloriesPer100g: 207, protein: 28, carbs: 0, fats: 10, fiber: 0 },
    { name: 'Salmon (cooked)', teluguName: '', region: 'International', category: 'Protein', caloriesPer100g: 208, protein: 25, carbs: 0, fats: 12, fiber: 0 },
    { name: 'Avocado', teluguName: '', region: 'International', category: 'Fat', caloriesPer100g: 160, protein: 2, carbs: 9, fats: 15, fiber: 6.7 },
    { name: 'Quinoa (cooked)', teluguName: '', region: 'International', category: 'Carb', caloriesPer100g: 120, protein: 4.4, carbs: 21, fats: 1.9, fiber: 2.8 },
    { name: 'Sweet Corn', teluguName: 'మొక్కజొన్న', region: 'Indian', category: 'Carb', caloriesPer100g: 86, protein: 3.2, carbs: 19, fats: 1.2, fiber: 2.7 },
    { name: 'Turkey Breast (roasted)', teluguName: '', region: 'International', category: 'Protein', caloriesPer100g: 135, protein: 30, carbs: 0, fats: 1, fiber: 0 },
    { name: 'Cottage Cheese (low fat)', teluguName: '', region: 'International', category: 'Protein', caloriesPer100g: 72, protein: 12, carbs: 2.7, fats: 1, fiber: 0 },
    { name: 'Peanut Butter (2 tbsp = 32g)', teluguName: '', region: 'International', category: 'Fat', caloriesPer100g: 588, protein: 25, carbs: 20, fats: 50, fiber: 6 },
    { name: 'Dark Chocolate (70%)', teluguName: 'డార్క్ చాక్లెట్', region: 'International', category: 'Fat', caloriesPer100g: 598, protein: 8, carbs: 46, fats: 43, fiber: 11 },
    { name: 'Brown Bread (wholegrain)', teluguName: '', region: 'International', category: 'Carb', caloriesPer100g: 247, protein: 9, carbs: 46, fats: 3.2, fiber: 4 },
    { name: 'Tofu (firm)', teluguName: 'టోఫు', region: 'International', category: 'Protein', caloriesPer100g: 76, protein: 8, carbs: 1.9, fats: 4.8, fiber: 0.3 },
    { name: 'Edamame', teluguName: '', region: 'International', category: 'Protein', caloriesPer100g: 122, protein: 11, carbs: 9, fats: 5, fiber: 5 },
    { name: 'Hummus', teluguName: '', region: 'International', category: 'Mixed', caloriesPer100g: 166, protein: 8, carbs: 14, fats: 10, fiber: 6 },
    { name: 'Protein Bar (avg)', teluguName: 'ప్రోటీన్ బార్', region: 'International', category: 'Protein', caloriesPer100g: 370, protein: 30, carbs: 40, fats: 10, fiber: 5 },
    { name: 'Energy Drink (250ml)', teluguName: '', region: 'International', category: 'Mixed', caloriesPer100g: 45, protein: 0, carbs: 11, fats: 0, fiber: 0 },
    { name: 'Orange Juice (fresh)', teluguName: 'నారింజ రసం', region: 'Indian', category: 'Fruit', caloriesPer100g: 45, protein: 0.7, carbs: 10, fats: 0.2, fiber: 0.2 },
    { name: 'Almond Milk (unsweetened)', teluguName: '', region: 'International', category: 'Mixed', caloriesPer100g: 17, protein: 0.6, carbs: 0.3, fats: 1.5, fiber: 0.3 },
    { name: 'Protein Powder (casein)', teluguName: '', region: 'International', category: 'Protein', caloriesPer100g: 370, protein: 75, carbs: 8, fats: 2, fiber: 0 },
    { name: 'Creatine (5g serving)', teluguName: '', region: 'International', category: 'Protein', caloriesPer100g: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 },
];

const workouts = [
    // Chest
    { name: 'Bench Press (Barbell)', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: 'Barbell + Bench' },
    { name: 'Incline Bench Press', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: 'Barbell + Bench' },
    { name: 'Decline Bench Press', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: 'Barbell + Bench' },
    { name: 'Dumbbell Fly', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Push-up (Standard)', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Wide Push-up', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Cable Fly', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: 'Cable Machine' },
    { name: 'Chest Dip', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: 'Dip Bar' },
    { name: 'Dumbbell Press (Flat)', muscleGroup: 'Chest', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Incline Dumbbell Press', muscleGroup: 'Chest', difficulty: 'Intermediate', equipment: 'Dumbbells' },

    // Back
    { name: 'Pull-up', muscleGroup: 'Back', difficulty: 'Intermediate', equipment: 'Pull-up Bar' },
    { name: 'Chin-up', muscleGroup: 'Back', difficulty: 'Intermediate', equipment: 'Pull-up Bar' },
    { name: 'Lat Pulldown', muscleGroup: 'Back', difficulty: 'Beginner', equipment: 'Cable Machine' },
    { name: 'Seated Cable Row', muscleGroup: 'Back', difficulty: 'Beginner', equipment: 'Cable Machine' },
    { name: 'Bent-over Barbell Row', muscleGroup: 'Back', difficulty: 'Intermediate', equipment: 'Barbell' },
    { name: 'Dumbbell Row (Single Arm)', muscleGroup: 'Back', difficulty: 'Beginner', equipment: 'Dumbbell' },
    { name: 'Deadlift (Conventional)', muscleGroup: 'Back', difficulty: 'Advanced', equipment: 'Barbell' },
    { name: 'Romanian Deadlift', muscleGroup: 'Back', difficulty: 'Intermediate', equipment: 'Barbell' },
    { name: 'T-bar Row', muscleGroup: 'Back', difficulty: 'Intermediate', equipment: 'Barbell' },
    { name: 'Face Pull', muscleGroup: 'Back', difficulty: 'Beginner', equipment: 'Cable Machine' },

    // Legs
    { name: 'Barbell Squat', muscleGroup: 'Legs', difficulty: 'Intermediate', equipment: 'Barbell' },
    { name: 'Front Squat', muscleGroup: 'Legs', difficulty: 'Advanced', equipment: 'Barbell' },
    { name: 'Leg Press', muscleGroup: 'Legs', difficulty: 'Beginner', equipment: 'Leg Press Machine' },
    { name: 'Walking Lunges', muscleGroup: 'Legs', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Dumbbell Lunges', muscleGroup: 'Legs', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Leg Extension', muscleGroup: 'Legs', difficulty: 'Beginner', equipment: 'Leg Extension Machine' },
    { name: 'Leg Curl (Lying)', muscleGroup: 'Legs', difficulty: 'Beginner', equipment: 'Leg Curl Machine' },
    { name: 'Calf Raise (Standing)', muscleGroup: 'Legs', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Hack Squat', muscleGroup: 'Legs', difficulty: 'Intermediate', equipment: 'Machine' },
    { name: 'Sumo Squat', muscleGroup: 'Legs', difficulty: 'Beginner', equipment: 'Barbell / Dumbbell' },

    // Shoulders
    { name: 'Overhead Press (Barbell)', muscleGroup: 'Shoulders', difficulty: 'Intermediate', equipment: 'Barbell' },
    { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Lateral Raise', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Front Raise', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Arnold Press', muscleGroup: 'Shoulders', difficulty: 'Intermediate', equipment: 'Dumbbells' },
    { name: 'Reverse Fly', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Shrugs (Barbell)', muscleGroup: 'Shoulders', difficulty: 'Beginner', equipment: 'Barbell' },
    { name: 'Upright Row', muscleGroup: 'Shoulders', difficulty: 'Intermediate', equipment: 'Barbell' },

    // Arms
    { name: 'Barbell Bicep Curl', muscleGroup: 'Arms', difficulty: 'Beginner', equipment: 'Barbell' },
    { name: 'Dumbbell Curl (Alternating)', muscleGroup: 'Arms', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Hammer Curl', muscleGroup: 'Arms', difficulty: 'Beginner', equipment: 'Dumbbells' },
    { name: 'Preacher Curl', muscleGroup: 'Arms', difficulty: 'Beginner', equipment: 'EZ Bar + Bench' },
    { name: 'Concentration Curl', muscleGroup: 'Arms', difficulty: 'Beginner', equipment: 'Dumbbell' },
    { name: 'Tricep Dips', muscleGroup: 'Arms', difficulty: 'Beginner', equipment: 'Parallel Bars' },
    { name: 'Skull Crushers', muscleGroup: 'Arms', difficulty: 'Intermediate', equipment: 'EZ Bar' },
    { name: 'Cable Tricep Pushdown', muscleGroup: 'Arms', difficulty: 'Beginner', equipment: 'Cable Machine' },
    { name: 'Overhead Tricep Extension', muscleGroup: 'Arms', difficulty: 'Beginner', equipment: 'Dumbbell' },
    { name: 'Close-Grip Bench Press', muscleGroup: 'Arms', difficulty: 'Intermediate', equipment: 'Barbell' },

    // Core
    { name: 'Plank', muscleGroup: 'Core', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Crunches', muscleGroup: 'Core', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Bicycle Crunches', muscleGroup: 'Core', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Leg Raises', muscleGroup: 'Core', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Russian Twists', muscleGroup: 'Core', difficulty: 'Beginner', equipment: 'Bodyweight / Plate' },
    { name: 'Mountain Climbers', muscleGroup: 'Core', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'Ab Wheel Rollout', muscleGroup: 'Core', difficulty: 'Advanced', equipment: 'Ab Wheel' },
    { name: 'Hanging Knee Raise', muscleGroup: 'Core', difficulty: 'Intermediate', equipment: 'Pull-up Bar' },
    { name: 'Side Plank', muscleGroup: 'Core', difficulty: 'Beginner', equipment: 'Bodyweight' },
    { name: 'V-up', muscleGroup: 'Core', difficulty: 'Intermediate', equipment: 'Bodyweight' },

    // Cardio
    { name: 'Running (treadmill/track)', muscleGroup: 'Cardio', difficulty: 'Beginner', equipment: 'None' },
    { name: 'Jump Rope', muscleGroup: 'Cardio', difficulty: 'Beginner', equipment: 'Jump Rope' },
    { name: 'Cycling (stationary)', muscleGroup: 'Cardio', difficulty: 'Beginner', equipment: 'Bike' },
    { name: 'Burpees', muscleGroup: 'Cardio', difficulty: 'Intermediate', equipment: 'Bodyweight' },
    { name: 'Box Jumps', muscleGroup: 'Cardio', difficulty: 'Intermediate', equipment: 'Box' },
    { name: 'Swimming', muscleGroup: 'Cardio', difficulty: 'Beginner', equipment: 'Pool' },
    { name: 'HIIT Sprint (20sec on / 10sec off)', muscleGroup: 'Cardio', difficulty: 'Advanced', equipment: 'None' },
    { name: 'Stair Climbing', muscleGroup: 'Cardio', difficulty: 'Beginner', equipment: 'Stairs' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        // Clear existing data
        await Food.deleteMany({});
        await Workout.deleteMany({});
        console.log('🗑️  Cleared existing foods and workouts');

        // Seed foods
        await Food.insertMany(foods);
        console.log(`✅ Seeded ${foods.length} foods`);

        // Seed workouts
        await Workout.insertMany(workouts);
        console.log(`✅ Seeded ${workouts.length} workouts`);

        console.log('\n🔥 Database seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err.message);
        process.exit(1);
    }
}

seed();
