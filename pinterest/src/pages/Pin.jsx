import { IonIcon } from "@ionic/react";
import Header from "../components/Header";
import {
  arrowBackOutline,
  chevronDownOutline,
  chevronUpOutline,
  heart,
  heartOutline,
} from "ionicons/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import api from "../api";
import "./styles/Pin.css";
import avatar from "../../public/avatar.png";
import { AuthContext } from "../contexts/AuthContext";

export default function Pin() {
  const {handleLike, handleAddComment, user, isAuthenticated} = useContext(AuthContext)
  const { name } = useParams();
  const navigate = useNavigate()

  const [pin, setPin] = useState();
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState()
  const [comment, setComment] = useState('')
  const [commentsCount, setCommentsCount] = useState(0)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    async function fetchComments(pin_id) {
      const response = await api.get(`/api/comment?pin_id=${pin_id}`)
      const { comments } = response.data
      setComments(comments)
    }
    async function fetchImage() {
      const response = await api.get(`/api/pin/${name}`);
      const { pin, liked } = response.data
      setPin(pin);
      setCommentsCount(pin.comments)
      setLiked(liked);
      setLikes(pin.likes)
      setDescription(pin.description)
      setTitle(pin.title)
      fetchComments(pin._id)
    }

    fetchImage();
  }, []);

  async function deleteComment(e, comment) {
    try {
      const response = await api.post(`/api/comment/delete`, {comment})
      console.log(response)
      e.target.parentElement.parentElement.style.display = 'none'
      setCommentsCount(prev => (prev-1))
      console.log(e)
    }
    catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "0 1rem",
          gap: "1rem",
          width: "fit-content",
          // position: "fixed",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: 'pointer'
          }}
          onClick={e => navigate(-1)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
              borderRadius: 360,
              width: "1.8rem",
              height: "1.8rem",
              opacity: 0,
              position: "absolute",
              zIndex: 1,
              transition: "all 150ms",
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = 0;
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = 0.1;
            }}
          />
          <IonIcon icon={arrowBackOutline} />
        </div>
        <h3 style={{ fontWeight: 600 }}>Back</h3>
      </div>

      <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 100}}>
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", width: "fit-content", borderRadius: 32, boxShadow: "rgb(211 211 211) 0px 0px 20px 0px"}}>
          {/* Pin */}
          <div style={{width: 508, borderRadius: 32, padding: 20}}>
            <img src={"http://localhost:55/pins/" + name} style={{width: "100%", objectFit: "contain", display: "flex", borderRadius: 16}}/>
          </div>
          {/* Title and comments container */}
          {edit ? 
            <div style={{width: 508, display: "flex", flexDirection: "column", justifyContent: "flex-start", position: "relative", padding: 32, gap: 8}}>
              <div className='input-container'>
                <label htmlFor='title'>Title</label>
                <input id="title" maxLength={64} className='input' placeholder='Title' required autoComplete='false' value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className='input-container'>
                <label htmlFor='description'>Description</label>
                <textarea id="description" maxLength={1000} style={{height: 500}} placeholder='Description' required autoComplete='false' value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="a red" style={{width: '50%', alignSelf: 'center', cursor: 'pointer'}} 
                onClick={async (e) => {
                  try {
                    const response = await api.post('/api/pin/update', {title, description, pin_id: pin?._id})
                    console.log(response)
                    setPin(response.data.pin)
                    setEdit(false)
                  }
                  catch (err) {
                    console.log(err)
                  }
                }}
              >Update</div>
              <div className="a grey" style={{width: '50%', alignSelf: 'center', cursor: 'pointer'}} onClick={(e) => {setTitle(pin?.title); setDescription(pin?.description); setEdit(false);}}>Cancel</div>
            </div>
            : 
            <div style={{width: 508, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative"}}>
              {/* Title and description and comments section */}
              <div style={{ margin: 32, marginTop: 20, flexGrow: 1 }}>
                <div style={{flexGrow: 1, overflow: "auto"}}>
                  {/* title */}
                  {user?._id === pin?.user?._id && 
                    <div style={{display: 'flex', height: 'min-content', gap: 16, justifyContent: 'flex-end'}}>
                      <div className="a grey" onClick={e => setEdit(true)} >Edit</div>
                      <div className="a red"
                        onClick={async (e) => {
                          try {
                            const response = await api.post('/api/pin/delete', {pin_id: pin?._id})
                            console.log(response)
                            navigate(-1)
                          }
                          catch(err) {
                            console.log(err)
                          }
                        }}
                      >Delete</div>
                    </div>
                  }
                  <div className="Pin-title-ellipsis" style={{ marginBottom: 16 }}>
                    {pin?.title}
                  </div>
                  {/* description */}
                  <div
                    className="Pin-description-ellipsis"
                  >
                    {pin?.description}
                    {/* <div style={{ cursor : 'pointer', color:'#3880FF'}}>Read more</div> */}
                  </div>
                  {/* user pic + name */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      margin: "24px 0",
                      cursor: 'pointer'
                    }}
                    onClick={e => navigate(`/profile/${pin?.user?._id}`)}
                  >
                    <img
                      src={
                        pin?.user?.avatar
                          ? `http://localhost:55/avatars/${pin?.user?.avatar}`
                          : avatar
                      }
                      style={{ borderRadius: "50%", width: 48, height: 48, objectFit: 'cover' }}
                    />
                    <div style={{ fontSize: "1.25rem", fontWeight: 400 }}>
                      {pin?.user?.name}
                    </div>
                  </div>
                  {/* comments */}
                  <div style={{ display: "flex", marginBottom: 16, cursor: 'pointer' }} onClick={e => setShowComments(prev => !prev)}>
                    <div style={{ fontWeight: 600 }}>Comments</div>
                    <IonIcon
                      icon={showComments ? chevronDownOutline : chevronUpOutline}
                      style={{ margin: "0 0 0 auto", fontSize: 28 }}
                    />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }} >

                    {showComments && comments?.map(comment => (
                      <div key={comment._id} style={{ display: "flex" }}>
                        <img
                          src={
                            comment?.user?.avatar
                              ? `http://localhost:55/avatars/${comment?.user?.avatar}`
                              : avatar
                          }
                          style={{
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            marginRight: 8,
                            objectFit: 'cover'
                          }}
                        />

                        <div style={{ wordBreak: "break-all" }}>
                          <span style={{ fontWeight: 500, margin: "0 8px 0 0" }}>
                            {comment?.user?.name}
                          </span>
                          {comment?.content}
                        </div>
                        {
                          user?._id === comment?.user?._id && <div style={{marginLeft: 'auto', paddingLeft: 8}}><div style={{color: "red", cursor: 'pointer'}} onClick={(e) => deleteComment(e, comment)}>delete</div></div>
                        }
                      </div>
                    ))}


                  </div>


                </div>
              </div>

              {/* Input comment bar */}
              <div
                style={{
                  position: "sticky",
                  bottom: 0,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 32,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    height: 1,
                    backgroundColor: "#e9e9e9",
                    marginBottom: 32,
                    // opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "16px",
                    padding: "0px 48px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexGrow: 1,
                      fontWeight: 500,
                      fontSize: "1.25rem",
                    }}
                  >
                    {`${commentsCount} Comments`}
                  </div>
                  <div style={{ fontWeight: 500 }}>{likes}</div>
                  <div
                    onClick={async (e) => {
                      if(!isAuthenticated) return navigate('/login')
                      await handleLike(pin._id, setLiked, setLikes)
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "black",
                        borderRadius: 360,
                        width: "52px",
                        height: "52px",
                        opacity: 0,
                        position: "absolute",
                        zIndex: 1,
                        transition: "all 150ms",
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = 0;
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = 0.1;
                      }}
                    />
                    {liked ? 
                      <IonIcon icon={heart} color="danger" style={{fontSize: 32}} />
                      :
                      <IonIcon icon={heartOutline} style={{ fontSize: 32 }} />
                    }
                  </div>
                </div>
                <div style={{ padding: "32px 32px" }}>
                  <form onSubmit={async e => {
                      e.preventDefault()
                      if(!isAuthenticated) return navigate('/login')
                      if(comment.length < 1) return
                      await handleAddComment(pin._id, comment, setComments)
                      setComment('')
                      setCommentsCount(prev => (prev+1))
                    }}>
                    <input style={{}} value={comment} onChange={e => setComment(e.target.value)} placeholder="add a comment" />
                  </form>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
}