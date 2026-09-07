import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { Table, TBody, Td, Th, THead, TRow } from '@/components/ui/Table';
import { Timeline, type TimelineStep } from '@/components/ui/Timeline';
import { DemoBlock, GuideSection } from '../bits';

const WIZARD_STEPS = [
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'student', label: 'Student' },
  { id: 'guardian', label: 'Guardian' },
  { id: 'academic', label: 'Academic' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
  { id: 'confirm', label: 'Confirm' },
];

const APPLICATIONS = [
  { id: 'SS26-847291', grade: 'Grade 6', status: 'Under review', variant: 'navy' as const },
  { id: 'SS26-512038', grade: 'Grade 9', status: 'Approved', variant: 'success' as const },
  { id: 'SS26-330914', grade: 'Grade 4', status: 'Needs correction', variant: 'gold' as const },
  { id: 'SS26-208457', grade: 'Grade 10', status: 'Rejected', variant: 'danger' as const },
];

const TRACKING_STEPS: TimelineStep[] = [
  {
    id: 'submitted',
    label: 'Application submitted',
    description: '1 September 2026',
    state: 'done',
  },
  { id: 'payment', label: 'Payment information', description: 'Verified (demo)', state: 'done' },
  {
    id: 'review',
    label: 'Application review',
    description: 'In progress since 3 September',
    state: 'current',
  },
  { id: 'decision', label: 'Final decision', state: 'pending' },
];

export function DataSection() {
  const [page, setPage] = useState(3);
  const [currentStep, setCurrentStep] = useState('payment');

  return (
    <GuideSection
      id="data"
      title="5 · Data display"
      description="The pieces the product phases are built on: the wizard progress indicator (Phase 4), the tracking timeline (Phase 6), and the admin tables (Phase 7). All records shown are fictional."
    >
      <DemoBlock label="ProgressSteps — registration wizard (interactive)">
        <ProgressSteps steps={WIZARD_STEPS} currentId={currentStep} label="Application progress" />
        <div className="mt-6 flex flex-wrap gap-2">
          {WIZARD_STEPS.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className="bg-navy-50 text-navy-800 hover:bg-navy-100 rounded-md px-2.5 py-1 text-xs font-medium"
            >
              {step.label}
            </button>
          ))}
        </div>
      </DemoBlock>

      <DemoBlock label="Timeline — application tracking states">
        <div className="max-w-md">
          <Timeline steps={TRACKING_STEPS} />
        </div>
      </DemoBlock>

      <DemoBlock label="Table — admin applications preview (fictional)">
        <Table caption="Demo applications">
          <THead>
            <Th scope="col">Application ID</Th>
            <Th scope="col">Grade</Th>
            <Th scope="col">Status</Th>
          </THead>
          <TBody>
            {APPLICATIONS.map((application) => (
              <TRow key={application.id}>
                <Td className="font-mono text-xs">{application.id}</Td>
                <Td>{application.grade}</Td>
                <Td>
                  <Badge variant={application.variant}>{application.status}</Badge>
                </Td>
              </TRow>
            ))}
          </TBody>
        </Table>
      </DemoBlock>

      <DemoBlock label="Pagination — windowed with ellipses">
        <Pagination page={page} pageCount={12} onChange={setPage} label="Demo pagination" />
      </DemoBlock>
    </GuideSection>
  );
}
