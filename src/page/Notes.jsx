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
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import moment from 'moment/moment';


import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Notes = () => {

  const [openSearchNotes, setOpenSearchNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [data, setData] = useState([]);

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
        uid: user,
        dateCreated: moment().format("MMM Do YY")
      })

      setLoading(false);
      setError("");
      setNotes("");

      // if (docRef.id.length > 0) {
      //   setLoading(false);
      //   setError("");
      //   setNotes("");
      // }
    } catch (error) {
      console.error("Error adding document:", error);
      setError("Error adding the note.");
    }

  }

  const fetchData = async () => {
    try {
      // setLoading(true);
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
  }, [user, notes])


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

        <div className='bg-sidebar px-4 py-2 flex justify-between items-center'>

          <BsPlusLg className='text-white' />

          <FiSearch className='text-white' onClick={handleOpenSearchTab} />

        </div>
        <div className='p-3 bg-secondary flex items-center justify-between' style={{ borderBottom: "1px solid #E0E0E0" }}>
          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption1} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption2} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption3} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption4} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption5} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption6} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption7} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption8} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption9} alt="edit options" />
          </button>

          <button style={{ width: "10px", height: "10px" }}>
            <img src={editOption10} alt="edit options" />
          </button>

          <button style={{ width: "15px", height: "15px" }}>
            <img src={editOption11} alt="edit options" />
          </button>

        </div>

        <div>
          {error && <p style={{ color: "red" }} className='text-red-600 text-sm'>{error}</p>}
          <form>

            <div >
              <CKEditor
                editor={ClassicEditor}
                // data="<p>Hello from CKEditor&nbsp;5!</p>"
                className='w-full bg-sidebar text-sm'
                onReady={editor => {
                  // You can store the "editor" and use when it is needed.
                  console.log('Editor is ready to use!', editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  console.log({ event, editor, data });
                  setNotes(data);
                }}
                // onChange={(e) => setNotes(e.target.value)}
                onBlur={(event, editor) => {
                  // console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                  // console.log('Focus.', editor);
                }}
              />
            </div>

            {/* <div>
              <textarea
                className='w-full bg-sidebar text-sm' rows="6"
                placeholder='. . . what is on your mind?'
                name="notes"
                id="note"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              >
              </textarea>
            </div> */}
          </form>
        </div>
      </div>

      <div className='flex justify-end py-2'>
        <button type="submit" onClick={handleAddNotesToDb} className="px-6 py-2 text-xs text-white bg-sidebar">
          {loading ? "Adding note . . ." : "Add note"}
        </button>
      </div>

      <div className='mt-16 grid md:grid-cols-4 grid-cols-2 gap-x-4 gap-y-6 '>
        {
          data.length == 0 && <div>
            <p>
              You have no notes
            </p>
          </div>
        }

        {
          data.map((note) => (

            <NavLink to={`/notes/${note.id}`} className='relative todo-weekly rounded-lg shadow-md' key={note.id}>
              <p style={{ fontSize: "10px" }} className='text-right px-2'>
                {note.dateCreated}
              </p>
              <div className='pt-2 border-b border-sidebar'></div>
              <p style={{ wordWrap: "break-word" }} className='p-2 text-xs'>
                {note.notes.length >= 257 ? note.notes.substring(0, 257) + " . . ." : note.notes}
              </p>

              {note.notes.length >= 257 ?  note.notes.substring(0, 257) + " . . ." : note.notes}

              <div
                dangerouslySetInnerHTML={{ __html: note.notes }} 
              />

              <div>

              </div>
            </NavLink>

          ))
        }


      </div>
    </section>
  )
}

export default Notes