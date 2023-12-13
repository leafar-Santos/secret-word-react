//CSS
import './App.css';

//React
import {useCallback, useEffect, useState} from 'react'


//Dados
import {wordsList} from './data/words';

//Componentes
import StartScreen from './components/start/StartScreen';
import Game from './components/game/Game';
import GameOver from './components/gameOver/GameOver';


//Estagios do jogo
const stages = [
  {id:1, name:'start'},
  {id:2, name:'game'},
  {id:3, name:'end'}
]


const guessesQty = 3;

function App() {
const[gameStage, setGameStage] = useState(stages[0].name);

//Iniciando state words
const [words] = useState(wordsList)


const[pickedWord, setPickedWord] = useState("");
const[pickedCategory, setpickedCategory] = useState("");
const[letters, setLetters] = useState([]);

//Estado de letras adivinhadas
const[guessedLetters, setGuessedLetters] = useState([])

//Estado de letras erradas
const[wrongLetters, setWrongLetters] = useState([])

//quantidade de tentativas do usuário
const[guesses, setGuesses] = useState(guessesQty)

//Pontuação do usuário
const[score,  setScore] = useState(0)



const pickWordAndCategory = useCallback (() =>{
  //Selecionando uma categoria aleatória do objeto de categorias
  const categories = Object.keys(words)
  const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

  //Selecionando uma palavra aleatória a partir da categoria escolhida
  const word = words[category][[Math.floor(Math.random() * words[category].length)]]
  return{word, category}

},[words]);

//Função para iniciar o jogo
const startGame = useCallback(() =>{
//Lipando todas as letras
clearLettersStates();

  //Função que seleciona palavra e seleciona categoria
  const {word, category} = pickWordAndCategory()
  console.log(word, category)


  //Pega uma palavra e tranforma em um array de letras
  let wordLetters = word.split("");

  //Deixano as letras sempre em minúsculo
  wordLetters = wordLetters.map((l) => l.toLowerCase());
  console.log(wordLetters)


  //Setando o status das palavras ao iniciar o jogo
  setPickedWord(word)
  setpickedCategory(category)
  setLetters(wordLetters)
  setGameStage(stages[1].name);
},[pickWordAndCategory]);

//Função que processa a letra que o usuário digita
const verifyLetter = (letter) =>{
  const normalizeLetter = letter.toLowerCase();

  //verificando se a letra já foi utilizada
  if(guessedLetters.includes(normalizeLetter) || 
    wrongLetters.includes(normalizeLetter)){
    return;
  }
    //incluir letra ou remover a chance
    if(letters.includes(normalizeLetter)){
      setGuessedLetters((actualGuessedLetters) =>[
        ...actualGuessedLetters,
        normalizeLetter
      ])
    }else{
      setWrongLetters((actualWrongLetters) =>[
        ...actualWrongLetters,
        normalizeLetter
      ])

      //Diminuindo as tentativas
      setGuesses((actualGuesses)=> actualGuesses - 1)
    }
}


const clearLettersStates = () =>{
  setGuessedLetters([])
  setWrongLetters([])
}


//Verifica Ccoondição de derrota
useEffect(() => {
  if(guesses <= 0){
    //Resestar todos os status
    clearLettersStates();
    setGameStage(stages[2].name)
  }

}, [guesses]);


//Verifica Condição de vitória
useEffect(() => {
  const uniqueLetters = [...new Set(letters)];

  //condição de vitória
  if(guessedLetters.length === uniqueLetters.length){
    //add score
    setScore((actualScore) => actualScore +=100 )
    startGame();
  }

  //Reinicia o jogo com uma nova palavra



},[guessedLetters,letters,startGame])

//Função para reiniciar o jogo
const retry = () =>{
  setScore(0)
  setGuesses(guessesQty)
  setGameStage(stages[0].name)
  
}

  return (
    <div className="App">
      {/*Chamando os compoentes se eles exitirem  */}
      {gameStage === 'start' && <StartScreen startGame = {startGame} />}

      {gameStage === 'game' && (
      <Game verifyLetter = {verifyLetter}
       pickedWord={pickedWord} 
       pickedCategory={pickedCategory} 
       letters={letters}
       guessedLetters={guessedLetters}
       wrongLetters = {wrongLetters}
       guesses={guesses}
       score = {score}
       />)}
      {gameStage === 'end' && <GameOver retry = {retry} score={score}/>}
      
    </div>
  );
}

export default App;
