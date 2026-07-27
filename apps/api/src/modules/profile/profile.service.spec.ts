import { computeCompletion } from './profile.service';

const EMPTY_PROFILE = {
  headline: null,
  bio: null,
  location: null,
  githubUrl: null,
  linkedinUrl: null,
  portfolioUrl: null,
};

const NO_COUNTS = { educations: 0, experiences: 0, languages: 0, skills: 0 };

describe('computeCompletion', () => {
  it('is 0 for a brand-new empty profile', () => {
    expect(computeCompletion(EMPTY_PROFILE, NO_COUNTS)).toBe(0);
  });

  it('is 100 when all six signals are present', () => {
    const profile = {
      headline: 'Engineer',
      bio: 'I build things.',
      location: 'Bengaluru',
      githubUrl: 'https://github.com/x',
      linkedinUrl: null,
      portfolioUrl: null,
    };
    expect(computeCompletion(profile, { educations: 1, experiences: 2, languages: 1, skills: 3 })).toBe(100);
  });

  it('requires headline AND bio AND location for the personal-details signal', () => {
    const partial = { ...EMPTY_PROFILE, headline: 'Engineer', bio: 'Hi' };
    expect(computeCompletion(partial, NO_COUNTS)).toBe(0);
    expect(computeCompletion({ ...partial, location: 'Pune' }, NO_COUNTS)).toBe(17);
  });

  it('counts any single social link as the links signal', () => {
    expect(computeCompletion({ ...EMPTY_PROFILE, portfolioUrl: 'https://me.dev' }, NO_COUNTS)).toBe(17);
  });

  it('treats empty strings as missing (cleared fields must not count)', () => {
    const cleared = {
      headline: '',
      bio: '',
      location: '',
      githubUrl: '',
      linkedinUrl: '',
      portfolioUrl: '',
    };
    expect(computeCompletion(cleared, NO_COUNTS)).toBe(0);
  });

  it('scores 5 of 6 signals as 83', () => {
    const profile = {
      headline: 'Engineer',
      bio: 'Bio',
      location: 'Remote',
      githubUrl: 'https://github.com/x',
      linkedinUrl: null,
      portfolioUrl: null,
    };
    expect(computeCompletion(profile, { educations: 1, experiences: 1, languages: 0, skills: 1 })).toBe(83);
  });
});
