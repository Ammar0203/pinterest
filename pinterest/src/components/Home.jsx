import { useImageSize } from 'react-image-size';
import './styles/Home.css'
import { useEffect, useState } from 'react';

function Card(props) {
  const [dimensions, { loading, error }] = useImageSize(props.src)
  if(!dimensions) return <></>;
  const rows = Math.floor((dimensions.height/(dimensions.width/ 236))/10)
  return (
    <div
      className='card'
      style={{
        gridRowEnd: `span ${rows}`,
      }}
    >
      <img src={props.src} className='img' />
    </div>
  );
}

function Home() { 
  const [images, setImages] = useState([])

  useEffect(() => {
    fetch('http://localhost:55/api/image', {method: 'POST'})
      .then(response => 
        response.json()
          .then(images => {
            setImages(images)
          })
      )
  }, [])
  console.log(images)
  return (
    <>
      <div className='pin_container'>
        {images && images.map(image => <Card key={image._id} src={'http://localhost:55/images/'+image.url.split('.')[0]} />)}
      </div>
    </>
  );
}
export default Home;
