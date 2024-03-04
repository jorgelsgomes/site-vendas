import './App.css'
import Home from './component/Home';
import { Route, Routes } from "react-router-dom";

function App() {
    const home = '/'
    return (
        <Routes>
            <Route exact path={home} component={ Home } />
        </Routes>
    )
}

export default App