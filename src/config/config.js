var days = [
  {
    name : 'Sunday',
    difficulty : 'easy',
    eat_out : false,
    id : 0
  },
  {
    name : 'Monday',
    difficulty : 'easy',
    eat_out : false,
    id : 1
  }, 
  {
    name : 'Tuesday',
    difficulty : 'easy',
    eat_out : false,
    id : 2
  },
  {
    name : 'Wednesday',
    difficulty : 'easy',
    eat_out : false,
    id : 3
  },
  {
    name : 'Thursday',
    difficulty : 'medium',
    eat_out : false,
    id : 4
  }, 
  {
    name : 'Friday',
    difficulty : 'hard',
    eat_out : true,
    id : 5
  },
  {
    name : 'Saturday',
    difficulty : 'hard',
    eat_out : true,
    id : 6
  }
];

var difficulties = [
  {
    name : 'Freezer',
    value : 'freezer',
    rank : 0
  },
  {
    name : 'Easy',
    value : 'easy', 
    rank : 1
  },
  {
    name : 'Medium', 
    value : 'medium',
    rank : 2
  },
  {
    name : 'Hard', 
    value : 'hard',
    rank : 3
  }
];

var mealTypes = [
  {
    name : 'Meal',
    value : 'meal'
  },
  {
    name : 'Side',
    value : 'side'
  },
  {
    name : 'Pseudo',
    value : 'pseudo'
  }
];

var pseudoMeals = [
  {
    _id : '000000000000000000001000',
    name : 'Eat Out', 
    description : 'Have a nice meal out',
    type : 'pseudo'
  },
  {
    _id : '000000000000000000001001',
    name : 'Left Overs',
    description : 'Left overs from previous meal',
    type : 'pseudo'
  }
];

var selectionParameters = {
  eat_out : 0.20,
  use_perferred_day : 0.50,
  use_perferred_side : 0.40
};

module.exports = {
  days : days,
  difficulties : difficulties,
  mealTypes : mealTypes,
  pseudoMeals : pseudoMeals,
  selectionParameters : selectionParameters,
  eatOutMeal : pseudoMeals[0],
  leftOverMeal : pseudoMeals[1]
};
