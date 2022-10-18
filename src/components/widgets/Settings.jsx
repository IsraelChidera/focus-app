import React, { useState } from 'react';
import Text from '../elements/Text';
import Card from '../elements/Card';
import Button from '../elements/Button';
import ReactSlider from 'react-slider';

const Settings = ({setOpen, workMin, breakMin, setBreakMin, setWorkMin}) => {
    

    const backButton = () => {
        setOpen(false);
    }

    return(
        <>
            <Card>
                <Text className="text-center text-white">
                    Focus time (in minutes): 45 {workMin}
                </Text>
                <ReactSlider
                    className="horizontal-slider mt-2 border border-tertiary rounded-3xl h-10"
                    thumbClassName="example-thumb h-10 w-10 rounded-3xl bg-white"
                    trackClassName="example-track"
                    value={workMin}
                    onChange={(e)=>setWorkMin(e)}
                    min={1}
                    max={120}
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
                
            </Card>

            <Card>
                <Text className="text-center text-white">
                    Break time (in minutes): 15 {breakMin}
                </Text>
                <ReactSlider
                    className="horizontal-slider mt-2 border border-tertiary rounded-3xl h-10"
                    thumbClassName="example-thumb h-10 w-10 rounded-3xl bg-white"
                    trackClassName="example-track"
                    value={breakMin}
                    onChange={(e)=>setBreakMin(e)}
                    min={1}
                    max={120}
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
            </Card>

            <div>
                <Button onClick={backButton} className="py-1 px-6">
                    {"<--- "}Back
                </Button>
            </div>
            
        </>
    )
}

export default Settings