import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Field } from '@/components/ui/Field';
import { Radio } from '@/components/ui/Radio';
import { Select } from '@/components/ui/Select';
import { TextInput } from '@/components/ui/TextInput';
import { Textarea } from '@/components/ui/Textarea';
import { DemoBlock, GuideSection } from '../bits';

export function FormsSection() {
  const [showError, setShowError] = useState(false);

  return (
    <GuideSection
      id="forms"
      title="2 · Forms"
      description="Field wires label, hint, and error to controls automatically (aria-describedby, aria-invalid, aria-required). Checkbox and Radio bring their own labels — group radios in a fieldset with a legend."
    >
      <DemoBlock label="Field + TextInput / Select / Textarea — with error toggle">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" hint="Exactly as printed on the birth certificate." isRequired>
            <TextInput placeholder="Ariana Rahman" />
          </Field>

          <Field
            label="Mobile number"
            isRequired
            error={showError ? 'Enter a valid 11-digit mobile number.' : undefined}
          >
            <TextInput placeholder="01XXXXXXXXX" inputMode="tel" />
          </Field>

          <Field label="Grade applying for" isRequired>
            <Select defaultValue="">
              <option value="" disabled>
                Select a grade…
              </option>
              <option value="g4">Grade 4</option>
              <option value="g6">Grade 6</option>
              <option value="g9">Grade 9</option>
            </Select>
          </Field>

          <Field label="School name" isRequired>
            <TextInput placeholder="Future Scholars Academy" />
          </Field>

          <Field
            label="Address"
            hint="Area and city are enough for the demo."
            className="sm:col-span-2"
          >
            <Textarea rows={3} placeholder="House 12, Road 5, Dhanmondi, Dhaka" />
          </Field>
        </div>
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={() => setShowError((value) => !value)}>
            {showError ? 'Hide error state' : 'Show error state'}
          </Button>
        </div>
      </DemoBlock>

      <DemoBlock label="Checkbox & Radio (self-labeled, fieldset grouping)">
        <div className="grid gap-6 sm:grid-cols-2">
          <Checkbox
            label="I confirm the information is accurate"
            description="Demo only — nothing is submitted anywhere."
            defaultChecked
          />
          <fieldset className="space-y-3">
            <legend className="text-navy-900 mb-2 text-sm font-medium">Guardian relation</legend>
            <Radio name="relation" label="Father" defaultChecked />
            <Radio name="relation" label="Mother" />
            <Radio
              name="relation"
              label="Legal guardian"
              description="Include details in Step 3."
            />
          </fieldset>
        </div>
      </DemoBlock>

      <DemoBlock label="Disabled state">
        <Field label="Application ID (read-only)" hint="Generated after submission.">
          <TextInput defaultValue="SS26-847291" readOnly disabled />
        </Field>
      </DemoBlock>
    </GuideSection>
  );
}
