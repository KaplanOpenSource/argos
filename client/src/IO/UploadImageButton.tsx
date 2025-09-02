import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import { useState } from "react";
import { ButtonFile } from "../Utils/ButtonFile";
import { useUploadImage } from "./useUploadImage";

export const UploadImageButton = ({
  onChangeFile,
  imageName,
  experimentName,
}: {
  onChangeFile: (filename: string, height: number, width: number) => void,
  imageName: string,
  experimentName: string,
}) => {
  const [working, setWorking] = useState(false);
  const { uploadImage } = useUploadImage();

  const handleChangeFile = async (files: File[]) => {
    setWorking(true);
    const ret = await uploadImage(files[0], imageName, experimentName);
    if (ret) {
      const { filename, height, width } = ret;
      onChangeFile(filename, height, width);
    }
    setWorking(false);
  };

  return (
    <>
      <ButtonFile
        accept="image/*"
        color='default'
        tooltip={'Upload image'}
        onChange={handleChangeFile}
        disabled={working}
      >
        {working
          ? <HourglassBottomIcon />
          : <FolderOpenIcon />
        }
      </ButtonFile>
    </>
  );
};