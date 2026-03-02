/**
 * ChanduFit Body Calculations Engine
 */

const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725
};

/**
 * Calculate BMI
 * @param {number} weight - kg
 * @param {number} height - cm
 */
function calculateBMI(weight, height) {
    const hm = height / 100;
    const bmi = weight / (hm * hm);
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    return { bmi: parseFloat(bmi.toFixed(1)), category };
}

/**
 * Calculate BMR using Mifflin-St Jeor
 * @param {number} weight - kg
 * @param {number} height - cm
 * @param {number} age - years
 * @param {string} gender - 'male' | 'female'
 */
function calculateBMR(weight, height, age, gender) {
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    return parseFloat(bmr.toFixed(0));
}

/**
 * Calculate TDEE
 */
function calculateTDEE(bmr, activityLevel) {
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
    return parseFloat((bmr * multiplier).toFixed(0));
}

/**
 * Calculate target calories based on goal
 */
function calculateTargetCalories(tdee, goal) {
    switch (goal) {
        case 'fat_loss': return tdee - 500;
        case 'muscle_gain': return tdee + 300;
        default: return tdee;
    }
}

/**
 * Calculate macro targets
 * @param {number} weight - kg
 * @param {number} targetCalories
 */
function calculateMacros(weight, targetCalories) {
    const protein = Math.round(weight * 2);        // 2g per kg
    const fats = Math.round(weight * 0.8);         // 0.8g per kg
    const proteinCals = protein * 4;
    const fatCals = fats * 9;
    const remainingCals = targetCalories - proteinCals - fatCals;
    const carbs = Math.max(0, Math.round(remainingCals / 4));
    return { protein, fats, carbs };
}

/**
 * Get age from DOB
 */
function getAge(dob) {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

/**
 * Estimate body fat % (U.S. Navy method approximation via BMI)
 */
function estimateBodyFat(bmi, age, gender) {
    if (gender === 'male') {
        return parseFloat((1.20 * bmi + 0.23 * age - 16.2).toFixed(1));
    } else {
        return parseFloat((1.20 * bmi + 0.23 * age - 5.4).toFixed(1));
    }
}

/**
 * Generate a smart diet plan based on user metrics
 */
function generateDietPlan(weight, goal, budget, targetCalories, macros) {
    const plans = {
        fat_loss: {
            low: {
                breakfast: ['4 Egg whites (scrambled)', '50g Oats with water', '1 Banana'],
                lunch: ['150g Chicken breast (grilled)', '1 cup Dal', '1 cup Brown rice', 'Salad'],
                snack: ['1 Apple', '30g Roasted chana'],
                dinner: ['2 Rotis', '150g Paneer bhurji', '1 cup Curd']
            },
            medium: {
                breakfast: ['4 Whole eggs (boiled)', '50g Oats with milk', '1 Banana', '1 tbsp Peanut butter'],
                lunch: ['200g Chicken breast', '1 cup Dal', '1.5 cups Rice', 'Salad'],
                snack: ['Greek yogurt 150g', '1 Apple'],
                dinner: ['3 Rotis', '150g Paneer curry', '1 cup Curd']
            },
            high: {
                breakfast: ['5 Whole eggs', '75g Oats with milk', '1 Banana', '2 tbsp Peanut butter', 'Whey protein shake'],
                lunch: ['250g Chicken breast', '1 cup Dal', '2 cups Rice', 'Salad'],
                snack: ['Greek yogurt 200g', 'Handful of almonds (20g)'],
                dinner: ['3 Rotis', '200g Chicken curry', '1 cup Curd', 'Salad']
            }
        },
        muscle_gain: {
            low: {
                breakfast: ['5 Whole eggs', '75g Oats', '2 Bananas', '1 tbsp Peanut butter'],
                lunch: ['200g Chicken', '2 cups Rice', '1 cup Dal', 'Salad'],
                snack: ['4 Bananas', '50g Peanut butter', '500ml Milk'],
                dinner: ['4 Rotis', '200g Paneer', '1 cup Dal']
            },
            medium: {
                breakfast: ['5 Whole eggs', '100g Oats', '2 Bananas', '50g Peanut butter', '500ml Milk'],
                lunch: ['250g Chicken', '2.5 cups Rice', '1 cup Dal', 'Salad'],
                snack: ['Greek yogurt 200g', 'Trail mix 50g', '2 Bananas'],
                dinner: ['4 Rotis', '200g Chicken curry', '1 cup Dal', '1 cup Curd']
            },
            high: {
                breakfast: ['5 Whole eggs', '100g Oats', '2 Bananas', 'Whey protein shake', '500ml Milk'],
                lunch: ['300g Chicken breast', '3 cups Rice', '1 cup Dal', 'Salad'],
                snack: ['Whey protein shake', '2 Bananas', '50g Almonds'],
                dinner: ['4 Rotis', '250g Chicken curry', '1 cup Dal', '200g Curd']
            }
        },
        maintain: {
            low: {
                breakfast: ['3 Whole eggs', '50g Oats', '1 Banana'],
                lunch: ['150g Chicken', '1.5 cups Rice', '1 cup Dal', 'Salad'],
                snack: ['1 Apple', '200ml Buttermilk'],
                dinner: ['3 Rotis', '1 cup Dal', '100g Paneer', '1 cup Curd']
            },
            medium: {
                breakfast: ['4 Whole eggs', '50g Oats', '1 Banana', '1 tbsp Peanut butter'],
                lunch: ['200g Chicken', '1.5 cups Rice', '1 cup Dal', 'Salad'],
                snack: ['Greek yogurt 150g', '1 Apple'],
                dinner: ['3 Rotis', '150g Paneer', '1 cup Dal', '1 cup Curd']
            },
            high: {
                breakfast: ['4 Whole eggs', '75g Oats', '2 Bananas', 'Whey protein shake'],
                lunch: ['250g Chicken', '2 cups Rice', '1 cup Dal', 'Salad'],
                snack: ['Greek yogurt 200g', 'Handful almonds'],
                dinner: ['3 Rotis', '200g Chicken', '1 cup Dal', '200g Curd']
            }
        }
    };

    const goalPlan = plans[goal] || plans['maintain'];
    const budgetPlan = goalPlan[budget] || goalPlan['medium'];

    return {
        breakfast: budgetPlan.breakfast,
        lunch: budgetPlan.lunch,
        snack: budgetPlan.snack,
        dinner: budgetPlan.dinner,
        targetCalories,
        macros
    };
}

module.exports = {
    calculateBMI,
    calculateBMR,
    calculateTDEE,
    calculateTargetCalories,
    calculateMacros,
    getAge,
    estimateBodyFat,
    generateDietPlan
};
