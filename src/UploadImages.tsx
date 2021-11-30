import {Page} from "./Page";
import {FC, useCallback} from "react";
import upload from './Assets/upload.svg';

type OwnProps = {
   setSelectedImage: (url: string) => void;
}

const UploadImages: FC<OwnProps> = ({
    setSelectedImage
}) => {
    const handleClickUpload = useCallback(() => {
        const input = document.createElement("input") as HTMLInputElement;
        input.accept = "image/*";
        input.type = "file";
        input.click();
        input.onchange = () => {
            const reader = new FileReader();
            reader.onload = () => {
                const url = reader.result as string;
                setSelectedImage(url);
            }
            reader.readAsDataURL(input.files![0]);
        }
    }, [setSelectedImage]);

    return <Page
        hasBackButton
        learnPage="/colors/learn"
        title="Upload images"
        subtitle="Please select which photos you want to work with"
    >
        <div className="upload-images">
            <img src={upload} alt=""/>
            <span className="title">Select your image</span>
            <span className="subtitle">Upload a photo max size 5mb</span>
            <button className="secondary" onClick={handleClickUpload}>Upload</button>
        </div>
    </Page>
}

export default UploadImages;
