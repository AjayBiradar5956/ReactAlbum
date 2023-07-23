import { useEffect, useState } from 'react';
import useFormInput from '../hooks';
import styles from '../home.module.css';

function Home() {
    const [album, setAlbum] = useState([]);
    const [editViewId, setEditViewId] = useState(null);
    const title = useFormInput('');
    const userId = useFormInput();
    const updateTitle = useFormInput('');
    const updateUserId = useFormInput();

    //VIEW ALL THE ALBUMS
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/albums')
            .then(response => response.json())
            .then(item => setAlbum(item));
    }, []);

    //ADD A NEW ALBUM
    function handleSubmit(e) {
        e.preventDefault();
        console.log(title.value, userId.value);
        fetch('https://jsonplaceholder.typicode.com/albums', {
            method: 'POST',
            body: JSON.stringify({
                title,
                userId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
            .then((response) => response.json())
            .then((json) => {
                const obj = {
                    title: json.title.value,
                    id: json.id,
                    userId: json.userId.value,
                }
                setAlbum([obj, ...album]);
            })
    }

    //HANDLE DELETE OPERATION
    function handleDelete(id) {
        fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    console.log("Deleted");
                    const newAlb = album.filter((item) => item.id !== id)
                    setAlbum(newAlb);
                }
            })
    }

    //HANDLE PUT OPERATION
    function handlePut(e, id) {
        e.preventDefault();
        setEditViewId(null);
        updateTitle.setValue('');
        updateUserId.setValue('');

        fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: updateTitle.value,
                userId: updateUserId.value,
                id: id,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.ok) {
                    console.log("put", response);
                    const index = album.findIndex((obj) => obj.id === id);
                    const updatedObject = {
                        title: updateTitle.value,
                        userId: updateUserId.value,
                        id: id,
                    }
                    if (index !== -1) {
                        const updatedArr = [...album.slice(0, index), updatedObject, ...album.slice(index + 1)];
                        setAlbum(updatedArr);
                    }
                }
            })
    }

    function handleEditView(id) {
        editViewId === id ? setEditViewId(null) : setEditViewId(id)
    }

    return (
        <div className={styles.container}>
            <h1>ALBUM</h1>
            <div className={styles.addAlbum}>
                <h2>Add an Album</h2>
                <form className={styles.postForm} onSubmit={handleSubmit}>
                    <label for="userId">User Id: </label>
                    <input id='userId' {...userId} />
                    <label for="title">Title: </label>
                    <input id="title" {...title} />
                    <button>Submit</button>
                </form>
            </div>
            <h2>List of Albums</h2>
            <div className={styles.listContainer}>
                {album.map((ele) => {
                    return <div className={styles.albumCard} key={ele.id}>
                        <span className={styles.albumCardDetails}>
                            <span><b>userId:</b> {ele.userId}</span>
                            <span className={styles.title}>{ele.title}</span>
                            <span onClick={() => handleEditView(ele.id)} className={styles.btn} >
                                <i class="fa-solid fa-pen-to-square" style={{ position: 'absolute', right: '50px', bottom: '25px', cursor: 'pointer' }}>
                                </i>
                            </span>
                            {editViewId === ele.id
                                ?
                                <div>
                                    <form onSubmit={(e) => handlePut(e, ele.id)}>
                                        <input id='userId' {...updateUserId} placeholder='Enter User ID' />
                                        <input id="title" {...updateTitle} placeholder='Enter Title' />
                                        <button type='submit'>Submit</button>
                                    </form>
                                </div>
                                :
                                <></>
                            }
                            <span onClick={() => handleDelete(ele.id)} className={styles.btn} >
                                <i class="fa-solid fa-trash"
                                    style={{ position: 'absolute', right: '10px', bottom: '25px', cursor: 'pointer' }}>
                                </i>
                            </span>
                        </span>
                    </div>
                })};
            </div>
        </div>
    )
}
export default Home;