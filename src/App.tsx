import './App.css'
import {Header} from "./components/Header.tsx";
import {Stats} from "./components/Stats.tsx";
import {TextBlock} from "./components/TextBlock.tsx";
import {Footer} from "./components/Footer.tsx";
import {useTestLifecycle} from "./hooks/useTestLifecycle.ts";
import {useTestState} from "./stores/test.ts";

function App() {
    useTestLifecycle();
    const sessionId = useTestState((state) => state.sessionId);

    return (
        <>
            <Header />
            <main>
                <Stats />
                <TextBlock key={sessionId} />
            </main>
            <Footer />
        </>
    );
}

export default App;
