import './StartScreen.css'

//Startgame criada em App,js sendo chamada como parâmetro
const StartScreen = ({startGame}) => {
  return (
    <div className="start">
        <h1>Secret Word</h1>
        <p>Clique no botão abaixo para começar a jogar!</p>
        <button onClick={startGame}>Começar o Jogo</button>
    </div>
  )
}

export default StartScreen;