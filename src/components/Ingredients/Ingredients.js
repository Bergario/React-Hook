import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [addIngredients, setAddIngredients] = useState([]);

  const addIngredientHandler = (ingredients) => {
    fetch(
      "https://react-hook-project-c6376-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredients),
        headers: { "Content-type": "aplication/json" },
      }
    )
      .then((response) => response.json())
      .then((responseData) => {
        setAddIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredients },
        ]);
      });
  };
  const removeIngredientHandler = (id) => {
    const ingredient = [...addIngredients];
    const result = ingredient.filter((ingredient) => ingredient.id !== id);
    setAddIngredients(result);
  };
  return (
    <div className="App">
      <IngredientForm onAddIngredientHandler={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={addIngredients}
          onRemoveItem={(id) => removeIngredientHandler(id)}
        />
      </section>
    </div>
  );
};

export default Ingredients;
