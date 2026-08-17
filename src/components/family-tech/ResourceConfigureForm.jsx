import {
  FormField, TextInput, TextArea, ChipGroup, SelectInput,
} from './FormComponents';
import {
  usageModeOptions, resourceSubjectOptions, dayOptions, printPrepStatusOptions,
} from '../../data/intakeOptions';
import { isChildMember } from '../../services/householdUtils';

export default function ResourceConfigureForm({ resource, members, onChange }) {
  const children = members.filter(isChildMember);
  const childOptions = children.map((c) => c.name || 'Child');

  const selectedChildNames = (resource.memberIds || [])
    .map((id) => members.find((m) => m.id === id)?.name)
    .filter(Boolean);

  return (
    <div className="resource-config-form">
      <FormField label="Resource name">
        <TextInput value={resource.name} onChange={(v) => onChange({ ...resource, name: v })} />
      </FormField>
      <FormField label="Subject / category">
        <SelectInput
          value={resource.subject}
          onChange={(v) => onChange({ ...resource, subject: v })}
          options={resourceSubjectOptions.map((s) => ({ value: s, label: s }))}
          placeholder="Select subject"
        />
      </FormField>
      <FormField label="Assigned children" hint="Leave empty for shared family use">
        {childOptions.length ? (
          <ChipGroup
            options={childOptions}
            selected={selectedChildNames}
            onChange={(names) => {
              const ids = names
                .map((n) => children.find((c) => (c.name || 'Child') === n)?.id)
                .filter(Boolean);
              onChange({ ...resource, memberIds: ids, isShared: ids.length === 0 });
            }}
          />
        ) : (
          <p className="resource-config-form__hint">Add children in your profile to assign resources.</p>
        )}
      </FormField>
      <FormField label="Usage mode">
        <SelectInput
          value={resource.usageMode || resource.mode}
          onChange={(v) => onChange({ ...resource, usageMode: v, mode: v })}
          options={usageModeOptions}
        />
      </FormField>
      <FormField label="Preferred sequence" hint="Lower numbers appear earlier in the day">
        <TextInput
          type="number"
          min="0"
          max="99"
          value={resource.sequence ?? 0}
          onChange={(v) => onChange({ ...resource, sequence: parseInt(v, 10) || 0 })}
        />
      </FormField>
      <FormField label="Typical duration">
        <TextInput
          value={resource.duration || ''}
          onChange={(v) => onChange({ ...resource, duration: v })}
          placeholder="e.g. 20 min, 30–45 min"
        />
      </FormField>
      <FormField label="Days or frequency">
        <ChipGroup
          options={dayOptions}
          selected={resource.days || []}
          onChange={(v) => onChange({ ...resource, days: v })}
        />
        <TextInput
          value={resource.frequency || ''}
          onChange={(v) => onChange({ ...resource, frequency: v })}
          placeholder="Or describe frequency, e.g. daily, 3x/week"
        />
      </FormField>
      <FormField label="Print / prep status">
        <SelectInput
          value={resource.printPrepStatus || ''}
          onChange={(v) => onChange({ ...resource, printPrepStatus: v })}
          options={printPrepStatusOptions}
          placeholder="Select"
        />
      </FormField>
      <FormField label="Teacher preparation required">
        <SelectInput
          value={resource.teacherPrepRequired ? 'yes' : 'no'}
          onChange={(v) => onChange({ ...resource, teacherPrepRequired: v === 'yes' })}
          options={[{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }]}
        />
      </FormField>
      <FormField label="Notes">
        <TextArea value={resource.notes || ''} onChange={(v) => onChange({ ...resource, notes: v })} rows={2} />
      </FormField>
    </div>
  );
}
