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
import { useNavigate } from 'react-router-dom';
import Pomodoro from '../components/widgets/Pomodoro';
// import { getAllUserNotes } from '../store/features/noteSlice';

const Home = () => {
    const [openTaskInput, setOpenTaskInput] = useState(false);
    const [open, setOpen] = useState(false);
    const [workMin, setWorkMin] = useState(45);
    const [breakMin, setBreakMin] = useState(15);
    const inputRef = useRef(null);

    const user = useSelector((state) => state.user.value);
    const { value, status } = useSelector((state) => state.note);
    const dispatch = useDispatch();

    const navigate = useNavigate();

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

    useEffect(() => {
        dispatch(getCurrentUser());
    }, [dispatch])
    console.log("user here: ", user);

    useEffect(() => {
        dispatch(notesFetch(user))
    }, [dispatch, user])


    return (
        <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">

            <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">
                <Pomodoro />

                {/* notes */}
                <Card className="py-4 col-span-2">
                    <div className="flex justify-between">
                        <Text className="text-lg font-semibold mb-10">
                            Notes
                        </Text>

                        <div
                            className="text-2xl cursor-pointer"
                            onClick={() => navigate("/notes")}
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

                            <Button
                                onClick={() => navigate("/notes")}
                            >
                                Add note
                            </Button>
                        </div>
                    </section>

                    <div className='mt-20'>
                        <div className='grid grid-cols-4 gap-y-10 gap-x-4 w-full'>
                            {
                                value.slice(0, 4).map((note) => (
                                    <div className='relative todo-weekly rounded-lg shadow-md' key={note.id}>
                                        <Text style={{ fontSize: "10px" }} className='text-right px-2'>
                                            {note.dateCreated}
                                        </Text>
                                        <div className='pt-2 border-b border-sidebar'></div>                                       

                                        {note.notes.length >= 257 ? <div
                                            style={{ wordWrap: "break-word" }} className='p-2 text-xs'
                                            dangerouslySetInnerHTML={{ __html: note.notes.substring(0, 257) + " . . ." }}
                                        /> : <div
                                            style={{ wordWrap: "break-word" }} className='p-2 text-xs'
                                            dangerouslySetInnerHTML={{ __html: note.notes }}
                                        />}

                                        <div>

                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </Card>
            </section>

        </section>
    )
}

export default Home


