import { useEffect, useState } from "react";

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export default function DashBoard(){
  const [foods, setFoods] = useState<FoodProps[]>([]);
  const [editingFood, setEditingFood] = useState<FoodProps>({} as FoodProps);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api.get('/foods');
      setFoods(response.data)
    })()
  }, []);



  function toggleModal() {
    console.log('foi aqui sim');
    setModalOpen(!modalOpen)
  }

  console.log('modalOpen', modalOpen);

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }


  async function handleAddFood(food: FoodProps) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }


  async function handleDeleteFood(id: number){

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  function handleEditFood(food: FoodProps){
    setEditingFood(food);
    setEditModalOpen(true);
  }

  async function handleUpdateFood(food: FoodProps) {

        try {
          const foodUpdated = await api.put(
            `/foods/${editingFood.id}`,
            { ...editingFood, ...food },
          );

          const foodsUpdated = foods.map((f: FoodProps) =>
            f.id !== foodUpdated.data.id ? f : foodUpdated.data,
          );

          setFoods(foodsUpdated);

        } catch (err) {
          console.log(err);
        }
  }


  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />
      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
           ))}
      </FoodsContainer>
    </>
  );
}
