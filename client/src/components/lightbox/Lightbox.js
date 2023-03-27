import PropTypes from 'prop-types';
import { useEffect } from 'react';
import ReactLightbox from 'react-image-lightbox';
import { Typography, IconButton } from '@mui/material';
import { useAuthContext } from '../../auth/useAuthContext';
import StyledLightbox from './styles';
import Iconify from '../iconify/Iconify';

Lightbox.propTypes = {
  open: PropTypes.bool,
  allData: PropTypes.object,
  images: PropTypes.array,
  photoIndex: PropTypes.number,
  setPhotoIndex: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default function Lightbox({ allData, handleDelete ,images, photoIndex, setPhotoIndex, open, ...other }) {

  const { user } = useAuthContext()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  let canDelete;
  if(allData?.allData){
    canDelete = ((allData?.allData[photoIndex]?.createdBy?.toString()) === (user._id.toString()))
  }

  const showIndex = (
    <Typography>
      <strong> {photoIndex + 1} </strong> {'/'} {images.length}
      {
        canDelete && (
          <>
            <IconButton sx={{ width: 100, height: 100 }} onClick={handleDelete}>
              <Iconify icon="material-symbols:delete-rounded" />
            </IconButton>
          </>
        )
      }
    </Typography>
  );

  const toolbarButtons = [showIndex];

  const customStyles = {
    overlay: {
      zIndex: 9999,
    },
  };

  return (
    <>
      <StyledLightbox />

      {open && (
        <ReactLightbox
          animationDuration={160}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          toolbarButtons={toolbarButtons}
          reactModalStyle={customStyles}
          wrapperClassName="react-lightbox"
          {...other}
        />
      )}
    </>
  );
}
