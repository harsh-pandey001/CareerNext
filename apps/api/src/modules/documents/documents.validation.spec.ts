import { BadRequestException } from '@nestjs/common';
import { decodeUploadContent, validateFileSignature } from './documents.service';

describe('decodeUploadContent', () => {
  it('decodes well-formed base64', () => {
    const buffer = decodeUploadContent(Buffer.from('%PDF-1.4 hello').toString('base64'));
    expect(buffer.toString()).toBe('%PDF-1.4 hello');
  });

  it('rejects strings that are not base64', () => {
    expect(() => decodeUploadContent('!!!!not-base64!!!!')).toThrow(BadRequestException);
  });

  it('rejects base64 that decodes to zero bytes', () => {
    // '=' padding only — regex rejects it before Buffer.from ever runs.
    expect(() => decodeUploadContent('====')).toThrow(BadRequestException);
  });
});

describe('validateFileSignature', () => {
  const pdf = Buffer.from('%PDF-1.4 content');
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]);
  const docx = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14]);
  const legacyDoc = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1]);
  const executable = Buffer.from([0x4d, 0x5a, 0x90, 0x00]); // MZ header

  it('accepts matching signatures', () => {
    expect(() => validateFileSignature(pdf, 'application/pdf')).not.toThrow();
    expect(() => validateFileSignature(png, 'image/png')).not.toThrow();
    expect(() => validateFileSignature(jpeg, 'image/jpeg')).not.toThrow();
    expect(() =>
      validateFileSignature(docx, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
    ).not.toThrow();
    expect(() => validateFileSignature(legacyDoc, 'application/msword')).not.toThrow();
  });

  it('rejects an executable renamed to PDF', () => {
    expect(() => validateFileSignature(executable, 'application/pdf')).toThrow(BadRequestException);
  });

  it('rejects a PNG claimed as JPEG', () => {
    expect(() => validateFileSignature(png, 'image/jpeg')).toThrow(BadRequestException);
  });

  it('rejects content shorter than the signature', () => {
    expect(() => validateFileSignature(Buffer.from([0x25]), 'application/pdf')).toThrow(BadRequestException);
  });

  it('passes through unmapped mimetypes (whitelist upstream owns that rejection)', () => {
    expect(() => validateFileSignature(executable, 'application/x-unknown')).not.toThrow();
  });
});
