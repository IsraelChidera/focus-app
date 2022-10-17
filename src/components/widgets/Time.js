import React from 'react';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Button from '../elements/Button';
import Card from '../elements/Card';

const red = '#f54e4e';
const green = '#4aec8c';

const Time = () => {
    return (
        <>
            <Card>
                <div>
                    <CircularProgressbar 
                        value={66} 
                        text={`${66}%`} 
                        styles={buildStyles({
                        // Rotation of path and trail, in number of turns (0-1)
                        rotation: 0.5,
                        // rotation,
                    
                        // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                        strokeLinecap: 'butt',
                    
                        // Text size
                        // textSize: '16px',
                    
                        // How long animation takes to go from one percentage to another, in seconds
                        pathTransitionDuration: 0.5,
                    
                        // Can specify path transition in more detail, or remove it entirely
                        // pathTransition: 'none',
                    
                        // Colors
                        pathColor: red,
                        textColor: '#f88',
                        trailColor: '#d6d6d6',
                        backgroundColor: '#3e98c7',
                        })}  
                    />
                </div>

                <div className="flex space-x-4">
                    <div>
                        <Button className="py-1 px-6">
                        Play
                        </Button>
                    </div>

                    <Button className="py-1 px-6">
                    Pause
                    </Button>

                    
                </div>
            </Card>
        </>
    )
}

export default Time