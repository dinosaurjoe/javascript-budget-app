

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
      }
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
      inputButton: '.add__btn'
    };

    return {
        getInput: function() {
            return {
              // value will be either income or expense based on choice
              type: document.querySelector(DOMstrings.inputType).value,
              // description of what it is
              description: document.querySelector(DOMstrings.inputDescription).value,
              // numerical value of the income or expense
              value: document.querySelector(DOMstrings.inputValue).value
            };
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

    var ctrlAddItem = function() {
        var input, newItem;
        // 1. Get input field input data
        input = UIController.getInput();
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the new item to the user interface

        // 4. Calculate the budget

        // 5. Display the budget on the user interface
    };


    return {
      init: function() {
        setUpEventListeners();
      }
    };

})(budgetController, UIController);

controller.init();




