import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../app/GlobalRedux/store"
import Image from "next/image"
import { setImageUrl } from "../app/GlobalRedux/Features/pageToEditSlice"



type Image = {
    url: string,
    id: string
  }

function ImageGallery() {
    const dispatch = useDispatch()
    const imagesArray = useSelector((state: RootState) => state.viewStory.images)

    const viewImage = (image: Image) => {
        console.log(image)
        dispatch(setImageUrl(image.url))
    }

  return (
    <div className="w-full">


    {imagesArray.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
          <p style={{ gridColumn: 'span 3', marginBottom: '16px', fontSize: '14px', color: '#4b5563' }}>Image gallery</p>
          {imagesArray.map((image, index) => (
            <div key={index} style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
            <button onClick={() => viewImage(image)}>
                <Image src={image.url} fill objectFit="cover" style={{ borderRadius: '8px' }} alt='/' />
            </button>
            </div>
          ))}
        </div>
      )}


    </div>
  )
}

export default ImageGallery