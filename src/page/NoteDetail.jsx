import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { collection, query, where, doc, updateDoc, deleteField, getDocs, deleteDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AiFillDelete } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';


const NoteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState("");

    const fetchData = async () => {
        try {
            // const querySnapshot = await getDocs(collection(db, "notes"), where("uid", "==", user));
            setLoading(true);
            const q = query(collection(db, "notes"), where("uid", "==", user));
            const querySnapshot = await getDocs(q);
            const fetchedData = [];
            querySnapshot.forEach((doc) => {
                setLoading(false);
                fetchedData.push({ id: doc.id, ...doc.data() });
            });

            setData(fetchedData);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    const handleDeleteNote = async () => {
        try {
            await deleteDoc(doc(db, "notes", id));
            navigate(-1);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }

    const note = data.find(item => item.id === id);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setUser(uid);
            } else {
                console.log("Wahala de");
            }
        });

    }, [user])

    useEffect(() => {
        fetchData();
    }, [user])

    console.log(note);

    if (!note) {
        return (
            <div className='mt-6'>
                <p className='text-white'>
                    Note not found. <NavLink to="/notes"
                        className='text-sm underline'
                    >return to notes</NavLink >
                </p>
            </div>
        )
    }
    return (
        <div className='mt-10 text-white'>
            <h3 className='pb-1'>Note detail</h3>
            <div className='flex justify-between items-center border-t border-secondary pt-2 text-right text-xs'>
                <p className='text-lg '><BiArrowBack onClick={() => navigate(-1)} /></p>
                <p style={{ fontSize: "12px" }} >
                    {note.dateCreated}
                </p>
            </div>
            <div className='text-sm mt-8'>               
                <div
                    dangerouslySetInnerHTML={{ __html: note.notes }}
                />
            </div>

            <div className='flex justify-center space-x-4 text-lg mt-20'>
                <BsPencilSquare className='cursor-pointer' />
                <AiFillDelete className='cursor-pointer' onClick={handleDeleteNote} />

            </div>
        </div>
    )
}

export default NoteDetail