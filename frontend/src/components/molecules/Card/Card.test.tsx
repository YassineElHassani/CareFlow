import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders title and content', () => {
    render(
      <Card title="Test Card">
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Card title="Test Card" footer={<button>Action</button>}>
        Content
      </Card>
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});