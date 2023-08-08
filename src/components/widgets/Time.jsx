import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Button from '../elements/Button';
import Card from '../elements/Card';

const red = '#f54e4e';
const green = '#4aec8c';

const Time = ({ workMin, breakMin, setBreakMin, setWorkMin}) => {
    
    const [isPaused, setIsPaused] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [mode, setMode] = useState("work");
    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);

    
    function tick(){
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    const initTimer = () => {
        setSecondsLeft(workMin*60);
    }

    const switchMode = () => {
        const nextMode = modeRef.current === 'work'? 'break': 'work';
        const nextSeconds = (nextMode ==='work' ? workMin : breakMin)*60;
        setMode(nextMode);
        modeRef.current = nextMode;
        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
    }

    useEffect(() => {
        initTimer();

        const interval = setInterval(()=>{
            if(isPausedRef.current) {
                return;
            }

            if(secondsLeftRef.current === 0){
               return switchMode();
            }

            tick();
            console.log(tick())
            console.log(secondsLeftRef.current)
        }, 1000);

        return () => clearInterval(interval);
    }, [workMin, breakMin, setBreakMin, setWorkMin])

    const totalSeconds = mode === 'work'? workMin*60 : breakMin*60
    const percentage = Math.round(secondsLeft/totalSeconds)*100;

    const minutes = Math.floor(secondsLeft/60);
    let seconds = secondsLeft%60;
    if(seconds<10) {
        seconds= '0' + seconds;
    }

    console.log(minutes,seconds)


    return (
        <>
            <Card>
                <div>
                    <CircularProgressbar 
                        value={percentage} 
                        // text={`${66}%`} 
                        text={minutes+":"+seconds}
                        styles={buildStyles({
                        
                        rotation: 0.5,                        
                        strokeLinecap: 'butt',                                            
                        pathTransitionDuration: 0.5,                    
                        pathColor: red,
                        textColor: '#f88',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                        })}  
                    />
                </div>

                <div className="flex items-center justify-center mt-6 space-x-4">
                  {isPaused? (
                    <Button className="py-1 px-6">
                        Play
                    </Button>
                  )
                  :
                  (
                    <Button className="py-1 px-6">
                        Pause
                    </Button>
                  )}
                    
                </div>
            </Card>
        </>
    )
}

export default Time