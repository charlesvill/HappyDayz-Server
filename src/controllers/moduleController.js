const path = require('path');
const { createWriteStream, createReadStream } = require('fs');
const fs = require('fs/promises');
const fsSync = require('fs');
const {
  createModule,
  deleteModule: deleteModuleModel,
  getModuleById,
  getModulesByPageId,
} = require('../models/module.model');
const sharp = require('sharp');
const convert = require('heic-convert');
const { uploadFile, getFileUrl } = require('../utils/s3');
const { InternalServerError } = require('../utils/err');

// Process a single file sequentially to minimize memory footprint
// With diskStorage, files are already on disk at file.path (not in memory)
async function processImageFile(file) {
  const fileExt = path.extname(file.originalname).slice(1).toLowerCase();
  const fileName = `${Date.now()}-${path.basename(file.originalname, path.extname(file.originalname))}.webp`;

  let fileBuffer = await fs.readFile(file.path);
  // For HEIC/HEIF, convert to JPEG first with reduced quality
  if (fileExt === 'heic' || fileExt === 'heif') {
    // Read file from disk (multer put it there with diskStorage)
    try {
      fileBuffer = await convert({
        buffer: fileBuffer,
        format: 'JPEG',
        quality: 0.6,
      });
    } catch (err) {
      throw new Error(`HEIC conversion failed: ${err.message}`);
    }
  }

  let optimizedBuffer = await sharp(fileBuffer)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  fileBuffer = null;
  const awsKey = await uploadFile({
    key: fileName,
    buffer: optimizedBuffer,
    contentType: 'image/webp',
  });
  file.cloudKey = awsKey;
  await fs
    .unlink(file.path)
    .catch((err) => console.warn(`Could not delete original: ${err.message}`));
  optimizedBuffer = null;
}

// Process images sequentially (not in parallel) to minimize memory on 1GB instance
async function processImage(req, res, next) {
  const start = performance.now();

  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    // Process files one at a time instead of Promise.all
    for (const file of req.files) {
      await processImageFile(file);
    }

    console.log(
      'Image processing took',
      ((performance.now() - start) / 1000).toFixed(2),
      'seconds'
    );
  } catch (err) {
    return next(new InternalServerError(err));
  }

  next();
}

async function addModule(req, res, next) {
  // const userId = req.params.userid; // guests uploading will not have userid
  // const eventId = req.params.eventid;
  // console.log('the current request: ',req);
  const pageId = req.params.pageid;
  const fieldData = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'no file(s) found!' });
  }

  const batchDbInsertions = req.files.map(async (file) => {
    const ext = path.extname(file.originalname);
    const title = path.basename(file.originalname, ext);

    const moduleData = {
      type: 'image',
      data: {
        title,
        name: fieldData?.name,
        caption: fieldData?.caption,
        extension: 'webp', // All processed files are WebP
        alt: 'Event photo',
        key: file.cloudKey,
      },
    };
    return await createModule(pageId, moduleData);
  });

  try {
    const response = await Promise.all(batchDbInsertions);
    return res.status(200).json(response);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

async function getAllByPage(req, res, next) {
  const { eventid: eventId, pageid: pageId } = req.params;

  try {
    const response = await getModulesByPageId(pageId);
    console.log('the whole lot: ', response);

    const signedUrls = response.modules?.length
      ? await Promise.all(
          response.modules.map(async (record) => {
            if (!record.data?.key) {
              console.warn('Module missing key:', record.id);
              return null;
            }
            return {
              url: await getFileUrl(record.data.key),
              name: record.data?.name,
              caption: record.data?.caption,
            };
          })
        )
      : [];

    res.status(200).json(signedUrls);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

async function deleteModule(req, res, next) {
  const { moduleid: moduleId, pageid: pageId } = req.params;

  try {
    // Get the module to retrieve file path before deletion
    const module = await getModuleById(moduleId);

    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Delete the file from the filesystem if path exists
    if (module.data?.path) {
      try {
        await fs.unlink(module.data.path);
        console.log(`Deleted file: ${module.data.path}`);
      } catch (fileErr) {
        console.warn(
          `Warning: Could not delete file at ${module.data.path}:`,
          fileErr.message
        );
        // Don't fail the entire delete operation if file deletion fails
      }
    }

    // Delete the module from the database
    const deletedModule = await deleteModuleModel(moduleId, pageId);
    return res.status(200).json(deletedModule);
  } catch (err) {
    return next(new InternalServerError(err));
  }
}

module.exports = {
  processImage,
  addModule,
  getAllByPage,
  deleteModule,
};
