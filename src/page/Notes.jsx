import React, { useEffect, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import editOption1 from '../components/assets/bold-icon.svg';
import editOption2 from '../components/assets/italics-icon.svg';
import editOption3 from '../components/assets/underline-icon.svg';
import editOption4 from '../components/assets/quote-icon.svg';
import editOption5 from '../components/assets/cross-icon.svg';
import editOption6 from '../components/assets/justify-icon.svg';
import editOption7 from '../components/assets/justify-icon-1.svg';
import editOption8 from '../components/assets/justify-icon-2.svg';
import editOption9 from '../components/assets/justify-icon-3.svg';
import editOption10 from '../components/assets/add-image-icon.svg';
import editOption11 from '../components/assets/add-link-icon.svg';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';


const Notes = () => {

  const [openSearchNotes, setOpenSearchNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState([]);
  const dat = []

  const handleOpenSearchTab = () => {
    setOpenSearchNotes(prevState => !prevState);
  }

  const handleAddNotesToDb = async () => {
    if (notes.trim() === "") {
      setError("Notes cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "notes"), {
        notes: notes,
        uid: user
      })

      if (docRef.id.length > 0) {
        setLoading(false);        
        setError("");
        setNotes("");
      }
    } catch (error) {
      console.error("Error adding document:", error);
      setError("Error adding the note.");
    }

  }

  const fetchData = async () => {
   
  }


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);                
      } else {
        console.log("Wahala de");
      }
    });

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "notes"));

        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });

        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchData();

    // const querySnapshot = getDocs(collection(db, "notes"));

    // querySnapshot.forEach((doc) => {
    //   setData(doc.id, " => ", doc.data());      
    // })
  }, [])
  
  console.log(data);
  console.log(dat);

  return (
    <section className="text-white mt-10 mb-20">
      {
        openSearchNotes && <form className='mb-6 w-full relative'>
          <input
            type='search'
            placeholder='Search ...'
            className='text-secondary w-1/2 text-sm'
          />
        </form>
      }


      <div className='bg-sidebar'>

        <div className='bg-tertiary border-b px-4 py-2 flex justify-between items-center'>

          <BsPlusLg className='text-sidebar' />

          <FiSearch className='text-sidebar' onClick={handleOpenSearchTab} />

        </div>
        <div className='p-3 bg-tertiary flex items-center justify-between' style={{ borderBottom: "1px solid #E0E0E0" }}>
          <button>
            <img src={editOption1} alt="edit options" />
          </button>

          <button>
            <img src={editOption2} alt="edit options" />
          </button>

          <button>
            <img src={editOption3} alt="edit options" />
          </button>

          <button>
            <img src={editOption4} alt="edit options" />
          </button>

          <button>
            <img src={editOption5} alt="edit options" />
          </button>

          <button>
            <img src={editOption6} alt="edit options" />
          </button>

          <button>
            <img src={editOption7} alt="edit options" />
          </button>

          <button>
            <img src={editOption8} alt="edit options" />
          </button>

          <button>
            <img src={editOption9} alt="edit options" />
          </button>

          <button>
            <img src={editOption10} alt="edit options" />
          </button>

          <button>
            <img src={editOption11} alt="edit options" />
          </button>

        </div>

        <div>
          {error && <p style={{ color: "red" }} className='text-red-600 text-sm'>{error}</p>}
          <form>
            <div>
              <textarea
                className='w-full bg-sidebar text-sm' rows="12"
                placeholder='. . . what is on your mind?'
                name="notes"
                id="note"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              >
              </textarea>
            </div>
          </form>
        </div>
      </div>

      <div className='flex justify-end py-2'>
        <button type="submit" onClick={handleAddNotesToDb} className="px-6 py-2 text-xs text-white bg-sidebar">
          {loading ? "Adding note . . ." : "Add note"}
        </button>
      </div>
    </section>
  )
}

export default Notes