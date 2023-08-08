import React, {useState, useEffect} from 'react';
import bg from './components/assets/bg.png';
// import Sidebar from './components/widgets/Sidebar';
import Home from './page/Home';
import Notes from './page/Notes';
import Signup from './page/Signup';
import Login from './page/Login';
import Timer from './page/Timer';
import Stopwatch from './page/Stopwatch';
import {Routes, Route} from 'react-router-dom';
// import Navbar from './components/widgets/Navbar';
import Layout from './components/widgets/Layout';
import { BrowserRouter as Router } from 'react-router-dom';


function App() {

  return (
    <Router>
      <div className="App bg-primary">
        <section>          
          <div>            
            <Routes>
           
                <Route 
                  path="/home"
                  element={
                    <Layout>
                      < Home />
                    </Layout>
                  
                  }
                />

                <Route 
                  path="/notes"
                  element={
                    <Layout>
                      < Notes />
                    </Layout>
                  
                  }
                />

                <Route 
                  path="/timer"
                  element={
                    <Layout>
                      < Timer />
                    </Layout>
                  
                  }
                />
                
                <Route 
                  path="/stopwatch"
                  element={
                    <Layout>
                      < Stopwatch />
                    </Layout>
                  
                  }
                />              
              
              <Route path="/" element={<Signup/>}/>
              <Route path="/login" element={<Login/>}/>
            </Routes>          
          </div>
        </section>

      </div>
    </Router>
  );
}

export default App;



