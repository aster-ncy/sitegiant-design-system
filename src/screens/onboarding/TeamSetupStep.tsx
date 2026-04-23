import { useState } from 'react';
import { Button, PlusIcon } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Dropdown } from '../../components/Dropdown';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff' },
  { value: 'viewer', label: 'Viewer' },
];

export interface TeamMember {
  email: string;
  role: string;
}

interface TeamSetupStepProps {
  members: TeamMember[];
  onMembersChange: (members: TeamMember[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export const TeamSetupStep = ({
  members,
  onMembersChange,
  onNext,
  onBack,
  onSkip,
}: TeamSetupStepProps) => {
  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = members.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    onMembersChange(updated);
  };

  const addMember = () => {
    onMembersChange([...members, { email: '', role: '' }]);
  };

  const removeMember = (index: number) => {
    onMembersChange(members.filter((_, i) => i !== index));
  };

  const canContinue = members.some(
    (m) => m.email.trim().length > 0 && m.role.length > 0
  );

  return (
    <Card variant="default" padding="lg">
      {/* Header */}
      <div className="mb-[var(--spacing-24)]">
        <h2
          className={[
            'text-[length:var(--text-22)] leading-[var(--leading-28)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-semibold)]',
            'text-[color:var(--color-text-primary)]',
            'mb-[var(--spacing-4)]',
          ].join(' ')}
        >
          Team Setup
        </h2>
        <p
          className={[
            'text-[length:var(--text-14)] leading-[var(--leading-17)]',
            'font-[family-name:var(--font-sans)] font-[var(--font-weight-regular)]',
            'text-[color:var(--color-text-secondary)]',
          ].join(' ')}
        >
          Invite team members to your workspace.
        </p>
      </div>

      {/* Member rows */}
      <div className="flex flex-col gap-[var(--spacing-16)] mb-[var(--spacing-16)]">
        {members.map((member, index) => (
          <div key={index} className="flex items-end gap-[var(--spacing-12)]">
            <div className="flex-1">
              <Input
                id={`member-email-${index}`}
                label={index === 0 ? 'Email Address' : undefined}
                placeholder="colleague@company.com"
                value={member.email}
                onChange={(val) => updateMember(index, 'email', val)}
              />
            </div>
            <div className="w-[160px]">
              <Dropdown
                id={`member-role-${index}`}
                label={index === 0 ? 'Role' : undefined}
                placeholder="Role"
                value={member.role}
                options={ROLE_OPTIONS}
                onChange={(val) => updateMember(index, 'role', val)}
              />
            </div>
            {members.length > 1 && (
              <div className="pb-[var(--spacing-1)]">
                <Button
                  variant="danger-outline"
                  size="md"
                  label="Remove"
                  onClick={() => removeMember(index)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add member */}
      <div className="mb-[var(--spacing-32)]">
        <Button
          variant="basic"
          size="md"
          label="Add Team Member"
          leftIcon={<PlusIcon />}
          onClick={addMember}
        />
      </div>

      {/* Footer nav */}
      <div className="flex justify-between gap-[var(--spacing-12)]">
        <Button variant="outline" size="md" label="Back" onClick={onBack} />
        <div className="flex gap-[var(--spacing-8)]">
          <Button variant="outline" size="md" label="Skip for now" onClick={onSkip} />
          <Button
            variant="primary"
            size="md"
            label="Continue"
            disabled={!canContinue}
            onClick={onNext}
          />
        </div>
      </div>
    </Card>
  );
};
