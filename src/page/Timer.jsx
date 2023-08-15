import React, { useEffect, useState } from 'react';
import Card from '../components/elements/Card';
import Button from '../components/elements/Button';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const Timer = () => {

  const [duration, setDuration] = useState(25); // Default duration in minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);

  let intervalId;

  const startTimer = () => {
    setIsRunning(true);
    setTimeLeft(duration * 60);

    intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime === 0) {
          clearInterval(intervalId);
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };


  const resetTimer = () => {
    clearInterval(intervalId);
    setIsRunning(false);
    setTimeLeft(timeLeft);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [duration, isRunning, timeLeft]);


  return (
    <section className="mt-10 mb-20">
      <Card>
        <div className='w-1/2 mx-auto'>
          <div>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <CircularProgressbar
            // value={percentage}
            // value={50}
            // text={`${66}%`} 
            // text={minutes + ":" + seconds}
            text={formatTime(timeLeft)}
            styles={buildStyles({

              rotation: 0.5,
              strokeLinecap: 'butt',
              pathTransitionDuration: 0.5,
              pathColor: 'orange',
              textColor: '#f88',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}
          />

          <div className='flex flex-col'>
            <Button onClick={startTimer} className="mt-6">
              {/* {isRunning ? "Pause session" : "Start session"} */}
              Start
            </Button>

            <Button onClick={resetTimer} className="mt-6">
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}

export default Timer