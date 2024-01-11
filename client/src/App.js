import './App.css';
import {Routes , Route} from "react-router-dom"
import { Lobby } from './screens/Lobby';
import { Room } from './screens/Room';

function App() {
  return (
    <div className="w-full h-screen bg-richblack-900 flex flex-col  text-richblack-100">
     <Routes>
      <Route path='/' element={<Lobby/>}/>
      <Route path="/room/:roomId" element={<Room/>}/>
     </Routes>
    </div>
  );
}

export default App;
