/**
 * Structured resume content — the shape authored in the Resume Builder and
 * owned by CareerNext (`ResumeDraft.content`, serialized as JSON text).
 * The builder is a stateless editor over this shape; the future AI service
 * performs field-level edits against it.
 */

export interface ResumeContentExperience {
  company: string;
  duration: string;
  points: string[];
}

export interface ResumeContentProject {
  name: string;
  techStack: string[];
  points: string[];
}

export interface ResumeContentEducation {
  institution: string;
  year: string;
}

export interface ResumeContentSections {
  experience: boolean;
  education: boolean;
  interests: boolean;
}

export interface ResumeContent {
  candidate: { name: string; role: string };
  summary: string;
  skills: string[];
  careerHighlights: string[];
  experience: ResumeContentExperience[];
  projects: ResumeContentProject[];
  education: ResumeContentEducation[];
  interests: string[];
  sections: ResumeContentSections;
}

export interface ResumeDraft {
  id: string;
  title: string;
  template: string;
  /** Serialized {@link ResumeContent} JSON. */
  content: string;
  createdAt: string;
  updatedAt: string;
}
