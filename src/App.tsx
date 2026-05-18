import './App.css'
import {Header} from "./components/Header.tsx";
import {Stats} from "./components/Stats.tsx";
import {TextBlock} from "./components/TextBlock.tsx";
import {Footer} from "./components/Footer.tsx";

function App() {

    const testo = "ciao"

  return (
    <>
      <Header></Header>
      <main>
          <Stats></Stats>
          <TextBlock textBlock={testo}></TextBlock>
      </main>
      <Footer></Footer>
    </>
  )
}

export default App
