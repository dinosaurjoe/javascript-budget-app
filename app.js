

// BUDGET CONTROLLER
var budgetController = (function() {

    //Expense function contructor
    var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    //Income function constructor
    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };


    //Object for storing data(Income and Expenses)
    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      // we set this to -1 because at first it is nonexistant
      percentage: -1
    };

    var calculateTotal = function(type) {

        //initial sum is 0
        var sum = 0;

        //using the data object we iterate over the arrays based on the type and add the value
        // to the total sum

        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });

        //store the sums we added from the loop in the total part of the data object
        data.totals[type] = sum;
    };

    return {
      addItem: function(type, des, val) {
        var newItem, ID;

        //[1, 2, 3, 4, 5], next ID = 6
        //[1, 2, 4, 6, 8], next ID = 9
        // ID = last ID + 1

        //Create new ID

        if (data.allItems[type].length > 0) {
          ID = data.allItems[type][data.allItems[type].length -1].id + 1;
        } else {
          ID = 0;
        }

        // Create new item based on 'inc' or 'exp' type
        if (type === 'exp') {
          newItem = new Expense(ID, des, val);

        } else if (type === 'inc') {
          newItem = new Income(ID, des, val);
        }

        // Push it into our data structure
        data.allItems[type].push(newItem);

        // Return the new element
        return newItem;
      },

      calculateBudget: function() {

          // calculate total income and expenses
          calculateTotal('exp');
          calculateTotal('inc');
          // calculate the budget: income - expenses
          data.budget = data.totals.inc - data.totals.exp;
          // calculate the percentage of income that we spent

          if (data.totals.inc > 0 ) {
              data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
          } else {
            data.percentage = -1;
          }
      },

      getBudget: function() {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          };
      },

      testing: function() {
        console.log(data);
      }
    };


})();



// UI CONTROLLER

var UIController = (function() {

    var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputButton: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getInput: function() {
            return {
              // value will be either income or expense based on choice
              type: document.querySelector(DOMstrings.inputType).value,
              // description of what it is
              description: document.querySelector(DOMstrings.inputDescription).value,
              // numerical value of the income or expense
              value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
          var html, newHtml, element;
          // Create html string with placeholder text
          if (type === 'inc') {
              element = DOMstrings.incomeContainer;
              html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          } else if (type === 'exp'){
              element = DOMstrings.expensesContainer;
              html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }
          // Replace the placeholder text with some actual data
          newHtml = html.replace('%id%', obj.id);
          newHtml = newHtml.replace('%description%', obj.description);
          newHtml = newHtml.replace('%value%', obj.value);
          // Insert the HTML into the DOM
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function() {
          var fields, fieldsArr;

          // Select the input description and the input value
          fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

          // Call the input description into the array prototype
          fieldsArr = Array.prototype.slice.call(fields);

          // Iterate over the array and apply an anonymous function to the array to clear the input after it's been called
          fieldsArr.forEach(function(current, index, array) {
              current.value = "";
          });

          fieldsArr[0].focus();
        },

        displayBudget: function(obj) {

          document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
          document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
          document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

          if (obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
          } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
          }
        },

        getDOMstrings: function() {
          return DOMstrings;
        }
    };

})();



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {
      var DOM = UIController.getDOMstrings();
      // When user clicks button
      document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);


      // When user presses return
      document.addEventListener('keypress', function(event) {

          if (event.keyCode === 13 || event.which === 13) {
              ctrlAddItem();
          }
      });
    };

    var updateBudget = function() {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the user interface
        UICtrl.displayBudget(budget);
    };


    var ctrlAddItem = function() {
        var input, newItem;
        // 1. Get input field input data
        input = UIController.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the new item to the user interface
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }

    };


    return {
      init: function() {
        UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
        });
        setUpEventListeners();
      }
    };

})(budgetController, UIController);

controller.init();




