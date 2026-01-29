import * as yup from 'yup';

export const RegisterSchema = yup.object({
	email: yup
		.string()
		.email('Invalid email address')
		.required('Email is required'),

	username: yup
		.string()
		.required('Name is required')
		.min(2, 'Name must be 2 character long'),

	password: yup
		.string()
		.required('Password is required')
		.min(6, 'Password must be 6 character long'),

	confirmPassword: yup
		.string()
		.required('Confirm password is required')
		.oneOf([yup.ref('password')], 'Passwords must match'),
});
