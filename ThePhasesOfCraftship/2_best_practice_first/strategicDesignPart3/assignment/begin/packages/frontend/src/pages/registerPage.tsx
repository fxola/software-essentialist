import { Layout } from "../components/layout";
import {
  RegistrationForm,
  RegistrationInput,
} from "../components/registrationForm";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../api";
import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { useSpinner } from "../contexts/spinnerContext";
import { OverlaySpinner } from "../components/overlaySpinner";

type ValidationResult = {
  success: boolean;
  errorMessage?: string;
};

function validateForm(input: RegistrationInput): ValidationResult {
  if (input.email.indexOf("@") === -1)
    return { success: false, errorMessage: "Email invalid" };
  if (input.username.length < 2)
    return { success: false, errorMessage: "Username invalid" };
  return { success: true };
}

export const RegisterPage = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const spinner = useSpinner();

  const handleSubmitRegistrationForm = async (input: RegistrationInput) => {
    // Validate the form
    const validationResult = validateForm(input);

    // If the form is invalid
    if (!validationResult.success) {
      // Show an error toast (for invalid input)
      return toast.error(validationResult.errorMessage);
    }

    // If the form is valid
    // Start loading spinner
    spinner.activate();
    try {
      // Make API call
      const response = await api.users.register(input);
      if (response.success) {
        setUser(response.data);
        spinner.deactivate();
        toast("Success! Redirecting home.");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      switch (response.error.error) {
        case "EmailAlreadyInUse":
          toast.error("This email has been taken");
          break;
        case "UsernameAlreadyTaken":
          toast.error("This username has been taken. Try a different username");
          break;
        case "ValidationError":
          toast.error("Invalid details provided");
          break;
        case "ServerError":
        case "UnknownError":
        default:
          toast.error("Something went wrong.Please try again");
      }
    } catch (err) {
      spinner.deactivate();
      return toast.error("Something went wrong.Please try again");
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <RegistrationForm
        onSubmit={(input: RegistrationInput) =>
          handleSubmitRegistrationForm(input)
        }
      />
      <OverlaySpinner isActive={spinner.spinner?.isActive} />
    </Layout>
  );
};
