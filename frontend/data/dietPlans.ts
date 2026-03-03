// Budget-based 7-day diet plans
// MUST-HAVES for ALL budgets: Oats, Eggs, Soya Chunks
// Chicken = HIGH budget only, sometimes in MEDIUM

export interface MealItem {
    name: string;
    qty: string;
    cal: number;
    protein: number;
}

export interface DayPlan {
    breakfast: MealItem[];
    lunch: MealItem[];
    snack: MealItem[];
    dinner: MealItem[];
}

export type BudgetType = 'low' | 'medium' | 'high';

// ==================== LOW BUDGET (₹100-150/day) ====================
// No chicken, no whey. Focus: eggs, soya, dal, seasonal veggies, peanuts
const LOW_BUDGET: DayPlan[] = [
    // Day 1 - Monday
    {
        breakfast: [
            { name: 'Oats with Milk', qty: '50g oats + 200ml milk', cal: 270, protein: 12 },
            { name: 'Boiled Eggs', qty: '2 eggs', cal: 140, protein: 12 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Soya Chunks Curry', qty: '50g dry', cal: 170, protein: 26 },
            { name: 'Dal (Toor)', qty: '100g cooked', cal: 116, protein: 9 },
            { name: 'Mixed Vegetables', qty: '100g', cal: 65, protein: 3 },
        ],
        snack: [
            { name: 'Roasted Peanuts', qty: '30g', cal: 170, protein: 7 },
            { name: 'Boiled Egg', qty: '1 egg', cal: 70, protein: 6 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Bhurji', qty: '2 eggs', cal: 180, protein: 13 },
            { name: 'Onion Salad', qty: '1 bowl', cal: 30, protein: 1 },
        ],
    },
    // Day 2 - Tuesday
    {
        breakfast: [
            { name: 'Oats Upma', qty: '60g oats', cal: 240, protein: 10 },
            { name: 'Boiled Eggs', qty: '2 eggs', cal: 140, protein: 12 },
            { name: 'Buttermilk', qty: '200ml', cal: 40, protein: 3 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Soya Keema', qty: '50g dry soya', cal: 170, protein: 26 },
            { name: 'Palak Dal', qty: '100g', cal: 120, protein: 8 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
        ],
        snack: [
            { name: 'Peanut Chikki', qty: '30g', cal: 145, protein: 5 },
            { name: 'Sprouts', qty: '50g', cal: 70, protein: 7 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Soya Chunks Dry', qty: '40g dry', cal: 136, protein: 21 },
            { name: 'Cucumber Raita', qty: '100g', cal: 50, protein: 3 },
        ],
    },
    // Day 3 - Wednesday
    {
        breakfast: [
            { name: 'Oats Porridge with Milk', qty: '50g oats + milk', cal: 270, protein: 12 },
            { name: 'Boiled Eggs', qty: '3 eggs', cal: 210, protein: 18 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Rajma (Kidney Beans)', qty: '100g cooked', cal: 130, protein: 9 },
            { name: 'Soya Chunks Curry', qty: '40g dry', cal: 136, protein: 21 },
            { name: 'Beetroot Salad', qty: '80g', cal: 35, protein: 1 },
        ],
        snack: [
            { name: 'Roasted Chana', qty: '40g', cal: 150, protein: 8 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Curry', qty: '2 eggs', cal: 200, protein: 14 },
            { name: 'Onion Tomato Salad', qty: '1 bowl', cal: 35, protein: 1 },
        ],
    },
    // Day 4 - Thursday
    {
        breakfast: [
            { name: 'Oats Dosa', qty: '2 pieces (60g oats)', cal: 230, protein: 9 },
            { name: 'Boiled Eggs', qty: '2 eggs', cal: 140, protein: 12 },
            { name: 'Coconut Chutney', qty: '30g', cal: 50, protein: 1 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Chana Dal', qty: '100g cooked', cal: 130, protein: 10 },
            { name: 'Soya Chunks Fry', qty: '50g dry', cal: 170, protein: 26 },
            { name: 'Cabbage Poriyal', qty: '80g', cal: 50, protein: 2 },
        ],
        snack: [
            { name: 'Peanut Butter Toast', qty: '1 bread + 20g PB', cal: 200, protein: 8 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Egg Bhurji', qty: '2 eggs', cal: 180, protein: 13 },
            { name: 'Mixed Dal', qty: '80g cooked', cal: 90, protein: 7 },
        ],
    },
    // Day 5 - Friday
    {
        breakfast: [
            { name: 'Oats with Banana', qty: '50g oats + 1 banana', cal: 310, protein: 11 },
            { name: 'Boiled Eggs', qty: '2 eggs', cal: 140, protein: 12 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Soya Biryani', qty: '50g soya + rice', cal: 200, protein: 26 },
            { name: 'Moong Dal', qty: '100g cooked', cal: 105, protein: 7 },
            { name: 'Raita', qty: '100g', cal: 50, protein: 3 },
        ],
        snack: [
            { name: 'Roasted Peanuts', qty: '30g', cal: 170, protein: 7 },
            { name: 'Sprouts Chaat', qty: '60g', cal: 80, protein: 8 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Omelette', qty: '3 eggs', cal: 240, protein: 18 },
            { name: 'Salad', qty: '1 bowl', cal: 30, protein: 1 },
        ],
    },
    // Day 6 - Saturday
    {
        breakfast: [
            { name: 'Oats Cheela', qty: '60g oats', cal: 250, protein: 10 },
            { name: 'Boiled Eggs', qty: '2 eggs', cal: 140, protein: 12 },
            { name: 'Milk', qty: '200ml', cal: 120, protein: 6 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Soya Chunks Masala', qty: '50g dry', cal: 170, protein: 26 },
            { name: 'Sambar', qty: '150ml', cal: 90, protein: 5 },
            { name: 'Carrot Beans Fry', qty: '80g', cal: 55, protein: 2 },
        ],
        snack: [
            { name: 'Boiled Egg', qty: '1 egg', cal: 70, protein: 6 },
            { name: 'Roasted Chana', qty: '30g', cal: 110, protein: 6 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Paneer Bhurji (tofu alt)', qty: '80g', cal: 180, protein: 10 },
            { name: 'Dal Tadka', qty: '100g', cal: 120, protein: 8 },
        ],
    },
    // Day 7 - Sunday
    {
        breakfast: [
            { name: 'Masala Oats', qty: '60g oats', cal: 250, protein: 10 },
            { name: 'Boiled Eggs', qty: '3 eggs', cal: 210, protein: 18 },
            { name: 'Tea with Milk', qty: '1 cup', cal: 50, protein: 2 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Soya Chunks Pulao', qty: '50g soya', cal: 200, protein: 26 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
            { name: 'Mixed Veg Curry', qty: '100g', cal: 80, protein: 3 },
        ],
        snack: [
            { name: 'Peanuts + Jaggery', qty: '30g + 15g', cal: 200, protein: 7 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Curry', qty: '2 eggs', cal: 200, protein: 14 },
            { name: 'Lemon Rice', qty: '100g', cal: 130, protein: 3 },
        ],
    },
];

// ==================== MEDIUM BUDGET (₹200-300/day) ====================
// Chicken 5/7 days, Oats 7/7, Soya Chunks 6/7, Paneer 3/7, 140g+ protein daily
const MEDIUM_BUDGET: DayPlan[] = [
    // Day 1 - Monday 🐔 Chicken + Soya + Paneer | ~148g protein
    {
        breakfast: [
            { name: 'Oats with Milk & Almonds', qty: '50g oats + 200ml milk + 5 almonds', cal: 310, protein: 14 },
            { name: 'Boiled Eggs', qty: '4 eggs', cal: 280, protein: 24 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        lunch: [
            { name: 'Brown Rice', qty: '150g cooked', cal: 170, protein: 4 },
            { name: 'Chicken Curry', qty: '150g', cal: 250, protein: 38 },
            { name: 'Soya Chunks Side', qty: '30g dry', cal: 102, protein: 15 },
            { name: 'Mixed Vegetables', qty: '100g', cal: 65, protein: 3 },
        ],
        snack: [
            { name: 'Roasted Peanuts', qty: '30g', cal: 170, protein: 7 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Paneer Bhurji', qty: '100g paneer', cal: 260, protein: 18 },
            { name: 'Egg Bhurji', qty: '2 eggs', cal: 180, protein: 13 },
            { name: 'Salad', qty: '1 bowl', cal: 40, protein: 1 },
        ],
    },
    // Day 2 - Tuesday 🐔 Chicken + Soya | ~152g protein
    {
        breakfast: [
            { name: 'Masala Oats', qty: '60g oats + veggies', cal: 260, protein: 10 },
            { name: 'Boiled Eggs', qty: '4 eggs', cal: 280, protein: 24 },
            { name: 'Milk', qty: '200ml', cal: 120, protein: 6 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Chicken Breast Grilled', qty: '150g', cal: 248, protein: 46 },
            { name: 'Dal Fry', qty: '100g cooked', cal: 130, protein: 9 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
        ],
        snack: [
            { name: 'Soya Chunks Dry Fry', qty: '40g dry', cal: 136, protein: 21 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Curry', qty: '2 eggs', cal: 200, protein: 14 },
            { name: 'Cucumber Raita', qty: '100g', cal: 50, protein: 3 },
        ],
    },
    // Day 3 - Wednesday (No Chicken) + Soya + Paneer | ~146g protein
    {
        breakfast: [
            { name: 'Oats Porridge with Milk', qty: '50g oats + 200ml milk', cal: 270, protein: 12 },
            { name: 'Boiled Eggs', qty: '4 eggs', cal: 280, protein: 24 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Soya Chunks Curry', qty: '60g dry', cal: 204, protein: 32 },
            { name: 'Rajma (Kidney Beans)', qty: '100g cooked', cal: 130, protein: 9 },
            { name: 'Salad', qty: '1 bowl', cal: 40, protein: 2 },
        ],
        snack: [
            { name: 'Peanut Butter Toast', qty: '2 bread + 25g PB', cal: 280, protein: 12 },
            { name: 'Orange', qty: '1 medium', cal: 62, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Paneer Tikka', qty: '120g paneer', cal: 300, protein: 22 },
            { name: 'Egg Omelette', qty: '2 eggs', cal: 160, protein: 12 },
            { name: 'Dal Tadka', qty: '80g', cal: 90, protein: 7 },
        ],
    },
    // Day 4 - Thursday 🐔 Chicken + Soya | ~155g protein
    {
        breakfast: [
            { name: 'Oats Upma', qty: '60g oats + veggies', cal: 260, protein: 10 },
            { name: 'Boiled Eggs', qty: '4 eggs', cal: 280, protein: 24 },
            { name: 'Buttermilk', qty: '200ml', cal: 40, protein: 3 },
        ],
        lunch: [
            { name: 'Brown Rice', qty: '150g cooked', cal: 170, protein: 4 },
            { name: 'Chicken Breast Grilled', qty: '180g', cal: 298, protein: 55 },
            { name: 'Soya Chunks Side', qty: '30g dry', cal: 102, protein: 15 },
            { name: 'Mixed Veg', qty: '100g', cal: 65, protein: 3 },
        ],
        snack: [
            { name: 'Roasted Peanuts', qty: '40g', cal: 225, protein: 10 },
            { name: 'Apple', qty: '1 medium', cal: 95, protein: 0 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Egg Bhurji', qty: '3 eggs', cal: 270, protein: 19 },
            { name: 'Dal Fry', qty: '100g', cal: 130, protein: 9 },
        ],
    },
    // Day 5 - Friday (No Chicken) + Soya + Paneer | ~143g protein
    {
        breakfast: [
            { name: 'Oats with Banana & Honey', qty: '50g oats + banana + milk', cal: 330, protein: 12 },
            { name: 'Boiled Eggs', qty: '4 eggs', cal: 280, protein: 24 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Soya Chunks Biryani', qty: '60g dry soya', cal: 240, protein: 32 },
            { name: 'Raita', qty: '100g', cal: 50, protein: 3 },
            { name: 'Sprouts Salad', qty: '60g', cal: 80, protein: 8 },
        ],
        snack: [
            { name: 'Roasted Chana', qty: '40g', cal: 150, protein: 8 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Paneer Curry', qty: '100g paneer', cal: 260, protein: 18 },
            { name: 'Egg Curry', qty: '2 eggs', cal: 200, protein: 14 },
            { name: 'Green Salad', qty: '1 bowl', cal: 40, protein: 2 },
        ],
    },
    // Day 6 - Saturday 🐔 Chicken + Soya | ~156g protein
    {
        breakfast: [
            { name: 'Oats Cheela', qty: '60g oats', cal: 250, protein: 10 },
            { name: 'Boiled Eggs', qty: '4 eggs', cal: 280, protein: 24 },
            { name: 'Milk', qty: '200ml', cal: 120, protein: 6 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Chicken Biryani', qty: '150g chicken + rice', cal: 380, protein: 38 },
            { name: 'Soya Chunks Dry', qty: '30g dry', cal: 102, protein: 15 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
        ],
        snack: [
            { name: 'Peanuts + Sprouts', qty: '30g + 50g', cal: 240, protein: 14 },
            { name: 'Apple', qty: '1 medium', cal: 95, protein: 0 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Chicken Tikka', qty: '100g', cal: 165, protein: 30 },
            { name: 'Onion Salad', qty: '1 bowl', cal: 30, protein: 1 },
        ],
    },
    // Day 7 - Sunday 🐔 Chicken + Soya | ~148g protein
    {
        breakfast: [
            { name: 'Oats Pancake with Egg', qty: '60g oats + 1 egg', cal: 310, protein: 15 },
            { name: 'Boiled Eggs', qty: '3 eggs', cal: 210, protein: 18 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Chicken Curry', qty: '150g', cal: 250, protein: 38 },
            { name: 'Soya Chunks Masala', qty: '40g dry', cal: 136, protein: 21 },
            { name: 'Mixed Veg', qty: '100g', cal: 65, protein: 3 },
        ],
        snack: [
            { name: 'Roasted Peanuts', qty: '30g', cal: 170, protein: 7 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Omelette', qty: '3 eggs', cal: 240, protein: 19 },
            { name: 'Dal Fry', qty: '100g', cal: 130, protein: 9 },
        ],
    },
];

// ==================== HIGH BUDGET (₹400+/day) ====================
// Chicken daily, whey-free but more chicken/eggs, dry fruits, paneer, fruits
const HIGH_BUDGET: DayPlan[] = [
    // Day 1 - Monday
    {
        breakfast: [
            { name: 'Oats with Milk & Dry Fruits', qty: '50g oats + almonds + walnuts', cal: 380, protein: 16 },
            { name: 'Boiled Eggs', qty: '4 eggs', cal: 280, protein: 24 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        lunch: [
            { name: 'Brown Rice', qty: '150g cooked', cal: 170, protein: 4 },
            { name: 'Chicken Breast Grilled', qty: '200g', cal: 330, protein: 62 },
            { name: 'Soya Chunks Side', qty: '30g dry', cal: 102, protein: 15 },
            { name: 'Mixed Salad', qty: '1 bowl', cal: 60, protein: 3 },
        ],
        snack: [
            { name: 'Peanuts + Almonds', qty: '40g mixed', cal: 230, protein: 9 },
            { name: 'Apple', qty: '1 medium', cal: 95, protein: 0 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Chicken Tikka', qty: '150g', cal: 250, protein: 45 },
            { name: 'Green Salad', qty: '1 bowl', cal: 40, protein: 2 },
        ],
    },
    // Day 2 - Tuesday
    {
        breakfast: [
            { name: 'Oats Smoothy', qty: '50g oats + banana + milk', cal: 350, protein: 14 },
            { name: 'Boiled Eggs', qty: '3 eggs', cal: 210, protein: 18 },
            { name: 'Dates', qty: '3 pieces', cal: 70, protein: 1 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Chicken Curry', qty: '180g', cal: 300, protein: 45 },
            { name: 'Dal Fry', qty: '100g', cal: 130, protein: 9 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
        ],
        snack: [
            { name: 'Soya Chunks Dry Snack', qty: '40g dry', cal: 136, protein: 21 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Omelette', qty: '3 eggs + veggies', cal: 270, protein: 19 },
            { name: 'Paneer Side', qty: '50g', cal: 130, protein: 9 },
        ],
    },
    // Day 3 - Wednesday
    {
        breakfast: [
            { name: 'Masala Oats + Egg', qty: '60g oats + 1 egg', cal: 310, protein: 15 },
            { name: 'Boiled Eggs', qty: '3 eggs', cal: 210, protein: 18 },
            { name: 'Orange Juice', qty: '200ml', cal: 90, protein: 1 },
        ],
        lunch: [
            { name: 'Brown Rice', qty: '150g cooked', cal: 170, protein: 4 },
            { name: 'Chicken Biryani', qty: '180g chicken + rice', cal: 420, protein: 42 },
            { name: 'Soya Chunks Raita', qty: '30g soya + curd', cal: 120, protein: 18 },
        ],
        snack: [
            { name: 'Mixed Nuts', qty: '40g', cal: 240, protein: 8 },
            { name: 'Apple', qty: '1 medium', cal: 95, protein: 0 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Chicken Breast Grilled', qty: '150g', cal: 248, protein: 46 },
            { name: 'Salad', qty: '1 bowl', cal: 50, protein: 2 },
        ],
    },
    // Day 4 - Thursday
    {
        breakfast: [
            { name: 'Oats with Milk & Almonds', qty: '50g oats + milk + almonds', cal: 340, protein: 15 },
            { name: 'Boiled Eggs', qty: '4 eggs', cal: 280, protein: 24 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Chicken Keema', qty: '180g', cal: 320, protein: 42 },
            { name: 'Soya Chunks Curry', qty: '40g dry', cal: 136, protein: 21 },
            { name: 'Mixed Veg', qty: '100g', cal: 65, protein: 3 },
        ],
        snack: [
            { name: 'Peanut Butter + Bread', qty: '2 bread + 30g PB', cal: 300, protein: 12 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Curry', qty: '3 eggs', cal: 300, protein: 21 },
            { name: 'Paneer Salad', qty: '50g paneer + salad', cal: 140, protein: 10 },
        ],
    },
    // Day 5 - Friday
    {
        breakfast: [
            { name: 'Oats Pancake', qty: '60g oats + 2 eggs', cal: 340, protein: 18 },
            { name: 'Boiled Eggs', qty: '2 eggs', cal: 140, protein: 12 },
            { name: 'Banana + Honey', qty: '1 banana + drizzle', cal: 130, protein: 1 },
        ],
        lunch: [
            { name: 'Brown Rice', qty: '150g cooked', cal: 170, protein: 4 },
            { name: 'Chicken Breast Tandoori', qty: '200g', cal: 330, protein: 62 },
            { name: 'Dal Makhani', qty: '100g', cal: 150, protein: 8 },
            { name: 'Salad', qty: '1 bowl', cal: 40, protein: 2 },
        ],
        snack: [
            { name: 'Soya Chunks Dry Fry', qty: '40g dry', cal: 136, protein: 21 },
            { name: 'Mixed Fruits', qty: '1 bowl', cal: 100, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Chicken Tikka Masala', qty: '150g', cal: 280, protein: 38 },
            { name: 'Raita', qty: '100g', cal: 50, protein: 3 },
        ],
    },
    // Day 6 - Saturday
    {
        breakfast: [
            { name: 'Oats with Banana & Dry Fruits', qty: '50g oats + banana + nuts', cal: 400, protein: 15 },
            { name: 'Boiled Eggs', qty: '3 eggs', cal: 210, protein: 18 },
            { name: 'Milk', qty: '200ml', cal: 120, protein: 6 },
        ],
        lunch: [
            { name: 'Rice', qty: '200g cooked', cal: 260, protein: 5 },
            { name: 'Chicken Curry', qty: '180g', cal: 300, protein: 45 },
            { name: 'Soya Chunks Side', qty: '30g dry', cal: 102, protein: 15 },
            { name: 'Curd', qty: '100g', cal: 60, protein: 4 },
        ],
        snack: [
            { name: 'Almonds + Cashews', qty: '30g', cal: 180, protein: 6 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '3 pieces', cal: 315, protein: 9 },
            { name: 'Egg Bhurji', qty: '3 eggs', cal: 270, protein: 19 },
            { name: 'Paneer Tikka', qty: '60g', cal: 160, protein: 11 },
        ],
    },
    // Day 7 - Sunday
    {
        breakfast: [
            { name: 'Masala Oats + Boiled Egg', qty: '60g oats + 1 egg', cal: 310, protein: 15 },
            { name: 'Boiled Eggs', qty: '3 eggs', cal: 210, protein: 18 },
            { name: 'Apple + Dates', qty: '1 apple + 2 dates', cal: 140, protein: 1 },
        ],
        lunch: [
            { name: 'Chicken Biryani', qty: '200g chicken + rice', cal: 480, protein: 48 },
            { name: 'Soya Chunks Curry', qty: '40g dry', cal: 136, protein: 21 },
            { name: 'Raita', qty: '100g', cal: 50, protein: 3 },
        ],
        snack: [
            { name: 'Mixed Dry Fruits', qty: '40g', cal: 210, protein: 6 },
            { name: 'Banana', qty: '1 medium', cal: 105, protein: 1 },
        ],
        dinner: [
            { name: 'Chapati', qty: '2 pieces', cal: 210, protein: 6 },
            { name: 'Chicken Breast Grilled', qty: '150g', cal: 248, protein: 46 },
            { name: 'Green Salad', qty: '1 bowl', cal: 40, protein: 2 },
            { name: 'Egg Boiled', qty: '1 egg', cal: 70, protein: 6 },
        ],
    },
];

export const DIET_PLANS: Record<BudgetType, DayPlan[]> = {
    low: LOW_BUDGET,
    medium: MEDIUM_BUDGET,
    high: HIGH_BUDGET,
};

export const BUDGET_LABELS: Record<BudgetType, { label: string; emoji: string; desc: string; color: string }> = {
    low: { label: 'Low Budget', emoji: '💚', desc: '₹100-150/day • Eggs, Soya, Dal, Peanuts', color: '#10b981' },
    medium: { label: 'Medium Budget', emoji: '💛', desc: '₹200-300/day • Chicken 5x/week + Paneer 3x + 140g+ protein', color: '#f59e0b' },
    high: { label: 'High Budget', emoji: '🔥', desc: '₹400+/day • Chicken daily + Dry Fruits', color: '#ef4444' },
};

// Get diet plan for today based on budget
export const getTodayPlan = (budget: BudgetType): DayPlan => {
    const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
    const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Mon=0, Tue=1...Sun=6
    return DIET_PLANS[budget][idx];
};

// Get base (unscaled) plan for a specific date
export const getBasePlanForDate = (budget: BudgetType, date: Date): DayPlan => {
    const dayOfWeek = date.getDay();
    const idx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    return DIET_PLANS[budget][idx];
};

// ==================== DYNAMIC SCALING ====================
// Adjusts portions based on user's target calories & protein
// A 60kg person gets smaller portions than a 90kg person

export interface UserMetrics {
    targetCalories: number;   // from backend TDEE calculation
    proteinTarget: number;    // grams (weight * 2)
    weight: number;           // kg
    goal: string;             // fat_loss | muscle_gain | maintain
}

// Scale a single item proportionally
const scaleItem = (item: MealItem, calFactor: number, proFactor: number): MealItem => {
    // Blend 60% calorie-based scaling + 40% protein-based scaling for balanced portions
    const blendedFactor = calFactor * 0.6 + proFactor * 0.4;
    // Clamp between 0.6x and 1.6x to avoid extremes
    const factor = Math.max(0.6, Math.min(1.6, blendedFactor));

    // Scale qty description with the factor
    const scaledCal = Math.round(item.cal * factor);
    const scaledProtein = Math.round(item.protein * factor);

    // Adjust quantity text to reflect actual portion
    let scaledQty = item.qty;
    // Try to extract and scale numeric values in qty
    const numMatch = item.qty.match(/^(\d+\.?\d*)(.*)/);
    if (numMatch) {
        const origNum = parseFloat(numMatch[1]);
        const scaledNum = Math.round(origNum * factor);
        scaledQty = `${scaledNum}${numMatch[2]}`;
    }

    return { name: item.name, qty: scaledQty, cal: scaledCal, protein: scaledProtein };
};

// Scale an entire day's plan to match user's targets
export const scalePlan = (basePlan: DayPlan, metrics: UserMetrics): DayPlan => {
    // Calculate base plan totals
    const allItems = [...basePlan.breakfast, ...basePlan.lunch, ...basePlan.snack, ...basePlan.dinner];
    const baseCal = allItems.reduce((s, i) => s + i.cal, 0);
    const basePro = allItems.reduce((s, i) => s + i.protein, 0);

    // Scaling factors
    const calFactor = metrics.targetCalories / baseCal;
    const proFactor = metrics.proteinTarget / basePro;

    // Scale each meal
    return {
        breakfast: basePlan.breakfast.map(item => scaleItem(item, calFactor, proFactor)),
        lunch: basePlan.lunch.map(item => scaleItem(item, calFactor, proFactor)),
        snack: basePlan.snack.map(item => scaleItem(item, calFactor, proFactor)),
        dinner: basePlan.dinner.map(item => scaleItem(item, calFactor, proFactor)),
    };
};

// Get scaled plan for a date — THE MAIN FUNCTION to use
export const getPlanForDate = (budget: BudgetType, date: Date, metrics?: UserMetrics | null): DayPlan => {
    const base = getBasePlanForDate(budget, date);
    if (metrics && metrics.targetCalories > 0 && metrics.proteinTarget > 0) {
        return scalePlan(base, metrics);
    }
    return base; // fallback: return unscaled if no metrics
};
