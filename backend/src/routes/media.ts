import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { supabase, DatabaseHelper } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, commonSchemas } from '../middleware/validation.js';
import { asyncHandler, createError, fileUploadValidation } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { APIResponse, UploadedFile } from '../types/index.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    files: 5 // Maximum 5 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

// Initialize upload directory
ensureUploadDir();

// Upload single file
router.post('/upload',
  authenticateToken,
  upload.single('file'),
  fileUploadValidation([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw createError.validation('File is required');
    }

    const userId = req.user!.id;
    const file = req.file;
    const fileId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      // Process image files with Sharp
      if (file.mimetype.startsWith('image/')) {
        await sharp(file.buffer)
          .resize(1920, 1080, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .png({ compressionLevel: 8 })
          .webp({ quality: 85 })
          .toFile(filePath);
      } else {
        // Save non-image files as-is
        await fs.writeFile(filePath, file.buffer);
      }

      // Generate file URL (in production, this would be a CDN URL)
      const fileUrl = `/uploads/${fileName}`;

      // Store file metadata in database
      const uploadedFile = await DatabaseHelper.executeQuery(() =>
        supabase
          .from('uploaded_files')
          .insert({
            id: fileId,
            user_id: userId,
            filename: fileName,
            original_name: file.originalname,
            url: fileUrl,
            size: file.size,
            mime_type: file.mimetype,
            created_at: new Date().toISOString()
          })
          .select('*')
          .single()
      );

      logger.info('File uploaded successfully', {
        fileId,
        userId,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype
      });

      const response: APIResponse<UploadedFile> = {
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: uploadedFile.id,
          filename: uploadedFile.filename,
          original_name: uploadedFile.original_name,
          url: uploadedFile.url,
          size: uploadedFile.size,
          mime_type: uploadedFile.mime_type,
          created_at: uploadedFile.created_at
        }
      };

      res.status(201).json(response);
    } catch (error) {
      // Clean up file if database operation fails
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        logger.warn('Failed to clean up file after error', { filePath, error: unlinkError });
      }

      throw createError.internal('File upload failed');
    }
  })
);

// Upload multiple files
router.post('/upload/multiple',
  authenticateToken,
  upload.array('files', 5), // Maximum 5 files
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[];
    const userId = req.user!.id;

    if (!files || files.length === 0) {
      throw createError.validation('At least one file is required');
    }

    const uploadedFiles: UploadedFile[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const fileId = uuidv4();
        const fileExtension = path.extname(file.originalname);
        const fileName = `${fileId}${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Process image files with Sharp
        if (file.mimetype.startsWith('image/')) {
          await sharp(file.buffer)
            .resize(1920, 1080, { 
              fit: 'inside',
              withoutEnlargement: true 
            })
            .jpeg({ quality: 85 })
            .png({ compressionLevel: 8 })
            .webp({ quality: 85 })
            .toFile(filePath);
        } else {
          await fs.writeFile(filePath, file.buffer);
        }

        const fileUrl = `/uploads/${fileName}`;

        const uploadedFile = await DatabaseHelper.executeQuery(() =>
          supabase
            .from('uploaded_files')
            .insert({
              id: fileId,
              user_id: userId,
              filename: fileName,
              original_name: file.originalname,
              url: fileUrl,
              size: file.size,
              mime_type: file.mimetype,
              created_at: new Date().toISOString()
            })
            .select('*')
            .single()
        );

        uploadedFiles.push({
          id: uploadedFile.id,
          filename: uploadedFile.filename,
          original_name: uploadedFile.original_name,
          url: uploadedFile.url,
          size: uploadedFile.size,
          mime_type: uploadedFile.mime_type,
          created_at: uploadedFile.created_at
        });
      } catch (error) {
        logger.error('File upload failed', { 
          originalName: file.originalname, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        errors.push(`Failed to upload ${file.originalname}`);
      }
    }

    const response: APIResponse<{ files: UploadedFile[]; errors: string[] }> = {
      success: true,
      message: `Uploaded ${uploadedFiles.length} files successfully`,
      data: {
        files: uploadedFiles,
        errors
      }
    };

    if (errors.length > 0) {
      response.errors = errors;
    }

    res.status(201).json(response);
  })
);

// Get user's uploaded files
router.get('/files',
  authenticateToken,
  validate(commonSchemas.pagination, 'query'),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query as any;
    const userId = req.user!.id;
    const offset = (page - 1) * limit;

    const { data: files, error, count } = await supabase
      .from('uploaded_files')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw createError.database('Failed to fetch files');
    }

    const response: APIResponse = {
      success: true,
      data: files || [],
      meta: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };

    res.json(response);
  })
);

// Get file details
router.get('/files/:fileId',
  authenticateToken,
  validate({ fileId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user!.id;

    const file = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single()
    );

    const response: APIResponse = {
      success: true,
      data: {
        id: file.id,
        filename: file.filename,
        original_name: file.original_name,
        url: file.url,
        size: file.size,
        mime_type: file.mime_type,
        created_at: file.created_at
      }
    };

    res.json(response);
  })
);

// Delete file
router.delete('/files/:fileId',
  authenticateToken,
  validate({ fileId: commonSchemas.uuid }, 'params'),
  asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const userId = req.user!.id;

    // Get file details
    const file = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single()
    );

    // Delete file from filesystem
    const filePath = path.join(uploadDir, file.filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      logger.warn('Failed to delete file from filesystem', { filePath, error });
    }

    // Delete file record from database
    await DatabaseHelper.executeQuery(() =>
      supabase
        .from('uploaded_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', userId)
        .select('*')
        .single()
    );

    logger.info('File deleted successfully', { fileId, userId });

    const response: APIResponse = {
      success: true,
      message: 'File deleted successfully'
    };

    res.json(response);
  })
);

// Serve uploaded files (public endpoint)
router.get('/uploads/:filename',
  asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);

    try {
      // Check if file exists
      await fs.access(filePath);
      
      // Set appropriate headers
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.pdf': 'application/pdf',
        '.txt': 'text/plain',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };

      const mimeType = mimeTypes[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache

      // Stream file
      const fileBuffer = await fs.readFile(filePath);
      res.send(fileBuffer);
    } catch (error) {
      res.status(404).json({
        success: false,
        message: 'File not found',
        code: 'FILE_NOT_FOUND'
      });
    }
  })
);

// Generate image thumbnail
router.get('/thumbnail/:fileId',
  authenticateToken,
  validate({ fileId: commonSchemas.uuid }, 'params'),
  validate({
    width: commonSchemas.number.min(50).max(800).default(300),
    height: commonSchemas.number.min(50).max(600).default(200),
    quality: commonSchemas.number.min(1).max(100).default(80)
  }, 'query'),
  asyncHandler(async (req, res) => {
    const { fileId } = req.params;
    const { width, height, quality } = req.query as any;
    const userId = req.user!.id;

    // Get file details
    const file = await DatabaseHelper.executeQuery(() =>
      supabase
        .from('uploaded_files')
        .select('*')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single()
    );

    if (!file.mime_type.startsWith('image/')) {
      throw createError.validation('File is not an image');
    }

    const filePath = path.join(uploadDir, file.filename);
    const thumbnailPath = path.join(uploadDir, `thumb_${fileId}_${width}x${height}.jpg`);

    try {
      // Check if thumbnail already exists
      await fs.access(thumbnailPath);
      
      // Serve existing thumbnail
      const thumbnailBuffer = await fs.readFile(thumbnailPath);
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(thumbnailBuffer);
    } catch {
      // Generate new thumbnail
      try {
        await sharp(filePath)
          .resize(parseInt(width), parseInt(height), {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: parseInt(quality) })
          .toFile(thumbnailPath);

        const thumbnailBuffer = await fs.readFile(thumbnailPath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        res.send(thumbnailBuffer);
      } catch (error) {
        throw createError.internal('Failed to generate thumbnail');
      }
    }
  })
);

export default router;