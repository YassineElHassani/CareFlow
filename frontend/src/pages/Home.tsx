import { Link } from 'react-router-dom';
import { Calendar, BarChart3, Pill, FlaskConical, Stethoscope, Lock, User, CheckCircle2, Building2 } from 'lucide-react';
import Button from '@/components/atoms/Button';
import { ROUTES } from '../constants/routes';

const Home: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Easy Appointment Booking',
      description: 'Schedule appointments with your healthcare providers in seconds.',
    },
    {
      icon: BarChart3,
      title: 'Health Records Management',
      description: 'Access and manage your medical records securely from anywhere.',
    },
    {
      icon: Pill,
      title: 'Prescription Management',
      description: 'Track prescriptions and receive reminders for medication.',
    },
    {
      icon: FlaskConical,
      title: 'Lab Results',
      description: 'View your lab results instantly as soon as they are available.',
    },
    {
      icon: Stethoscope,
      title: 'Expert Healthcare Team',
      description: 'Connect with experienced doctors and healthcare professionals.',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with industry standards.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Patients' },
    { number: '500+', label: 'Healthcare Professionals' },
    { number: '50K+', label: 'Appointments Completed' },
    { number: '98%', label: 'Patient Satisfaction' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      avatar: 'user',
      comment: 'CareFlow has made managing my health so much easier. The interface is intuitive and booking appointments is a breeze!',
      rating: 5,
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      avatar: 'doctor',
      comment: 'As a doctor, CareFlow helps me manage my patients efficiently. The digital record system is a game-changer.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patient',
      avatar: 'user',
      comment: 'I love being able to access my lab results instantly. The notification system keeps me informed every step of the way.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">CareFlow</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">
                About
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition-colors">
                Testimonials
              </a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="section py-20 md:py-32">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full">
                <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-primary-700">
                  Modern Healthcare Management
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your Health,{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Simplified
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Experience seamless healthcare management with CareFlow. Book appointments,
                access medical records, and connect with healthcare professionals all in one place.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to={ROUTES.REGISTER}>
                  <Button size="lg" variant="primary" className="shadow-lg shadow-primary-500/30">
                    Get Started Free
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  Watch Demo
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-8 border-t border-gray-200">
                <div className="flex -space-x-2">
                  {[Stethoscope, User, FlaskConical, User].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-primary-100 border-2 border-white flex items-center justify-center shadow-sm"
                    >
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Trusted by 10,000+ patients</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-600 ml-1">5.0 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative animate-fade-in">
              <div className="relative z-10">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
                      <span className="badge badge-primary">3 Today</span>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Dr. John Smith</p>
                          <p className="text-sm text-gray-600">Cardiology Checkup</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary-600">Today</p>
                          <p className="text-xs text-gray-500">{10 + i}:00 AM</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-200 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-success-200 rounded-full blur-2xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Healthcare
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to make healthcare management effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Modern Healthcare, Redefined
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                CareFlow brings together patients, doctors, and healthcare facilities on a
                single platform. Our mission is to make quality healthcare accessible,
                efficient, and patient-centered.
              </p>
              <div className="space-y-4">
                {[
                  { text: 'HIPAA Compliant & Secure' },
                  { text: '24/7 Customer Support' },
                  { text: 'Multi-language Support' },
                  { text: 'Mobile App Available' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-success-100 text-success-700 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="aspect-square bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white">
                  <div className="text-center">
                    <Building2 className="w-24 h-24 mb-4 mx-auto" />
                    <p className="text-xl font-semibold">Healthcare Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Patients & Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their CareFlow experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const AvatarIcon = testimonial.avatar === 'doctor' ? Stethoscope : User;
              return (
                <div
                  key={index}
                  className="card animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <AvatarIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have simplified their healthcare journey with CareFlow
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" variant="secondary" className="shadow-lg">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-xl font-bold text-white">CareFlow</span>
              </div>
              <p className="text-sm">
                Modern healthcare management platform for patients and healthcare professionals.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2024 CareFlow. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;