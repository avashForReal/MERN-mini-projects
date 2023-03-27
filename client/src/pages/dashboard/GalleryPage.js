import { useEffect, useState, useCallback } from 'react';

import { Helmet } from 'react-helmet-async';
// @mui
import { Box, Card, Container, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { HOST_API_KEY } from '../../config';
// routes
import typography from '../../theme/typography';
import { PATH_DASHBOARD } from '../../routes/paths';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Image from '../../components/image';
import Lightbox from '../../components/lightbox';
import { Upload } from '../../components/upload';
import axios from '../../utils/axios';

export default function DemoLightboxPage() {
    const [openLightbox, setOpenLightbox] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [imagesLightbox, setImagesLightBox] = useState([]);
    const [file, setFile] = useState(null);
    const [trigg, setTrigg] = useState(true)

    const [img, setImg] = useState({})

    const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setFile(
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );
        }
    }, []);

    const uploadFile = async () => {
        try {
            const fd = new FormData();
            fd.append('photo', file);
            const images = await axios.post('/photos', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            setTrigg(!trigg);
        } catch (err) {
            setFile(null);
            setTrigg(!trigg);
            toast.error(err.msg || err.message || "An error occured", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    const handleOpenLightbox = (url) => {
        const selectedImage = imagesLightbox.findIndex((index) => index === url);
        setOpenLightbox(true);
        setSelectedImage(selectedImage);
    };

    const handleCloseLightbox = () => {
        setOpenLightbox(false);
    };

    const setImageURL = async (data) => {
        const URLs = data?.map((d) => {
            return `${HOST_API_KEY}/uploads/${d.photo}`;
        })
        return URLs;
    }

    const handleDelete = async () => {
        const id = img?.allData[selectedImage]._id.toString();
        try {
            await axios.delete(`/photos/${id}`)
            setTrigg(!trigg);
            handleCloseLightbox();
            toast.success("Image deleted.", {
                position: toast.POSITION.TOP_RIGHT
            });
        } catch (err) {
            toast.error(err.message || "An error occured", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    const fetchImages = async () => {
        try {
            const images = await axios.get('/photos');
            const d = await setImageURL(images?.data);
            setImagesLightBox(d);
            setImg({ allData: images?.data, images: d })
        } catch (err) {
            console.log(err);
            toast.error(err.message || "An error occured", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }

    useEffect(() => {
        fetchImages();
    }, [trigg])

    return (
        <>
            <Helmet>
                <title> Gallery </title>
            </Helmet>
            <Container>
                <CustomBreadcrumbs
                    heading="Gallery"
                    links={[
                        { name: 'Dashboard', href: PATH_DASHBOARD.root },
                        { name: 'Gallery', href: PATH_DASHBOARD.general.gallery },
                    ]}
                />
                <Upload file={file} onDrop={handleDropSingleFile} />
                <Button sx={{ width: '100%', mt: 2 }} variant='contained' disabled={!file} onClick={uploadFile}>Upload</Button>
                <Card sx={{ p: 6, mt: 5 }}>
                    <Box
                        gap={1.5}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(2, 1fr)',
                            sm: 'repeat(3, 1fr)',
                            md: 'repeat(4, 1fr)',
                        }}
                    >
                        {imagesLightbox.map((img) => (
                            <Image
                                key={img}
                                alt={img}
                                src={img}
                                ratio="1/1"
                                onClick={() => handleOpenLightbox(img)}
                                sx={{
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                }}
                            />
                        ))}
                    </Box>
                </Card>
            </Container>

            <Lightbox
                allData={img}
                handleDelete={handleDelete}
                images={imagesLightbox}
                mainSrc={imagesLightbox[selectedImage]}
                photoIndex={selectedImage}
                setPhotoIndex={setSelectedImage}
                open={openLightbox}
                onCloseRequest={handleCloseLightbox}
            />
        </>
    )
}
