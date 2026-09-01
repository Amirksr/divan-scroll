import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm from '../components/ContactForm';

describe('<ContactForm />', () => {
  it('renders the reservation form with all fields', () => {
    render(<ContactForm />);
    expect(screen.getByRole('heading', { name: 'رزرو میز' })).toBeInTheDocument();
    expect(screen.getByLabelText('نام شما')).toBeInTheDocument();
    expect(screen.getByLabelText('ایمیل')).toBeInTheDocument();
    expect(screen.getByLabelText('شماره تماس')).toBeInTheDocument();
    expect(screen.getByLabelText('تعداد نفرات')).toBeInTheDocument();
    expect(screen.getByLabelText('تاریخ')).toBeInTheDocument();
    expect(screen.getByLabelText('پیام شما')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ارسال پیام' })).toBeInTheDocument();
  });

  it('shows validation errors and does not submit when required fields are empty', () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: 'ارسال پیام' }));

    // Once an error <span> renders inside the <label>, its text becomes
    // part of the label's accessible name too — so an exact-string match
    // against just the field label ("نام شما") no longer finds the input.
    // Match with a leading-substring regex instead.
    expect(screen.getAllByRole('alert')).toHaveLength(3);
    expect(screen.getByLabelText(/^نام شما/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/^ایمیل/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/^پیام شما/)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('submits successfully and shows a confirmation once required fields are valid', () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText('نام شما'), { target: { value: 'امیر' } });
    fireEvent.change(screen.getByLabelText('ایمیل'), { target: { value: 'amir@example.com' } });
    fireEvent.change(screen.getByLabelText('پیام شما'), { target: { value: 'میز برای دو نفر' } });
    fireEvent.click(screen.getByRole('button', { name: 'ارسال پیام' }));

    expect(screen.getByRole('status')).toHaveTextContent('پیام دریافت شد');
    expect(screen.queryByLabelText('نام شما')).not.toBeInTheDocument();
  });

  it('leaves phone, party size, and date optional', () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText('نام شما'), { target: { value: 'امیر' } });
    fireEvent.change(screen.getByLabelText('ایمیل'), { target: { value: 'amir@example.com' } });
    fireEvent.change(screen.getByLabelText('پیام شما'), { target: { value: 'سلام' } });
    fireEvent.click(screen.getByRole('button', { name: 'ارسال پیام' }));

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
