//Get HTML elements and assign to variables
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

//Set the default state for isError to false
let isError = false;

//Function to clean input string by removing +, - and whitespace characters with an empty string
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

//Function to check if input string is in invalid scientific notation format (e.g. 1e10, 2E5)
//\d+ matches one or more digits
//e matches the character 'e' (case insensitive due to the 'i' flag)
//\d+ matches one or more digits again
//i is the case insensitive flag, so it matches both 'e' and 'E'
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

//Creates a function to add entries
function addEntry() {

  //Find the specific container for the currently selected category so that new input fields can be added to it dynamically
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);

  //Counts how many text inputs already exist in the target container and adds 1 to determine the new entry number
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;

  //Creates a reusable chunk of HTML for a new entry - with unique labels and inputs based on the selected
  //category and next entry number
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;

  //Takes the input fields and adds them to the correct section of the web paige so they appear instantly without
  //refreshing or reloading
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

//Function to calculate calories. (e) stands for event.
function calculateCalories(e) {

  //Prevents the default form submission behavior
  e.preventDefault();

  //Reset isError to false at the start of each calculation
  isError = false;

  //Assign all number inputs to variables
  const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
  const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
  const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
  const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
  const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

  //Calculate calories for each category by calling getCaloriesFromInputs function
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  //If any input was invalid, exit the function early
  if (isError) {
    return;
  }

  //Calculate total consumed calories, remaining calories, and determine if there's a surplus or deficit
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

  //Display the results in the output section with appropriate formatting
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  //Make the output section visible
  output.classList.remove('hide');
}

//Run a function to get calories from a list of input elements
function getCaloriesFromInputs(list) {

  //Initialize calories to 0
  let calories = 0;

  //Loop through each input element in the list
  for (const item of list) {

    //Normalize the input value by cleaning it
    const currVal = cleanInputString(item.value);

    //Check if the cleaned input is invalid
    const invalidInputMatch = isInvalidInput(currVal);

    //If the input is invalid, show an alert, set isError to true, and exit the function early.
    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }

    //Add the numeric value of the cleaned input to the total calories
    calories += Number(currVal);
  }

  //Return the total calories calculated from the input elements
  return calories;
}

//Function to clear the form
function clearForm() {

  //Select all input containers and convert to an array for easier manipulation
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  //Clear the inner HTML of each input container to remove all dynamically added entries
  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  //Reset the budget input and output section to their default states
  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

//Add event listeners to buttons
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);