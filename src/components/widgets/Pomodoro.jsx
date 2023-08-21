import React, { useEffect, useState } from 'react';
import Card from '../elements/Card';
import Text from '../elements/Text';
import Button from '../elements/Button';

const Pomodoro = () => {
    const [workTime, setWorkTime] = useState(25);
    const [restTime, setRestTime] = useState(5);
    const [isRunning, setIsRunning] = useState(false);
    const [timerLabel, setTimerLabel] = useState('Work');
    const [timer, setTimer] = useState(workTime * 60);
    const [restTimer, setRestTimer] = useState(restTime * 60);

    const formatTime = seconds => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`;
    };

    const toggleTimer = () => {
        setIsRunning(prevState => !prevState)
    }

    const resetTimer = () => {
        setIsRunning(false);
        setTimerLabel('Work');
        setTimer(workTime * 60);
        setRestTimer(restTime * 60);
    }

    useEffect(() => {
        let intevalId;

        if (isRunning && timer > 0) {
            intevalId = setInterval(() => {
                setTimer(prevState => prevState - 1);
            }, 1000)
        }
        else if (timer === 0) {
            clearInterval(intevalId);
            toggleTimer();
            if (timerLabel === 'Work') {
                setTimerLabel('Break');
                setTimer(restTimer);
            } else {
                setTimerLabel('Work');
                setTimer(workTime);
            }
        }

        return () => {
            clearInterval(intevalId);
        };
    }, [isRunning, timer, timerLabel, workTime, restTime])

    return (
        <Card className="text-center pb-16">
            <Text className="font-semibold text-xl">
                Ready, set, focus!
            </Text>

            <Text className="text-sm pt-2">
                Achieve your daily goals and get more
                done using the Pomodoro Technique
            </Text>            

            <div className="flex justify-center items-center mt-8">
                <div className="py-2 px-4 rounded-md border-b border-x-0 border-x-white border-t-0 border-t-white border-white ">
                    <div className='px-4 flex space-x-4 rounded-md'>
                        <div className='flex flex-col'>
                            <span className="text-4xl font-semibold">
                                {formatTime(timer)}
                            </span>
                        </div>

                    </div>
                </div>
            </div>



            <Text className="text-sm mt-6">
                {timerLabel === 'Work' && <span>It's time work</span>}
                {timerLabel === 'Break' && <span>Time to take some rest</span>}
            </Text>

            <div className='flex flex-col'>
                <Button onClick={toggleTimer} className="mt-6 w-auto px-10 mx-auto">
                    {isRunning ? "Pause session" : "Start session"}
                </Button>

                <Button onClick={resetTimer} className="mt-6 w-auto mx-auto">
                    Reset
                </Button>
            </div>
        </Card>
    )
}

export default Pomodoro