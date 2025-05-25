import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { filename, content } = await request.json();

    if (!filename || !content) {
      return NextResponse.json(
        { error: 'Filename and content are required' },
        { status: 400 }
      );
    }

    // Sanitize filename to prevent path traversal
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Create save directory if it doesn't exist
    const saveDir = join(process.cwd(), 'dev-eon-exports');
    if (!existsSync(saveDir)) {
      mkdirSync(saveDir, { recursive: true });
    }

    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const uniqueFilename = `${timestamp}_${sanitizedFilename}`;
    const filePath = join(saveDir, uniqueFilename);

    // Write file
    writeFileSync(filePath, content, 'utf8');

    return NextResponse.json({
      success: true,
      message: 'File saved successfully',
      filename: uniqueFilename,
      path: `/dev-eon-exports/${uniqueFilename}`
    });

  } catch (error) {
    console.error('File save error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 