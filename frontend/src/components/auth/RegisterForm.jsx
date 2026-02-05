import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { validateEmail, validatePhone, validateMinLength } from '../../utils/validators';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!validateMinLength(formData.password, 6)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      addToast('Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {apiError}
        </div>
      )}

      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your name"
        error={errors.name}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors.email}
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Enter 10-digit phone number"
        error={errors.phone}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a password"
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
          Login here
        </Link>
      </p>
    </form>
  );
}
