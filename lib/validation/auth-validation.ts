export interface AuthValidationErrors {
    email?: string;
    password?: string;
    name?: string;
}

export interface ValidationResult {
    errors: AuthValidationErrors;
    isError: boolean;
}

export function SignInValidate(email: string, password: string): ValidationResult {
    const errors: AuthValidationErrors = {};
    let isError = false;

    // Email validation
    if (!email) {
        errors.email = "Email is required";
        isError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address";
        isError = true;
    }

    // Password validation
    if (!password) {
        errors.password = "Password is required";
        isError = true;
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
        isError = true;
    }

    return { errors, isError };
}

export function SignUpValidate(
    email: string,
    password: string,
    name: string
): ValidationResult {
    const errors: AuthValidationErrors = {};
    let isError = false;

    // Name validation
    if (!name || name.trim() === "") {
        errors.name = "Name is required";
        isError = true;
    } else if (name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
        isError = true;
    }

    // Email validation
    if (!email) {
        errors.email = "Email is required";
        isError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address";
        isError = true;
    }

    // Password validation
    if (!password) {
        errors.password = "Password is required";
        isError = true;
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
        isError = true;
    }

    return { errors, isError };
}
