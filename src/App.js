import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ShoppingList from './components/shoppingList';
import Game from './components/tictactoe/game'


function App() {
  return (
    <Game />
    
    
  );
}

export default App;
