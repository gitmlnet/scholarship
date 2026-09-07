import { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TabPanel, Tabs, type TabItem } from '@/components/ui/Tabs';
import { DemoBlock, GuideSection } from '../bits';

const TAB_ITEMS: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'dates', label: 'Important dates' },
  { id: 'faq', label: 'FAQ' },
];

export function OverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <GuideSection
      id="overlays"
      title="4 · Overlays & navigation"
      description="Modal rides the native <dialog> element (Esc, focus trap, focus restore, scroll lock). Tabs follow the WAI-ARIA pattern with arrow-key navigation. Accordion uses <details>/<summary> for free keyboard support."
    >
      <DemoBlock label="Modal (native dialog)">
        <Button variant="dark" size="sm" onClick={() => setModalOpen(true)}>
          Open modal
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Reset demo data?"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={() => setModalOpen(false)}>
                Reset
              </Button>
            </>
          }
        >
          This clears all locally stored demo applications and audit entries, returning the platform
          to its pristine seed state. The action cannot be undone.
        </Modal>
      </DemoBlock>

      <DemoBlock label="Tabs (arrow keys · Home · End)">
        <div>
          <Tabs
            items={TAB_ITEMS}
            activeId={activeTab}
            onChange={setActiveTab}
            label="Example tabs"
          />
          <TabPanel id="overview" activeId={activeTab}>
            Program overview content — purpose, benefits, and exam structure.
          </TabPanel>
          <TabPanel id="dates" activeId={activeTab}>
            Applications close 30 November 2026; the exam is on 19 December 2026.
          </TabPanel>
          <TabPanel id="faq" activeId={activeTab}>
            The FAQ page (Phase 3) will render from seeded bilingual data.
          </TabPanel>
        </div>
      </DemoBlock>

      <DemoBlock label="Accordion (native details/summary)">
        <Accordion
          exclusiveName="style-guide-accordion"
          items={[
            {
              id: 'who',
              summary: 'Who can apply for the scholarship?',
              content:
                'Students currently enrolled in Grades 4–10 at any recognized institution can apply.',
            },
            {
              id: 'fee',
              summary: 'How do I pay the application fee?',
              content:
                'Through DemoPay, the fictional mobile financial service — transaction IDs are verified by simulation only.',
            },
            {
              id: 'track',
              summary: 'How can I track my application?',
              content:
                'Enter your application ID on the Track Application page to see the status timeline.',
            },
          ]}
        />
      </DemoBlock>
    </GuideSection>
  );
}
