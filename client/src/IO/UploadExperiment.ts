import JSZip from "jszip";
import { useCallback } from "react";
import { argosJsonVersion } from "../constants/constants";
import { useExperiments } from "../Context/useExperiments";
import { createNewName } from "../Utils/utils";
import { ConvertExperiment } from "./ConvertExperiment";
import { ReadFileAsText } from "./FileIo";
import { useUploadImage } from "./useUploadImage";

export const useUploadExperiment = () => {
  const { experiments, addExperiment } = useExperiments();
  const { uploadImage } = useUploadImage();

  const uploadExperiment = useCallback(async (file) => {
    try {
      const { rawExp, zip } = await readExperiment(file);
      const [experiment, errors] = checkConvert(rawExp);

      const name = createNewName(experiments, experiment.name); // this is done here to upload images with the correct experiment name
      experiment.name = name;

      if (zip) {
        const imageFiles = Object.values(zip.files).filter(x => x.name.startsWith('images/') && !x.dir);
        if (imageFiles.length > 0) {
          const images = (experiment.imageStandalone || []).concat((experiment.imageEmbedded || []));
          for (const im of imageFiles) {
            const imageBlob = await im.async('blob');
            const imageFileName = im.name.split('/').at(-1);
            const imageName = imageFileName.replace(/\.[^/.]+$/, "");
            console.log(imageBlob, imageName)
            const ret = await uploadImage(imageBlob, imageName, experiment.name, imageFileName);
            if (ret) {
              const { filename, height, width } = ret;
              const imageData = images.find(x => x.name === imageName);
              if (imageData) {
                imageData.filename = filename;
                imageData.height = height;
                imageData.width = width;
              }
            } else {
              throw 'Problem with uploading image ' + imageName;
            }
          }
        }
      }

      addExperiment(experiment);
      return errors;
    } catch (e) {
      alert('Upload error: ' + e)
    }
  }, [experiments, addExperiment]);

  const readExperiment = async (file) => {
    if (file.name.endsWith('.json')) {
      const text = await ReadFileAsText(file);
      const experiment = JSON.parse(text);
      return { rawExp: experiment || {}, zip: undefined };
    }
    if (file.name.endsWith('.zip')) {
      const zip = await JSZip().loadAsync(file);
      const jsonFiles = Object.values(zip.files).filter(x => x.name.endsWith('.json'));
      let index = 0;
      if (jsonFiles.length === 0) {
        throw "No json files in " + file.name;
      } else if (jsonFiles.length > 1) {
        const numberedFiles = jsonFiles.map((x, i) => i + ': ' + x.name).join("\n");
        const indexStr = prompt("found the following jsons:\n" + numberedFiles + '\npick one?');
        index = parseInt(indexStr);
      }
      const jsonFile = jsonFiles[index];
      const text = await jsonFile.async('text');
      const experiment = JSON.parse(text);
      return { rawExp: experiment || {}, zip };
    }
    throw "unknown file extension " + file.name;
  }

  const checkConvert = (experiment) => {
    const version = (experiment || {}).version;
    if (version === argosJsonVersion) {
      return [experiment, []];
    } else if (ConvertExperiment.isExperimentVersion2(experiment)) {
      const convertor = new ConvertExperiment();
      const newExp = convertor.go(experiment);
      if (!newExp) {
        throw 'cannot convert experiment';
      }
      const errors = [...new Set(convertor.errors)];
      return [newExp, errors];
    } else {
      console.log('error', experiment);
      throw "unknown experiment version";
    }
  }

  return {
    uploadExperiment,
  }
}
