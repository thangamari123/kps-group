// Server-side gate for candidate applications: a job only accepts applications while it is published
// and its closing date has not passed (see lib/job-deadline.ts for the exact rule and business timezone).
import { getFirestoreDoc } from './firestore';
import { getDeadlineDate, isDeadlinePassed, isJobOpenForApplications } from '../../../lib/job-deadline';

/** Ids used for open (non job-specific) applications; they have no job document to check. */
const GENERAL_JOB_IDS = new Set(['general', 'general-application']);

export type JobGateResult =
  | { ok: true; title?: string }
  | { ok: false; status: number; message: string };

export async function checkJobAcceptingApplications(
  projectId: string,
  jobId: string,
  now: number = Date.now()
): Promise<JobGateResult> {
  if (!jobId || GENERAL_JOB_IDS.has(jobId)) return { ok: true };

  // Public Firestore rules only expose published jobs, so a draft, closed, archived or deleted job reads as null.
  const job = await getFirestoreDoc(projectId, 'jobs', jobId);
  if (!job) {
    return { ok: false, status: 400, message: 'This position is not accepting applications.' };
  }

  if (!isJobOpenForApplications(job, now)) {
    const expired = getDeadlineDate(job.deadline) !== null && isDeadlinePassed(job.deadline, now);
    return {
      ok: false,
      status: 400,
      message: expired
        ? 'The application deadline for this position has passed.'
        : 'Applications for this position are closed.',
    };
  }

  return { ok: true, title: typeof job.title === 'string' ? job.title : undefined };
}
