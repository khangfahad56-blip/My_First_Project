let selectedFood = null;
const today = new Date().toISOString().split('T')[0];

// Load dashboard on start
document.addEventListener('DOMContentLoaded', loadDashboard);

async function loadDashboard() {
    try {
        const mealsRes = await fetch(`/api/meals/${today}`);
        const meals = await mealsRes.json();
        
        const trackingRes = await fetch(`/api/tracking/${today}`);
        const tracking = await trackingRes.json();
        
        const totals = meals.reduce((acc, m) => {
            acc.calories += m.calories || 0;
            acc.protein += m.protein || 0;
            acc.carbs += m.carbs || 0;
            acc.fat += m.fat || 0;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
        
        document.getElementById('today-calories').textContent = Math.round(totals.calories);
        document.getElementById('today-protein').textContent = Math.round(totals.protein) + 'g';
        document.getElementById('today-carbs').textContent = Math.round(totals.carbs) + 'g';
        document.getElementById('today-fat').textContent = Math.round(totals.fat) + 'g';
        
        if (tracking) {
            document.getElementById('water-count').textContent = tracking.water_intake || 0;
        }
        
        loadMeals();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function searchFoods() {
    const query = document.getElementById('food-search').value;
    if (query.length < 2) {
        document.getElementById('food-suggestions').classList.add('hidden');
        return;
    }
    
    const res = await fetch(`/api/foods?search=${query}`);
    const foods = await res.json();
    
    const div = document.getElementById('food-suggestions');
    div.innerHTML = foods.map(f => `
        <div onclick="selectFood(${f.id}, '${f.name}', ${f.calories}, ${f.protein}, ${f.carbs}, ${f.fat})" 
             class="p-2 hover:bg-blue-50 cursor-pointer rounded">
            <p class="font-medium">${f.name}</p>
            <p class="text-sm text-gray-500">${f.calories} kcal | P:${f.protein}g C:${f.carbs}g F:${f.fat}g</p>
        </div>
    `).join('');
    div.classList.remove('hidden');
}

function selectFood(id, name, calories, protein, carbs, fat) {
    selectedFood = { id, name, calories, protein, carbs, fat };
    document.getElementById('food-search').value = name;
    document.getElementById('food-suggestions').classList.add('hidden');
    
    const info = document.getElementById('selected-food-info');
    info.innerHTML = `
        <p class="font-bold">${name}</p>
        <p class="text-sm">Per serving: ${calories} kcal | P:${protein}g | C:${carbs}g | F:${fat}g</p>
    `;
    info.classList.remove('hidden');
}

async function addMeal() {
    if (!selectedFood) { alert('Please select a food first'); return; }
    
    const quantity = parseFloat(document.getElementById('food-quantity').value) || 1;
    const mealType = document.getElementById('meal-type').value;
    
    const meal = {
        date: today,
        meal_type: mealType,
        food_id: selectedFood.id,
        food_name: selectedFood.name,
        quantity,
        calories: selectedFood.calories * quantity,
        protein: selectedFood.protein * quantity,
        carbs: selectedFood.carbs * quantity,
        fat: selectedFood.fat * quantity,
        fiber: 0, sugar: 0, sodium: 0, potassium: 0
    };
    
    await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meal)
    });
    
    selectedFood = null;
    document.getElementById('food-search').value = '';
    document.getElementById('food-quantity').value = 1;
    document.getElementById('selected-food-info').classList.add('hidden');
    
    loadDashboard();
}

async function loadMeals() {
    const res = await fetch(`/api/meals/${today}`);
    const meals = await res.json();
    
    const div = document.getElementById('meals-list');
    
    if (meals.length === 0) {
        div.innerHTML = '<p class="text-gray-500 text-center py-8">No meals added yet</p>';
        return;
    }
    
    const grouped = {};
    meals.forEach(m => {
        if (!grouped[m.meal_type]) grouped[m.meal_type] = [];
        grouped[m.meal_type].push(m);
    });
    
    div.innerHTML = Object.entries(grouped).map(([type, meals]) => `
        <div class="mb-4">
            <h3 class="font-bold text-lg capitalize mb-2">${type}</h3>
            ${meals.map(m => `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2">
                    <div>
                        <p class="font-medium">${m.food_name}</p>
                        <p class="text-sm text-gray-500">${m.quantity} serving(s)</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-blue-600">${Math.round(m.calories)} kcal</p>
                        <button onclick="deleteMeal(${m.id})" class="text-red-500 text-sm">🗑️</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

async function deleteMeal(id) {
    if (!confirm('Delete this meal?')) return;
    await fetch(`/api/meals/${id}`, { method: 'DELETE' });
    loadDashboard();
}

async function addWater(amount) {
    let res = await fetch(`/api/tracking/${today}`);
    let tracking = await res.json();
    
    if (!tracking.date) tracking = { date: today, water_intake: 0 };
    tracking.water_intake = Math.max(0, (tracking.water_intake || 0) + amount);
    
    await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tracking)
    });
    
    document.getElementById('water-count').textContent = tracking.water_intake;
}

function calculateNutrition() {
    const gender = document.getElementById('calc-gender').value;
    const age = parseInt(document.getElementById('calc-age').value);
    const height = parseFloat(document.getElementById('calc-height').value);
    const weight = parseFloat(document.getElementById('calc-weight').value);
    
    let bmr = gender === 'male' ? 
        10 * weight + 6.25 * height - 5 * age + 5 :
        10 * weight + 6.25 * height - 5 * age - 161;
    
    const tdee = bmr * 1.55;
    const bmi = weight / ((height / 100) ** 2);
    const protein = weight * 2;
    const fat = weight * 0.8;
    const carbs = (tdee - protein * 4 - fat * 9) / 4;
    
    const div = document.getElementById('calc-results');
    div.innerHTML = `
        <p><strong>BMR:</strong> ${Math.round(bmr)} kcal</p>
        <p><strong>TDEE:</strong> ${Math.round(tdee)} kcal</p>
        <p><strong>BMI:</strong> ${bmi.toFixed(1)}</p>
        <p><strong>Protein:</strong> ${Math.round(protein)}g</p>
        <p><strong>Carbs:</strong> ${Math.round(carbs)}g</p>
        <p><strong>Fat:</strong> ${Math.round(fat)}g</p>
    `;
    div.classList.remove('hidden');
}