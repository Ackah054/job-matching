-- Insert seed data for testing
-- Sample users
INSERT INTO users (id, email, password_hash, role, full_name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', '$2b$10$YIjlrDwlV5neoJ8aU8w0ReYvxzj.FLM7DjM7Y.ZqVGY3Ks8ub8r8K', 'job_seeker', 'John Doe'),
('550e8400-e29b-41d4-a716-446655440002', 'jane@example.com', '$2b$10$YIjlrDwlV5neoJ8aU8w0ReYvxzj.FLM7DjM7Y.ZqVGY3Ks8ub8r8K', 'job_seeker', 'Jane Smith'),
('550e8400-e29b-41d4-a716-446655440003', 'recruiter@techcorp.com', '$2b$10$YIjlrDwlV5neoJ8aU8w0ReYvxzj.FLM7DjM7Y.ZqVGY3Ks8ub8r8K', 'employer', 'Tech Corp Recruiter'),
('550e8400-e29b-41d4-a716-446655440004', 'admin@platform.com', '$2b$10$YIjlrDwlV5neoJ8aU8w0ReYvxzj.FLM7DjM7Y.ZqVGY3Ks8ub8r8K', 'admin', 'Platform Admin');

-- Sample job seeker profiles
INSERT INTO job_seeker_profiles (id, user_id, bio, location, desired_job_title, current_salary, desired_salary_min, desired_salary_max, years_of_experience) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Full-stack developer with 5 years experience', 'San Francisco, CA', 'Senior Software Engineer', 120000, 150000, 200000, 5),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Data scientist passionate about ML', 'New York, NY', 'Machine Learning Engineer', 100000, 130000, 180000, 3);

-- Sample skills for seekers
INSERT INTO seeker_skills (seeker_id, skill_name, proficiency_level, years_of_experience) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'React', 'expert', 5),
('650e8400-e29b-41d4-a716-446655440001', 'Node.js', 'expert', 5),
('650e8400-e29b-41d4-a716-446655440001', 'TypeScript', 'advanced', 3),
('650e8400-e29b-41d4-a716-446655440001', 'PostgreSQL', 'advanced', 4),
('650e8400-e29b-41d4-a716-446655440002', 'Python', 'expert', 3),
('650e8400-e29b-41d4-a716-446655440002', 'Machine Learning', 'advanced', 3),
('650e8400-e29b-41d4-a716-446655440002', 'TensorFlow', 'advanced', 2),
('650e8400-e29b-41d4-a716-446655440002', 'SQL', 'expert', 3);

-- Sample work experience
INSERT INTO seeker_experience (seeker_id, company_name, job_title, description, start_date, end_date, is_current) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Tech Company A', 'Senior Developer', 'Led development of microservices', '2020-01-15', NULL, TRUE),
('650e8400-e29b-41d4-a716-446655440001', 'Tech Company B', 'Full Stack Developer', 'Built web applications', '2018-06-01', '2019-12-31', FALSE),
('650e8400-e29b-41d4-a716-446655440002', 'Data Corp', 'ML Engineer', 'Developed ML models for predictions', '2021-03-01', NULL, TRUE);

-- Sample education
INSERT INTO seeker_education (seeker_id, school_name, degree, field_of_study, graduation_date) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Stanford University', 'Bachelor of Science', 'Computer Science', '2018-06-01'),
('650e8400-e29b-41d4-a716-446655440002', 'MIT', 'Master of Science', 'Data Science', '2020-05-15');

-- Sample company
INSERT INTO companies (id, user_id, company_name, description, website, industry, company_size, location, is_verified) VALUES
('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Tech Corp', 'Leading technology company', 'https://techcorp.com', 'Technology', '1000-5000', 'San Francisco, CA', TRUE);

-- Sample job postings
INSERT INTO jobs (id, company_id, job_title, description, location, job_type, salary_min, salary_max, years_of_experience_required) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Senior Full Stack Engineer', 'We are looking for a senior developer to lead our platform development', 'San Francisco, CA', 'full_time', 150000, 220000, 4),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Machine Learning Engineer', 'Join our AI team to build next-gen models', 'New York, NY', 'full_time', 140000, 200000, 3);

-- Sample job skills
INSERT INTO job_skills (job_id, skill_name, is_required, proficiency_level) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'React', TRUE, 'expert'),
('850e8400-e29b-41d4-a716-446655440001', 'Node.js', TRUE, 'expert'),
('850e8400-e29b-41d4-a716-446655440001', 'TypeScript', TRUE, 'advanced'),
('850e8400-e29b-41d4-a716-446655440001', 'PostgreSQL', FALSE, 'advanced'),
('850e8400-e29b-41d4-a716-446655440002', 'Python', TRUE, 'expert'),
('850e8400-e29b-41d4-a716-446655440002', 'Machine Learning', TRUE, 'advanced'),
('850e8400-e29b-41d4-a716-446655440002', 'TensorFlow', FALSE, 'advanced');
