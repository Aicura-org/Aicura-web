import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const brainDir = 'C:\\Users\\muham\\.gemini\\antigravity-ide\\brain\\7cd1018b-f9f7-4be8-ac45-5039979c4311';
    
    // Look in brain directory or tempmediaStorage
    const candidatePaths = [
      path.join(brainDir, filename),
      path.join(brainDir, '.tempmediaStorage', filename),
      path.join(brainDir, '.user_uploaded', filename),
      path.join(process.cwd(), 'public', filename),
    ];

    let foundPath: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        foundPath = p;
        break;
      }
    }

    if (!foundPath) {
      return new NextResponse('Asset not found', { status: 404 });
    }

    // Proactively copy to public folder if not already there
    try {
      const publicDest = path.join(process.cwd(), 'public', filename);
      if (!fs.existsSync(publicDest) && foundPath !== publicDest) {
        fs.copyFileSync(foundPath, publicDest);
      }
    } catch {
      // non-blocking
    }

    const buffer = fs.readFileSync(foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const contentType =
      ext === '.png'
        ? 'image/png'
        : ext === '.webp'
        ? 'image/webp'
        : ext === '.svg'
        ? 'image/svg+xml'
        : 'image/jpeg';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    return new NextResponse(err.message, { status: 500 });
  }
}
