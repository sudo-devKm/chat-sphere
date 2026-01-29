export type RegisterFormsValues = {
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
};

export interface LoginFormValues {
	email: string;
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	username: string;
	email: string;
	password: string;
}

export interface UserResponse {
	_id: string;
	email: string;
	username: string;
	avatar?: string;
	status: string;
}
