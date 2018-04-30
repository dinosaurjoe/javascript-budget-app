

// BUDGET CONTROLLER
var budgetController = (function() {

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
    var DOM = UIController.getDOMstrings();

    var ctrlAddItem = function() {
        // 1. Get input field input data
        var input = UIController.getInput();
        console.log(input);
        // 2. Add the item to the budget controller

        // 3. Add the new item to the user interface

        // 4. Calculate the budget

        // 5. Display the budget on the user interface
    }

    // When user clicks button
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);


    // When user presses return
    document.addEventListener('keypress', function(event) {

        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);






