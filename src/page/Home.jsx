import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/elements/Card';
import Text from '../components/elements/Text';
import Button from '../components/elements/Button';
import Time from '../components/widgets/Time';
import Settings from '../components/widgets/Settings';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/features/userSlice';
import { notesFetch } from '../store/features/noteSlice';
// import { getAllUserNotes } from '../store/features/noteSlice';

const Home = () => {
    const [openTaskInput, setOpenTaskInput] = useState(false);
    const [open, setOpen] = useState(false);
    const [workMin, setWorkMin] = useState(45);
    const [breakMin, setBreakMin] = useState(15);
    const inputRef = useRef(null);
    const [remainingTime, setRemainingTime] = useState({
        seconds: '00',
        minutes: '00',
        hours: '00',
        days: '00'
    })

    const handleTaskButton = () => {
        setOpenTaskInput(true);
        inputRef.current.focus();
    }

    const handleSettings = () => {
        setOpen(true);
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                // ...
                console.log("uid", uid)
            } else {
                // User is signed out
                // ...
                console.log("user is logged out")
            }
        });

        const intervalID = setInterval(() => {
            // console.log("yes")
        }, 1000)

        return () => clearInterval(intervalID);
    }, [])
    
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch])
    console.log("user here: ", user);

    useEffect(() => {
        dispatch(notesFetch(user))
    }, [dispatch, user])


    return (
        <section className="text-white pt-10 pb-20">

            <section className="grid grid-cols-2 gap-4">
                <Card className="text-center pb-16">
                    <Text className="font-semibold text-xl">
                        Ready, set, focus!
                    </Text>

                    {/* <ul>
                        {notes.map((note) => (
                            <li key={note.id}>{note.title}</li>
                        ))}
                    </ul>               */}

                    <Text className="text-sm pt-2">
                        Achieve your daily goals and get more
                        done using the Pomodoro Technique
                    </Text>

                    <div className="flex justify-center items-center mt-8">
                        <div className="py-2 px-4 rounded-md border-b border-x-0 border-x-white border-t-0 border-t-white border-white ">
                            <div className='px-4 flex space-x-4 rounded-md'>
                                <div className='flex flex-col'>
                                    <span className="text-4xl font-semibold">
                                        55
                                    </span>
                                    <span className="text-xs pt-2">
                                        mins
                                    </span>
                                </div>

                                <div className='flex flex-col justify-between'>
                                    <span>
                                        ^
                                    </span>
                                    <span>
                                        v
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Text className="text-sm mt-6">
                        You will have 3 breaks
                    </Text>

                    <Button className="mt-6">
                        Start focus session
                    </Button>
                </Card>

                <Card className="py-4">
                    <div>
                        <p>
                            {remainingTime.days} days
                        </p>
                        <p>
                            {remainingTime.hours} hours
                        </p>
                        <p>
                            {remainingTime.minutes} minutes
                        </p>
                        <p>
                            {remainingTime.seconds} seconds
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-between">
                            <Text className="text-sm font-semibold">
                                Daily progress
                            </Text>

                            <Button
                                onClick={handleSettings}
                                className="py-1 px-6"
                            >
                                Settings
                            </Button>
                        </div>

                        {open ? <Settings
                            setOpen={setOpen}
                            workMin={workMin}
                            breakMin={breakMin}
                            setWorkMin={setWorkMin}
                            setBreakMin={setBreakMin}
                        />
                            :
                            <Time
                                workMin={workMin}
                                breakMin={breakMin}
                                setWorkMin={setWorkMin}
                                setBreakMin={setBreakMin}
                            />
                        }

                    </div>
                </Card>

                <Card className="py-4 col-span-2">
                    <div className="flex justify-between">
                        <Text className="text-lg font-semibold mb-10">
                            Notes
                        </Text>

                        <div
                            className="text-2xl cursor-pointer"
                            onClick={handleTaskButton}
                        >
                            +
                        </div>
                    </div>

                    <section className="flex justify-center items-center text-center">
                        <div>
                            <Text className="font-bold text-2xl">
                                Stay focused
                            </Text>

                            <Text className="pt-2 pb-6 text-sm">
                                Add notes while on your focus sessions
                            </Text>

                            <button
                                className="rounded-lg text-sm py-1.5 px-8 text-white bg-secondary"
                            >
                                Add note
                            </button>
                        </div>

                    </section>


                </Card>
            </section>

        </section>
    )
}

export default Home


