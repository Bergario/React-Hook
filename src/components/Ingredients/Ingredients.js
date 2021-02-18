import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [addIngredients, setAddIngredients] = useState([]);

  useEffect(() => {
    fetch(
      "https://react-hook-project-c6376-default-rtdb.firebaseio.com/ingredients.json"
    )
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredient = [];
        for (let key in responseData) {
          loadedIngredient.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        setAddIngredients(loadedIngredient);
      });
  }, []);

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
    fetch(
      `https://react-hook-project-c6376-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      { method: "DELETE" }
    ).then((response) => {
      const ingredient = [...addIngredients];
      const result = ingredient.filter((ingredient) => ingredient.id !== id);
      setAddIngredients(result);
    });
  };

  const filteredIngredientsHandler = useCallback(
    (filteredIngredient) => {
      setAddIngredients(filteredIngredient);
    },
    [setAddIngredients]
  );
  console.log(addIngredients);

  return (
    <div className="App">
      <IngredientForm onAddIngredientHandler={addIngredientHandler} />

      <section>
        <Search onLoadedIngredient={filteredIngredientsHandler} />
        <IngredientList
          ingredients={addIngredients}
          onRemoveItem={(id) => removeIngredientHandler(id)}
        />
      </section>
    </div>
  );
};

export default Ingredients;
