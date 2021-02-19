import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

const Ingredients = () => {
  const [addIngredients, setAddIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

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
    setIsLoading(true);
    fetch(
      "https://react-hook-project-c6376-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredients),
        headers: { "Content-type": "aplication/json" },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((responseData) => {
        setAddIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredients },
        ]);
      });
  };
  const removeIngredientHandler = (id) => {
    setIsLoading(true);
    fetch(
      `https://react-hook-project-c6376-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      { method: "DELETE" }
    )
      .then((response) => {
        const ingredient = [...addIngredients];
        const result = ingredient.filter((ingredient) => ingredient.id !== id);
        setAddIngredients(result);
        setIsLoading(false);
      })
      .catch((error) => setError("Something went wrong!"));
  };

  const filteredIngredientsHandler = useCallback(
    (filteredIngredient) => {
      setAddIngredients(filteredIngredient);
    },
    [setAddIngredients]
  );

  const closeModalErrorHanlder = () => {
    setError(null);
    setIsLoading(false);
  };
  return (
    <div className="App">
      {error && (
        <ErrorModal onClose={closeModalErrorHanlder}>{error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredientHandler={addIngredientHandler}
        loading={isLoading}
      />

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
