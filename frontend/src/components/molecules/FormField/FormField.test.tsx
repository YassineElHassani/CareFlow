import { render, screen } from '@testing-library/react';
import FormField from './FormField';

describe('FormField', () => {
  it('renders input by default', () => {
    render(<FormField label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('renders select when fieldType is select', () => {
    render(
      <FormField
        fieldType="select"
        label="Role"
        options={[{ value: 'admin', label: 'Admin' }]}
      />
    );
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
  });

  it('renders checkbox when fieldType is checkbox', () => {
    render(<FormField fieldType="checkbox" label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });
});