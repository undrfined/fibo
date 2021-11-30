import UploadImages from "../UploadImages";
import {useState} from "react";
import ColorModelsPage from "./ColorModelsPage";

export default function ColorModels() {
    const [selectedImage, setSelectedImage] = useState<string>();

    return !selectedImage ?
        <UploadImages setSelectedImage={setSelectedImage}/> :
        <ColorModelsPage selectedImage={selectedImage} />;
}
