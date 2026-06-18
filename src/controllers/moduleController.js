const path = require('path');
const { createWriteStream, createReadStream } = require('fs');
const fs = require('fs/promises');
const {
  createModule,
  deleteModule: deleteModuleModel,
  getModuleById,
} = require('../models/module.model');
const sharp = require('sharp');
const convert = require('heic-convert');
const { InternalServerError } = require('../utils/err');

// Process a single file sequentially to minimize memory footprint
// With diskStorage, files are already on disk at file.path (not in memory)
async function processImageFile(file) {
  const fileExt = path.extname(file.originalname).slice(1).toLowerCase();
  const outputPath = path.join(
    './uploads',
    `${Date.now()}-${path.basename(file.originalname, path.extname(file.originalname))}.webp`
  );
  
  // For HEIC/HEIF, convert to JPEG first with reduced quality
  if (fileExt === 'heic' || fileExt === 'heif') {
    console.log('Converting HEIC to JPEG from disk:', file.path);
    try {
      // Read file from disk (multer put it there with diskStorage)
      const fileBuffer = await fs.readFile(file.path);
      const jpegBuffer = await convert({
        buffer: fileBuffer,
        format: 'JPEG',
        quality: 0.6,
      });

      return new Promise((resolve, reject) => {
        const writeStream = createWriteStream(outputPath);
        writeStream.on('finish', () => {
          file.processedPath = outputPath;
          // Delete original uploaded file to save disk space
          fs.unlink(file.path).catch(err => 
            console.warn(`Could not delete original: ${err.message}`)
          );
          resolve();
        });
        writeStream.on('error', reject);

        sharp(jpegBuffer)
          .resize({ width: 900, withoutEnlargement: true })
          .webp({ quality: 80 })
          .on('error', reject)
          .pipe(writeStream);
      });
    } catch (err) {
      throw new Error(`HEIC conversion failed: ${err.message}`);
    }
  } else {
    // For other formats, read from disk and process
    console.log('Processing image from disk:', file.path);
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(file.path);
      const writeStream = createWriteStream(outputPath);
      
      writeStream.on('finish', () => {
        file.processedPath = outputPath;
        // Delete original uploaded file to save disk space
        fs.unlink(file.path).catch(err => 
          console.warn(`Could not delete original: ${err.message}`)
        );
        resolve();
      });
      writeStream.on('error', reject);
      readStream.on('error', reject);

      readStream
        .pipe(sharp()
          .resize({ width: 900, withoutEnlargement: true })
          .webp({ quality: 85 }))
        .on('error', reject)
        .pipe(writeStream);
    });
  }
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

  if (!req.files) {
    return res.status(400).json({ message: 'no file(s) found!' });
  }

  const batchDbInsertions = req.files.map(async (file) => {
    const fileExt = path.extname(file.originalname).slice(1);
    const title = path.basename(file.originalname, fileExt);
    console.log(title);

    const moduleData = {
      type: 'image',
      data: {
        title,
        extension: 'webp', // All processed files are WebP
        size: file.processedPath ? 'see_webp' : file.size, // Original size vs processed
        alt: 'Event photo',
        // Use the processed WebP path instead of original
        path: file.processedPath || file.path,
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
  deleteModule,
};
